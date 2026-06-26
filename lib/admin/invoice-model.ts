// Pure builder: turn the DB-shape invoice (cents + ISO dates) into the
// `InvoiceModel` shape `renderInvoiceHtml` consumes (euros as numbers,
// long dates, VAT label, billing-period label). No I/O.

import type {
  InvoiceBank,
  InvoiceBankFilled,
  InvoiceClient,
  InvoiceFrom,
  InvoiceIdentity,
  InvoiceItem,
  InvoiceMeta,
  InvoiceModel,
  InvoiceTotals,
} from './invoice-template';

/** DB-shape `billing.invoices` row (relevant columns + frozen `issuer` jsonb). */
export type InvoiceRow = {
  number: string;
  issue_date: string;
  due_date: string;
  period_from: string | null;
  period_to: string | null;
  subtotal_cents: number;
  vat_rate: number;
  vat_cents: number;
  total_cents: number;
  issuer: {
    name?: string;
    role?: string;
    location?: string;
    identity?: InvoiceIdentity;
    bank?: {
      account_name?: string;
      iban?: string;
      bic?: string;
      bank?: string;
      reference?: string;
    };
  };
};

/** DB-shape `billing.invoice_line_items` row. */
export type InvoiceLineRow = {
  work_date: string;
  description: string;
  hours: number;
  rate_cents: number;
  amount_cents: number;
};

/** DB-shape `billing.clients` row (the subset we care about). */
export type InvoiceClientRow = {
  name: string;
  legal_name?: string | null;
};

const centsToEuros = (c: number): number => (Number(c) || 0) / 100;

// Format an ISO date "2026-06-08" as a long English date "8 June 2026".
function longDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function periodLabel(from: string | null, to: string | null): string {
  if (from && to) return `${longDate(from)} - ${longDate(to)}`;
  if (from) return longDate(from);
  if (to) return longDate(to);
  return '';
}

// Walk a Mon-Sun ISO date range inclusively.
function eachDay(from: string, to: string): string[] {
  const out: string[] = [];
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

// Day-of-week 0=Sun..6=Sat from a 'YYYY-MM-DD' ISO date.
function isoDow(iso: string): number {
  return new Date(`${iso}T00:00:00Z`).getUTCDay();
}

// ISO week number + Mon/Sun bounds for a 'YYYY-MM-DD' date. Used to group
// batched (multi-week) invoice rows by week and label each group.
function isoWeekParts(iso: string): { week: number; monday: string; sunday: string } {
  const d = new Date(`${iso}T00:00:00Z`);
  const day = (d.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  const monday = new Date(d); monday.setUTCDate(d.getUTCDate() - day);
  const sunday = new Date(monday); sunday.setUTCDate(monday.getUTCDate() + 6);
  const thu = new Date(d); thu.setUTCDate(d.getUTCDate() - day + 3);
  const firstThu = new Date(Date.UTC(thu.getUTCFullYear(), 0, 4));
  const firstDay = (firstThu.getUTCDay() + 6) % 7;
  firstThu.setUTCDate(firstThu.getUTCDate() - firstDay + 3);
  const week = 1 + Math.round((thu.getTime() - firstThu.getTime()) / (7 * 24 * 3600 * 1000));
  const fmt = (x: Date): string => x.toISOString().slice(0, 10);
  return { week, monday: fmt(monday), sunday: fmt(sunday) };
}

// Compact day-month range label: "15 - 21 June" (same month) or
// "29 June - 5 July" (spanning). Used for batched week-group headers.
function rangeLabel(aIso: string, bIso: string): string {
  const a = new Date(`${aIso}T00:00:00Z`);
  const b = new Date(`${bIso}T00:00:00Z`);
  const aMonth = a.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' });
  const bMonth = b.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' });
  return aMonth === bMonth
    ? `${a.getUTCDate()} - ${b.getUTCDate()} ${bMonth}`
    : `${a.getUTCDate()} ${aMonth} - ${b.getUTCDate()} ${bMonth}`;
}

const round2 = (n: number): number => Math.round((Number(n) || 0) * 100) / 100;

// Join distinct, non-empty description fragments for a day.
function joinDescriptions(parts: string[]): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const t = String(p ?? '').trim();
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out.join('; ') || '(work)';
}

// Roll up stored per-entry line items into one invoice line per work_date
// (TKT-436: merge-by-day invoicing). Storage stays granular; presentation is
// one row per day. Amounts sum from cents (cent-exact); a day's rate is its
// single applied rate, or the blended amount/hours when a day mixes rates.
//
// TKT-441: when `periodRange` (full Mon-Sun ISO week) is provided, synthesize
// a 0h / EUR 0 "(no billable work)" placeholder row for every weekday in the
// range that has no real line. Sat/Sun only get a placeholder when the week
// itself contains a weekend entry. Existing day-rows are never blanked.
function rollupLinesByDay(
  lines: InvoiceLineRow[],
  periodRange?: { start: string; end: string } | null,
  { keepIso = false }: { keepIso?: boolean } = {},
): Array<InvoiceItem & { isoDate?: string }> {
  type Day = { date: string; hours: number; amountCents: number; rates: Set<number>; descs: string[] };
  const byDay = new Map<string, Day>();
  for (const l of lines) {
    const date = l.work_date;
    if (!date) continue;
    if (!byDay.has(date)) byDay.set(date, { date, hours: 0, amountCents: 0, rates: new Set(), descs: [] });
    const d = byDay.get(date)!;
    d.hours += Number(l.hours) || 0;
    d.amountCents += Number(l.amount_cents) || 0;
    const rate = centsToEuros(l.rate_cents);
    if (rate) d.rates.add(rate);
    d.descs.push(l.description);
  }
  type Item = InvoiceItem & { isoDate: string; zero?: boolean };
  const real: Item[] = [...byDay.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => {
      const hours = round2(d.hours);
      const amount = d.amountCents / 100;
      const rate = d.rates.size === 1 ? [...d.rates][0] : round2(hours ? amount / hours : 0);
      return { isoDate: d.date, date: longDate(d.date), description: joinDescriptions(d.descs), hours, rate, amount };
    });

  // Synthesize placeholder rows for missing days inside the ISO week.
  if (periodRange?.start && periodRange?.end) {
    const realSet = new Set(real.map((r) => r.isoDate));
    const hasWeekendEntry = real.some((r) => {
      const dow = isoDow(r.isoDate);
      return dow === 0 || dow === 6;
    });
    const synthesized: Item[] = [];
    for (const iso of eachDay(periodRange.start, periodRange.end)) {
      if (realSet.has(iso)) continue;
      const dow = isoDow(iso);
      const isWeekend = dow === 0 || dow === 6;
      if (isWeekend && !hasWeekendEntry) continue;
      synthesized.push({
        isoDate: iso,
        date: longDate(iso),
        description: '(no billable work)',
        hours: 0,
        rate: 0,
        amount: 0,
        zero: true,
      });
    }
    const merged = [...real, ...synthesized].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    return keepIso ? merged : merged.map(({ isoDate: _iso, ...rest }) => rest);
  }

  return keepIso ? real : real.map(({ isoDate: _iso, ...rest }) => rest);
}

export function buildInvoiceModel(
  invoice: InvoiceRow,
  lines: InvoiceLineRow[],
  clientRow: InvoiceClientRow,
): InvoiceModel {
  const issuer = invoice.issuer ?? {};
  const issuerBank = issuer.bank ?? {};

  const from: InvoiceFrom = {
    name: issuer.name ?? '',
    role: issuer.role ?? '',
    location: issuer.location,
    identity: issuer.identity ?? {},
  };

  const client: InvoiceClient = {
    name: clientRow.name,
    org: clientRow.legal_name ?? undefined,
    addressLines: [],
  };

  const meta: InvoiceMeta = {
    number: invoice.number,
    issueDate: longDate(invoice.issue_date),
    dueDate: longDate(invoice.due_date),
    periodLabel: periodLabel(invoice.period_from, invoice.period_to),
  };

  // One row per day (TKT-436): storage stays per-entry, presentation rolls up.
  // TKT-441: pass the persisted Mon..Sun period so missing weekdays synthesize
  // a "(no billable work)" placeholder row.
  const periodRange = invoice.period_from && invoice.period_to
    ? { start: invoice.period_from, end: invoice.period_to }
    : null;
  // Batched (catch-up) invoice: when the rows span more than one ISO week,
  // tag each row with its week + a short range label so the template draws a
  // per-week divider header (mirrors the CLI's --batch). A normal single-week
  // invoice spans one week, so nothing is tagged and it renders flat.
  const rolled = rollupLinesByDay(lines, periodRange, { keepIso: true });
  const weekKeys = new Set(rolled.map((r) => isoWeekParts(r.isoDate!).monday));
  const multiWeek = weekKeys.size > 1;
  const items: InvoiceItem[] = rolled.map(({ isoDate, ...rest }) => {
    if (!multiWeek || !isoDate) return rest;
    const p = isoWeekParts(isoDate);
    const periodEnd = invoice.period_to ?? isoDate;
    const endShown = p.sunday <= periodEnd ? p.sunday : periodEnd;
    const partial = endShown < p.sunday;
    return { ...rest, week: p.week, weekLabel: `${rangeLabel(p.monday, endShown)}${partial ? ' (partial)' : ''}` };
  });

  const vatRate = Number(invoice.vat_rate) || 0;
  const totals: InvoiceTotals = {
    subtotal: centsToEuros(invoice.subtotal_cents),
    vatRate,
    vatLabel: vatRate > 0 ? `VAT (${Math.round(vatRate * 100)}%)` : 'VAT (not registered)',
    vatAmount: centsToEuros(invoice.vat_cents),
    total: centsToEuros(invoice.total_cents),
  };

  const filled: InvoiceBankFilled = {
    account_name: !!issuerBank.account_name,
    iban: !!issuerBank.iban,
    bic: !!issuerBank.bic,
    bank: !!issuerBank.bank,
  };
  const bank: InvoiceBank = {
    account_name: issuerBank.account_name,
    iban: issuerBank.iban,
    bic: issuerBank.bic,
    bank: issuerBank.bank,
    reference: issuerBank.reference,
    filled,
  };

  return { from, client, meta, items, totals, bank };
}

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
function rollupLinesByDay(lines: InvoiceLineRow[]): InvoiceItem[] {
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
  return [...byDay.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => {
      const hours = round2(d.hours);
      const amount = d.amountCents / 100;
      const rate = d.rates.size === 1 ? [...d.rates][0] : round2(hours ? amount / hours : 0);
      return { date: longDate(d.date), description: joinDescriptions(d.descs), hours, rate, amount };
    });
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
  const items: InvoiceItem[] = rollupLinesByDay(lines);

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

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

  const items: InvoiceItem[] = lines.map((l) => ({
    date: longDate(l.work_date),
    description: l.description,
    hours: Number(l.hours) || 0,
    rate: centsToEuros(l.rate_cents),
    amount: centsToEuros(l.amount_cents),
  }));

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

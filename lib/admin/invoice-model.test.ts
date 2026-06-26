import { describe, it, expect } from 'vitest';
import { buildInvoiceModel } from './invoice-model';

const base = {
  invoice: {
    number: 'EFE-2026-001', issue_date: '2026-06-08', due_date: '2026-06-15',
    period_from: '2026-06-02', period_to: '2026-06-06',
    subtotal_cents: 306000, vat_rate: 0, vat_cents: 0, total_cents: 306000,
    issuer: { name: 'George Efesopoulos', role: 'Product Designer & Developer', location: 'Cyprus',
              identity: { tic_number: 'X' }, bank: { account_name: 'G', iban: 'IE', bic: 'B', bank: 'Wise' } },
  },
  lines: [{ work_date: '2026-06-02', description: 'Prep', hours: 1, rate_cents: 8500, amount_cents: 8500 }],
  client: { name: 'Chris Heinz', legal_name: 'EPC / 250k Club' },
};

describe('buildInvoiceModel', () => {
  it('maps cents to euro numbers and carries the number', () => {
    const m = buildInvoiceModel(base.invoice, base.lines, base.client);
    expect(m.meta.number).toBe('EFE-2026-001');
    expect(m.totals.subtotal).toBe(3060);
    expect(m.totals.total).toBe(3060);
    expect(m.items[0].amount).toBe(85);
    expect(m.items[0].rate).toBe(85);
  });
  it('labels VAT as not-registered when rate is 0', () => {
    const m = buildInvoiceModel(base.invoice, base.lines, base.client);
    expect(m.totals.vatLabel).toMatch(/not registered/i);
  });
});

describe('buildInvoiceModel - batched / multi-week', () => {
  const batch = {
    invoice: {
      number: 'EFE-2026-003', issue_date: '2026-06-26', due_date: '2026-07-03',
      period_from: '2026-06-15', period_to: '2026-06-26',
      subtotal_cents: 89250, vat_rate: 0, vat_cents: 0, total_cents: 89250,
      issuer: base.invoice.issuer,
    },
    lines: [
      { work_date: '2026-06-16', description: 'Malte email via Resend', hours: 3.5, rate_cents: 8500, amount_cents: 29750 },
      { work_date: '2026-06-18', description: 'Stripe billing fix', hours: 1.5, rate_cents: 8500, amount_cents: 12750 },
      { work_date: '2026-06-24', description: '250kclub.org go-live', hours: 5.5, rate_cents: 8500, amount_cents: 46750 },
    ],
    client: base.client,
  };

  it('groups rows by ISO week with a label per group, week 2 partial', () => {
    const m = buildInvoiceModel(batch.invoice, batch.lines, batch.client);
    const weeks = new Set(m.items.map((i) => i.week));
    expect(weeks.size).toBe(2);
    const labels = m.items.map((i) => i.weekLabel).filter(Boolean) as string[];
    expect(labels).toContain('15 - 21 June');
    expect(labels.some((l) => l.includes('(partial)'))).toBe(true);
  });

  it('still shows every weekday across the span and keeps totals + date-range period', () => {
    const m = buildInvoiceModel(batch.invoice, batch.lines, batch.client);
    expect(m.items.length).toBe(10); // 3 worked + 7 empty weekdays (no weekend work)
    expect(m.meta.periodLabel).toBe('15 June 2026 - 26 June 2026');
    expect(m.totals.total).toBe(892.5);
  });

  it('leaves single-week invoices ungrouped', () => {
    const m = buildInvoiceModel(base.invoice, base.lines, base.client);
    expect(m.items.every((i) => i.week == null)).toBe(true);
  });
});

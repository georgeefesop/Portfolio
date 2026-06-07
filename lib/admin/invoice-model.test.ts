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

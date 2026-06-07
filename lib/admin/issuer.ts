/**
 * Issuer / bank / identity block frozen into every invoice at issue time.
 *
 * The web has no `secrets.json` at runtime, so issuer config comes from env
 * (`EFESOP_ISSUER_*`, `EFESOP_BANK_*`). The CLI reads the equivalent values
 * from `secrets.json` (`efesop_bank` + `cyprus_identity`); both pass an
 * `issuer` block into `billing_issue_invoice`, which freezes it.
 *
 * Shape mirrors the `from` + `bank` blocks the invoice template expects
 * (see `lib/admin/invoice-template.ts`, ADR 6 in the P1 plan).
 *
 * Server-only: env access happens only on the server.
 */

import 'server-only';

export type IssuerBlock = {
  name: string;
  role: string;
  location: string;
  identity: {
    tic_number: string;
    social_insurance_number: string;
    tax_residency: string;
  };
  bank: {
    account_name: string;
    iban: string;
    bic: string;
    bank: string;
  };
};

/**
 * Build the issuer block from env. Defaults match the P1 plan; missing
 * values fall through as empty strings so the template renders cleanly
 * even before all secrets are wired into Vercel.
 */
export function issuerBlock(): IssuerBlock {
  return {
    name: process.env.EFESOP_ISSUER_NAME ?? 'George Efesopoulos',
    role: process.env.EFESOP_ISSUER_ROLE ?? 'Product Designer & Developer',
    location: process.env.EFESOP_ISSUER_LOCATION ?? 'Cyprus',
    identity: {
      tic_number: process.env.EFESOP_TIC_NUMBER ?? '',
      social_insurance_number: process.env.EFESOP_SOCIAL_INSURANCE_NUMBER ?? '',
      tax_residency: process.env.EFESOP_ISSUER_LOCATION ?? 'Cyprus',
    },
    bank: {
      account_name: process.env.EFESOP_BANK_ACCOUNT_NAME ?? '',
      iban: process.env.EFESOP_BANK_IBAN ?? '',
      bic: process.env.EFESOP_BANK_BIC ?? '',
      bank: process.env.EFESOP_BANK_NAME ?? '',
    },
  };
}

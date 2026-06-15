/**
 * Typed wrappers over the public `billing_*` invoice RPCs (SECURITY DEFINER)
 * on the shared Supabase project. The `billing` schema is private; every
 * call goes through `public.billing_*` so the web app and `invoice` CLI share
 * one contract.
 *
 * Param names must match the migration `p_*` arg names exactly (P0 lesson).
 *
 * Server-only: uses the service-role client from `./supabase`.
 */

import 'server-only';
import { getBillingSupabase } from './supabase';
import type { IssuerBlock } from './issuer';

// --- Row shapes (match the RPC return columns) ---

/** One row from `billing_list_invoices`. */
export type InvoiceListRow = {
  id: string;
  number: string;
  status: 'issued' | 'sent' | 'paid' | 'void';
  issue_date: string;
  due_date: string;
  period_from: string | null;
  period_to: string | null;
  subtotal_cents: number;
  vat_cents: number;
  total_cents: number;
  currency: string;
};

/** Full `billing.invoices` row (the `billing_issue_invoice` / `billing_void_invoice` return). */
export type InvoiceRow = {
  id: string;
  client_id: string;
  number: string;
  status: 'issued' | 'sent' | 'paid' | 'void';
  issue_date: string;
  due_date: string;
  period_from: string | null;
  period_to: string | null;
  currency: string;
  subtotal_cents: number;
  vat_rate: number;
  vat_cents: number;
  total_cents: number;
  notes: string;
  issuer: IssuerBlock | Record<string, unknown>;
  created_at: string;
  voided_at: string | null;
};

/** One frozen line item from `billing.invoice_line_items`. */
export type InvoiceLineRow = {
  id: string;
  invoice_id: string;
  time_entry_id: string | null;
  work_date: string;
  description: string;
  hours: number;
  rate_cents: number;
  amount_cents: number;
  sort: number;
};

/** The `billing_get_invoice` payload: header + ordered line items. */
export type InvoiceDetail = {
  invoice: InvoiceRow;
  lines: InvoiceLineRow[];
};

/** Args for `issueInvoice` / `billing_issue_invoice`. */
export type IssueInvoiceArgs = {
  clientId: string;
  entryIds: string[];
  issueDate: string;
  dueDate: string;
  vatRate?: number;
  notes?: string;
  issuer: IssuerBlock;
};

// --- RPC wrappers (each throws on error) ---

function client() {
  const supabase = getBillingSupabase();
  if (!supabase) {
    throw new Error(
      'Billing Supabase not configured (set GEORGE_OS_SUPABASE_URL and GEORGE_OS_SUPABASE_SERVICE_KEY).',
    );
  }
  return supabase;
}

/** Issue an invoice from a set of unbilled, billable entries; returns the new row. */
export async function issueInvoice(args: IssueInvoiceArgs): Promise<InvoiceRow> {
  const { data, error } = await client().rpc('billing_issue_invoice', {
    p_client_id: args.clientId,
    p_entry_ids: args.entryIds,
    p_issue_date: args.issueDate,
    p_due_date: args.dueDate,
    p_vat_rate: args.vatRate ?? 0,
    p_notes: args.notes ?? '',
    p_issuer: args.issuer,
  });
  if (error) throw new Error(error.message);
  return data as InvoiceRow;
}

/** Invoices for a client, newest first. */
export async function listInvoices(clientId: string): Promise<InvoiceListRow[]> {
  const { data, error } = await client().rpc('billing_list_invoices', {
    p_client_id: clientId,
  });
  if (error) throw new Error(error.message);
  return (data as InvoiceListRow[]) ?? [];
}

/** Header + frozen line items for one invoice. */
export async function getInvoice(invoiceId: string): Promise<InvoiceDetail | null> {
  const { data, error } = await client().rpc('billing_get_invoice', {
    p_invoice_id: invoiceId,
  });
  if (error) throw new Error(error.message);
  return (data as InvoiceDetail | null) ?? null;
}

/** Void an invoice; releases its entries (`invoice_id` cleared) so they can be re-billed. */
export async function voidInvoice(invoiceId: string): Promise<InvoiceRow> {
  const { data, error } = await client().rpc('billing_void_invoice', {
    p_invoice_id: invoiceId,
  });
  if (error) throw new Error(error.message);
  return data as InvoiceRow;
}

/** Mark an invoice `sent` or `paid` (rejected if currently `void`). */
export async function setInvoiceStatus(
  invoiceId: string,
  status: 'sent' | 'paid',
): Promise<InvoiceRow> {
  const { data, error } = await client().rpc('billing_set_invoice_status', {
    p_invoice_id: invoiceId,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  return data as InvoiceRow;
}

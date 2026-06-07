/**
 * Issue, list, fetch, and update invoices for the efesop admin tool.
 *
 *   POST  { entryIds, issueDate, dueDate, vatRate?, notes? }
 *         -> billing_issue_invoice (issuer frozen from env), returns the new row.
 *   GET   ?id=<uuid>   -> billing_get_invoice (header + frozen line items).
 *   GET   (no id)      -> billing_list_invoices for Chris Heinz.
 *   PATCH { id, action: 'void' | 'sent' | 'paid' }
 *         -> billing_void_invoice / billing_set_invoice_status.
 *
 * The pages that link here are already gated, but the page gate does NOT
 * protect this route (a direct request bypasses it), so every handler
 * re-checks `isAdmin()` and returns 401 BEFORE touching the database
 * (P0 mandatory pattern, see `app/api/admin/time/route.ts`).
 */

import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin/auth';
import { getClientId } from '@/lib/admin/billing';
import {
  getInvoice,
  issueInvoice,
  listInvoices,
  setInvoiceStatus,
  voidInvoice,
} from '@/lib/admin/invoices';
import { issuerBlock } from '@/lib/admin/issuer';

export const runtime = 'nodejs';

const CLIENT_NAME = 'Chris Heinz';

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const rec =
    body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

  const entryIds = Array.isArray(rec.entryIds)
    ? (rec.entryIds.filter((v) => typeof v === 'string') as string[])
    : [];
  const issueDate = typeof rec.issueDate === 'string' ? rec.issueDate : '';
  const dueDate = typeof rec.dueDate === 'string' ? rec.dueDate : '';
  if (entryIds.length === 0 || !issueDate || !dueDate) {
    return NextResponse.json({ error: 'invalid_invoice' }, { status: 400 });
  }

  const vatRate = typeof rec.vatRate === 'number' ? rec.vatRate : 0;
  const notes = typeof rec.notes === 'string' ? rec.notes : '';

  try {
    const clientId = await getClientId(CLIENT_NAME);
    const row = await issueInvoice({
      clientId,
      entryIds,
      issueDate,
      dueDate,
      vatRate,
      notes,
      issuer: issuerBlock(),
    });
    return NextResponse.json(row);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'issue_failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get('id');

  try {
    if (id) {
      const detail = await getInvoice(id);
      if (!detail) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }
      return NextResponse.json(detail);
    }
    const clientId = await getClientId(CLIENT_NAME);
    const rows = await listInvoices(clientId);
    return NextResponse.json(rows);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'fetch_failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const rec =
    body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

  const id = typeof rec.id === 'string' ? rec.id : '';
  const action = typeof rec.action === 'string' ? rec.action : '';
  if (!id || (action !== 'void' && action !== 'sent' && action !== 'paid')) {
    return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
  }

  try {
    const row =
      action === 'void'
        ? await voidInvoice(id)
        : await setInvoiceStatus(id, action);
    return NextResponse.json(row);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'update_failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

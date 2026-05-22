/**
 * Invoice / payment-request API for the /create-invoice tool.
 *   POST   create a Stripe Payment Link for an agreed job
 *   PATCH  { id }  deactivate a payment link
 *
 * Runs on the G.E. Revamp Stripe account. Every Price is created under one
 * shared Product so the account does not fill with thousands of products.
 * Both methods require the invoice-tool auth cookie.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { getGregStripe } from '@/lib/greg/stripe';
import { ADMIN_COOKIE, cookieValid } from '@/lib/greg/admin-auth';

export const runtime = 'nodejs';

const MIN_EUR = 5;
const MAX_EUR = 50_000;
const VAT_RATE = 0.19;

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

/** One shared Product for every invoice Price. Found-or-created, then cached. */
let cachedProductId: string | null = null;
async function invoiceProductId(
  stripe: ReturnType<typeof getGregStripe>,
): Promise<string> {
  if (cachedProductId) return cachedProductId;
  const found = await stripe.products.search({
    query: "metadata['greg_invoice_product']:'true'",
    limit: 1,
  });
  if (found.data[0]) {
    cachedProductId = found.data[0].id;
    return cachedProductId;
  }
  const created = await stripe.products.create({
    name: 'Building work - G.E. Revamp Services',
    metadata: { greg_invoice_product: 'true' },
  });
  cachedProductId = created.id;
  return cachedProductId;
}

export async function POST(request: NextRequest) {
  if (!cookieValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return unauthorized();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const r =
    body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

  const clientName =
    typeof r.clientName === 'string' ? r.clientName.trim().slice(0, 120) : '';
  const clientPhone =
    typeof r.clientPhone === 'string' ? r.clientPhone.trim().slice(0, 40) : '';
  const service =
    typeof r.service === 'string' ? r.service.trim().slice(0, 200) : '';
  const note = typeof r.note === 'string' ? r.note.trim().slice(0, 300) : '';
  const dueDate =
    typeof r.dueDate === 'string' ? r.dueDate.trim().slice(0, 20) : '';
  const vat = r.vat === true;
  const amount =
    typeof r.amount === 'number' ? r.amount : Number(r.amount);

  if (!clientName) {
    return NextResponse.json({ error: 'Add the client name.' }, { status: 400 });
  }
  if (!service) {
    return NextResponse.json(
      { error: 'Add a description of the work.' },
      { status: 400 },
    );
  }
  if (!Number.isFinite(amount) || amount < MIN_EUR || amount > MAX_EUR) {
    return NextResponse.json(
      {
        error: `Enter an amount between EUR ${MIN_EUR} and EUR ${MAX_EUR.toLocaleString('en-US')}.`,
      },
      { status: 400 },
    );
  }

  const net = Math.round(amount * 100);
  const total = vat ? Math.round(net * (1 + VAT_RATE)) : net;
  const lineName = vat ? `${service} (includes 19% VAT)` : service;

  try {
    const stripe = getGregStripe();
    const product = await invoiceProductId(stripe);
    const price = await stripe.prices.create({
      product,
      currency: 'eur',
      unit_amount: total,
      nickname: lineName.slice(0, 250),
    });
    const link = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${request.nextUrl.origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
        },
      },
      invoice_creation: { enabled: true },
      restrictions: { completed_sessions: { limit: 1 } },
      metadata: {
        source: 'greg_invoice',
        client_name: clientName,
        client_phone: clientPhone,
        service,
        note,
        due_date: dueDate,
        vat_included: vat ? 'yes' : 'no',
      },
    });

    if (!link.url) {
      return NextResponse.json({ error: 'no_link_url' }, { status: 502 });
    }
    return NextResponse.json({ id: link.id, url: link.url, total: total / 100 });
  } catch (err) {
    console.error(
      '[greg/invoice] create error',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      {
        error:
          'Could not create the payment request. The Stripe key may not be set up yet.',
      },
      { status: 502 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!cookieValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return unauthorized();
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const id =
    body && typeof body === 'object'
      ? (body as Record<string, unknown>).id
      : undefined;
  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ error: 'missing_id' }, { status: 400 });
  }
  try {
    await getGregStripe().paymentLinks.update(id, { active: false });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      '[greg/invoice] deactivate error',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Could not deactivate the link.' },
      { status: 502 },
    );
  }
}

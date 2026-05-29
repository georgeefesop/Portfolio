/**
 * Stripe Checkout session creator for name-your-amount payments on
 * greg.efesop.com/pay.
 *
 * POST /api/greg/pay/custom-checkout
 *   { amount: number (EUR), name: string, email: string,
 *     reason?: string, invoice?: boolean }
 *
 * Builds a one-off Checkout Session from an inline price_data line item on
 * the G.E. Revamp Stripe account. Everything is validated server-side.
 */

import { NextResponse } from 'next/server';
import { getGregStripe } from '@/lib/greg/stripe';

export const runtime = 'nodejs';

const MIN_EUR = 5;
const MAX_EUR = 50_000;
const REASON_MAX_LEN = 200;
const NAME_MAX_LEN = 100;
const DEFAULT_REASON = 'Payment to G.E. Revamp Services';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Resolve the site origin for redirect URLs. */
function resolveOrigin(request: Request): string {
  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');
  const host = request.headers.get('host');
  if (host) {
    const proto = host.includes('localhost') ? 'http' : 'https';
    return `${proto}://${host}`;
  }
  return 'https://greg.efesop.com';
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const record =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : {};

  const raw = record.amount;
  const amount =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string' && raw.trim() !== ''
        ? Number(raw)
        : NaN;

  if (!Number.isFinite(amount) || amount < MIN_EUR || amount > MAX_EUR) {
    return NextResponse.json(
      {
        error: `Enter an amount between EUR ${MIN_EUR} and EUR ${MAX_EUR.toLocaleString(
          'en-US',
        )}.`,
      },
      { status: 400 },
    );
  }

  const unitAmount = Math.round(amount * 100);

  const name =
    typeof record.name === 'string'
      ? record.name.trim().slice(0, NAME_MAX_LEN)
      : '';
  const email = typeof record.email === 'string' ? record.email.trim() : '';

  if (!name) {
    return NextResponse.json({ error: 'Enter your name.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Enter a valid email address.' },
      { status: 400 },
    );
  }

  const reasonRaw =
    typeof record.reason === 'string' ? record.reason.trim() : '';
  const reason = reasonRaw.slice(0, REASON_MAX_LEN) || DEFAULT_REASON;
  const wantInvoice = record.invoice === true;
  const origin = resolveOrigin(request);

  try {
    const session = await getGregStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: unitAmount,
            product_data: { name: reason },
          },
        },
      ],
      success_url: `${origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pay?canceled=1`,
      billing_address_collection: wantInvoice ? 'required' : 'auto',
      tax_id_collection: { enabled: wantInvoice },
      invoice_creation: { enabled: wantInvoice },
      metadata: {
        source: 'greg_custom_pay',
        custom_reason: reason,
        customer_name: name,
        invoice_requested: wantInvoice ? 'yes' : 'no',
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'no_session_url' }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error('[greg/pay/custom-checkout] Stripe error', msg);
    return NextResponse.json({ error: 'stripe_error' }, { status: 502 });
  }
}

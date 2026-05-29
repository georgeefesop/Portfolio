/**
 * Stripe Checkout session creator for CUSTOM (name-your-amount) payments on
 * efesop.com/pay.
 * POST /api/pay/custom-checkout
 *   { amount: number (EUR), name: string, email: string,
 *     reason?: string, invoice?: boolean }
 *
 * Builds a one-off Checkout Session from an inline price_data line item, so no
 * pre-created Stripe Product/Price is needed. Everything is validated
 * server-side - never trust the client in a money flow.
 *
 * Receipts email automatically for every payment (Stripe dashboard setting).
 * Invoices are opt-in: invoice=true turns on Stripe's invoice_creation, which
 * generates and emails a proper invoice PDF.
 */

import { NextResponse } from 'next/server';
import { getPayStripe } from '@/lib/pay/stripe';

export const runtime = 'nodejs'; // Stripe SDK needs Node, not Edge.

/** Custom payment bounds, in EUR. Tune here if needed. */
const MIN_EUR = 5;
const MAX_EUR = 10_000;
const REASON_MAX_LEN = 200;
const NAME_MAX_LEN = 100;
const DEFAULT_REASON = 'Custom payment';

/** Loose email sanity check - Stripe does the real validation. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Resolve the site origin for redirect URLs (preview-safe). */
function resolveOrigin(request: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  const origin = request.headers.get('origin');
  if (origin) return origin;
  const host = request.headers.get('host');
  const proto = host?.includes('localhost') ? 'http' : 'https';
  return host ? `${proto}://${host}` : 'https://efesop.com';
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

  // Amount: a finite number within bounds, charged in cents.
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

  const unitAmount = Math.round(amount * 100); // cents

  // Name + email: required. Email prefills Stripe; name is kept for the record.
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

  // Reason: optional free text, trimmed + length-capped. Shown on the Stripe
  // checkout page and the emailed receipt/invoice.
  const reasonRaw =
    typeof record.reason === 'string' ? record.reason.trim() : '';
  const reason = reasonRaw.slice(0, REASON_MAX_LEN) || DEFAULT_REASON;

  const wantInvoice = record.invoice === true;

  const origin = resolveOrigin(request);

  try {
    const session = await getPayStripe().checkout.sessions.create({
      mode: 'payment',
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
      cancel_url: `${origin}/pay?canceled=custom`,
      // Business invoices need a full billing address; personal payments don't.
      billing_address_collection: wantInvoice ? 'required' : 'auto',
      // Surface the VAT / Tax ID input on Checkout when an invoice is requested.
      tax_id_collection: { enabled: wantInvoice },
      // Opt-in: generate + email a proper invoice PDF.
      invoice_creation: { enabled: wantInvoice },
      metadata: {
        offering_slug: 'custom',
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
    console.error('[pay/custom-checkout] Stripe error', msg);
    return NextResponse.json({ error: 'stripe_error' }, { status: 502 });
  }
}

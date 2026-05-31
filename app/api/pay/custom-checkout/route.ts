/**
 * Stripe Checkout session creator for CUSTOM (name-your-amount) payments on
 * efesop.com/pay.
 * POST /api/pay/custom-checkout
 *   { name: string, email: string, invoice?: boolean,
 *     lines: { description?: string, amount: number }[] }
 *
 * Builds a one-off Checkout Session from one inline price_data line item per
 * row, so no pre-created Stripe Product/Price is needed. The total (sum of
 * lines) is validated server-side - never trust the client in a money flow.
 *
 * Receipts email automatically for every payment (Stripe dashboard setting).
 * Invoices are opt-in: invoice=true turns on Stripe's invoice_creation (which
 * generates and emails a proper invoice PDF) plus tax_id_collection, so the
 * buyer can enter a VAT / Tax ID on the Checkout page.
 */

import { NextResponse } from 'next/server';
import { getPayStripe } from '@/lib/pay/stripe';

export const runtime = 'nodejs'; // Stripe SDK needs Node, not Edge.

/** Custom payment bounds, in EUR - applied to the line total. Tune here. */
const MIN_EUR = 5;
const MAX_EUR = 10_000;
const REASON_MAX_LEN = 200;
const NAME_MAX_LEN = 100;
const MAX_LINES = 20;
const DEFAULT_REASON = 'Custom payment';

/** Loose email sanity check - Stripe does the real validation. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LineItem = { name: string; unitAmount: number };

/** Parse + validate the lines array into priced Stripe line items. */
function parseLines(raw: unknown): LineItem[] {
  if (!Array.isArray(raw)) return [];
  const parsed: { desc: string; unitAmount: number }[] = [];
  for (const entry of raw.slice(0, MAX_LINES)) {
    if (typeof entry !== 'object' || entry === null) continue;
    const e = entry as Record<string, unknown>;
    const amt =
      typeof e.amount === 'number'
        ? e.amount
        : typeof e.amount === 'string' && e.amount.trim() !== ''
          ? Number(e.amount)
          : NaN;
    if (!Number.isFinite(amt) || amt <= 0) continue;
    const desc =
      typeof e.description === 'string'
        ? e.description.trim().slice(0, REASON_MAX_LEN)
        : '';
    parsed.push({ desc, unitAmount: Math.round(amt * 100) });
  }
  // A single unnamed payment keeps the original default label.
  return parsed.map((p, i) => ({
    name: p.desc || (parsed.length === 1 ? DEFAULT_REASON : `Item ${i + 1}`),
    unitAmount: p.unitAmount,
  }));
}

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

  // Lines: at least one priced row, total within bounds.
  const lineItems = parseLines(record.lines);
  if (lineItems.length === 0) {
    return NextResponse.json(
      {
        error: `Enter an amount between EUR ${MIN_EUR} and EUR ${MAX_EUR.toLocaleString(
          'en-US',
        )}.`,
      },
      { status: 400 },
    );
  }

  const totalCents = lineItems.reduce((sum, l) => sum + l.unitAmount, 0);
  const totalEur = totalCents / 100;
  if (totalEur < MIN_EUR || totalEur > MAX_EUR) {
    return NextResponse.json(
      {
        error: `Total must be between EUR ${MIN_EUR} and EUR ${MAX_EUR.toLocaleString(
          'en-US',
        )}.`,
      },
      { status: 400 },
    );
  }

  const wantInvoice = record.invoice === true;
  const reasonSummary = lineItems.map((l) => l.name).join(' + ').slice(0, 480);
  const origin = resolveOrigin(request);

  try {
    const session = await getPayStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: lineItems.map((l) => ({
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: l.unitAmount,
          product_data: { name: l.name },
        },
      })),
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
        custom_reason: reasonSummary,
        line_count: String(lineItems.length),
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

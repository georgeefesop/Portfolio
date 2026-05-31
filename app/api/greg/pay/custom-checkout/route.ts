/**
 * Stripe Checkout session creator for name-your-amount payments on
 * greg.efesop.com/pay.
 *
 * POST /api/greg/pay/custom-checkout
 *   { name: string, email: string, invoice?: boolean,
 *     lines: { description?: string, amount: number }[] }
 *
 * Builds a one-off Checkout Session from one inline price_data line item per
 * row on the G.E. Revamp Stripe account. The total (sum of lines) is validated
 * server-side. invoice=true turns on invoice_creation + tax_id_collection so
 * the buyer can enter a VAT / Tax ID on the Checkout page.
 */

import { NextResponse } from 'next/server';
import { getGregStripe } from '@/lib/greg/stripe';

export const runtime = 'nodejs';

const MIN_EUR = 5;
const MAX_EUR = 50_000;
const REASON_MAX_LEN = 200;
const NAME_MAX_LEN = 100;
const MAX_LINES = 20;
const DEFAULT_REASON = 'Payment to G.E. Revamp Services';
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
  return parsed.map((p, i) => ({
    name: p.desc || (parsed.length === 1 ? DEFAULT_REASON : `Item ${i + 1}`),
    unitAmount: p.unitAmount,
  }));
}

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
    const session = await getGregStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
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
      cancel_url: `${origin}/pay?canceled=1`,
      billing_address_collection: wantInvoice ? 'required' : 'auto',
      tax_id_collection: { enabled: wantInvoice },
      invoice_creation: { enabled: wantInvoice },
      metadata: {
        source: 'greg_custom_pay',
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
    console.error('[greg/pay/custom-checkout] Stripe error', msg);
    return NextResponse.json({ error: 'stripe_error' }, { status: 502 });
  }
}

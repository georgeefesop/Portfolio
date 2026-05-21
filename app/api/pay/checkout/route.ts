/**
 * Stripe Checkout session creator for the efesop.com/pay storefront.
 * POST /api/pay/checkout  { slug: string }
 *
 * Resolves the offering slug against data/offerings.ts, refuses anything
 * that is not status: 'live', creates a Stripe Checkout Session on the LIVE
 * account, and returns { url } for the client to redirect to.
 *
 * Email receipts: Checkout sends a receipt automatically once "Successful
 * payments" emails are enabled in the Stripe dashboard
 * (Settings -> Customer emails). No per-session flag needed for that.
 */

import { NextResponse } from 'next/server';
import { getPayStripe } from '@/lib/pay/stripe';
import { getOffering } from '@/data/offerings';

export const runtime = 'nodejs'; // Stripe SDK needs Node, not Edge.

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

  const slug =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>).slug
      : undefined;

  if (typeof slug !== 'string' || slug.length === 0) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const offering = getOffering(slug);
  if (!offering) {
    return NextResponse.json({ error: 'unknown_offering' }, { status: 404 });
  }

  if (offering.status !== 'live' || !offering.priceId) {
    return NextResponse.json(
      { error: 'offering_not_purchasable' },
      { status: 409 },
    );
  }

  const origin = resolveOrigin(request);

  try {
    const session = await getPayStripe().checkout.sessions.create({
      mode: offering.billing === 'recurring' ? 'subscription' : 'payment',
      line_items: [{ price: offering.priceId, quantity: 1 }],
      success_url: `${origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pay?canceled=${offering.slug}`,
      billing_address_collection: 'auto',
      // Lets buyers apply a coupon if George ever issues one.
      allow_promotion_codes: true,
      metadata: {
        offering_slug: offering.slug,
        offering_name: offering.name,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'no_session_url' }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error('[pay/checkout] Stripe error', msg);
    return NextResponse.json({ error: 'stripe_error' }, { status: 502 });
  }
}

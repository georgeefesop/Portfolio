/**
 * Stripe webhook for the efesop.com/pay storefront (George Efesopoulos personal
 * account, the live personal Stripe account - shared with kitchens.efesop.com/Agora).
 *
 * On `checkout.session.completed` it captures the customer + payment into the
 * `efesop_pay_payments` table in Supabase. The upsert is keyed on
 * stripe_session_id so re-deliveries from Stripe are idempotent.
 *
 * Stripe dashboard: add an endpoint at /api/pay/stripe-webhook for the
 * `checkout.session.completed` event; signing secret -> STRIPE_PAY_WEBHOOK_SECRET.
 * Test mode and live mode are separate endpoints on Stripe - register both and
 * use the same env var name in each environment.
 */

import { type NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getPayStripe } from '@/lib/pay/stripe';
import { getPaySupabase } from '@/lib/pay/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_PAY_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json(
      { error: 'webhook_not_configured' },
      { status: 400 },
    );
  }

  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = getPayStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error(
      '[pay/webhook] signature verification failed',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};
    const description =
      meta.offering_name ||
      meta.custom_reason ||
      meta.offering_slug ||
      'Payment to efesop.com/pay';
    const supabase = getPaySupabase();

    const record = {
      stripe_event_id: event.id,
      stripe_session_id: session.id,
      offering_slug:
        typeof meta.offering_slug === 'string' ? meta.offering_slug : null,
      offering_name:
        typeof meta.offering_name === 'string' ? meta.offering_name : null,
      customer_name:
        session.customer_details?.name ?? meta.customer_name ?? null,
      customer_email: session.customer_details?.email ?? null,
      customer_phone: session.customer_details?.phone ?? null,
      amount_total:
        session.amount_total != null ? session.amount_total / 100 : null,
      currency: session.currency ?? null,
      description,
      invoice_requested: meta.invoice_requested === 'yes',
      paid_at: new Date(
        (session.created ?? Math.floor(Date.now() / 1000)) * 1000,
      ).toISOString(),
    };

    if (supabase) {
      const { error } = await supabase
        .from('efesop_pay_payments')
        .upsert(record, { onConflict: 'stripe_session_id' });
      if (error) {
        console.error('[pay/webhook] supabase upsert error', error.message);
      }
    } else {
      console.warn(
        '[pay/webhook] Supabase not configured - payment not stored',
      );
    }
  }

  return NextResponse.json({ received: true });
}

/**
 * Stripe webhook for the G.E. Revamp account (greg.efesop.com).
 *
 * On `checkout.session.completed` it captures the customer + payment into
 * Supabase (system of record) and mirrors it to Notion. For Same-Day Design
 * Render orders it also marks the stored order paid and emails the brief +
 * reference photos to George and Gregory.
 *
 * Stripe dashboard: add an endpoint at /api/greg/stripe-webhook for the
 * `checkout.session.completed` event; signing secret -> STRIPE_GREG_WEBHOOK_SECRET.
 */

import { type NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getGregStripe } from '@/lib/greg/stripe';
import { getGregSupabase } from '@/lib/greg/supabase';
import { addNotionCustomer } from '@/lib/greg/notion';
import { sendRenderOrderEmail } from '@/lib/greg/email';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_GREG_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json(
      { error: 'webhook_not_configured' },
      { status: 400 },
    );
  }

  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = getGregStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error(
      '[greg/webhook] signature verification failed',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};
    const description =
      meta.service || meta.custom_reason || 'Payment to G.E. Revamp';
    const supabase = getGregSupabase();

    const record = {
      stripe_event_id: event.id,
      stripe_session_id: session.id,
      customer_name:
        session.customer_details?.name ??
        meta.client_name ??
        meta.customer_name ??
        null,
      customer_email: session.customer_details?.email ?? null,
      customer_phone:
        session.customer_details?.phone ?? meta.client_phone ?? null,
      amount_total:
        session.amount_total != null ? session.amount_total / 100 : null,
      currency: session.currency ?? null,
      description,
      source: meta.source ?? null,
      invoice_requested: meta.invoice_requested === 'yes',
      paid_at: new Date(
        (session.created ?? Math.floor(Date.now() / 1000)) * 1000,
      ).toISOString(),
    };

    // Supabase - system of record. Upsert keyed on the session id is
    // idempotent if Stripe re-delivers the event.
    if (supabase) {
      const { error } = await supabase
        .from('greg_revamp_payments')
        .upsert(record, { onConflict: 'stripe_session_id' });
      if (error) {
        console.error('[greg/webhook] supabase upsert error', error.message);
      }
    } else {
      console.warn(
        '[greg/webhook] Supabase not configured - payment not stored',
      );
    }

    // Notion - optional dad-facing mirror.
    try {
      await addNotionCustomer({
        name: record.customer_name ?? 'Unknown',
        email: record.customer_email,
        phone: record.customer_phone,
        amount: record.amount_total,
        description: record.description,
        source: record.source,
        paidAt: record.paid_at,
      });
    } catch (err) {
      console.error(
        '[greg/webhook] notion sync error',
        err instanceof Error ? err.message : err,
      );
    }

    // Render orders - mark paid and email the brief to George + Gregory.
    if (meta.source === 'greg_renders') {
      try {
        await notifyRenderOrder(session, meta, supabase);
      } catch (err) {
        console.error(
          '[greg/webhook] render order notify error',
          err instanceof Error ? err.message : err,
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}

/**
 * Mark a paid render order in Supabase and email the brief + photos to
 * George and Gregory. Falls back to the Stripe metadata brief when Supabase
 * is not configured.
 */
async function notifyRenderOrder(
  session: Stripe.Checkout.Session,
  meta: Stripe.Metadata,
  supabase: SupabaseClient | null,
): Promise<void> {
  const customerName = session.customer_details?.name ?? 'a customer';
  const customerEmail = session.customer_details?.email ?? '';
  const amountLabel =
    session.amount_total != null && session.currency
      ? new Intl.NumberFormat('en-IE', {
          style: 'currency',
          currency: session.currency.toUpperCase(),
        }).format(session.amount_total / 100)
      : '';
  const quantity = Math.max(1, Math.round(Number(meta.quantity) || 1));

  let projectDescription = meta.brief ?? '';
  let location = meta.location ?? '';
  let whatsapp = meta.whatsapp ?? '';
  let styleNotes = '';
  let referenceImages: string[] = [];

  if (supabase && meta.order_id) {
    await supabase
      .from('greg_render_orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        stripe_session_id: session.id,
        customer_name: customerName,
        customer_email: customerEmail || null,
      })
      .eq('id', meta.order_id);

    const { data } = await supabase
      .from('greg_render_orders')
      .select(
        'project_description, location, whatsapp, style_notes, reference_images',
      )
      .eq('id', meta.order_id)
      .single();

    if (data) {
      projectDescription = data.project_description ?? projectDescription;
      location = data.location ?? location;
      whatsapp = data.whatsapp ?? whatsapp;
      styleNotes = data.style_notes ?? '';
      referenceImages = Array.isArray(data.reference_images)
        ? (data.reference_images as string[])
        : [];
    }
  }

  await sendRenderOrderEmail({
    customerName,
    customerEmail,
    quantity,
    amountLabel,
    projectDescription,
    location,
    whatsapp,
    styleNotes,
    referenceImages,
    stripeSessionId: session.id,
  });
}

/**
 * Stripe webhook endpoint for the agora funnel.
 * POST /api/agora/stripe-webhook
 *
 * Verifies signature, maps the event back to a lead (by email),
 * upserts a deal, and writes an activity record.
 *
 * Stripe dashboard → Developers → Webhooks → "+ Add endpoint":
 *   URL:      https://kitchens.efesop.com/api/agora/stripe-webhook
 *   Events:   checkout.session.completed
 *             invoice.payment_succeeded
 *             invoice.payment_failed
 *             customer.subscription.deleted
 *             payment_intent.payment_failed
 *   Secret:   set STRIPE_AGORA_WEBHOOK_SECRET in .env.local + Vercel env
 */

import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getAgoraStripe, AGORA_PRICES, type AgoraTier } from "@/lib/agora/stripe";
import {
  findLeadByEmail,
  insertLead,
  findDealByStripeSession,
  insertDeal,
  updateDeal,
  logActivity,
} from "@/lib/agora/crm";
import type { DealStage, TierOffered } from "@/lib/agora/types";

export const runtime = "nodejs"; // Stripe SDK requires Node, not Edge.

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_AGORA_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("[agora/stripe-webhook] missing signature or secret");
    return NextResponse.json({ error: "misconfigured" }, { status: 500 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getAgoraStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[agora/stripe-webhook] signature verification failed", msg);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaid(event.data.object);
        break;
      case "invoice.payment_failed":
        await handleInvoiceFailed(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
      default:
        // Acknowledge unknown events so Stripe stops retrying.
        console.log("[agora/stripe-webhook] unhandled event type:", event.type);
    }
  } catch (err) {
    console.error("[agora/stripe-webhook] handler error", err);
    // Return 500 so Stripe retries with exponential backoff.
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ---------- Event handlers ----------

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_email ?? session.customer_details?.email ?? null;
  const name = session.customer_details?.name ?? null;
  const tier = await resolveTierFromSession(session);
  const isSubscription = session.mode === "subscription";

  const lead = await findOrCreateLeadByEmail({
    email,
    business_name: name ?? "Unknown",
    source_detail: "stripe_checkout",
  });

  // Idempotency: if we've already created a deal for this session, just update it.
  const existing = await findDealByStripeSession(session.id);

  const stage: DealStage = isSubscription
    ? tier === "care"
      ? "won_care"
      : "won_rent"
    : "won_buy";

  if (existing) {
    await updateDeal(existing.id, {
      stage,
      closed_at: new Date().toISOString(),
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      amount_eur: session.amount_total ? Math.round(session.amount_total / 100) : null,
    });
  } else {
    await insertDeal({
      lead_id: lead.id,
      stage,
      tier_offered: (tier as TierOffered) ?? null,
      amount_eur: session.amount_total ? Math.round(session.amount_total / 100) : null,
      stripe_checkout_session_id: session.id,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      closed_at: new Date().toISOString(),
    });
  }

  await logActivity({
    lead_id: lead.id,
    type: "stripe_payment_succeeded",
    direction: "system",
    subject: `Stripe checkout completed (${tier ?? "unknown tier"})`,
    body: null,
    metadata: { session_id: session.id, mode: session.mode, amount_total: session.amount_total },
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Recurring renewal - log only, deal already exists from checkout.session.completed.
  const subscriptionId =
    "subscription" in invoice && typeof invoice.subscription === "string"
      ? invoice.subscription
      : null;
  if (!subscriptionId) return;

  const email = invoice.customer_email ?? null;
  if (!email) return;

  const lead = await findLeadByEmail(email);
  if (!lead) return; // No matching lead - shouldn't happen but don't error.

  await logActivity({
    lead_id: lead.id,
    type: "stripe_payment_succeeded",
    direction: "system",
    subject: "Subscription renewal paid",
    body: null,
    metadata: {
      invoice_id: invoice.id,
      subscription_id: subscriptionId,
      amount_paid: invoice.amount_paid,
    },
  });
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const email = invoice.customer_email ?? null;
  if (!email) return;
  const lead = await findLeadByEmail(email);
  if (!lead) return;

  await logActivity({
    lead_id: lead.id,
    type: "stripe_payment_failed",
    direction: "system",
    subject: "Subscription invoice payment failed",
    body: null,
    metadata: { invoice_id: invoice.id },
  });
}

async function handleSubscriptionCanceled(sub: Stripe.Subscription) {
  // Find the deal by subscription ID.
  const customer = typeof sub.customer === "string" ? sub.customer : null;
  if (!customer) return;

  // Retrieve customer's email to find the lead.
  const customerObj = await getAgoraStripe().customers.retrieve(customer);
  if (customerObj.deleted) return;
  const email = customerObj.email ?? null;
  if (!email) return;

  const lead = await findLeadByEmail(email);
  if (!lead) return;

  await logActivity({
    lead_id: lead.id,
    type: "stripe_subscription_canceled",
    direction: "system",
    subject: "Subscription canceled",
    body: null,
    metadata: { subscription_id: sub.id },
  });
}

async function handlePaymentFailed(pi: Stripe.PaymentIntent) {
  const email = pi.receipt_email ?? null;
  if (!email) return;
  const lead = await findLeadByEmail(email);
  if (!lead) return;

  await logActivity({
    lead_id: lead.id,
    type: "stripe_payment_failed",
    direction: "system",
    subject: "Payment intent failed",
    body: pi.last_payment_error?.message ?? null,
    metadata: { payment_intent_id: pi.id },
  });
}

// ---------- Helpers ----------

async function findOrCreateLeadByEmail(args: {
  email: string | null;
  business_name: string;
  source_detail: string;
}) {
  if (args.email) {
    const existing = await findLeadByEmail(args.email);
    if (existing) return existing;
  }
  return insertLead({
    business_name: args.business_name,
    email: args.email,
    source: "inbound_form",
    source_detail: args.source_detail,
  });
}

async function resolveTierFromSession(
  session: Stripe.Checkout.Session
): Promise<AgoraTier | null> {
  // Walk the line items, match the first price ID we recognise.
  const lineItems = await getAgoraStripe().checkout.sessions.listLineItems(session.id, {
    limit: 5,
  });
  for (const item of lineItems.data) {
    const priceId = item.price?.id;
    if (!priceId) continue;
    for (const [tier, id] of Object.entries(AGORA_PRICES)) {
      if (id === priceId) return tier as AgoraTier;
    }
  }
  return null;
}

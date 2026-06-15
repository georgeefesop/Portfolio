---
gbrain: v1
project: ge-portfolio
doc_type: architecture
tier: 2
title: Stripe webhook routing
summary: The three Stripe webhook endpoints (/pay, /agora, /greg) - which account, what events, where data lands, how idempotency works.
tags: [stripe, webhooks, integrations, idempotency]
data_sources: [stripe-efesop-personal, stripe-ge-revamp, supabase-george-os-canonical, supabase-agora-crm-canonical]
canonical_paths:
  - app/api/pay/stripe-webhook/route.ts
  - app/api/agora/stripe-webhook/route.ts
  - app/api/greg/stripe-webhook/route.ts
  - lib/pay/stripe.ts
  - lib/agora/stripe.ts
  - lib/greg/stripe.ts
  - lib/agora/crm.ts
updated: 2026-06-15
---

# Stripe webhook routing

Three accounts, three webhook routes, three Supabase write targets. Each route verifies the signature, dispatches by event type, and writes idempotently.

## Endpoints overview

| Route file | Surface | Stripe account | Events | Writes to |
|---|---|---|---|---|
| `app/api/pay/stripe-webhook/route.ts` | `/pay` storefront | efesop personal (`acct_1Qw1q1GHt7cesuhE`, LIVE) | `checkout.session.completed` | `efesop_pay_payments` (george-os Supabase) |
| `app/api/agora/stripe-webhook/route.ts` | `/agora` kitchens funnel | efesop personal (same account, currently TEST) | `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`, `payment_intent.payment_failed` | `leads`, `deals`, `activities` (agora-crm Supabase) |
| `app/api/greg/stripe-webhook/route.ts` | `greg.efesop.com` | G.E. Revamp (separate account) | `checkout.session.completed` | `greg_revamp_payments` (+ optional `greg_render_orders` paid-flip, optional Notion mirror, optional Resend email) (george-os Supabase) |

All three handlers `export const runtime = 'nodejs'` (Stripe SDK requires Node, not Edge).

## Common shape

Each handler:

1. Reads `stripe-signature` header.
2. Reads `STRIPE_<SURFACE>_WEBHOOK_SECRET` from env. If either is missing, returns `400 { error: 'webhook_not_configured' }` (or `500 misconfigured` for agora) - the route does NOT throw.
3. Verifies via `getXStripe().webhooks.constructEvent(raw, signature, secret)`. On failure returns `400 invalid_signature`.
4. Dispatches by `event.type`.
5. Returns `200 { received: true }` on success. Agora returns `500 handler_failed` on a handler exception so Stripe retries with exponential backoff.

## `/pay` (`app/api/pay/stripe-webhook/route.ts`)

- Single event: `checkout.session.completed`.
- Resolves a description from metadata in priority order: `meta.offering_name -> meta.custom_reason -> meta.offering_slug -> 'Payment to efesop.com/pay'`.
- Upserts into `efesop_pay_payments` keyed by `stripe_session_id` (`onConflict: 'stripe_session_id'`). Stripe retries are safe.
- Captures: `stripe_event_id`, `stripe_session_id`, `offering_slug`, `offering_name`, `customer_name`, `customer_email`, `customer_phone`, `amount_total` (euros, divided from cents), `currency`, `description`, `invoice_requested` (boolean from `meta.invoice_requested === 'yes'`), `paid_at` (ISO string).
- If Supabase env is missing, logs a warning and still ACKs `200`. The payment row is just not stored.

## `/agora` (`app/api/agora/stripe-webhook/route.ts`)

The most stateful of the three. Five event types:

### `checkout.session.completed`

1. Resolve email + name from `session.customer_email`/`customer_details`.
2. `resolveTierFromSession` walks `listLineItems` and matches the first price ID against `AGORA_PRICES` (`buy | rent | care` in `lib/agora/stripe.ts`).
3. `findOrCreateLeadByEmail` - tries `findLeadByEmail`, else `insertLead({ source: 'inbound_form', source_detail: 'stripe_checkout' })`.
4. **Idempotency guard**: `findDealByStripeSession(session.id)`. If a deal exists, `updateDeal`; else `insertDeal`.
5. Stage = `won_buy` for one-time, `won_care` for care subscription, `won_rent` for rent subscription.
6. Always `logActivity({ type: 'stripe_payment_succeeded', direction: 'system', ... })`.

### `invoice.payment_succeeded`

Subscription renewal. Looks up the lead by `customer_email`, logs an activity. No new deal row (the original `checkout.session.completed` already created it).

### `invoice.payment_failed`

Looks up the lead, logs `stripe_payment_failed` activity. No state mutation on the deal.

### `customer.subscription.deleted`

Retrieves the Stripe Customer to recover the email, looks up the lead, logs `stripe_subscription_canceled`.

### `payment_intent.payment_failed`

Looks up the lead by `pi.receipt_email`, logs `stripe_payment_failed` with `pi.last_payment_error?.message`.

Unhandled event types are logged and ACKed `200` so Stripe stops retrying.

## `/greg` (`app/api/greg/stripe-webhook/route.ts`)

- Single event: `checkout.session.completed`.
- Resolves description from `meta.service -> meta.custom_reason -> 'Payment to G.E. Revamp'`.
- Upserts into `greg_revamp_payments` keyed by `stripe_session_id`. Captures: `stripe_event_id`, `stripe_session_id`, `customer_name`, `customer_email`, `customer_phone`, `amount_total`, `currency`, `description`, `source`, `invoice_requested`, `paid_at`.
- Optional Notion mirror via `addNotionCustomer` (`lib/greg/notion.ts`). Failures are logged, do not break the ack.
- If `meta.source === 'greg_renders'`, additionally calls `notifyRenderOrder`:
  - Updates `greg_render_orders` row keyed by `meta.order_id`: sets `status: 'paid'`, `paid_at`, `stripe_session_id`, captures customer name/email.
  - Reads `project_description`, `location`, `whatsapp`, `style_notes`, `reference_images` from the row.
  - Sends `sendRenderOrderEmail` (Resend) to George + Gregory with the brief.

## Idempotency model

Stripe will re-deliver an event for up to 3 days on a non-2xx response, and may also re-deliver on success after a network blip.

- `/pay` and `/greg` are pure upserts keyed on `stripe_session_id`. Safe.
- `/agora` guards via `findDealByStripeSession` before any insert. Activities are append-only - a duplicate `stripe_payment_succeeded` activity row IS possible if Stripe retries. This is intentional (cheap log, audit-trail friendly) but be aware when computing analytics.
- Never key on `stripe_event_id` alone for the deal-state mutation: a single session can emit multiple events (e.g. `checkout.session.completed` plus an async confirmation), and they all describe the same deal.

## Local testing

```bash
# pay
stripe listen --forward-to localhost:3000/api/pay/stripe-webhook \
  --events checkout.session.completed

# agora
stripe listen --forward-to localhost:3000/api/agora/stripe-webhook \
  --events checkout.session.completed,invoice.payment_succeeded,invoice.payment_failed,customer.subscription.deleted,payment_intent.payment_failed

# greg (against the greg Stripe account - switch via stripe login --interactive)
stripe listen --forward-to localhost:3000/api/greg/stripe-webhook \
  --events checkout.session.completed
```

`stripe listen` prints a temporary webhook signing secret. Paste it into `.env.local` as the matching `STRIPE_*_WEBHOOK_SECRET` for that session.

Trigger a synthetic event:

```bash
stripe trigger checkout.session.completed
```

Verify the Supabase row landed before declaring the handler fixed.

## Rotation

- Three signing secrets, three secret keys, rotated independently. Each rotation: change the value on Stripe, change the value in Vercel env (Production and Preview), redeploy.
- Per global memory: never rotate without explicit ask. "use the access" / "fix it" are read permissions, not rotate permissions.

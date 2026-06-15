
# ADR 0002 - Two Stripe accounts, three webhook routes

- Status: Accepted
- Date: 2026-06-15

## Context

ge-portfolio serves three commercial surfaces with very different ownership:

1. `/pay` storefront - George Efesopoulos sole-trader income.
2. `/agora` kitchens funnel - an Agora product proposition currently under the same sole-trader umbrella.
3. `greg.efesop.com` - G.E. Revamp Services Limited, a separate UK company. Payments must land in that company's books, not George's.

Mixing payments across these into a single Stripe account would entangle accounting, taxes, payouts, and dashboards.

## Decision

Two Stripe accounts (efesop personal shared by `/pay` and `/agora`; G.E. Revamp for greg), mapped to three webhook routes and three secret-key env vars. Per `lib/pay/stripe.ts`, `lib/agora/stripe.ts`, `lib/greg/stripe.ts`:

| Surface | Stripe account | Mode | Secret env | Webhook env | Webhook route |
|---|---|---|---|---|---|
| `/pay` | efesop personal (live personal account) | LIVE | `STRIPE_PAY_SECRET_KEY` | `STRIPE_PAY_WEBHOOK_SECRET` | `app/api/pay/stripe-webhook/route.ts` |
| `/agora` | efesop personal (same live personal account) | TEST (until activation) | `STRIPE_AGORA_SECRET_KEY` | `STRIPE_AGORA_WEBHOOK_SECRET` | `app/api/agora/stripe-webhook/route.ts` |
| `greg.efesop.com` | G.E. Revamp Services Limited | LIVE-capable, mode follows the key | `STRIPE_GREG_SECRET_KEY` | `STRIPE_GREG_WEBHOOK_SECRET` | `app/api/greg/stripe-webhook/route.ts` |

`/pay` and `/agora` share the SAME Stripe account but isolate by webhook secret (Stripe lets you register multiple endpoints on the same account, each with its own signing secret). All three Stripe clients pin API version `'2026-04-22.dahlia'`.

Each webhook upserts on `stripe_session_id` for idempotency:
- `/pay`: `efesop_pay_payments.upsert(..., { onConflict: 'stripe_session_id' })`.
- `/agora`: `findDealByStripeSession` guard plus `insertDeal` or `updateDeal`.
- `/greg`: `greg_revamp_payments.upsert(..., { onConflict: 'stripe_session_id' })`.

## Consequences

- Three independent payouts, three independent Stripe dashboards, three sets of disputes/refunds workflows.
- Three webhook signing secrets to rotate independently. Set in `.env.local` AND Vercel env per surface.
- Switching `/agora` from TEST to LIVE means swapping the price IDs in `lib/agora/stripe.ts:33-44`, not touching anything else.
- Never set `STRIPE_GREG_SECRET_KEY` to an efesop key (or vice versa). The split is a legal/accounting boundary, not a code convenience.
- Adding a fourth surface follows the same pattern: new `lib/<name>/stripe.ts`, new webhook route, new secret pair.

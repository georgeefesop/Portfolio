---
gbrain: v1
project: ge-portfolio
doc_type: how-to
tier: 2
title: How to deploy ge-portfolio to Vercel
summary: Env vars per surface, Stripe webhook endpoints, custom domains, and how to verify a deploy actually landed.
tags: [how-to, deploy, vercel, stripe]
data_sources: [stripe-efesop-personal, stripe-ge-revamp]
canonical_paths:
  - .env.example
  - middleware.ts
  - next.config.ts
  - app/api/pay/stripe-webhook/route.ts
  - app/api/agora/stripe-webhook/route.ts
  - app/api/greg/stripe-webhook/route.ts
updated: 2026-06-15
---

# How to deploy ge-portfolio to Vercel

Vercel auto-deploys on commit to the default branch of `github.com/georgeefesop/Portfolio`. This doc covers the one-time setup and the per-deploy verify steps.

## Vercel project

- Framework preset: Next.js.
- Node version: 20 (Next 16 + React 19 requirement).
- Build command: `next build` (default).
- Output: handled by Vercel.

## Custom domains

Two domains on the same Vercel project:

- `efesop.com` (apex) - the portfolio + `/pay` + `/agora` + `/admin` + `/kingfisher-sanity/studio`.
- `greg.efesop.com` (subdomain) - the G.E. Revamp microsite. Routes to `app/greg/*` via `middleware.ts` host rewrite.

Add both domains in the Vercel project's Domains tab. DNS: A/AAAA to Vercel for apex, CNAME to Vercel for the subdomain.

## Environment variables

Set per-environment (Production, Preview, Development) in Vercel. `.env.example` covers a partial set; the canonical per-surface list below is the source of truth (several real env vars are used in code but absent from `.env.example`). Group by surface:

**Public portfolio.**
- `RESEND_API_KEY` - contact form / estimate emails.
- `NEXT_PUBLIC_SITE_URL=https://efesop.com` - used for Stripe success/cancel URLs; safe to leave unset (falls back to request origin).

**`/pay` storefront** (efesop personal Stripe, LIVE).
- `STRIPE_PAY_SECRET_KEY=sk_live_...`
- `STRIPE_PAY_WEBHOOK_SECRET=whsec_...` (signing secret of the `/api/pay/stripe-webhook` endpoint on Stripe).

**`/agora` kitchens funnel** (efesop personal Stripe, currently TEST; SEPARATE Supabase project for CRM).
- `STRIPE_AGORA_SECRET_KEY=sk_test_...` (will become `sk_live_...` after activation).
- `STRIPE_AGORA_WEBHOOK_SECRET=whsec_...`.
- `NEXT_PUBLIC_SUPABASE_AGORA_URL=https://hwbkggrtvbjhqvogkcpn.supabase.co` - required; `lib/agora/supabase.ts` throws without it.
- `SUPABASE_AGORA_SERVICE_ROLE_KEY=...` - service-role key for the agora-crm project; required for the `/api/agora/stripe-webhook` route to write `leads`/`deals`/`activities`.

**`greg.efesop.com`** (G.E. Revamp company Stripe - SEPARATE account).
- `STRIPE_GREG_SECRET_KEY=sk_live_or_test_...`
- `STRIPE_GREG_WEBHOOK_SECRET=whsec_...`
- `NEXT_PUBLIC_POSTHOG_KEY_GREG=phc_...` - separate PostHog project for the subdomain.
- `GREG_ADMIN_PASSWORD=...` - gates `/admin` on the greg surface.
- `GREG_SUPABASE_URL=https://ygyeyprogpawmjzjyrew.supabase.co`
- `GREG_SUPABASE_SERVICE_KEY=...`
- `ANTHROPIC_API_KEY=...` - for `/admin/render-studio`.
- `RUNWARE_API_KEY=...` - for `/admin/render-studio`.
- Optional: `GREG_RENDER_NOTIFY_EMAIL`, `GREG_NOTION_TOKEN`, `GREG_NOTION_CUSTOMERS_DB_ID`.

**`/admin` (efesop time tracking)**
- `EFESOP_ADMIN_PASSWORD=...`
- `GEORGE_OS_SUPABASE_URL=https://ygyeyprogpawmjzjyrew.supabase.co`
- `GEORGE_OS_SUPABASE_SERVICE_KEY=...`
- Issuer block (printed on every invoice; see `lib/admin/issuer.ts`): `EFESOP_ISSUER_NAME`, `EFESOP_ISSUER_ROLE`, `EFESOP_ISSUER_LOCATION`, `EFESOP_TIC_NUMBER`, `EFESOP_SOCIAL_INSURANCE_NUMBER`, `EFESOP_BANK_ACCOUNT_NAME`, `EFESOP_BANK_IBAN`, `EFESOP_BANK_BIC`, `EFESOP_BANK_NAME`.

**Sanity (Kingfisher microsite).**
- `NEXT_PUBLIC_SANITY_PROJECT_ID=bfonjqiz`
- `NEXT_PUBLIC_SANITY_DATASET=kingfisher`

**Analytics.**
- `NEXT_PUBLIC_POSTHOG_KEY=phc_...` - efesop.com project key. PostHog is proxied via `/ingest/*` (configured in `next.config.ts`).

## Stripe webhook endpoints

Register on each Stripe account dashboard (Developers -> Webhooks). One endpoint per surface per mode.

| Account | Endpoint URL | Events | Signing secret env |
|---|---|---|---|
| efesop personal | `https://efesop.com/api/pay/stripe-webhook` | `checkout.session.completed` | `STRIPE_PAY_WEBHOOK_SECRET` |
| efesop personal | `https://efesop.com/api/agora/stripe-webhook` | `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`, `payment_intent.payment_failed` | `STRIPE_AGORA_WEBHOOK_SECRET` |
| G.E. Revamp | `https://greg.efesop.com/api/greg/stripe-webhook` | `checkout.session.completed` | `STRIPE_GREG_WEBHOOK_SECRET` |

Test mode and live mode are separate endpoints on Stripe - register both per surface and feed the same env var name in each environment.

Full handler-by-handler walkthrough: `docs/integrations/stripe-webhook-routing.md`.

## Verify a deploy actually landed

Per global memory: verify before claiming "done".

- **HTML check**: `curl -sI https://efesop.com/ | head -n 5` returns `200 OK`.
- **Greg subdomain rewrite**: `curl -s https://greg.efesop.com/ | grep -i 'greg' | head -n 3` returns greg-specific content (NOT the portfolio shell).
- **Apex 404 on `/greg`**: `curl -sI https://efesop.com/greg` returns `404`.
- **Stripe round-trip**: from Stripe CLI, `stripe trigger checkout.session.completed --add checkout_session:metadata.offering_slug=test` against the production endpoint, then check the corresponding Supabase row.
- **`deploy-check vercel ge-portfolio`** - toolbelt CLI; preferred over curl when available.

If verification fails: roll back via Vercel's Deployments tab (one click), then debug.

## Local preview of a Vercel build

```bash
vercel link                         # if first time
vercel pull --environment=production
vercel build
vercel deploy --prebuilt
```

Useful when a build-time env mismatch only shows up in Vercel's image (not `next build` locally).

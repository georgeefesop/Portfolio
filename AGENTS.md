---
gbrain: v1
project: ge-portfolio
doc_type: agents
tier: 2
title: ge-portfolio agent guide
summary: Next.js 16 product-design portfolio plus three Stripe-funded sub-apps (pay, agora, greg) with a Sanity-backed Kingfisher microsite and a private billing admin.
tags: [nextjs, sanity, stripe, supabase, portfolio]
data_sources: [sanity-kingfisher-canonical, supabase-george-os-canonical, supabase-agora-crm-canonical, stripe-efesop-personal, stripe-ge-revamp, posthog-eu, vercel-analytics, resend]
canonical_paths:
  - app/
  - middleware.ts
  - data/case-studies/
  - sanity/schemas/kingfisher/
  - lib/admin/billing.ts
  - app/api/pay/stripe-webhook/route.ts
  - app/api/agora/stripe-webhook/route.ts
  - app/api/greg/stripe-webhook/route.ts
  - scripts/fix-emdashes.mjs
updated: 2026-06-15
---

# ge-portfolio (agent guide)

> Human-facing intro lives in `README.md`. This file is what agents read before touching code.

## Project

**What.** George Efesopoulos' product-design and AI-build portfolio. A single Next.js 16 (App Router) deployment serves four addressable surfaces from one codebase:

1. **Public portfolio** at `efesop.com` (homepage, `/case-studies/[slug]`, contact, estimate).
2. **`/pay` storefront** at `efesop.com/pay` (name-your-amount Stripe Checkout to the personal Stripe account).
3. **`/agora` kitchens funnel** (lead capture + Stripe Checkout for the Agora kitchens proposition; uses the same personal Stripe account, different webhook).
4. **`greg.efesop.com`** contractor microsite for G.E. Revamp Services Limited, served from `app/greg/*` via host-based rewrite in `middleware.ts` (NOT a separate deployment).
5. **`/admin`** private time tracking and invoice issuance (efesop personal).

A Kingfisher Mortgages client microsite lives at `app/kingfisher` with its own Sanity Studio at `/kingfisher-sanity/studio` (project `bfonjqiz`, dataset `kingfisher`).

**Integrates with.**
- **Stripe** - two accounts (efesop personal shared by `/pay` and `/agora`; G.E. Revamp for greg), three webhook routes (see `docs/integrations/stripe-webhook-routing.md`).
- **Supabase** - two separate projects (george-os for pay/greg/admin/billing, agora-crm for the kitchens funnel).
- **Sanity** - one project (`bfonjqiz`) for Kingfisher CMS content.
- **PostHog** - EU cloud, proxied via `/ingest/*` rewrites in `next.config.ts`. Separate project key for `greg.efesop.com`.
- **Vercel Analytics** - via `@vercel/analytics`.
- **Resend** - contact form, estimate emails, render-order notifications.
- **Notion** (optional) - greg customer mirror via `lib/greg/notion.ts`.
- **Akti** (`/akti*`) - proxied from `akti-seven.vercel.app` via `next.config.ts` rewrites.

**Truth store.** Per global memory, the canonical store for OS-level data is the local SQLite at `data/.local/george-os.db` in `~/Projects/george-os/`. THIS app reads/writes its OWN domain data to its dedicated Supabase tables:

- Pay payments: `efesop_pay_payments` (canonical, on the george-os Supabase project) - `app/api/pay/stripe-webhook/route.ts:78`.
- Greg payments: `greg_revamp_payments` and `greg_render_orders` (canonical, same project) - `app/api/greg/stripe-webhook/route.ts:79,153`.
- Billing/admin: the private `billing` schema on the george-os Supabase project, accessed via the 12 `public.billing_*` SECURITY DEFINER RPCs (canonical for time tracking and invoices) - `lib/admin/billing.ts` and `lib/admin/invoices.ts`.
- Agora CRM: `leads`, `deals`, `activities` tables on the SEPARATE agora-crm Supabase project (`hwbkggrtvbjhqvogkcpn`) - `lib/agora/crm.ts` + `app/api/agora/stripe-webhook/route.ts`.
- Kingfisher content: Sanity dataset `kingfisher` on project `bfonjqiz`.

Case study content is **typed source code**, not a CMS - `data/case-studies/<slug>.ts` files, registered in `data/case-studies/index.ts`.

## Run, build, test

Package manager is **npm** (`package-lock.json`). All commands run from the repo root.

```bash
npm install                       # first time
npm run dev                       # next dev at http://localhost:3000
npm run build                     # next build (production)
npm start                         # next start (after build)
npm run lint                      # eslint
npm run test                      # vitest run
npm run seed:kingfisher           # node scripts/seed-kingfisher-sanity.mjs (Kingfisher Sanity seed)
```

**Dev host for the greg microsite.** `middleware.ts` host-routes `greg.*` into the `/greg` tree. Locally visit `http://greg.localhost:3000` (browsers resolve `*.localhost` to `127.0.0.1`).

**Env.** Copy `.env.example` to `.env.local` and fill in. The minimum to boot the public portfolio is none of these (everything degrades gracefully when keys are missing); per-surface required envs are partially documented inline in `.env.example` - see `docs/how-to/deploy-to-vercel.md` for the full per-surface list (several real env vars - `STRIPE_AGORA_*`, `STRIPE_PAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SUPABASE_AGORA_URL`, `SUPABASE_AGORA_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` - are used in code but absent from `.env.example`). The Stripe webhooks return `400 webhook_not_configured` if their signing secret is unset, rather than crashing the route.

**Sanity Studio.** Hosted in-app at `/kingfisher-sanity/studio` (configured in `sanity.config.ts`, `basePath: '/kingfisher-sanity/studio'`). Requires `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.

## Conventions

**Style.**
- TypeScript everywhere. React 19, App Router, Tailwind v4.
- Two-space indent, single quotes in `.ts`/`.tsx` (mostly; some files use double - match the surrounding file).
- Server-only modules import `'server-only'` at the top (see `lib/pay/stripe.ts`, `lib/admin/supabase.ts`).
- Stripe API version pinned: `'2026-04-22.dahlia'` across all three clients.

**No em dashes anywhere (U+2014).** Husky `pre-commit` runs `npx lint-staged`, which runs `scripts/fix-emdashes.mjs` against staged `ts,tsx,js,jsx,mjs,cjs,css,html,svg,json,md,mdx` files and auto-replaces em dashes with hyphens. The script must contain ZERO literal U+2014 bytes (it uses `String.fromCodePoint(0x2014)`); if it ever ingests a literal em dash, the hook will quietly fix itself into a no-op (see Gotchas).

**Stripe key isolation.** Two accounts, three secret-key env vars (one per surface), never cross-mixed:

| Surface | Account | Secret env | Webhook secret env | Client module |
|---|---|---|---|---|
| `/pay` | efesop personal (`acct_1Qw1q1GHt7cesuhE`) LIVE | `STRIPE_PAY_SECRET_KEY` | `STRIPE_PAY_WEBHOOK_SECRET` | `lib/pay/stripe.ts` |
| `/agora` | efesop personal (same `acct_1Qw1...`) - currently TEST mode | `STRIPE_AGORA_SECRET_KEY` | `STRIPE_AGORA_WEBHOOK_SECRET` | `lib/agora/stripe.ts` |
| `/greg` | G.E. Revamp Services Limited (separate account) | `STRIPE_GREG_SECRET_KEY` | `STRIPE_GREG_WEBHOOK_SECRET` | `lib/greg/stripe.ts` |

**Webhook idempotency.** All three webhook handlers upsert on `stripe_session_id` (`onConflict: 'stripe_session_id'`) so Stripe retries do not duplicate rows. The agora handler additionally guards via `findDealByStripeSession` before insert. Never change these keys.

**Case studies.** Each is a typed `CaseStudy` in `data/case-studies/<slug>.ts`; the live order is the `cases[]` array in `data/case-studies/index.ts`. External / link-only entries live in `data/case-studies/external.ts`. See `docs/how-to/add-case-study.md` for the workflow.

**Off-limits.**
- Do not rename, move, or delete `.husky/pre-commit` or `scripts/fix-emdashes.mjs`.
- Do not place the three Stripe secrets in any committed file. `.env.local` only, plus Vercel project env.
- Do not write to the Supabase `agora-crm` project from any route outside `/api/agora/*` (lead and deal model is owned there).
- Do not auto-default visitors back to dark theme; the inline theme script in `app/layout.tsx` deliberately defaults to `light-olive` (see Gotchas).

## Gotchas

Real traps observed in this repo, sourced from `CLAUDE.md` dossier (now migrated here) and the code.

- **Next.js `<Image>` ignores `currentColor` in SVGs** (2026-04-30). `<Image>` loads SVGs in an isolated document context, so `fill="currentColor"` never inherits. Use CSS `mask-image` instead. Pattern is in `components/sections/CredibilityBar` (or wherever logos render after the fix).
- **`scripts/fix-emdashes.mjs` must contain NO literal U+2014** (2026-04-30). The first version had em dashes in its own comments; husky then ran the hook against itself and the script silently fixed itself into a no-op. The current implementation builds the search character via `String.fromCodePoint(0x2014)` so the source stays pure ASCII. If you edit the script, keep it ASCII.
- **Turbopack caches CSS aggressively in dev** (2026-04-30). CSS-token changes (e.g. `--text-dim`) may not reflect in the browser until you restart `npm run dev`, even when the production build shows the correct value. Restart the dev server before assuming a token change did not land.
- **`app/layout.tsx` defaults the theme to `light-olive`** (2026-04-30). The inline theme script applies light-olive when no localStorage key exists. Dark mode is NO LONGER the default. Do not "fix" this by re-defaulting to dark.
- **`prototype:open` is the single source of truth for opening the POS modal** (2026-04-30). The open-sound fires from the event listener in `ProductHero`, not from individual callers. Dispatch the custom event; do not call internal open APIs directly.
- **CSS `mask-image` over `<Image>` for SVG logos that need to inherit color** (2026-04-30) - same root cause as the first gotcha; canonical workaround.
- **`vibrant` mode and `CornerBrackets` HUD are deliberately removed** (2026-04-30, around commit `9170faa`). Do not re-introduce them: removed as part of the visual repositioning.
- **Stripe webhook signing secrets gate the routes**. Missing secret returns `400 webhook_not_configured` (not 500). Verify your env before debugging "webhook fails in prod".
- **Greg uses a separate Stripe ACCOUNT, not just a separate webhook**. `STRIPE_GREG_SECRET_KEY` is a key on the G.E. Revamp company account, not the efesop personal account. The pay and agora webhooks both use the efesop account but isolate by `STRIPE_PAY_WEBHOOK_SECRET` vs `STRIPE_AGORA_WEBHOOK_SECRET`.
- **Resend is not fully wired**. `.env.example` documents `RESEND_API_KEY`; the contact and estimate routes exist (`app/api/contact/route.ts`, `app/api/estimate/route.ts`) but full env-config status is per-environment - verify Resend before announcing a send-related fix is "done".
- **PostHog has two project keys**. `NEXT_PUBLIC_POSTHOG_KEY` for `efesop.com`, `NEXT_PUBLIC_POSTHOG_KEY_GREG` for `greg.efesop.com`. They are separate projects on PostHog EU cloud.
- **Akti is proxied, not embedded**. `next.config.ts` rewrites `/akti` and `/akti/:path*` to `akti-seven.vercel.app`. Editing the Akti app means editing that other deployment, not this repo.
- **Agora is currently in Stripe TEST mode**. `lib/agora/stripe.ts:33` holds test price IDs; live IDs will replace them once Stripe activation completes.

## How to verify changes

Pick the smallest verify step that proves the change.

- **TypeScript change**: `npm run lint` (eslint surfaces type-related issues via `eslint-config-next`). For deeper checks run `tsc --noEmit` (no script wired; invoke directly).
- **Unit logic change** (e.g. `lib/admin/invoice-model.ts`, `lib/admin/auth-core.ts`, `lib/admin/time.ts`): `npm run test`. Vitest co-locates tests as `<name>.test.ts`.
- **Production build**: `npm run build` then `npm start`. Catches a class of App Router / Turbopack / Tailwind v4 issues that dev hides.
- **Stripe webhook**: trigger from Stripe CLI against `localhost:3000/api/<surface>/stripe-webhook` with the matching signing secret in `.env.local`. Verify the upsert landed:
  - `/pay`: row in `efesop_pay_payments` keyed by `stripe_session_id`.
  - `/agora`: row in `deals` keyed by `stripe_checkout_session_id`, activity in `activities`.
  - `/greg`: row in `greg_revamp_payments` keyed by `stripe_session_id`, optional Notion mirror.
- **Greg subdomain rewrite**: visit `http://greg.localhost:3000/` and confirm the response is the `app/greg/page.tsx` content (apex `localhost:3000/greg` should 404 by design - that is `middleware.ts` working).
- **Em-dash hook**: stage a file containing U+2014, run `git commit`, confirm the file is rewritten with hyphens and the commit lands.
- **Sanity Studio**: visit `http://localhost:3000/kingfisher-sanity/studio` after setting `NEXT_PUBLIC_SANITY_PROJECT_ID=bfonjqiz` and `NEXT_PUBLIC_SANITY_DATASET=kingfisher`.
- **Deploy landed**: `deploy-check vercel ge-portfolio` (toolbelt CLI) or curl a known-changed asset on `https://efesop.com`. Per global memory: verify before claiming "done".

## Tickets

Work lives in the george-os ticket system, bound to the `ge-portfolio` project goal. Use the `ticketize` CLI (canonical) or `ops ticket query` to find open work:

```bash
ticketize query --project ge-portfolio --status backlog,in_flight
ticketize get TKT-NNN
ticketize new --project ge-portfolio --goal <goal_id_or_title> --title "..."
```

Status flips: flip In-flight at start, Done at finish. See global CLAUDE.md "Tickets" section.

## Internal tools (built here)

- `scripts/fix-emdashes.mjs` - the em-dash guard (husky + lint-staged on commit).
- `scripts/seed-kingfisher-sanity.mjs` - seeds the Kingfisher dataset (`npm run seed:kingfisher`).
- `scripts/export-kingfisher.mjs`, `scripts/export-case-study-images.mjs`, `scripts/import-deck-images.mjs` - one-off content migration helpers.
- `scripts/gen-sidechain-thumb.py` - sidechain case-study thumbnail generator.
- `scripts/download_assets.ps1` - asset bulk-download helper.

## Decisions (migrated from prior dossier)

Logged here for continuity. Treat each as a fixed product/design decision unless explicitly reopened.

- 2026-04-30: Removed `vibrant` mode (colour-blob background + `BackgroundToggle`) from `ProductHero`. It did not fit the repositioned portfolio aesthetic. (commit window starting `9170faa`)
- 2026-04-30: Removed `CornerBrackets` HUD decoration from `CaseStudyModal` desktop panel - simplified to clean border.
- 2026-04-30: Hero H1 changed to `UX / UI PRODUCT / DESIGNER & DEVELOPER` so visitors who do not parse "Product Designer" see UX/UI immediately. (commit `2260f83`)
- 2026-04-30: `prototype:open` custom event is the single source of truth for opening the POS modal. Sound fires from the listener, not callers.
- 2026-04-30: Light-mode theme system added with three palettes (`light-sand`, `light-linen`, `light-olive`), all defined as `[data-theme]` CSS overrides. POS prototype has its own `pos-*` token scale. (commit `51c1c66`)
- 2026-04-30: Chose CSS `mask-image` over Next.js `<Image>` for SVG logos in `CredibilityBar` to preserve `currentColor` inheritance.

## Architecture decision records

One-way doors are captured in `docs/adr/`:

- `0001-record-architecture-decisions.md` - we use ADRs (Nygard).
- `0002-three-stripe-accounts.md` - two Stripe accounts, three webhook routes.
- `0003-supabase-multi-project.md` - two Supabase projects, intentionally isolated.
- `0004-subdomain-routing.md` - `greg.efesop.com` via `middleware.ts` rewrite, not a separate deployment.

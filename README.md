
# ge-portfolio

George Efesopoulos' product-design and AI-build portfolio, plus three Stripe-funded sub-apps and a Kingfisher Mortgages microsite, all from one Next.js 16 deployment.

> Agents: read `AGENTS.md` first. `CLAUDE.md` is a one-line pointer to it.

## Why

- A single repo, single Vercel deployment serves: the public portfolio at `efesop.com`, the `/pay` storefront, the `/agora` kitchens funnel, the `greg.efesop.com` contractor microsite (host-routed via `middleware.ts`), and a private `/admin` time-tracking surface.
- Case study content is typed source code in `data/case-studies/`, not a CMS. Marketing copy stays under version control; you cannot fix a typo by clicking around.
- Two Stripe accounts (efesop personal, shared by `/pay` and `/agora`; G.E. Revamp for greg) feed three idempotent webhook routes. Keep them isolated; see `docs/adr/0002-three-stripe-accounts.md`.
- Kingfisher Mortgages content lives in Sanity (project `bfonjqiz`, dataset `kingfisher`) with the Studio mounted at `/kingfisher-sanity/studio`.

## Install / setup

Prerequisites: Node 20+, npm.

```bash
git clone https://github.com/georgeefesop/Portfolio.git
cd Portfolio
npm install
cp .env.example .env.local       # fill in keys per surface (see .env.example comments)
npm run dev                      # http://localhost:3000
```

The public portfolio renders with zero env vars. Webhooks return `400 webhook_not_configured` when their signing secret is unset (degrades gracefully). Per-surface env requirements (Stripe, Supabase, Sanity, PostHog, Resend) are partially documented inline in `.env.example`; see `docs/how-to/deploy-to-vercel.md` for the full per-surface list (several required vars are used in code but absent from `.env.example`).

### Greg subdomain locally

`middleware.ts` rewrites the `greg.*` host into the `/greg` route tree. To work on it locally:

```bash
# browsers resolve *.localhost to 127.0.0.1 automatically
open http://greg.localhost:3000
```

### Kingfisher Sanity Studio

```bash
# .env.local needs:
# NEXT_PUBLIC_SANITY_PROJECT_ID=bfonjqiz
# NEXT_PUBLIC_SANITY_DATASET=kingfisher
open http://localhost:3000/kingfisher-sanity/studio
```

## Usage

The smallest working example: add a case study.

```bash
# 1. Copy a template (e.g. akti.ts), give it a slug.
cp data/case-studies/akti.ts data/case-studies/my-study.ts

# 2. Edit the export, then register it.
# In data/case-studies/index.ts:
#   import myStudy from './my-study';
#   export const cases: CaseStudy[] = [myStudy, ...]; // order = display order

# 3. View locally.
npm run dev
open http://localhost:3000
```

Full workflow: `docs/how-to/add-case-study.md`.

Other commands:

```bash
npm run build                    # next build
npm start                        # next start (after build)
npm run lint                     # eslint
npm run test                     # vitest run
npm run seed:kingfisher          # seed Kingfisher Sanity from scripts/seed-kingfisher-sanity.mjs
```

## Status

Live and deployed on Vercel from `github.com/georgeefesop/Portfolio` (auto-deploy on commit to the default branch). 15 case studies in `data/case-studies/index.ts` as of 2026-06-15. The `/pay` storefront is on Stripe LIVE. The `/agora` funnel is on Stripe TEST pending account activation. `greg.efesop.com` is live on its own Stripe (G.E. Revamp Services Limited).

## Docs

- `AGENTS.md` - what agents need to know before touching code (conventions, gotchas, verify steps).
- `docs/adr/` - architecture decisions (2 Stripe accounts and 3 webhook routes, 2 Supabase projects, subdomain routing).
- `docs/how-to/` - add a case study, deploy to Vercel.
- `docs/integrations/` - Stripe webhook routing, Sanity Kingfisher schema overview.
- `docs/greg/` - G.E. Revamp setup, admin plan, intake.
- `docs/admin-billing/` - time-tracking + invoicing P0/P1 plans.
- `docs/style-guide.md` - visual conventions.

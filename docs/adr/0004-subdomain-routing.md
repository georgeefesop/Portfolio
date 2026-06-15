---
gbrain: v1
project: ge-portfolio
doc_type: adr
tier: 2
title: ADR 0004 - greg.efesop.com served from /greg via middleware rewrite
summary: greg.efesop.com is host-routed into the /greg tree by middleware.ts; it is NOT a separate deployment.
tags: [adr, routing, middleware, nextjs]
data_sources: []
canonical_paths:
  - middleware.ts
  - app/greg/
updated: 2026-06-15
---

# ADR 0004 - greg.efesop.com served from /greg via middleware rewrite

- Status: Accepted
- Date: 2026-06-15

## Context

George needed a contractor microsite for G.E. Revamp Services Limited at `greg.efesop.com`, separate in branding and content from his portfolio at `efesop.com`. The two surfaces share infrastructure (Next.js build, Vercel project, Supabase tables, deploy pipeline) but the visitor on `greg.efesop.com` must NEVER see portfolio content, and the visitor on `efesop.com` must NEVER reach the greg tree by typing `/greg`.

## Decision

One Next.js deployment, host-based routing in `middleware.ts`:

- The greg microsite lives at `app/greg/*`.
- On host `greg.efesop.com` (or `greg.localhost` in dev), `middleware.ts` rewrites the request path to `/greg<path>` (with `/` rewritten to `/greg`). The URL bar still shows `greg.efesop.com/...`.
- On the apex host (`efesop.com`) the `/greg` tree returns 404. The microsite is reachable only via its subdomain.

The matcher excludes `api`, `_next`, `ingest` (PostHog proxy), and any path with a file extension - so API routes work the same on both hosts.

```ts
// middleware.ts
export const config = {
  matcher: ['/((?!api|_next|ingest|.*\\.[\\w]+$).*)'],
};
```

Local development: visit `http://greg.localhost:3000` (browsers resolve `*.localhost` to 127.0.0.1).

## Consequences

- One CI pipeline, one Vercel deploy, one set of build/lint/test commands serves both surfaces.
- Shared libs are trivial: greg payments and pay payments both end up in the same Supabase project (see ADR 0003), and the webhook handlers sit side-by-side under `app/api/`.
- API routes are reachable on BOTH hosts (`greg.efesop.com/api/...` and `efesop.com/api/...`). Webhooks are typically registered to one canonical URL each per Stripe, but the routes do not care which host called them.
- Adding a future microsite (e.g. another client) follows the same pattern: add a host prefix branch in `middleware.ts`, add an `app/<name>/*` tree, gate the apex from reaching it. Do NOT proliferate this for case studies - those stay as content in `data/case-studies/`. The pattern is for genuinely separate brand surfaces only.
- The Akti case study, by contrast, is proxied to a separate Vercel deployment via `next.config.ts` rewrites (`/akti` and `/akti/:path*` -> `akti-seven.vercel.app`). That decision is older and has not been promoted to a full ADR; it is a content-level proxy, not a brand surface.

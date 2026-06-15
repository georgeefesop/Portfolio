
# ADR 0003 - Two Supabase projects, intentionally isolated

- Status: Accepted
- Date: 2026-06-15

## Context

ge-portfolio writes to four logical data domains: efesop /pay payments, greg payments + render orders, the private `billing` schema for admin time-tracking and invoicing, and the agora CRM (leads, deals, activities). Each domain has its own access pattern and (in agora's case) likely a different long-term owner.

## Decision

Use TWO Supabase projects. Boundary is by ownership/extraction-risk, not by row volume.

**Project A: `george-os`** (`ygyeyprogpawmjzjyrew.supabase.co`) - holds the three efesop-side domains:
- `public.efesop_pay_payments` - written by `app/api/pay/stripe-webhook/route.ts`, accessed via `lib/pay/supabase.ts` (`getPaySupabase`).
- `public.greg_revamp_payments` and `public.greg_render_orders` - written by `app/api/greg/stripe-webhook/route.ts`, accessed via `lib/greg/supabase.ts`.
- `billing.*` private schema (time entries, invoices, rates, clients) - accessed exclusively through `public.billing_*` SECURITY DEFINER RPCs. See `lib/admin/billing.ts` and `lib/admin/invoices.ts` for the 12 wrapped RPCs (`billing_resolve_rate`, `billing_set_rate`, `billing_upsert_time_entry`, `billing_delete_time_entry`, `billing_list_time_entries`, `billing_week_summary`, `billing_list_clients`, `billing_issue_invoice`, `billing_list_invoices`, `billing_get_invoice`, `billing_void_invoice`, `billing_set_invoice_status`).

`lib/pay/supabase.ts` and `lib/greg/supabase.ts` fall back to each other's env vars (`PAY_SUPABASE_URL || GREG_SUPABASE_URL`) precisely because they ARE the same project.

**Project B: `agora-crm`** (`hwbkggrtvbjhqvogkcpn.supabase.co`) - holds the agora funnel:
- `leads`, `deals`, `activities` tables - accessed via `lib/agora/crm.ts` (`findLeadByEmail`, `insertLead`, `findDealByStripeSession`, `insertDeal`, `updateDeal`, `logActivity`).

The agora data model is intentionally portable - it may be extracted into its own product/repo later. Keeping it in a separate Supabase project means that extraction is a credential change, not a schema split.

**Canonical truth caveat.** Per global memory, OS-level canonical truth (sessions, tickets, goals) is the local SQLite at `~/Projects/george-os/data/.local/george-os.db`. The Supabase `cc.*` schema is a frozen orphan and is NOT read or written by this repo. This repo's Supabase usage is for its own domain data only.

## Consequences

- Two sets of credentials to manage. `GEORGE_OS_SUPABASE_URL`/`_SERVICE_KEY` for project A's billing client (`lib/admin/supabase.ts`). `GREG_SUPABASE_URL`/`_SERVICE_KEY` (also used by pay via fallback). `lib/agora/crm.ts` reads its own agora-crm env (verify with that module).
- Cross-domain joins are not possible at the database layer. If you ever need to correlate an agora lead to an admin invoice, do it in code, not SQL.
- Adding a new domain belongs in project A unless it has agora's "may extract later" property; in that case, give it its own Supabase project from day one.
- The `billing` schema is private. Never read or write its tables directly from the app; always go through the `public.billing_*` RPCs (the contract is fixed there).

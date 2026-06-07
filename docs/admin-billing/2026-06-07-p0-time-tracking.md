# Admin Time-Tracking (P0) Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. Nothing in here is applied until George approves; `apply_migration` to the george-os Supabase requires explicit go.

**Goal:** Log billable time from both `efesop.com/admin` and a `time` CLI into a new Supabase `billing` schema, and see this week's running total. Retires the Notion "Time & Billing" log.

**Architecture:** A private password-gated sub-app at `app/admin/*` inside the existing **ge-portfolio** repo (Next.js 16 / React 19 / Tailwind v4, Vercel), cloning the proven `greg` auth + server-only Supabase patterns. Persistence is a private `billing` schema on the **george-os** Supabase project (`ygyeyprogpawmjzjyrew`), driven only through `public.billing_*` SECURITY DEFINER RPC wrappers (PostgREST cannot see `billing`), with deny-all RLS on every base table. The same RPCs back a toolbelt `time` CLI, so web and terminal share one source of truth.

**Tech Stack:** Next.js 16 App Router, `@supabase/supabase-js` (installed), react-hook-form (installed), Postgres 17 (george-os), Node toolbelt CLIs, vitest (new dev dep, pure-util tests only).

---

## Jurisdiction + scope notes

- **Establishment: Cyprus** (confirmed). Only affects the P3 VAT/tax layer; P0 stores no tax. The existing invoice identity is already Cyprus (`cyprus_identity` secret, `invoice.mjs` location `'Cyprus'`).
- **Money is integer cents** everywhere (`*_cents int`), never float. Rate `85 EUR/h` = `8500`.
- **Ship VAT-off.** No VAT fields in P0.
- **Generated `ARCHITECTURE` reference:** this header is the durable design record for now; a standalone `ARCHITECTURE.md` + the P1-P3 plans follow once P0 lands.

## Data model (P0 subset: 3 tables, all in schema `billing`)

- `billing.clients` - id uuid pk, name, legal_name, email, vat_number null, country char(2), address jsonb default '{}', default_currency char(3) default 'EUR' (regex check), payment_terms_days int default 7, notes, created_at. Seeded with Chris Heinz / EPC.
- `billing.rate_history` (SCD-2) - id, client_id fk, hourly_rate_cents int check>0, currency char(3), effective_from date, effective_to date null (=current), created_at. Seeded EUR 85/h from 2026-06-01. Rate change = close the open row + insert a new one; never UPDATE an amount.
- `billing.time_entries` - id, client_id fk, project_id uuid null (FK added in P1), work_date date NOT NULL, started_at/ended_at timestamptz null (display only), break_minutes int default 0 check>=0, duration_minutes int NOT NULL check>=0 (billable minutes, single source of truth), work_done text default '', comment text default '', billable boolean default true, rate_cents_applied int (snapshot at write - the immutability guard), currency char(3) default 'EUR', billing_week text GENERATED from work_date (`to_char(work_date,'IYYY"-W"IW')`), source text default 'manual' check in ('manual','cli','notion'), ticket_refs jsonb default '[]' (P2 fills it), invoice_id uuid null (FK added in P1), invoiced_at timestamptz null, created_at. Index `(client_id, work_date)`.

Deferred to later phases: `billing.invoices`, `billing.invoice_line_items`, `billing.payments`, `billing.invoice_counters`, `billing.tax_vat_ledger`.

## ADRs (decisions locked here)

1. **Home:** apex `app/admin/*` in ge-portfolio (not a subdomain, not `/studio`), backed by george-os `billing` schema. Reversible, but this is the foundation.
2. **Auth:** clone greg's sha256 httpOnly-cookie gate, password-only (drop the username). Zero new auth dependency. RLS deny-all on every table regardless - a one-user app is still internet-exposed.
3. **PostgREST surface:** base tables private in `billing`; the API is `public.billing_*` SECURITY DEFINER RPCs with `SET search_path = billing, public`. Mirrors the `cc` convention and lets the CLI + app share one contract.
4. **Manual-first:** `work_date` is user-set (4am-rollover is a client default), so no timezone-coupled generated date column. No live timer in P0.
5. **Rate immutability:** snapshot `rate_cents_applied` at write; rate history is SCD-2. A future rate change never re-prices logged work.
6. **Ticket auto-detect (P2) reads `cc.tickets`** (already synced from both Notion boards), not live Notion. Already "talks to the command center."

---

## Task 1: Migration 0001 - `billing` schema, tables, RLS, seed

**Files:**
- Create (reference copy, version-controlled): `db/billing/0001_schema.sql`
- Apply to: george-os Supabase (`ygyeyprogpawmjzjyrew`) via Supabase MCP `apply_migration` name `billing_0001_schema` - **only after George approves.**

- [ ] **Step 1: Write the migration SQL** to `db/billing/0001_schema.sql`

```sql
create schema if not exists billing;

create table billing.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  email text,
  vat_number text,
  country char(2),
  address jsonb not null default '{}'::jsonb,
  default_currency char(3) not null default 'EUR' check (default_currency ~ '^[A-Z]{3}$'),
  payment_terms_days int not null default 7,
  notes text,
  created_at timestamptz not null default now()
);

create table billing.rate_history (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references billing.clients(id),
  hourly_rate_cents int not null check (hourly_rate_cents > 0),
  currency char(3) not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  effective_from date not null,
  effective_to date,
  created_at timestamptz not null default now()
);
create index rate_history_client_idx on billing.rate_history (client_id, effective_from desc);

create table billing.time_entries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references billing.clients(id),
  project_id uuid,
  work_date date not null,
  started_at timestamptz,
  ended_at timestamptz,
  break_minutes int not null default 0 check (break_minutes >= 0),
  duration_minutes int not null check (duration_minutes >= 0),
  work_done text not null default '',
  comment text not null default '',
  billable boolean not null default true,
  rate_cents_applied int,
  currency char(3) not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  billing_week text generated always as (to_char(work_date, 'IYYY"-W"IW')) stored,
  source text not null default 'manual' check (source in ('manual','cli','notion')),
  ticket_refs jsonb not null default '[]'::jsonb,
  invoice_id uuid,
  invoiced_at timestamptz,
  created_at timestamptz not null default now()
);
create index time_entries_client_date_idx on billing.time_entries (client_id, work_date desc);

-- Deny-all RLS (service_role bypasses; no users exist)
alter table billing.clients enable row level security;
alter table billing.rate_history enable row level security;
alter table billing.time_entries enable row level security;
create policy block_public on billing.clients      for all to anon, authenticated using (false) with check (false);
create policy block_public on billing.rate_history  for all to anon, authenticated using (false) with check (false);
create policy block_public on billing.time_entries  for all to anon, authenticated using (false) with check (false);

-- Seed
insert into billing.clients (name, legal_name, country, default_currency, payment_terms_days)
values ('Chris Heinz', 'EPC / 250k Club', 'DE', 'EUR', 7);
insert into billing.rate_history (client_id, hourly_rate_cents, currency, effective_from)
select id, 8500, 'EUR', date '2026-06-01' from billing.clients where name = 'Chris Heinz';
```

- [ ] **Step 2: Apply (after approval)** via Supabase MCP `apply_migration`, project `ygyeyprogpawmjzjyrew`, name `billing_0001_schema`, the SQL above.

- [ ] **Step 3: Verify** with `sq`:

Run: `sq sql "select count(*) clients, (select count(*) from billing.rate_history) rates from billing.clients"`
Expected: `clients=1, rates=1`.

Run: `sq sql "select name from billing.clients"` -> `Chris Heinz`.

---

## Task 2: Migration 0002 - `public.billing_*` RPC wrappers

**Files:**
- Create: `db/billing/0002_rpcs.sql`
- Apply: Supabase MCP `apply_migration` name `billing_0002_rpcs` (after approval).

- [ ] **Step 1: Write the RPCs** to `db/billing/0002_rpcs.sql`

```sql
create or replace function public.billing_resolve_rate(p_client_id uuid, p_date date)
returns int language sql security definer set search_path = billing, public as $$
  select hourly_rate_cents from billing.rate_history
  where client_id = p_client_id and effective_from <= p_date
    and (effective_to is null or effective_to >= p_date)
  order by effective_from desc limit 1;
$$;

create or replace function public.billing_upsert_time_entry(
  p_id uuid, p_client_id uuid, p_work_date date,
  p_started_at timestamptz, p_ended_at timestamptz,
  p_break_minutes int, p_duration_minutes int,
  p_work_done text, p_comment text, p_billable boolean,
  p_source text, p_ticket_refs jsonb
) returns billing.time_entries
language plpgsql security definer set search_path = billing, public as $$
declare v_rate int; v_row billing.time_entries;
begin
  v_rate := public.billing_resolve_rate(p_client_id, p_work_date);
  insert into billing.time_entries
    (id, client_id, work_date, started_at, ended_at, break_minutes, duration_minutes,
     work_done, comment, billable, rate_cents_applied, source, ticket_refs)
  values
    (coalesce(p_id, gen_random_uuid()), p_client_id, p_work_date, p_started_at, p_ended_at,
     coalesce(p_break_minutes,0), p_duration_minutes, coalesce(p_work_done,''),
     coalesce(p_comment,''), coalesce(p_billable,true), v_rate,
     coalesce(p_source,'manual'), coalesce(p_ticket_refs,'[]'::jsonb))
  on conflict (id) do update set
    work_date=excluded.work_date, started_at=excluded.started_at, ended_at=excluded.ended_at,
    break_minutes=excluded.break_minutes, duration_minutes=excluded.duration_minutes,
    work_done=excluded.work_done, comment=excluded.comment, billable=excluded.billable,
    rate_cents_applied=excluded.rate_cents_applied, ticket_refs=excluded.ticket_refs
  returning * into v_row;
  return v_row;
end; $$;

create or replace function public.billing_list_time_entries(
  p_client_id uuid, p_from date, p_to date, p_unbilled_only boolean default false
) returns table (
  id uuid, work_date date, hours numeric, billable boolean, rate_cents_applied int,
  amount_cents int, work_done text, comment text, billing_week text, invoice_id uuid
) language sql security definer set search_path = billing, public as $$
  select id, work_date, round(duration_minutes/60.0, 2) as hours, billable, rate_cents_applied,
    case when billable then round(duration_minutes/60.0 * rate_cents_applied)::int else 0 end as amount_cents,
    work_done, comment, billing_week, invoice_id
  from billing.time_entries
  where client_id = p_client_id and work_date >= p_from and work_date <= p_to
    and (not p_unbilled_only or invoice_id is null)
  order by work_date desc, created_at desc;
$$;

create or replace function public.billing_week_summary(p_client_id uuid, p_billing_week text)
returns table (entries int, total_hours numeric, billable_hours numeric, billable_cents bigint)
language sql security definer set search_path = billing, public as $$
  select count(*)::int,
    coalesce(round(sum(duration_minutes)/60.0, 2), 0),
    coalesce(round(sum(duration_minutes) filter (where billable)/60.0, 2), 0),
    coalesce(sum(case when billable then round(duration_minutes/60.0 * rate_cents_applied) else 0 end), 0)::bigint
  from billing.time_entries
  where client_id = p_client_id and billing_week = p_billing_week;
$$;
```

- [ ] **Step 2: Apply (after approval)** via Supabase MCP `apply_migration` name `billing_0002_rpcs`.

- [ ] **Step 3: Verify round-trip** with `sq` (grab the client id first):

Run: `sq sql "select id from billing.clients where name='Chris Heinz'"` -> copy `<cid>`.
Run: `sq rpc billing_upsert_time_entry --p_id=null --p_client_id=<cid> --p_work_date=2026-06-09 --p_started_at=null --p_ended_at=null --p_break_minutes=0 --p_duration_minutes=120 --p_work_done=smoke --p_comment= --p_billable=true --p_source=cli --p_ticket_refs=[]`
Expected: a JSON row with `rate_cents_applied: 8500`, `billing_week: "2026-W24"`.
Run: `sq rpc billing_week_summary --p_client_id=<cid> --p_billing_week=2026-W24`
Expected: `billable_hours: 2.00, billable_cents: 17000`.
Cleanup: `sq sql "delete from billing.time_entries where work_done='smoke'"`.

---

## Task 3: Pure time utils + tests (`lib/admin/time.ts`)

**Files:**
- Create: `lib/admin/time.ts`, `lib/admin/time.test.ts`
- Modify: `package.json` (add `vitest` devDep + `"test": "vitest run"` if absent)

- [ ] **Step 1: Write failing tests** `lib/admin/time.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { parseDurationMinutes, defaultWorkDate } from './time';

describe('parseDurationMinutes', () => {
  it('parses minutes', () => expect(parseDurationMinutes('90m')).toBe(90));
  it('parses decimal hours', () => expect(parseDurationMinutes('1.5h')).toBe(90));
  it('parses bare hours', () => expect(parseDurationMinutes('2')).toBe(120));
  it('parses a 24h range', () => expect(parseDurationMinutes('9-11:30')).toBe(150));
  it('parses an overnight range', () => expect(parseDurationMinutes('22:00-02:00')).toBe(240));
  it('rejects junk', () => expect(parseDurationMinutes('soon')).toBeNull());
});

describe('defaultWorkDate', () => {
  it('before 4am rolls to yesterday', () =>
    expect(defaultWorkDate(new Date('2026-06-07T02:30:00'))).toBe('2026-06-06'));
  it('after 4am stays today', () =>
    expect(defaultWorkDate(new Date('2026-06-07T09:00:00'))).toBe('2026-06-07'));
});
```

- [ ] **Step 2: Run, expect fail.** Run: `npm test` -> FAIL (module not found).

- [ ] **Step 3: Implement** `lib/admin/time.ts`

```ts
// Duration parsing for manual time entry. Returns whole minutes, or null.
export function parseDurationMinutes(input: string): number | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  const range = s.match(/^(\d{1,2})(?::(\d{2}))?\s*-\s*(\d{1,2})(?::(\d{2}))?$/);
  if (range) {
    const [, h1, m1 = '0', h2, m2 = '0'] = range;
    let start = +h1 * 60 + +m1;
    let end = +h2 * 60 + +m2;
    if (end <= start) end += 24 * 60; // overnight
    return end - start;
  }
  const mins = s.match(/^(\d+(?:\.\d+)?)\s*m(in)?$/);
  if (mins) return Math.round(+mins[1]);
  const hrs = s.match(/^(\d+(?:\.\d+)?)\s*h?$/);
  if (hrs) return Math.round(+hrs[1] * 60);
  return null;
}

// Day a logged block counts for: before 4am local, count it as yesterday.
export function defaultWorkDate(now: Date = new Date()): string {
  const d = new Date(now);
  if (d.getHours() < 4) d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function eur(cents: number): string {
  return (cents / 100).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
```

- [ ] **Step 4: Run, expect pass.** Run: `npm test` -> PASS (8 tests).
- [ ] **Step 5: Commit** `git add lib/admin/time.ts lib/admin/time.test.ts package.json && git commit -m "feat(admin): time parsing utils"`

---

## Task 4: Auth gate (clone greg, password-only)

**Files:**
- Create: `lib/admin/auth.ts` (clone of `lib/greg/admin-auth.ts`, deltas below)
- Create: `app/api/admin/session/route.ts` (clone of `app/api/greg/admin/session/route.ts`, deltas below)
- Create: `components/admin/LoginForm.tsx`
- Modify: `.env.local`, `.env.example` (add `EFESOP_ADMIN_PASSWORD`), and Vercel env.

- [ ] **Step 1:** `lib/admin/auth.ts` - clone greg, drop the username:

```ts
import 'server-only';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

export const ADMIN_COOKIE = 'efesop_admin_auth';
function password(): string { return process.env.EFESOP_ADMIN_PASSWORD ?? ''; }
export function authToken(): string {
  return createHash('sha256').update(`efesop-admin-v1:${password()}`).digest('hex');
}
export function passwordValid(pass: string): boolean {
  const pw = password();
  return pw.length > 0 && pass === pw;
}
export function cookieValid(value: string | undefined): boolean {
  return password().length > 0 && !!value && value === authToken();
}
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return cookieValid(jar.get(ADMIN_COOKIE)?.value);
}
```

- [ ] **Step 2:** `app/api/admin/session/route.ts` - clone greg's route; body is `{ password }` only; on valid, set `ADMIN_COOKIE = authToken()` (httpOnly, secure in prod, sameSite lax, path '/', maxAge 30d); `DELETE` clears it. `export const runtime = 'nodejs'`.

- [ ] **Step 3:** `components/admin/LoginForm.tsx` (client component): a single password input that POSTs `{ password }` to `/api/admin/session`, and on `res.ok` calls `location.reload()`; on 401 shows "Wrong password." Use tokens `bg-bg-secondary border-border-subtle text-text-primary` and the copper `bg-accent-primary` button (match `app/greg/admin/page.tsx`).

- [ ] **Step 4:** Add `EFESOP_ADMIN_PASSWORD=` to `.env.example`; set a real value in `.env.local` and in Vercel (Production + Preview). Never commit the value.

- [ ] **Step 5: Commit** (no value committed).

---

## Task 5: Billing data layer (`lib/admin/supabase.ts` + `lib/admin/billing.ts`)

**Files:**
- Create: `lib/admin/supabase.ts` (clone of `lib/greg/supabase.ts`, george-os creds)
- Create: `lib/admin/billing.ts` (typed RPC callers)
- Modify: `.env.example` (+ `GEORGE_OS_SUPABASE_URL`, `GEORGE_OS_SUPABASE_SERVICE_KEY`), Vercel env.

- [ ] **Step 1:** `lib/admin/supabase.ts`

```ts
import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
let cached: SupabaseClient | null = null;
export function getBillingSupabase(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.GEORGE_OS_SUPABASE_URL;
  const key = process.env.GEORGE_OS_SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
```

- [ ] **Step 2:** `lib/admin/billing.ts` - `import 'server-only'`; typed wrappers over `.rpc()` (public schema): `resolveRate`, `upsertTimeEntry`, `listTimeEntries`, `weekSummary`, plus `getClientId(name)` and `currentBillingWeek()` (`to_char` equivalent in TS via ISO week). Each throws on `error`. Export `TimeEntryRow`/`WeekSummary` types matching the RPC return columns.

- [ ] **Step 3:** Env: add the two `GEORGE_OS_SUPABASE_*` vars to `.env.example`, `.env.local`, and Vercel. The service-role value comes from `secrets.json` `george_os_supabase` (do not echo it).

- [ ] **Step 4: Commit.**

---

## Task 6: `/admin` hub + `/admin/time` (form + this-week list)

**Files:**
- Create: `app/admin/page.tsx` (gated hub)
- Create: `app/admin/time/page.tsx` (server: list + summary)
- Create: `components/admin/QuickAddForm.tsx` (client, react-hook-form)
- Create: `app/api/admin/time/route.ts` (POST upsert, re-verifies auth)

- [ ] **Step 1:** `app/admin/page.tsx` - `export const metadata = { robots: { index: false, follow: false } }`; if `!(await isAdmin())` render `<LoginForm/>`; else a simple hub linking to `/admin/time`. (Existing dev-only `app/admin/leads` is untouched; do NOT add an `app/admin/layout.tsx` so leads stays ungated.)

- [ ] **Step 2:** `app/api/admin/time/route.ts` - `runtime = 'nodejs'`; POST handler that **re-checks `await isAdmin()` and returns 401 if false** (page gate does not protect the route), parses the body, and calls `upsertTimeEntry`. This is the most likely real vuln (direct POST), so the in-route auth check is mandatory.

- [ ] **Step 3:** `components/admin/QuickAddForm.tsx` - react-hook-form fields: `work_date` (default `defaultWorkDate()`), `duration` (text, parsed with `parseDurationMinutes`, inline error if null), `break_minutes` (number, subtracted -> `duration_minutes = parsed - break`), `work_done` (text), `comment` (text), `billable` (checkbox, default true). Submit POSTs to `/api/admin/time`; on success reset + `router.refresh()`.

- [ ] **Step 4:** `app/admin/time/page.tsx` - server component: resolve client id, call `listTimeEntries(cid, weekStart, weekEnd)` + `weekSummary(cid, currentBillingWeek())`; render `<QuickAddForm/>`, the week's rows (date, hours, work_done, EUR amount via `eur()`), and a footer **"This week: {billable_hours}h / EUR {eur(billable_cents)}"**. Use copper tokens to match the portfolio.

- [ ] **Step 5: Verify (manual).** `npm run dev`, visit `/admin`, log in with `EFESOP_ADMIN_PASSWORD`, add an entry (e.g. `work_date=today`, `duration=2h`, `work_done=test`), confirm it appears with `EUR 170.00` and the week total updates. Then `curl -XPOST localhost:3000/api/admin/time -d '{}'` -> expect `401`.

- [ ] **Step 6: Commit.**

---

## Task 7: `time` CLI (toolbelt, same RPCs)

**Files:**
- Create: `C:\Users\georg\Projects\toolbelt\commands\time.mjs`
- Modify: `toolbelt/package.json` (`bin: { "time": "commands/time.mjs" }`), then `npm link` from the repo root.

- [ ] **Step 1:** Write `commands/time.mjs` modeled on `commands/sq.mjs`: `SUPABASE_URL='https://ygyeyprogpawmjzjyrew.supabase.co'`, key from `getSecret('george_os_supabase.service_role_key')`, POST `/rest/v1/rpc/<fn>` with `apikey`+`Authorization` bearer and `Content-Profile: public`. Reuse `emit`/`err` from `../lib/output.mjs`. Inline a JS copy of `parseDurationMinutes`/`defaultWorkDate` (small; the toolbelt is JS, the app is TS). Subcommands:
  - `time log "<work_done>" <duration> [--date=YYYY-MM-DD] [--break=N] [--no-bill] [--comment="..."]` -> resolves client (Chris Heinz), `billing_upsert_time_entry` with `source=cli`.
  - `time list [--week=2026-W24]` -> `billing_list_time_entries` for the week range (default current).
  - `time week [--week=...]` -> `billing_week_summary`, prints `Nh / EUR X`.

- [ ] **Step 2:** Add the `bin` entry, run `npm link` (from `C:\Users\georg\Projects\toolbelt`).

- [ ] **Step 3: Verify end-to-end (shared source of truth).**
Run: `time log "cli smoke" 1.5h --date=2026-06-09`
Run: `time week --week=2026-W24` -> includes the 1.5h.
Then reload `/admin/time` for that week -> the CLI entry shows in the web list too.
Cleanup the smoke row via `sq sql "delete from billing.time_entries where work_done like '%smoke%'"`.

- [ ] **Step 4: Commit** (toolbelt repo).

---

## Task 8: Cutover + retire the Notion log

- [ ] **Step 1:** Re-log this week's real entries (or backfill the 12 Wk23 rows from the Notion "Time & Billing" DB) via `time log` / the form. (Backfill script optional; the week is small.)
- [ ] **Step 2:** Confirm `time week` and `/admin/time` agree with the known total.
- [ ] **Step 3:** Mark the Notion "Time & Billing" DB read-only / archived (manual, George). The two Notion **ticket** boards stay - they feed P2 detection.
- [ ] **Step 4:** Final commit + (with George's ok) push to deploy `/admin` to efesop.com.

---

## Self-review (done)

- Spec coverage: add hours/work/comment/breaks (T6), settable billable (T6), rate snapshot (T2), web + CLI shared (T6/T7), this-week total (T6/T7), Supabase canonical replacing Notion (T1/T8). Ticket auto-detect, invoicing, dashboards, tax = P1-P3.
- Types consistent: `duration_minutes`/`rate_cents_applied`/`billing_week`/`amount_cents` used identically across SQL, `billing.ts`, form, and CLI.
- No placeholders: all SQL, utils, auth, and the CLI shape are concrete; the two mechanical clones (auth, supabase client) include full target code; the React pieces specify exact fields, tokens, and the mandatory in-route auth recheck.

## Deferred (separate plans)

- **P1 Invoicing:** `invoices`/`line_items`/`counters` tables + `billing_issue_invoice` (freeze snapshot, gap-free number), `buildInvoiceModel()` reusing `renderInvoiceHtml` verbatim, `<iframe srcDoc>` preview, PDF via the toolbelt CLI first. Re-point `invoice` CLI onto `billing`.
- **P2 Intelligence:** ticket auto-detect from `cc.tickets` (confirm-before-attach), the dashboard (KPI strip + income/outstanding/rate charts, Recharts).
- **P3 Tax/VAT:** Cyprus set-aside accrual now; VAT treatment enum + `tax_vat_ledger` when registered. Post income to `cc.ledger_entries` on payment (idempotent).

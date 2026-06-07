# Admin Invoicing (P1) Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. Builds on the shipped P0 (`2026-06-07-p0-time-tracking.md`). Nothing touches the live george-os Supabase until George approves each `apply_migration`.

**Goal:** Turn tracked billable hours into a numbered, immutable invoice - issued from `efesop.com/admin` (live HTML preview, confirm, print-to-PDF, mark sent/paid) and from the toolbelt `invoice` CLI (real PDF file) - both persisting to the same `billing` schema, with a historical-invoices list. Retires the Notion-sourced invoice path.

**Architecture:** Extend the private `billing` schema (george-os Supabase) with `invoices`, `invoice_line_items`, `invoice_counters`, exposed through `public.billing_*` SECURITY DEFINER RPCs (the P0 contract). `billing_issue_invoice` is the one transactional centerpiece: gap-free number from a locked counter, frozen line items snapshotted from the entries, entries stamped `invoice_id`/`invoiced_at`. The branded A4 template (`lib/invoice-template.mjs`) is ported into the web app as `lib/admin/invoice-template.ts`; the web previews it in an `<iframe srcDoc>` and downloads via the browser's print-to-PDF (no serverless Chromium), while the CLI keeps Playwright for an on-disk `.pdf`. Issuer/bank/identity are frozen into each invoice at issue time.

**Tech Stack:** Next.js 16 App Router, `@supabase/supabase-js`, Postgres 17 (george-os), Node toolbelt CLI (Playwright already a dep of `invoice.mjs`), vitest (pure-util tests).

---

## Scope + non-goals

- **In scope (P1):** invoice data model + gap-free numbering + immutability; issue/list/get/void/mark-paid RPCs; typed wrappers; gated `/api/admin/invoice`; `/admin/invoices` list + new-invoice flow (pick unbilled entries -> preview -> issue -> print/PDF -> mark sent/paid); repoint `invoice.mjs` onto `billing`; historical list; `/admin` hub link.
- **Out of scope (later):** Stripe payment links from an invoice (P1.5; greg already has the pattern in `app/api/greg/invoice/route.ts`), the income/outstanding dashboard + charts (P2), Cyprus tax set-aside + VAT ledger (P3), multi-client (the schema is already multi-client; the UI stays Chris-Heinz-first).
- **VAT:** ships **off** (`vat_rate = 0`), but every total carries a `vat_rate`/`vat_cents` column and the template renders a VAT row, so P3 is a config flip, not a migration.

## ADRs (decisions locked here)

1. **Gap-free numbering via a counter row, not a sequence.** `billing.invoice_counters(year, next_seq)`; `billing_issue_invoice` does `SELECT next_seq ... FOR UPDATE` then `UPDATE +1` inside the same transaction as the insert. A Postgres `sequence` gaps on rollback; a locked counter row does not. Number format `EFE-YYYY-NNN` (zero-padded to 3, grows past 999 naturally).
2. **Immutability = freeze on issue.** Line items are snapshotted into `billing.invoice_line_items` (frozen `description`/`hours`/`rate_cents`/`amount_cents`), and `issuer` (from/bank/identity) is frozen into `invoices.issuer jsonb`. A later rate change or secret edit never alters an issued invoice. Entries are stamped `invoice_id` + `invoiced_at`; an entry can be on at most one live invoice (`invoice_id is null` guard).
3. **Void releases, never deletes.** `billing_void_invoice` sets `status='void'` + `voided_at` and clears the entries' `invoice_id`/`invoiced_at` so they can be re-billed. Numbers are never reused (the void keeps its number, the counter never rewinds). No hard delete of issued invoices.
4. **PDF strategy: HTML preview + print-to-PDF on web; Playwright on CLI.** Vercel serverless has no Chromium, and `@sparticuz/chromium` is heavy. The web renders the ported template into `<iframe srcDoc>` and calls `iframe.contentWindow.print()` for "Download PDF" (browser Save-as-PDF, deterministic with `@page { size:A4; margin:0 }` already in the template). The CLI keeps Playwright for a real on-disk file. Same template, same output.
5. **Template is duplicated, not shared.** `lib/admin/invoice-template.ts` is a TS port of toolbelt `lib/invoice-template.mjs`; the two repos can't cleanly import across each other. The template is stable; a shared npm package is out of scope. Keep them byte-equivalent in structure; a comment in each points at the other.
6. **Issuer/bank/identity via env (web) + secrets.json (CLI), frozen at issue.** The web has no `secrets.json` at runtime, so issuer config comes from env (`EFESOP_ISSUER_*`, `EFESOP_BANK_*`); the CLI reads `efesop_bank` + `cyprus_identity` from secrets. Both pass an `issuer` block into `billing_issue_invoice`, which freezes it. These values print on every invoice anyway (not secret); env keeps them out of git.
7. **Selection is by explicit entry ids, not "the whole week".** The issue RPC takes `p_entry_ids uuid[]` (the unbilled, billable rows the user ticked). This lets the UI exclude a row, and is robust to entries added after preview. The CLI passes all unbilled billable ids for the chosen week.

## Data model (additions to schema `billing`)

- `billing.invoice_counters` - `year int pk, next_seq int not null default 1`.
- `billing.invoices` - `id uuid pk, client_id fk, number text unique, status text check in ('issued','sent','paid','void') default 'issued', issue_date date, due_date date, period_from date, period_to date, currency char(3) default 'EUR', subtotal_cents bigint, vat_rate numeric default 0, vat_cents bigint default 0, total_cents bigint, notes text default '', issuer jsonb default '{}', created_at, voided_at`.
- `billing.invoice_line_items` - `id uuid pk, invoice_id fk on delete cascade, time_entry_id uuid fk null, work_date date, description text, hours numeric, rate_cents int, amount_cents bigint, sort int`.
- `billing.time_entries` gains FK `invoice_id -> billing.invoices(id) on delete set null` (P0 left it a bare uuid).

---

## Task 1: Migration 0004 - invoices schema, counter, FK, RLS

**Files:**
- Create: `db/billing/0004_invoices.sql`
- Apply: Supabase MCP `apply_migration`, project `ygyeyprogpawmjzjyrew`, name `billing_0004_invoices` (after George approves).

- [ ] **Step 1: Write `db/billing/0004_invoices.sql`**

```sql
create table billing.invoice_counters (
  year int primary key,
  next_seq int not null default 1
);

create table billing.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references billing.clients(id),
  number text not null unique,
  status text not null default 'issued' check (status in ('issued','sent','paid','void')),
  issue_date date not null,
  due_date date not null,
  period_from date,
  period_to date,
  currency char(3) not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  subtotal_cents bigint not null,
  vat_rate numeric not null default 0,
  vat_cents bigint not null default 0,
  total_cents bigint not null,
  notes text not null default '',
  issuer jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  voided_at timestamptz
);
create index invoices_client_idx on billing.invoices (client_id, issue_date desc);

create table billing.invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references billing.invoices(id) on delete cascade,
  time_entry_id uuid references billing.time_entries(id) on delete set null,
  work_date date not null,
  description text not null,
  hours numeric not null,
  rate_cents int not null,
  amount_cents bigint not null,
  sort int not null default 0
);
create index invoice_line_items_invoice_idx on billing.invoice_line_items (invoice_id, sort);

alter table billing.time_entries
  add constraint time_entries_invoice_fk
  foreign key (invoice_id) references billing.invoices(id) on delete set null;

alter table billing.invoices          enable row level security;
alter table billing.invoice_line_items enable row level security;
alter table billing.invoice_counters   enable row level security;
create policy block_public on billing.invoices           for all to anon, authenticated using (false) with check (false);
create policy block_public on billing.invoice_line_items  for all to anon, authenticated using (false) with check (false);
create policy block_public on billing.invoice_counters    for all to anon, authenticated using (false) with check (false);
```

- [ ] **Step 2: Apply (after approval)** via `apply_migration` name `billing_0004_invoices`.
- [ ] **Step 3: Verify** with `execute_sql`:
  Run: `select to_regclass('billing.invoices'), to_regclass('billing.invoice_line_items'), to_regclass('billing.invoice_counters');`
  Expected: three non-null regclass values.
  Run: `select conname from pg_constraint where conname='time_entries_invoice_fk';` -> one row.

---

## Task 2: Migration 0005 - issue / list / get / void / mark RPCs

**Files:**
- Create: `db/billing/0005_invoice_rpcs.sql`
- Apply: `apply_migration` name `billing_0005_invoice_rpcs` (after approval).

- [ ] **Step 1: Write `db/billing/0005_invoice_rpcs.sql`**

```sql
-- Issue an invoice from a set of unbilled, billable entries. Gap-free number,
-- frozen line items, entries stamped. All-or-nothing in one transaction.
create or replace function public.billing_issue_invoice(
  p_client_id uuid, p_entry_ids uuid[], p_issue_date date, p_due_date date,
  p_vat_rate numeric, p_notes text, p_issuer jsonb
) returns billing.invoices
language plpgsql security definer set search_path = billing, public as $$
declare
  v_year int := extract(year from p_issue_date)::int;
  v_seq int; v_number text; v_inv billing.invoices;
  v_subtotal bigint; v_vat bigint; v_from date; v_to date; v_count int;
begin
  select count(*) into v_count from billing.time_entries
   where id = any(p_entry_ids) and client_id = p_client_id and billable and invoice_id is null;
  if v_count = 0 then raise exception 'no unbilled billable entries to invoice'; end if;

  insert into billing.invoice_counters (year, next_seq) values (v_year, 1)
    on conflict (year) do nothing;
  select next_seq into v_seq from billing.invoice_counters where year = v_year for update;
  update billing.invoice_counters set next_seq = next_seq + 1 where year = v_year;
  v_number := 'EFE-' || v_year || '-' || lpad(v_seq::text, 3, '0');

  select coalesce(sum(round(duration_minutes/60.0 * rate_cents_applied)),0)::bigint,
         min(work_date), max(work_date)
    into v_subtotal, v_from, v_to
  from billing.time_entries
  where id = any(p_entry_ids) and client_id = p_client_id and billable and invoice_id is null;

  v_vat := round(v_subtotal * coalesce(p_vat_rate,0))::bigint;

  insert into billing.invoices
    (client_id, number, status, issue_date, due_date, period_from, period_to,
     subtotal_cents, vat_rate, vat_cents, total_cents, notes, issuer)
  values
    (p_client_id, v_number, 'issued', p_issue_date, p_due_date, v_from, v_to,
     v_subtotal, coalesce(p_vat_rate,0), v_vat, v_subtotal + v_vat,
     coalesce(p_notes,''), coalesce(p_issuer,'{}'::jsonb))
  returning * into v_inv;

  insert into billing.invoice_line_items
    (invoice_id, time_entry_id, work_date, description, hours, rate_cents, amount_cents, sort)
  select v_inv.id, te.id, te.work_date,
         coalesce(nullif(te.work_done,''), nullif(te.comment,''), '(work)'),
         round(te.duration_minutes/60.0, 2), te.rate_cents_applied,
         round(te.duration_minutes/60.0 * te.rate_cents_applied)::bigint,
         (row_number() over (order by te.work_date, te.created_at))::int
  from billing.time_entries te
  where te.id = any(p_entry_ids) and te.client_id = p_client_id and te.billable and te.invoice_id is null;

  update billing.time_entries
     set invoice_id = v_inv.id, invoiced_at = now()
   where id = any(p_entry_ids) and client_id = p_client_id and billable and invoice_id is null;

  return v_inv;
end; $$;

create or replace function public.billing_list_invoices(p_client_id uuid)
returns table (id uuid, number text, status text, issue_date date, due_date date,
               period_from date, period_to date, subtotal_cents bigint, vat_cents bigint,
               total_cents bigint, currency char(3))
language sql security definer set search_path = billing, public as $$
  select id, number, status, issue_date, due_date, period_from, period_to,
         subtotal_cents, vat_cents, total_cents, currency
  from billing.invoices where client_id = p_client_id
  order by issue_date desc, number desc;
$$;

create or replace function public.billing_get_invoice(p_invoice_id uuid)
returns jsonb language sql security definer set search_path = billing, public as $$
  select jsonb_build_object(
    'invoice', to_jsonb(i),
    'lines', coalesce((select jsonb_agg(to_jsonb(li) order by li.sort)
                       from billing.invoice_line_items li where li.invoice_id = i.id), '[]'::jsonb))
  from billing.invoices i where i.id = p_invoice_id;
$$;

create or replace function public.billing_void_invoice(p_invoice_id uuid)
returns billing.invoices language plpgsql security definer set search_path = billing, public as $$
declare v billing.invoices;
begin
  update billing.time_entries set invoice_id = null, invoiced_at = null where invoice_id = p_invoice_id;
  update billing.invoices set status = 'void', voided_at = now() where id = p_invoice_id returning * into v;
  return v;
end; $$;

create or replace function public.billing_set_invoice_status(p_invoice_id uuid, p_status text)
returns billing.invoices language sql security definer set search_path = billing, public as $$
  update billing.invoices set status = p_status
   where id = p_invoice_id and p_status in ('sent','paid') and status <> 'void'
  returning *;
$$;
```

- [ ] **Step 2: Apply (after approval)** via `apply_migration` name `billing_0005_invoice_rpcs`.
- [ ] **Step 3: Verify round-trip** with `execute_sql` against the 12 already-seeded entries (do NOT leave a test invoice - this issues a real number; verify then void):

```sql
-- issue from this week's unbilled billable entries, then read it back, then void
with cid as (select id from billing.clients where name='Chris Heinz'),
ids as (select array_agg(id) a from billing.time_entries
        where client_id=(select id from cid) and billable and invoice_id is null),
issued as (select public.billing_issue_invoice(
  (select id from cid), (select a from ids), current_date, current_date + 7, 0, 'smoke', '{}'::jsonb) inv)
select (issued.inv).number, (issued.inv).subtotal_cents, (issued.inv).total_cents,
       (select count(*) from billing.invoice_line_items where invoice_id=(issued.inv).id) as lines
from issued;
```
Expected: `number EFE-2026-001`, `subtotal_cents 306000`, `total_cents 306000`, `lines 11`.
Then void + confirm entries released (so the seeded data is reusable by the real UI later):
```sql
select public.billing_void_invoice(id) from billing.invoices where number='EFE-2026-001';
select count(*) filter (where invoice_id is null) free, count(*) total from billing.time_entries where billable;
```
Expected: `free = total` (all released). **Then** reset the counter so the first real invoice is `001`:
```sql
delete from billing.invoices where number='EFE-2026-001';
update billing.invoice_counters set next_seq=1 where year=2026;
```
(Voided rows normally stay for the audit trail; here we delete the smoke one and rewind the counter because no real invoice exists yet.)

---

## Task 3: Invoice template port + model builder (`lib/admin/invoice-template.ts`)

**Files:**
- Create: `lib/admin/invoice-template.ts` (TS port of toolbelt `lib/invoice-template.mjs`, verbatim structure)
- Create: `lib/admin/invoice-model.ts` (`buildInvoiceModel`) + `lib/admin/invoice-model.test.ts`

- [ ] **Step 1:** Port `renderInvoiceHtml(inv)` and `eur(n)` into `lib/admin/invoice-template.ts`. Copy `C:\Users\georg\Projects\toolbelt\lib\invoice-template.mjs` byte-for-byte, add `export function renderInvoiceHtml(inv: InvoiceModel): string` typing and an `InvoiceModel` interface matching its `@param` block (`from`,`client`,`meta`,`items`,`totals`,`bank`). Add a top comment: `// PORT of toolbelt/lib/invoice-template.mjs - keep in sync (see ADR 5).`

- [ ] **Step 2: Write failing tests** `lib/admin/invoice-model.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { buildInvoiceModel } from './invoice-model';

const base = {
  invoice: {
    number: 'EFE-2026-001', issue_date: '2026-06-08', due_date: '2026-06-15',
    period_from: '2026-06-02', period_to: '2026-06-06',
    subtotal_cents: 306000, vat_rate: 0, vat_cents: 0, total_cents: 306000,
    issuer: { name: 'George Efesopoulos', role: 'Product Designer & Developer', location: 'Cyprus',
              identity: { tic_number: 'X' }, bank: { account_name: 'G', iban: 'IE', bic: 'B', bank: 'Wise' } },
  },
  lines: [{ work_date: '2026-06-02', description: 'Prep', hours: 1, rate_cents: 8500, amount_cents: 8500 }],
  client: { name: 'Chris Heinz', legal_name: 'EPC / 250k Club' },
};

describe('buildInvoiceModel', () => {
  it('maps cents to euro numbers and carries the number', () => {
    const m = buildInvoiceModel(base.invoice, base.lines, base.client);
    expect(m.meta.number).toBe('EFE-2026-001');
    expect(m.totals.subtotal).toBe(3060);
    expect(m.totals.total).toBe(3060);
    expect(m.items[0].amount).toBe(85);
    expect(m.items[0].rate).toBe(85);
  });
  it('labels VAT as not-registered when rate is 0', () => {
    const m = buildInvoiceModel(base.invoice, base.lines, base.client);
    expect(m.totals.vatLabel).toMatch(/not registered/i);
  });
});
```

- [ ] **Step 3: Run, expect fail.** `npm test` -> FAIL (module not found).
- [ ] **Step 4: Implement `lib/admin/invoice-model.ts`** - pure: convert the DB invoice (cents, ISO dates) + line rows + client into the `InvoiceModel` the template wants (euros as numbers, long dates, `vatLabel`, period label). Read `issuer` (frozen jsonb) for `from`/`bank`. VAT label `vat_rate>0 ? 'VAT (19%)' : 'VAT (not registered)'`. No I/O.
- [ ] **Step 5: Run, expect pass.** `npm test` -> PASS.
- [ ] **Step 6: Commit.**

---

## Task 4: Issuer config (`lib/admin/issuer.ts`) + env

**Files:**
- Create: `lib/admin/issuer.ts` (server-only; reads env, returns the `issuer` block to freeze)
- Modify: `.env.example`, `.env.local`, Vercel env

- [ ] **Step 1:** `lib/admin/issuer.ts` - `import 'server-only'`; `export function issuerBlock(): IssuerBlock` reading `EFESOP_ISSUER_NAME` (default 'George Efesopoulos'), `EFESOP_ISSUER_ROLE`, `EFESOP_ISSUER_LOCATION` (default 'Cyprus'), `EFESOP_TIC_NUMBER`, `EFESOP_SOCIAL_INSURANCE_NUMBER`, `EFESOP_BANK_ACCOUNT_NAME`, `EFESOP_BANK_IBAN`, `EFESOP_BANK_BIC`, `EFESOP_BANK_NAME`. Shape matches `invoice-template.ts` `from`+`bank` (`{ name, role, location, identity:{tic_number,social_insurance_number,tax_residency}, bank:{account_name,iban,bic,bank} }`).
- [ ] **Step 2:** Add the keys to `.env.example` (blank), `.env.local` (real values, from `secrets.json` `efesop_bank` + `cyprus_identity` - do not echo), and Vercel (production+preview) via the same `vercel env add NAME production` CLI flow used in P0. **IBAN/TIC print on every invoice; not secret, but keep out of git.**
- [ ] **Step 3: Commit** (no values).

---

## Task 5: Typed wrappers (`lib/admin/invoices.ts`)

**Files:**
- Create: `lib/admin/invoices.ts` (`import 'server-only'`; uses `getBillingSupabase()` from P0)

- [ ] **Step 1:** Types + wrappers, each throwing on `error` (mirror `lib/admin/billing.ts`):
  - `InvoiceListRow`, `InvoiceDetail` (`{ invoice, lines }`), `IssueInvoiceArgs`.
  - `issueInvoice({ clientId, entryIds, issueDate, dueDate, vatRate=0, notes='', issuer })` -> `.rpc('billing_issue_invoice', { p_client_id, p_entry_ids, p_issue_date, p_due_date, p_vat_rate, p_notes, p_issuer })`.
  - `listInvoices(clientId)` -> `billing_list_invoices`.
  - `getInvoice(invoiceId)` -> `billing_get_invoice` (returns the jsonb).
  - `voidInvoice(invoiceId)` / `setInvoiceStatus(invoiceId, status)`.
- [ ] **Step 2:** `tsc --noEmit` clean. **Param names must match the SQL `p_*` exactly** (P0 lesson). **Commit.**

---

## Task 6: API route `/api/admin/invoice`

**Files:**
- Create: `app/api/admin/invoice/route.ts` (`runtime='nodejs'`)

- [ ] **Step 1:** Every handler re-checks `await isAdmin()` -> 401 first (the page gate does not protect the route - P0's mandatory pattern, see `app/api/admin/time/route.ts`).
  - `POST` `{ entryIds, issueDate, dueDate, vatRate, notes }` -> `getClientId('Chris Heinz')`, `issueInvoice({..., issuer: issuerBlock() })`, return the invoice. Validate `entryIds` is a non-empty string array; default `vatRate` 0.
  - `GET` `?id=` -> `getInvoice(id)`; no `id` -> `listInvoices(clientId)`.
  - `PATCH` `{ id, action }` where action in `void|sent|paid` -> `voidInvoice` / `setInvoiceStatus`.
- [ ] **Step 2: Verify** the auth recheck: `curl -XPOST .../api/admin/invoice -d '{}'` -> 401 (logged out). **Commit.**

---

## Task 7: `/admin/invoices` list + new-invoice flow

**Files:**
- Create: `app/admin/invoices/page.tsx` (gated server: `listInvoices` table + "New invoice" link)
- Create: `app/admin/invoices/new/page.tsx` (gated server: loads unbilled billable entries via `listTimeEntries(cid, from, to, true)` for a default range)
- Create: `components/admin/NewInvoice.tsx` (client: pick entries -> preview -> issue)
- Create: `components/admin/InvoicePreview.tsx` (client: `<iframe srcDoc={html}>` + "Download PDF" -> `iframe.contentWindow?.print()`)

- [ ] **Step 1:** `app/admin/invoices/page.tsx` - gate with `isAdmin()`/`<LoginForm/>` (clone `app/admin/time/page.tsx` head). Table of `listInvoices`: number, issue date, period, total (`eur`), status pill, link to `/admin/invoices/[id]` (a simple detail page can be deferred - the list + new flow is the P1 core; a row link may open the preview via `getInvoice`). Top-right "New invoice" -> `/admin/invoices/new`.
- [ ] **Step 2:** `components/admin/NewInvoice.tsx` (client) - receives the unbilled entries as a prop. Checkbox list (default all checked), `issue_date` (default today via `defaultWorkDate()`), `due_date` (default +7), optional notes. A running total of the checked rows. Two buttons:
  - **Preview** - POST the checked `entryIds` to a render endpoint OR build the model client-side from the props + `issuerBlock` passed down, then render via `renderInvoiceHtml` into `<InvoicePreview/>`. (Pre-issue preview uses a *draft* number like `EFE-2026-(next)`; the real number is assigned on issue.)
  - **Issue invoice** - POST to `/api/admin/invoice`; on success route to the issued invoice (preview now reflects the frozen number) and show "Download PDF" + "Mark sent".
- [ ] **Step 3:** `components/admin/InvoicePreview.tsx` - `<iframe className="h-[80vh] w-full rounded-xl border" srcDoc={html} title="Invoice preview" />` + a "Download PDF" button calling `iframeRef.current?.contentWindow?.print()`. The template's `@page{size:A4;margin:0}` makes the print deterministic.
- [ ] **Step 4: Manual verify (live data).** `/admin/invoices/new` shows the 11 seeded billable rows totalling EUR 3,060; Preview renders the branded A4; Issue creates `EFE-2026-001`, the entries drop off the unbilled list, and the invoice appears in `/admin/invoices`. Print-to-PDF produces a clean one-pager.
- [ ] **Step 5: Commit.**

---

## Task 8: Repoint `invoice.mjs` onto `billing` + `/admin` hub link + cutover

**Files:**
- Modify: `C:\Users\georg\Projects\toolbelt\commands\invoice.mjs`
- Modify: `app/admin/page.tsx` (add an "Invoices" hub card)

- [ ] **Step 1:** In `invoice.mjs`, replace the Notion source (`queryAll`/`projectRow`/`BILLING_DS`) with the `billing` RPC transport already used by `time.mjs`: resolve Chris Heinz via `billing_list_clients`, fetch rows via `billing_list_time_entries` with `p_unbilled_only=true` for the `--week` range. Map RPC rows (`hours`,`amount_cents`,`work_done`,`rate_cents_applied`) into the existing `items` shape. Keep `renderInvoiceHtml` + Playwright + the bank/identity-from-`secrets.json` blocks unchanged.
- [ ] **Step 2:** Add `invoice --issue` - when passed, after rendering, call `billing_issue_invoice` (entry ids from the same query, `issuer` from `efesop_bank`+`cyprus_identity`) so the CLI persists + numbers like the web, and name the PDF `efesop-invoice-<number>.pdf`. Without `--issue` it stays a dry-run preview PDF (no persistence).
- [ ] **Step 3:** `app/admin/page.tsx` - add a second `TOOLS` entry `{ href:'/admin/invoices', title:'Invoices', description:'Issue and track invoices from tracked hours.', icon: FileText }`.
- [ ] **Step 4: Verify shared truth.** Issue `EFE-2026-001` from the web; run `invoice --week=2026-W23` (CLI) -> it now reports **0 unbilled** for that week (entries already invoiced), proving one source of truth. `time week` still totals correctly.
- [ ] **Step 5:** Mark the Notion "Time & Billing" + invoice path archived (manual, George). **Commit** (ge-portfolio + toolbelt, separate commits).

---

## Self-review

- **Spec coverage:** invoice generator (T2/T3/T7), live preview (T7 `InvoicePreview`), confirm + download (T7), send/mark-paid (T6 PATCH + T7), historical invoices list (T7 list), repoint onto Supabase (T8), one source of truth (T8 verify). Income charts + ticket-detect = P2; tax/VAT accrual = P3 (the `vat_rate`/`vat_cents` columns + template VAT row are the seam).
- **Type consistency:** `*_cents` integers end-to-end; `entryIds`/`p_entry_ids uuid[]`, `vat_rate`/`p_vat_rate`, `issuer`/`p_issuer jsonb` named identically across SQL <-> `invoices.ts` <-> route. `InvoiceModel` shape matches the ported template's `@param` block exactly.
- **Immutability holds:** issue freezes line items + issuer + number; rate changes (P0 `billing_set_rate`) and secret edits never touch an issued invoice; void releases entries without reusing numbers.
- **No placeholders:** all migration SQL and the issue/list/get/void/mark RPCs are concrete; pure-util task has real tests; UI tasks name exact files + the P0/greg components to clone (`QuickAddForm`, `RateCard`, `InvoiceTool`, `app/admin/time/page.tsx`) and the print-to-PDF mechanism.
- **Gap risk checked:** `EFE-2026-001` is verified end-to-end against the live seeded data in Task 2 (then voided + counter rewound), so the first real web invoice is genuinely `001`.

## Deferred (separate plans)

- **P1.5 Pay link:** an "Add Stripe payment link" button on an issued invoice, cloning `app/api/greg/invoice/route.ts` (one shared Product, a Price per invoice, WhatsApp share). Optional, since clients pay by bank transfer today.
- **P2 Intelligence:** ticket auto-detect from `cc.tickets`; the dashboard (KPI strip + income/outstanding/rate charts, Recharts).
- **P3 Tax/VAT:** flip `vat_rate` on; Cyprus set-aside accrual; `tax_vat_ledger`; post `paid` invoices to `cc.ledger_entries` (idempotent on invoice number).

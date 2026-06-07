-- Fresh-create the billing schema. Safe to re-run: drops first (only seed data
-- lives here until the first real time entry is logged).
drop schema if exists billing cascade;
create schema billing;

-- Immutable ISO year-week, e.g. '2026-W24'. Reproduces
-- to_char(d, 'IYYY"-W"IW'), but to_char(date, text) is only STABLE
-- (locale-dependent), which a STORED generated column rejects. extract() on a
-- date IS immutable, so we build the string from extract() + lpad instead.
create function billing.iso_week(d date) returns text
language sql immutable as $$
  select lpad(extract(isoyear from d)::int::text, 4, '0')
      || '-W'
      || lpad(extract(week    from d)::int::text, 2, '0');
$$;

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
  billing_week text generated always as (billing.iso_week(work_date)) stored,
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

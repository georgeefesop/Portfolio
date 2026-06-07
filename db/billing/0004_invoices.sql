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

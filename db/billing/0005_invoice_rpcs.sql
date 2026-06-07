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
returns billing.invoices language plpgsql security definer set search_path = billing, public as $$
declare v billing.invoices;
begin
  if p_status not in ('sent','paid') then
    raise exception 'invalid status: %', p_status;
  end if;
  update billing.invoices set status = p_status
   where id = p_invoice_id and status <> 'void'
  returning * into v;
  if v.id is null then
    raise exception 'invoice not found or is void';
  end if;
  return v;
end; $$;

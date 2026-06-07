-- Editable time table support (TKT-435).
--  1. Widen billing_list_time_entries to also return started_at / ended_at /
--     break_minutes / duration_minutes, so the table can show AND edit them.
--  2. billing_delete_time_entry, refusing to delete an invoiced (frozen) row.
--  3. An invoiced-row guard on billing_upsert_time_entry, so an entry already
--     on an issued invoice can never be edited (the P1 immutability rule).

-- 1. Widen the list RPC. Return type changes -> drop + recreate.
drop function if exists public.billing_list_time_entries(uuid, date, date, boolean);
create function public.billing_list_time_entries(
  p_client_id uuid, p_from date, p_to date, p_unbilled_only boolean default false
) returns table (
  id uuid, work_date date, started_at timestamptz, ended_at timestamptz,
  break_minutes int, duration_minutes int, hours numeric, billable boolean,
  rate_cents_applied int, amount_cents int, work_done text, comment text,
  billing_week text, invoice_id uuid
) language sql security definer set search_path = billing, public as $$
  select id, work_date, started_at, ended_at, break_minutes, duration_minutes,
    round(duration_minutes/60.0, 2) as hours, billable, rate_cents_applied,
    case when billable then round(duration_minutes/60.0 * rate_cents_applied)::int else 0 end as amount_cents,
    work_done, comment, billing_week, invoice_id
  from billing.time_entries
  where client_id = p_client_id and work_date >= p_from and work_date <= p_to
    and (not p_unbilled_only or invoice_id is null)
  order by work_date desc, created_at desc;
$$;

-- 2. Delete a time entry. An invoiced entry is frozen: refuse it.
create or replace function public.billing_delete_time_entry(p_id uuid)
returns void language plpgsql security definer set search_path = billing, public as $$
declare v_invoice uuid;
begin
  select invoice_id into v_invoice from billing.time_entries where id = p_id;
  if not found then
    raise exception 'time entry % not found', p_id;
  end if;
  if v_invoice is not null then
    raise exception 'time entry % is on invoice % and cannot be deleted', p_id, v_invoice;
  end if;
  delete from billing.time_entries where id = p_id;
end; $$;

-- 3. Re-create the upsert with an immutability guard: an entry already on an
--    invoice cannot be updated. The insert path is unaffected (p_id is new).
create or replace function public.billing_upsert_time_entry(
  p_id uuid, p_client_id uuid, p_work_date date,
  p_started_at timestamptz, p_ended_at timestamptz,
  p_break_minutes int, p_duration_minutes int,
  p_work_done text, p_comment text, p_billable boolean,
  p_source text, p_ticket_refs jsonb
) returns billing.time_entries
language plpgsql security definer set search_path = billing, public as $$
declare v_rate int; v_row billing.time_entries; v_invoice uuid;
begin
  if p_id is not null then
    select invoice_id into v_invoice from billing.time_entries where id = p_id;
    if v_invoice is not null then
      raise exception 'time entry % is on invoice % and cannot be edited', p_id, v_invoice;
    end if;
  end if;
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

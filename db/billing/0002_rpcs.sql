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

create or replace function public.billing_list_clients()
returns table (id uuid, name text, default_currency char(3))
language sql security definer set search_path = billing, public as $func$
  select id, name, default_currency from billing.clients order by name;
$func$;

-- Set a new hourly rate for a client (SCD-2): close the currently-open rate the
-- day before the new one takes effect, replace any rate that already starts on
-- that exact date, then insert the new open rate. Past time entries are
-- unaffected (they snapshot rate_cents_applied at log time).
create or replace function public.billing_set_rate(
  p_client_id uuid, p_hourly_rate_cents int, p_effective_from date, p_currency char(3) default 'EUR'
) returns billing.rate_history
language plpgsql security definer set search_path = billing, public as $$
declare v_row billing.rate_history;
begin
  if p_hourly_rate_cents is null or p_hourly_rate_cents <= 0 then
    raise exception 'rate must be > 0';
  end if;
  update billing.rate_history
     set effective_to = p_effective_from - 1
   where client_id = p_client_id
     and effective_to is null
     and effective_from < p_effective_from;
  delete from billing.rate_history
   where client_id = p_client_id and effective_from = p_effective_from;
  insert into billing.rate_history (client_id, hourly_rate_cents, currency, effective_from)
  values (p_client_id, p_hourly_rate_cents, coalesce(p_currency, 'EUR'), p_effective_from)
  returning * into v_row;
  return v_row;
end; $$;

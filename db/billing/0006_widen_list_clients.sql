-- Widen billing_list_clients to return the columns the ClientRow type already
-- declares (legal_name, country, payment_terms_days), so the invoice bill-to
-- shows real client data instead of a hardcoded fallback. Changing the return
-- type of a returns-table function requires drop + create.
drop function if exists public.billing_list_clients();
create function public.billing_list_clients()
returns table (id uuid, name text, legal_name text, country char(2),
               default_currency char(3), payment_terms_days int)
language sql security definer set search_path = billing, public as $func$
  select id, name, legal_name, country, default_currency, payment_terms_days
  from billing.clients order by name;
$func$;

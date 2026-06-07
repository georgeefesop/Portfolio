/**
 * Typed wrappers over the public `billing_*` SECURITY DEFINER RPCs on the
 * george-os Supabase project. The `billing` schema is private (PostgREST
 * cannot see it); every call goes through a `public.billing_*` function, so
 * this is the single contract the web app and the `time` CLI share.
 *
 * Server-only: uses the service-role client from `./supabase`.
 */

import 'server-only';
import { getBillingSupabase } from './supabase';

// --- Row shapes (match the RPC return columns) ---

/** One row from `billing_list_time_entries`. */
export type TimeEntryRow = {
  id: string;
  work_date: string;
  started_at: string | null;
  ended_at: string | null;
  break_minutes: number;
  duration_minutes: number;
  hours: number;
  billable: boolean;
  rate_cents_applied: number | null;
  amount_cents: number;
  work_done: string;
  comment: string;
  billing_week: string;
  invoice_id: string | null;
};

/** The single row returned by `billing_week_summary`. */
export type WeekSummary = {
  entries: number;
  total_hours: number;
  billable_hours: number;
  billable_cents: number;
};

/** One row from `billing_list_clients`. */
export type ClientRow = {
  id: string;
  name: string;
  legal_name: string | null;
  country: string | null;
  default_currency: string;
  payment_terms_days: number;
};

/** Args for `upsertTimeEntry` / `billing_upsert_time_entry`. */
export type UpsertTimeEntryArgs = {
  id?: string | null;
  clientId: string;
  workDate: string;
  startedAt?: string | null;
  endedAt?: string | null;
  breakMinutes?: number;
  durationMinutes: number;
  workDone?: string;
  comment?: string;
  billable?: boolean;
  source?: 'manual' | 'cli' | 'notion';
  ticketRefs?: unknown[];
};

/** One row from `billing.rate_history` (the `billing_set_rate` return). */
export type RateRow = {
  id: string;
  client_id: string;
  hourly_rate_cents: number;
  currency: string;
  effective_from: string;
  effective_to: string | null;
};

// --- RPC wrappers (each throws on error) ---

function client() {
  const supabase = getBillingSupabase();
  if (!supabase) {
    throw new Error(
      'Billing Supabase not configured (set GEORGE_OS_SUPABASE_URL and GEORGE_OS_SUPABASE_SERVICE_KEY).',
    );
  }
  return supabase;
}

/** Current hourly rate (cents) for a client on a given date, or null. */
export async function resolveRate(clientId: string, date: string): Promise<number | null> {
  const { data, error } = await client().rpc('billing_resolve_rate', {
    p_client_id: clientId,
    p_date: date,
  });
  if (error) throw new Error(error.message);
  return (data as number | null) ?? null;
}

/** Set a new hourly rate (cents) effective from a date; closes the prior open rate. */
export async function setRate(
  clientId: string,
  hourlyRateCents: number,
  effectiveFrom: string,
  currency = 'EUR',
): Promise<RateRow> {
  const { data, error } = await client().rpc('billing_set_rate', {
    p_client_id: clientId,
    p_hourly_rate_cents: hourlyRateCents,
    p_effective_from: effectiveFrom,
    p_currency: currency,
  });
  if (error) throw new Error(error.message);
  return data as RateRow;
}

/** Insert or update a time entry; returns the persisted row. */
export async function upsertTimeEntry(args: UpsertTimeEntryArgs): Promise<TimeEntryRow> {
  const { data, error } = await client().rpc('billing_upsert_time_entry', {
    p_id: args.id ?? null,
    p_client_id: args.clientId,
    p_work_date: args.workDate,
    p_started_at: args.startedAt ?? null,
    p_ended_at: args.endedAt ?? null,
    p_break_minutes: args.breakMinutes ?? 0,
    p_duration_minutes: args.durationMinutes,
    p_work_done: args.workDone ?? '',
    p_comment: args.comment ?? '',
    p_billable: args.billable ?? true,
    p_source: args.source ?? 'manual',
    p_ticket_refs: args.ticketRefs ?? [],
  });
  if (error) throw new Error(error.message);
  return data as TimeEntryRow;
}

/** Delete a time entry by id. Throws if it is on an invoice (frozen). */
export async function deleteTimeEntry(id: string): Promise<void> {
  const { error } = await client().rpc('billing_delete_time_entry', { p_id: id });
  if (error) throw new Error(error.message);
}

/** Time entries for a client across a date range (optionally only unbilled). */
export async function listTimeEntries(
  clientId: string,
  from: string,
  to: string,
  unbilledOnly = false,
): Promise<TimeEntryRow[]> {
  const { data, error } = await client().rpc('billing_list_time_entries', {
    p_client_id: clientId,
    p_from: from,
    p_to: to,
    p_unbilled_only: unbilledOnly,
  });
  if (error) throw new Error(error.message);
  return (data as TimeEntryRow[]) ?? [];
}

/** Totals for one billing week (e.g. "2026-W24"). */
export async function weekSummary(clientId: string, billingWeek: string): Promise<WeekSummary> {
  const { data, error } = await client().rpc('billing_week_summary', {
    p_client_id: clientId,
    p_billing_week: billingWeek,
  });
  if (error) throw new Error(error.message);
  const rows = (data as WeekSummary[]) ?? [];
  return rows[0] ?? { entries: 0, total_hours: 0, billable_hours: 0, billable_cents: 0 };
}

/** All billing clients. */
export async function listClients(): Promise<ClientRow[]> {
  const { data, error } = await client().rpc('billing_list_clients');
  if (error) throw new Error(error.message);
  return (data as ClientRow[]) ?? [];
}

const clientIdCache = new Map<string, string>();

/** Resolve a client's id by name (cached). Throws if no client matches. */
export async function getClientId(name: string): Promise<string> {
  const cached = clientIdCache.get(name);
  if (cached) return cached;
  const clients = await listClients();
  const match = clients.find((c) => c.name === name);
  if (!match) throw new Error(`No billing client named "${name}".`);
  clientIdCache.set(name, match.id);
  return match.id;
}

// --- Pure helpers (ISO year-week, matching Postgres to_char(d,'IYYY"-W"IW')) ---

/** ISO year + week for a date, equal to Postgres `to_char(d,'IYYY"-W"IW')`. */
function isoYearWeek(date: Date): { year: number; week: number } {
  // Work in UTC at midnight to avoid DST / local-offset drift.
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // ISO weekday: Mon=1..Sun=7. Shift to the Thursday of this week.
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const year = d.getUTCFullYear();
  const yearStart = Date.UTC(year, 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7);
  return { year, week };
}

/** The current ISO billing week, e.g. "2026-W24". */
export function currentBillingWeek(now: Date = new Date()): string {
  const { year, week } = isoYearWeek(now);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

function isoDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

/** Monday..Sunday ISO dates for a billing week like "2026-W24". */
export function weekRange(billingWeek: string): { from: string; to: string } {
  const m = billingWeek.match(/^(\d{4})-W(\d{2})$/);
  if (!m) throw new Error(`Invalid billing week "${billingWeek}" (expected "YYYY-Www").`);
  const year = +m[1];
  const week = +m[2];
  // ISO: the week containing Jan 4 is week 1; its Monday is the anchor.
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - (jan4Day - 1));
  const monday = new Date(week1Monday);
  monday.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return { from: isoDate(monday), to: isoDate(sunday) };
}

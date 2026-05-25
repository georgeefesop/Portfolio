/**
 * Server-only Supabase client for the efesop.com/pay storefront.
 *
 * Writes payment rows to the `efesop_pay_payments` table in the George-OS
 * Supabase project, using the service-role key. Returns null if not
 * configured so callers can degrade gracefully (the webhook ack still
 * returns 200; the payment just is not stored).
 *
 * Env: PAY_SUPABASE_URL, PAY_SUPABASE_SERVICE_KEY. Falls back to the
 * GREG_SUPABASE_* pair when the pay-specific vars are unset, because both
 * services currently live in the same Supabase project (george-os).
 */

import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function getPaySupabase(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.PAY_SUPABASE_URL ?? process.env.GREG_SUPABASE_URL;
  const key =
    process.env.PAY_SUPABASE_SERVICE_KEY ??
    process.env.GREG_SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

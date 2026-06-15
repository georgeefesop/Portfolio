/**
 * Server-only Supabase client for greg.efesop.com payment capture.
 *
 * Writes to the `greg_revamp_payments` table in the shared Supabase
 * project, using the service-role key. Returns null if not configured so
 * callers can degrade gracefully.
 *
 * Env: GREG_SUPABASE_URL, GREG_SUPABASE_SERVICE_KEY
 */

import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function getGregSupabase(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.GREG_SUPABASE_URL;
  const key = process.env.GREG_SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

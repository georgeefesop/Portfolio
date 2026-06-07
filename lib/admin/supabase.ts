import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
let cached: SupabaseClient | null = null;
export function getBillingSupabase(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.GEORGE_OS_SUPABASE_URL;
  const key = process.env.GEORGE_OS_SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

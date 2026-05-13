/**
 * Server-only Supabase client for the agora-crm project.
 *
 * Uses the service_role key, which bypasses RLS. NEVER import this from a
 * client component - it would leak the service_role key to the browser.
 *
 * If you need a browser-safe client (e.g. to read public data), make a
 * separate `supabase-browser.ts` that uses the publishable key.
 */

import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getAgoraSupabase(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_AGORA_URL;
  const serviceRoleKey = process.env.SUPABASE_AGORA_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_AGORA_URL is not set");
  if (!serviceRoleKey) throw new Error("SUPABASE_AGORA_SERVICE_ROLE_KEY is not set");
  cached = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: "public",
    },
  });
  return cached;
}

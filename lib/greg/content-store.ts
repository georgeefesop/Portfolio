/**
 * Editable site content for greg.efesop.com, stored in the Supabase
 * `greg_content` table (one JSON row per key). Every read falls back to the
 * static defaults in data/greg, so the site renders fine before Gregory has
 * saved anything and when Supabase is not configured.
 */

import 'server-only';
import { getGregSupabase } from './supabase';

export type ContentKey = 'gallery' | 'services' | 'testimonials' | 'business';

export async function getContent<T>(key: ContentKey, fallback: T): Promise<T> {
  const supabase = getGregSupabase();
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase
      .from('greg_content')
      .select('data')
      .eq('key', key)
      .maybeSingle();
    if (error || !data) return fallback;
    return (data.data as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function setContent(
  key: ContentKey,
  data: unknown,
): Promise<boolean> {
  const supabase = getGregSupabase();
  if (!supabase) return false;
  const { error } = await supabase
    .from('greg_content')
    .upsert(
      { key, data, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    );
  if (error) {
    console.error('[greg/content-store] setContent error', error.message);
    return false;
  }
  return true;
}

/**
 * Image upload for the admin content editor. Stores the file in the public
 * greg-uploads bucket and returns its public URL. Admin cookie required.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, cookieValid } from '@/lib/greg/admin-auth';
import { getGregSupabase } from '@/lib/greg/supabase';

export const runtime = 'nodejs';

const BUCKET = 'greg-uploads';

export async function POST(request: NextRequest) {
  if (!cookieValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const supabase = getGregSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'storage_unavailable' }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_form' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'no_file' }, { status: 400 });
  }

  const ext =
    (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') ||
    'jpg';
  const path = `content/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });
    if (error) {
      console.error('[greg/upload] error', error.message);
      return NextResponse.json({ error: 'upload_failed' }, { status: 502 });
    }
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: pub.publicUrl });
  } catch (err) {
    console.error(
      '[greg/upload] error',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: 'upload_failed' }, { status: 502 });
  }
}

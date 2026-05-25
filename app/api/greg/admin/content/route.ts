/**
 * Save editable site content from the admin content editor.
 * POST { key, data } -> upserts the greg_content row. Admin cookie required.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, cookieValid } from '@/lib/greg/admin-auth';
import { setContent, type ContentKey } from '@/lib/greg/content-store';

export const runtime = 'nodejs';

const KEYS: ContentKey[] = [
  'gallery',
  'services',
  'testimonials',
  'business',
  'hero',
  'about',
];

export async function POST(request: NextRequest) {
  if (!cookieValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const rec =
    body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

  const key = rec.key;
  if (typeof key !== 'string' || !KEYS.includes(key as ContentKey)) {
    return NextResponse.json({ error: 'invalid_key' }, { status: 400 });
  }
  if (rec.data === undefined) {
    return NextResponse.json({ error: 'missing_data' }, { status: 400 });
  }

  const ok = await setContent(key as ContentKey, rec.data);
  if (!ok) {
    return NextResponse.json(
      { error: 'Could not save. The database may not be set up yet.' },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}

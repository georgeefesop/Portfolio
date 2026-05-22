/**
 * Update a render order's status from the admin orders dashboard.
 * PATCH { id, status } -> sets greg_render_orders.status. Admin cookie required.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, cookieValid } from '@/lib/greg/admin-auth';
import { getGregSupabase } from '@/lib/greg/supabase';

export const runtime = 'nodejs';

const STATUSES = ['paid', 'fulfilled'];

export async function PATCH(request: NextRequest) {
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
  const id = typeof rec.id === 'string' ? rec.id : '';
  const status = typeof rec.status === 'string' ? rec.status : '';

  if (!id || !STATUSES.includes(status)) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const supabase = getGregSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }

  const { error } = await supabase
    .from('greg_render_orders')
    .update({ status })
    .eq('id', id);
  if (error) {
    console.error('[greg/orders] update error', error.message);
    return NextResponse.json({ error: 'update_failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

/**
 * Create / update a time entry for the efesop admin time tracker.
 *
 *   POST { work_date, duration_minutes, break_minutes, work_done, comment, billable }
 *     -> upserts via billing_upsert_time_entry, returns the persisted row.
 *
 * The page that renders the form is already gated, but the page gate does
 * NOT protect this route (a direct POST bypasses it), so we re-check
 * `isAdmin()` here and return 401 before touching the database.
 */

import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin/auth';
import { getClientId, upsertTimeEntry } from '@/lib/admin/billing';

export const runtime = 'nodejs';

const CLIENT_NAME = 'Chris Heinz';

export async function POST(request: Request) {
  if (!(await isAdmin())) {
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

  const workDate = typeof rec.work_date === 'string' ? rec.work_date : '';
  const durationMinutes =
    typeof rec.duration_minutes === 'number' ? rec.duration_minutes : NaN;
  if (!workDate || !Number.isFinite(durationMinutes)) {
    return NextResponse.json({ error: 'invalid_entry' }, { status: 400 });
  }

  const breakMinutes =
    typeof rec.break_minutes === 'number' ? rec.break_minutes : 0;
  const workDone = typeof rec.work_done === 'string' ? rec.work_done : '';
  const comment = typeof rec.comment === 'string' ? rec.comment : '';
  const billable = typeof rec.billable === 'boolean' ? rec.billable : true;

  try {
    const clientId = await getClientId(CLIENT_NAME);
    const row = await upsertTimeEntry({
      clientId,
      workDate,
      durationMinutes,
      breakMinutes,
      workDone,
      comment,
      billable,
      source: 'manual',
    });
    return NextResponse.json(row);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'upsert_failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

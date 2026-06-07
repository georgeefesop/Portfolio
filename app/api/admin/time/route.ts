/**
 * Create / update / delete time entries for the efesop admin time tracker.
 *
 *   POST   { work_date, started_at?, ended_at?, break_minutes, duration_minutes,
 *            work_done, comment, billable }
 *            -> insert one entry via billing_upsert_time_entry.
 *   PATCH  { entries: [ { id, work_date, started_at?, ended_at?, break_minutes,
 *            duration_minutes, work_done, comment, billable }, ... ] }
 *            -> save-all: upsert each edited row; returns per-row results.
 *   DELETE { id } -> delete one entry (refused server-side if it is invoiced).
 *
 * The page that renders the form is gated, but the page gate does NOT protect
 * this route (a direct request bypasses it), so every handler re-checks
 * isAdmin() and returns 401 before touching the database.
 */

import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin/auth';
import {
  getClientId,
  upsertTimeEntry,
  deleteTimeEntry,
} from '@/lib/admin/billing';

export const runtime = 'nodejs';

const CLIENT_NAME = 'Chris Heinz';

type EntryInput = {
  id?: string | null;
  work_date: string;
  started_at: string | null;
  ended_at: string | null;
  break_minutes: number;
  duration_minutes: number;
  work_done: string;
  comment: string;
  billable: boolean;
};

// Pull a clean, typed entry out of an untrusted object, or null if invalid.
function readEntry(raw: unknown): EntryInput | null {
  const rec =
    raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const workDate = typeof rec.work_date === 'string' ? rec.work_date : '';
  const durationMinutes =
    typeof rec.duration_minutes === 'number' ? rec.duration_minutes : NaN;
  if (!workDate || !Number.isFinite(durationMinutes) || durationMinutes < 0) {
    return null;
  }
  return {
    id: typeof rec.id === 'string' ? rec.id : null,
    work_date: workDate,
    started_at: typeof rec.started_at === 'string' ? rec.started_at : null,
    ended_at: typeof rec.ended_at === 'string' ? rec.ended_at : null,
    break_minutes:
      typeof rec.break_minutes === 'number' ? Math.max(0, rec.break_minutes) : 0,
    duration_minutes: Math.round(durationMinutes),
    work_done: typeof rec.work_done === 'string' ? rec.work_done : '',
    comment: typeof rec.comment === 'string' ? rec.comment : '',
    billable: typeof rec.billable === 'boolean' ? rec.billable : true,
  };
}

async function save(clientId: string, e: EntryInput) {
  return upsertTimeEntry({
    id: e.id,
    clientId,
    workDate: e.work_date,
    startedAt: e.started_at,
    endedAt: e.ended_at,
    breakMinutes: e.break_minutes,
    durationMinutes: e.duration_minutes,
    workDone: e.work_done,
    comment: e.comment,
    billable: e.billable,
    source: 'manual',
  });
}

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
  const entry = readEntry(body);
  if (!entry) {
    return NextResponse.json({ error: 'invalid_entry' }, { status: 400 });
  }

  try {
    const clientId = await getClientId(CLIENT_NAME);
    const row = await save(clientId, { ...entry, id: null });
    return NextResponse.json(row);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'upsert_failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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
  const list = Array.isArray(rec.entries) ? rec.entries : null;
  if (!list || list.length === 0) {
    return NextResponse.json({ error: 'no_entries' }, { status: 400 });
  }

  const clientId = await getClientId(CLIENT_NAME);
  // Save each row independently so one bad row doesn't sink the batch; the
  // client reports which rows failed.
  const results = await Promise.all(
    list.map(async (raw, i) => {
      const entry = readEntry(raw);
      if (!entry || !entry.id) {
        return { index: i, id: entry?.id ?? null, ok: false, error: 'invalid_row' };
      }
      try {
        await save(clientId, entry);
        return { index: i, id: entry.id, ok: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'save_failed';
        return { index: i, id: entry.id, ok: false, error: message };
      }
    }),
  );

  const failed = results.filter((r) => !r.ok);
  return NextResponse.json(
    { results, saved: results.length - failed.length, failed: failed.length },
    { status: failed.length ? 207 : 200 },
  );
}

export async function DELETE(request: Request) {
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
  const id = typeof rec.id === 'string' ? rec.id : '';
  if (!id) {
    return NextResponse.json({ error: 'missing_id' }, { status: 400 });
  }

  try {
    await deleteTimeEntry(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'delete_failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

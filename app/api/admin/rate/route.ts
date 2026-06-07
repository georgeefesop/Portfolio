/**
 * Set the hourly rate for the efesop admin time tracker.
 *
 *   POST { hourly_rate_eur, effective_from } -> billing_set_rate, returns the row.
 *
 * Gated like every /admin/* route: a direct POST must re-check isAdmin().
 */

import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin/auth';
import { getClientId, setRate } from '@/lib/admin/billing';

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

  const eurAmount =
    typeof rec.hourly_rate_eur === 'number' ? rec.hourly_rate_eur : NaN;
  const effectiveFrom =
    typeof rec.effective_from === 'string' && rec.effective_from
      ? rec.effective_from
      : '';
  if (!Number.isFinite(eurAmount) || eurAmount <= 0 || !effectiveFrom) {
    return NextResponse.json({ error: 'invalid_rate' }, { status: 400 });
  }

  try {
    const clientId = await getClientId(CLIENT_NAME);
    const row = await setRate(clientId, Math.round(eurAmount * 100), effectiveFrom);
    return NextResponse.json(row);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'set_rate_failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

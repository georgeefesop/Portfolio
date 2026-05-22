/**
 * Login / logout for the G.E. Revamp admin. The one cookie gates /admin,
 * every /admin/* tool and /create-invoice.
 *   POST   { username, password }  -> sets the admin auth cookie
 *   DELETE                          -> clears it
 */

import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  authToken,
  credentialsValid,
} from '@/lib/greg/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const rec =
    body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const username = typeof rec.username === 'string' ? rec.username : '';
  const password = typeof rec.password === 'string' ? rec.password : '';

  if (!credentialsValid(username, password)) {
    return NextResponse.json(
      { error: 'Wrong username or password.' },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, authToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}

/**
 * Auth for the G.E. Revamp admin area.
 *
 * One username + password gate covers /admin, every /admin/* tool and
 * /create-invoice. On login an httpOnly cookie holding a hash of the
 * password is set; pages and API routes verify it. The Stripe secret key
 * never leaves the server, so this gate only needs to keep strangers out.
 *
 * Password lives in GREG_ADMIN_PASSWORD (never in code or git).
 */

import 'server-only';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

export const ADMIN_COOKIE = 'greg_admin_auth';
const ADMIN_USER = 'greg';

function password(): string {
  return process.env.GREG_ADMIN_PASSWORD ?? '';
}

/** Opaque cookie value. Cannot be produced without knowing the password. */
export function authToken(): string {
  return createHash('sha256')
    .update(`greg-admin-v1:${password()}`)
    .digest('hex');
}

export function credentialsValid(user: string, pass: string): boolean {
  const pw = password();
  return (
    pw.length > 0 && user.trim().toLowerCase() === ADMIN_USER && pass === pw
  );
}

export function cookieValid(value: string | undefined): boolean {
  return password().length > 0 && !!value && value === authToken();
}

/** Server-component / route guard: is the current request signed in? */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return cookieValid(jar.get(ADMIN_COOKIE)?.value);
}

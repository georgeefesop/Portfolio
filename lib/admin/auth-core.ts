/**
 * Pure auth core for the efesop.com admin area (username + password).
 *
 * No `server-only` and no `next` imports live here, so this module is
 * importable from vitest. The httpOnly cookie holds a sha256 hash bound to
 * BOTH the username and the password; nobody can mint it without knowing
 * both. The thin server wrapper (./auth.ts) adds `isAdmin()` on top.
 *
 * Credentials live in EFESOP_ADMIN_USER (defaults to "george") and
 * EFESOP_ADMIN_PASSWORD (never in code or git; empty = login disabled).
 */

import { createHash } from 'crypto';

export const ADMIN_COOKIE = 'efesop_admin_auth';

function adminUser(): string {
  return process.env.EFESOP_ADMIN_USER?.trim() || 'george';
}

function password(): string {
  return process.env.EFESOP_ADMIN_PASSWORD ?? '';
}

/** Opaque cookie value. Cannot be produced without the username + password. */
export function authToken(): string {
  return createHash('sha256')
    .update(`efesop-admin-v1:${adminUser()}:${password()}`)
    .digest('hex');
}

export function credentialsValid(user: string, pass: string): boolean {
  return password().length > 0 && user === adminUser() && pass === password();
}

export function cookieValid(value: string | undefined): boolean {
  return password().length > 0 && !!value && value === authToken();
}

/**
 * Server-only auth wrapper for the efesop.com admin area.
 *
 * Re-exports the pure helpers from ./auth-core and adds the request guard
 * `isAdmin()`, which reads the cookie jar. Keeping the `server-only` and
 * `next/headers` imports out of auth-core lets that module be unit-tested.
 */

import 'server-only';
import { cookies } from 'next/headers';

export {
  ADMIN_COOKIE,
  authToken,
  credentialsValid,
  cookieValid,
} from './auth-core';

import { ADMIN_COOKIE, cookieValid } from './auth-core';

/** Server-component / route guard: is the current request signed in? */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return cookieValid(jar.get(ADMIN_COOKIE)?.value);
}

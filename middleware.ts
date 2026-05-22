import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Subdomain routing for greg.efesop.com.
 *
 * greg.efesop.com is the contractor site for G.E. Revamp Services Limited.
 * It lives in the same repo / deployment as efesop.com, under app/greg/*.
 *
 * - On the `greg.` subdomain: requests are rewritten into the /greg route
 *   tree, so the visitor sees greg.efesop.com/ but is served app/greg/page.
 * - On the apex domain (efesop.com): the /greg tree is internal-only and
 *   returns 404, so greg's site is reachable only via its subdomain.
 *
 * Local dev: visit greg.localhost:3000 (browsers resolve *.localhost to
 * 127.0.0.1 automatically).
 */

const GREG_HOST_PREFIX = 'greg.';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = (req.headers.get('host') || '').split(':')[0].toLowerCase();
  const isGregHost = host.startsWith(GREG_HOST_PREFIX);

  if (isGregHost) {
    // Already inside the greg tree (e.g. an internal asset path) - pass through.
    if (url.pathname === '/greg' || url.pathname.startsWith('/greg/')) {
      return NextResponse.next();
    }
    const rewritten = url.clone();
    rewritten.pathname = `/greg${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(rewritten);
  }

  // Non-greg host: the /greg tree is not publicly addressable.
  if (url.pathname === '/greg' || url.pathname.startsWith('/greg/')) {
    return new NextResponse('Not found', { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Run on page routes only - skip API, Next internals, the PostHog proxy,
  // and any path with a file extension (static assets in /public).
  matcher: ['/((?!api|_next|ingest|.*\\.[\\w]+$).*)'],
};

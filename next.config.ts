import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return {
      // greg.efesop.com routing (was middleware.ts; TKT-1393). Host-conditioned
      // rewrites cost zero Edge Middleware invocations. Same exclusions as the
      // old matcher: api, _next, ingest, file-extension paths pass through.
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host' as const, value: 'greg\\..*' }],
          destination: '/greg',
        },
        {
          source: '/:path((?!greg(?:/|$)|api|_next|ingest|.*\\.[\\w]+$).*)',
          has: [{ type: 'host' as const, value: 'greg\\..*' }],
          destination: '/greg/:path',
        },
        // On non-greg hosts the /greg tree is not publicly addressable.
        {
          source: '/greg/:path*',
          missing: [{ type: 'host' as const, value: 'greg\\..*' }],
          destination: '/greg-blocked-404',
        },
        {
          source: '/greg',
          missing: [{ type: 'host' as const, value: 'greg\\..*' }],
          destination: '/greg-blocked-404',
        },
      ],
      afterFiles: [
        { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
        { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
        { source: '/ingest/decide', destination: 'https://eu.i.posthog.com/decide' },
        // Akti - portfolio sub-app proxied from akti-seven.vercel.app
        { source: '/akti', destination: 'https://akti-seven.vercel.app/akti' },
        { source: '/akti/:path*', destination: 'https://akti-seven.vercel.app/akti/:path*' },
      ],
      fallback: [],
    };
  },
  images: {
    qualities: [25, 50, 75, 90, 100],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 492],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'mir-s3-cdn-cf.behance.net',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'pps.services.adobe.com',
      },
      {
        protocol: 'https',
        hostname: 'www.iog.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'ygyeyprogpawmjzjyrew.supabase.co',
      },
    ],
  },
};

export default nextConfig;

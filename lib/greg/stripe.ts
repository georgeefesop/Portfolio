/**
 * Server-only Stripe client for greg.efesop.com payments.
 *
 * Uses the G.E. Revamp Services Limited Stripe account - a SEPARATE account
 * from efesop.com. Set STRIPE_GREG_SECRET_KEY (sk_live_... or sk_test_...)
 * in .env.local and in the Vercel project env vars.
 */

import 'server-only';
import Stripe from 'stripe';

let cached: Stripe | null = null;

export function getGregStripe(): Stripe {
  if (cached) return cached;
  const secretKey = process.env.STRIPE_GREG_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_GREG_SECRET_KEY is not set');
  cached = new Stripe(secretKey, {
    apiVersion: '2026-04-22.dahlia',
    appInfo: { name: 'greg-revamp-pay', version: '1.0.0' },
  });
  return cached;
}

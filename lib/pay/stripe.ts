/**
 * Server-only Stripe client for the efesop.com/pay storefront.
 *
 * Uses the live personal Stripe account (George Efesopoulos).
 * The key lives in STRIPE_PAY_SECRET_KEY - set it to the LIVE secret key
 * (sk_live_...) in .env.local and in Vercel project env vars.
 */

import 'server-only';
import Stripe from 'stripe';

let cached: Stripe | null = null;

export function getPayStripe(): Stripe {
  if (cached) return cached;
  const secretKey = process.env.STRIPE_PAY_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_PAY_SECRET_KEY is not set');
  cached = new Stripe(secretKey, {
    apiVersion: '2026-04-22.dahlia',
    appInfo: {
      name: 'efesop-pay',
      version: '1.0.0',
    },
  });
  return cached;
}

/**
 * Server-only Stripe client for the agora account
 * (acct_1Qw1q1GHt7cesuhE / "George Efesop"). TEST mode for now.
 *
 * Test-mode IDs:
 *   Buy   €2,497 one-time  - price_1TVyglGHt7cesuhEqnDHcNRZ
 *   Rent  €299/mo recurring - price_1TVygoGHt7cesuhE7NxAVpFB
 *   Care  €97/mo recurring  - price_1TVygzGHt7cesuhEQVGmQdTh
 *
 * Live IDs will replace these once Stripe activation completes (proof-of-address upload).
 */

import "server-only";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_AGORA_SECRET_KEY;
if (!secretKey) {
  throw new Error("STRIPE_AGORA_SECRET_KEY is not set");
}

export const agoraStripe = new Stripe(secretKey, {
  // Pin the API version so behavior is stable across SDK upgrades.
  // Bump deliberately when we want new Stripe features.
  apiVersion: "2026-04-22.dahlia",
  appInfo: {
    name: "agora-kitchens",
    version: "0.1.0",
  },
});

/** Test-mode price IDs. Update from stripe-config.live.json once we go live. */
export const AGORA_PRICES = {
  buy: "price_1TVyglGHt7cesuhEqnDHcNRZ",
  rent: "price_1TVygoGHt7cesuhE7NxAVpFB",
  care: "price_1TVygzGHt7cesuhEQVGmQdTh",
} as const;

/** Test-mode Payment Link URLs - for direct buttons that bypass our own checkout flow. */
export const AGORA_PAYMENT_LINKS = {
  buy: "https://buy.stripe.com/test_4gM4gz76CgXq4U86vJ8og00",
  rent: "https://buy.stripe.com/test_8x2fZh8aGfTm4U87zN8og01",
  care: "https://buy.stripe.com/test_14AbJ1fD8fTmbiw6vJ8og02",
} as const;

export type AgoraTier = keyof typeof AGORA_PRICES;

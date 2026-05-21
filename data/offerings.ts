/**
 * Catalogue of paid offerings for efesop.com/pay.
 *
 * SINGLE SOURCE OF TRUTH. Add, edit, or remove an offering by editing this
 * array - the cards on /pay render straight from it, and the checkout API
 * resolves a slug to its Stripe price here.
 *
 * To take a placeholder offering live:
 *   1. Create a Product + Price on the LIVE Stripe account.
 *   2. Set `status: 'live'`, fill `priceId`, set the real `priceLabel` + `priceAmount`.
 *   3. For a recurring offering also set `billing: 'recurring'` and `interval`.
 * The checkout route only ever lets a `status: 'live'` offering through.
 */

export type OfferingStatus = 'live' | 'placeholder';
export type OfferingBilling = 'one_off' | 'recurring';

export interface Offering {
  /** URL-safe id. Used for ?offering= deep links and as the React key. */
  slug: string;
  /** Card title. */
  name: string;
  /** 1-2 line description shown on the card. */
  description: string;
  /** Human-readable price, e.g. "EUR 250" or "From EUR 600". */
  priceLabel: string;
  /** Numeric price in EUR for display sorting / structured data. null when not set. */
  priceAmount: number | null;
  /** one_off = single payment. recurring = subscription. */
  billing: OfferingBilling;
  /** Billing interval for recurring offerings. */
  interval?: 'month' | 'year';
  /** live = wired to a real Stripe price + buyable. placeholder = card only. */
  status: OfferingStatus;
  /** LIVE Stripe price id. Required when status is 'live'. */
  priceId?: string;
  /** CTA label override. Defaults sensibly per status. */
  ctaLabel?: string;
  /** Short turnaround note shown under the price, optional. */
  turnaround?: string;
  /** Optional bullet highlights of what's included. */
  includes?: string[];
}

export const offerings: Offering[] = [
  {
    slug: 'custom-video',
    name: 'Custom AI-Generated Video Ad',
    description:
      'A bespoke 30-50 second video advertisement for your product or brand. Scripted, directed, and rendered with AI - not slot-machined.',
    priceLabel: 'EUR 250',
    priceAmount: 250,
    billing: 'one_off',
    status: 'live',
    priceId: 'price_1TZZWZGHt7cesuhECfTLTdvy',
    ctaLabel: 'Buy now',
    turnaround: 'Delivered in 5-7 days',
    includes: [
      '30-50s finished video, ready to post',
      'Script + direction included',
      'One round of revisions',
    ],
  },
  {
    slug: 'website-build',
    name: 'Website Build',
    description:
      'A custom marketing site, landing page, or microsite. Designed and built by one person on Next.js or WordPress. Fast, schema-marked, yours to edit.',
    priceLabel: 'Pricing coming soon',
    priceAmount: null,
    billing: 'one_off',
    status: 'placeholder',
    ctaLabel: 'Enquire',
    turnaround: 'Typically 1-2 weeks',
  },
  {
    slug: 'website-care',
    name: 'Website Care Plan',
    description:
      'Ongoing maintenance, updates, edits, and monitoring for your site. A monthly retainer so the build stays fast, current, and looked after.',
    priceLabel: 'Pricing coming soon',
    priceAmount: null,
    billing: 'recurring',
    interval: 'month',
    status: 'placeholder',
    ctaLabel: 'Enquire',
    turnaround: 'Monthly, cancel anytime',
  },
  {
    slug: 'design-work',
    name: 'Product & UX Design',
    description:
      'SaaS interfaces, dashboards, mobile apps, and design systems. Research through hi-fi UI - the same person designs and ships it.',
    priceLabel: 'Pricing coming soon',
    priceAmount: null,
    billing: 'one_off',
    status: 'placeholder',
    ctaLabel: 'Enquire',
    turnaround: 'Scoped per project',
  },
];

/** Look up one offering by slug. */
export function getOffering(slug: string): Offering | undefined {
  return offerings.find((o) => o.slug === slug);
}

/** Email for enquiry CTAs on placeholder offerings. */
export const ENQUIRY_EMAIL = 'george.efesop@gmail.com';

/**
 * "Same-Day Design Renders" - the one productized, buyable offering on
 * greg.efesop.com/pay. A fixed-price AI-generated visualisation service.
 *
 * Price is a plain number here - change RENDER_PRICE_EUR to reprice. The
 * checkout uses an inline Stripe price, so no pre-created Stripe Price is
 * needed.
 */

export const RENDER_PRICE_EUR = 45;
export const RENDER_MAX_QUANTITY = 10;

export const renderContent = {
  eyebrow: 'New',
  title: 'Same-Day Design Renders',
  blurb:
    'See your project before a single block is laid. Send us your idea and we turn it into a realistic visualisation, delivered the same day. The easiest way to picture an extension, a new build, a garden or an outdoor space before you commit to it.',
  priceNote: 'per render, delivered the same day',
  cta: 'Order a render',
  includes: [
    'One realistic design render of your project',
    'Delivered the same day, straight to your phone',
    'Ideal for extensions, new builds, gardens and outdoor spaces',
  ],
};

export interface RenderExample {
  id: string;
  title: string;
  /** A single finished render. */
  image?: string;
  /** A before/after pair - takes priority over `image`. */
  beforeImage?: string;
  afterImage?: string;
}

export const renderExamples: RenderExample[] = [
  {
    id: 'outdoor-kitchen',
    title: 'Outdoor kitchen and bar in a courtyard',
    image: '/greg/renders/render-outdoor-kitchen.png',
  },
  {
    id: 'limestone-house',
    title: 'New limestone family home',
    image: '/greg/renders/render-limestone-house.png',
  },
  {
    id: 'pool-terrace',
    title: 'Pool and landscaped terrace',
    image: '/greg/renders/render-pool-terrace.png',
  },
  {
    id: 'land-boundary',
    title: 'Bare plot to fenced and gated',
    beforeImage: '/greg/renders/render-land-before.png',
    afterImage: '/greg/renders/render-land-after.png',
  },
];

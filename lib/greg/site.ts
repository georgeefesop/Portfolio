/**
 * Single source of truth for G.E. Revamp Services Limited.
 * greg.efesop.com pulls company identity, contact details and links from here.
 */

export const GREG = {
  company: 'G.E. Revamp Services Limited',
  shortName: 'G.E. Revamp',
  tagline: 'Renovations, extensions and building work across Cyprus',
  owner: 'Gregory Efesopoulos',
  regNumber: 'HE 478537',
  address: '9 Iouliou, 2A, Mesa Geitonia 4001, Limassol, Cyprus',
  email: 'efesop@hotmail.co.uk',
  /** Display form of the WhatsApp / phone number. */
  phoneDisplay: '+357 99 325 319',
  /** Digits only, for wa.me and tel: links. */
  phoneDigits: '35799325319',
  siteUrl: 'https://greg.efesop.com',
  yearsExperience: 30,
  /** Filled once Gregory provides it - shown in the footer. */
  vatNumber: '',
} as const;

/** Build a wa.me link, optionally with a pre-filled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${GREG.phoneDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** tel: link for the same number. */
export const GREG_TEL = `tel:+${GREG.phoneDigits}`;

/** Default pre-filled WhatsApp message for general enquiries. */
export const WHATSAPP_DEFAULT_MESSAGE =
  'Hello, I found your website and would like to ask about a project.';

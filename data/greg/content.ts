/**
 * All written copy + structured content for greg.efesop.com.
 *
 * SINGLE SOURCE OF TRUTH for the site's words. Editing copy here updates
 * the site - the section components are presentational and render from this.
 *
 * Voice: a Cyprus building contractor. Plain-spoken, confident, trustworthy.
 * No jargon, no em dashes.
 */

import {
  Wrench,
  Sprout,
  Building2,
  MessageSquare,
  ClipboardList,
  Hammer,
  CheckCircle2,
  Award,
  HardHat,
  MapPin,
  BadgeCheck,
  type LucideIcon,
} from 'lucide-react';
import { GREG } from '@/lib/greg/site';

/* ----------------------------- Hero ----------------------------- */

export const heroContent = {
  eyebrow: 'Owner-run building company · Limassol, Cyprus',
  titleLead: 'Home ',
  titleAccent: 'Improvements',
  body: 'G.E. Revamp is run hands-on by Gregory Efesopoulos. From a new bathroom to a whole extra floor, handled start to finish.',
  primaryCta: 'Get a free quote',
  secondaryCta: 'See our work',
  trustLine: 'More than 30 years of building experience. Free, no-obligation quotes.',
  beforeImage: '/greg/hero-before-2.jpg',
  afterImage: '/greg/hero-after-2.jpg',
};

/* ------------------------- Credentials -------------------------- */
/* Honest trust chips. Add a projects-completed chip once Gregory
   confirms a number (see docs/greg/intake-questions.md, Q2). */

export const credentials: { icon: LucideIcon; label: string }[] = [
  { icon: Award, label: 'Over 30 years of building experience' },
  { icon: HardHat, label: 'Owner-run, hands-on site management' },
  { icon: MapPin, label: 'Limassol, Paphos and across Cyprus' },
  { icon: BadgeCheck, label: 'Free, no-obligation quotes' },
];

/* --------------------------- Services --------------------------- */

export interface GregService {
  id: string;
  title: string;
  description: string;
  points: string[];
  /** The headline service gets visual weight. */
  featured?: boolean;
}

/* Icons are keyed by service id so service data stays JSON-serialisable
   and editable from the admin. New services use the default icon. */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  maintenance: Wrench,
  gardening: Sprout,
  renovations: Building2,
};

export function serviceIcon(id: string): LucideIcon {
  return SERVICE_ICONS[id] ?? Hammer;
}

export const services: GregService[] = [
  {
    id: 'maintenance',
    title: 'Building Maintenance',
    description:
      'Reliable upkeep and repairs for homes and businesses, done by people who turn up when they say they will.',
    points: [
      'Painting, plastering and general repairs',
      'Bathroom and kitchen updates',
      'Ongoing property upkeep and fixes',
    ],
  },
  {
    id: 'gardening',
    title: 'Gardening & Landscaping',
    description:
      'Gardens, driveways and outdoor spaces designed and built to make the outside of your property work as hard as the inside.',
    points: [
      'Garden design, groundwork and planting',
      'Driveways, patios and paving',
      'Garages and outdoor structures',
    ],
  },
  {
    id: 'renovations',
    title: 'Renovations & Extensions',
    description:
      'The big jobs. Full home renovations, property extensions and adding an entire floor on top of your existing house, managed end to end.',
    points: [
      'Full home and business renovations',
      'Extensions and additional floors',
      'Planning permission and building teams managed',
    ],
    featured: true,
  },
];

export const servicesIntro = {
  heading: 'What we do',
  sub: 'One company for the whole job, from the smallest repair to a full extension.',
};

/* ---------------------------- Process --------------------------- */

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const processIntro = {
  heading: 'How a project works',
  sub: 'Big building work makes people nervous. Here is exactly how G.E. Revamp keeps it straightforward, from the first message to the final handover.',
};

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Talk it through',
    description:
      'Send a message on WhatsApp with what you have in mind. A few photos, a rough idea, or just a question. We arrange a time to visit and see the property.',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'Quote and plan',
    description:
      'You get a clear, no-obligation quote and a realistic timeline. Where the job needs drawings or planning permission, that is arranged for you.',
    icon: ClipboardList,
  },
  {
    number: '03',
    title: 'We build',
    description:
      'Gregory runs the site and the trades day to day. You get straight answers and steady progress, not a project that goes quiet for weeks.',
    icon: Hammer,
  },
  {
    number: '04',
    title: 'Finished properly',
    description:
      'The job is handed back clean and complete, finished to a standard that lasts. Snags sorted, no loose ends.',
    icon: CheckCircle2,
  },
];

/* --------------------------- Projects --------------------------- */

export const projectsIntro = {
  heading: 'Recent work',
  sub: 'A look at projects completed across Cyprus: kitchens, bathrooms, extensions, additional floors and full renovations.',
};

/* ------------------------- Testimonials ------------------------- */
/* PLACEHOLDER content. Replace with real client testimonials from
   Gregory (see docs/greg/intake-questions.md, Q6) before launch. */

export interface GregTestimonial {
  quote: string;
  name: string;
  location: string;
  project: string;
  placeholder?: boolean;
}

export const testimonialsIntro = {
  heading: 'What clients say',
  sub: 'Word of mouth is how most of our work comes in.',
};

export const testimonials: GregTestimonial[] = [
  {
    quote:
      'A real client quote will go here once Gregory provides three short testimonials.',
    name: 'Client name',
    location: 'Town',
    project: 'Project type',
    placeholder: true,
  },
  {
    quote:
      'A real client quote will go here once Gregory provides three short testimonials.',
    name: 'Client name',
    location: 'Town',
    project: 'Project type',
    placeholder: true,
  },
  {
    quote:
      'A real client quote will go here once Gregory provides three short testimonials.',
    name: 'Client name',
    location: 'Town',
    project: 'Project type',
    placeholder: true,
  },
];

/* ---------------------------- About ----------------------------- */

export const aboutContent = {
  heading: 'Three decades of building, ',
  headingAccent: 'now one company.',
  paragraphs: [
    'Gregory Efesopoulos has spent more than 30 years building and renovating homes in Cyprus and the United Kingdom. G.E. Revamp Services Limited brings that experience under one roof.',
    'It is a hands-on business. Gregory runs the site and the trades himself, so the person who quotes your job is the same person who sees it finished. From a small repair to a major extension, the standard does not change.',
  ],
};

/* ------------------------ Areas served -------------------------- */

export const areasContent = {
  heading: 'Where we work',
  body: 'G.E. Revamp is based in Limassol and works across the Greek side of Cyprus, including ongoing projects in Paphos.',
  /* Gregory to confirm the exact list of towns (intake Q4). */
  areas: ['Limassol', 'Paphos', 'Larnaca', 'Nicosia'],
};

/* --------------------------- Final CTA -------------------------- */

export const finalCtaContent = {
  heading: 'Ready to talk about your project?',
  body: 'Send a message on WhatsApp with a few photos or a rough idea of what you want. Gregory will arrange a visit and give you a clear, no-obligation quote.',
  cta: 'Message G.E. Revamp',
};

/* ----------------------------- Pay ------------------------------ */

export const payContent = {
  eyebrow: 'Payments',
  heading: 'Pay G.E. Revamp',
  intro:
    'Pay an agreed amount securely by card, or order a same-day design render of your project. For a quote on a new job, message us on WhatsApp.',
  customTitle: 'Make a payment',
  customBlurb:
    'Enter your details and the agreed amount, then check out securely. Card payments are processed by Stripe and a receipt is emailed to you straight away.',
};

/* ----------------------- Business details ----------------------- */
/* The contact fields Gregory can edit from the admin. The footer reads
   these; everything else comes from lib/greg/site.ts. */

export interface BusinessDetails {
  email: string;
  address: string;
  vatNumber: string;
}

export const defaultBusiness: BusinessDetails = {
  email: GREG.email,
  address: GREG.address,
  vatNumber: GREG.vatNumber,
};

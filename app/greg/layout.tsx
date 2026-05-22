import type { Metadata } from 'next';
import './greg-theme.css';
import GregNav from '@/components/greg/GregNav';
import GregFooter from '@/components/greg/GregFooter';
import { FloatingWhatsApp } from '@/components/greg/WhatsApp';
import { GREG } from '@/lib/greg/site';
import { getContent } from '@/lib/greg/content-store';
import { defaultBusiness, type BusinessDetails } from '@/data/greg/content';

/* Content is read from Supabase per request so Gregory's admin edits show
   up straight away. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(GREG.siteUrl),
  title: {
    default: 'G.E. Revamp Services | Renovations & Extensions in Cyprus',
    template: '%s | G.E. Revamp Services',
  },
  description:
    'G.E. Revamp Services is a Limassol building company. Over 30 years of renovations, extensions, additional floors and property maintenance across Cyprus. Free quotes on WhatsApp.',
  alternates: { canonical: GREG.siteUrl },
  icons: { icon: '/greg/icon.svg' },
  openGraph: {
    title: 'G.E. Revamp Services | Renovations & Extensions in Cyprus',
    description:
      'Over 30 years of renovations, extensions and building work across Cyprus. Limassol-based, covering the Greek side of the island.',
    url: GREG.siteUrl,
    siteName: GREG.company,
    type: 'website',
  },
};

export default async function GregLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const business = await getContent<BusinessDetails>(
    'business',
    defaultBusiness,
  );

  return (
    <div
      data-site="greg"
      className="greg-root flex min-h-screen flex-col bg-bg-primary text-text-primary"
    >
      <GregNav />
      <div className="flex-1">{children}</div>
      <GregFooter business={business} />
      <FloatingWhatsApp />
    </div>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail } from 'lucide-react';
import { offerings } from '@/data/offerings';
import OfferingCard from '@/components/pay/OfferingCard';
import PayNotices from '@/components/pay/PayNotices';
import Footer from '@/components/ui/Footer';

const SITE_URL = 'https://efesop.com';
const AUTHOR_NAME = 'George Efesop';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Hire George Efesop - Services & Pricing',
  description:
    'Pay for AI-built digital work: custom video ads, website builds, care plans, and product design. Branded, secure Stripe checkout.',
  alternates: { canonical: `${SITE_URL}/pay` },
  openGraph: {
    title: 'Hire George Efesop - Services & Pricing',
    description:
      'Pay for AI-built digital work: custom video ads, website builds, care plans, and product design.',
    url: `${SITE_URL}/pay`,
    type: 'website',
  },
};

export default function PayPage() {
  // Live offerings render first; the flagship video ad gets the featured treatment.
  const ordered = [...offerings].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status === 'live' ? -1 : 1;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'efesop - Services & Pricing',
    url: `${SITE_URL}/pay`,
    provider: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    itemListElement: offerings
      .filter((o) => o.status === 'live' && o.priceAmount !== null)
      .map((o) => ({
        '@type': 'Offer',
        name: o.name,
        description: o.description,
        url: `${SITE_URL}/pay?offering=${o.slug}`,
        price: o.priceAmount,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      })),
  };

  return (
    <main className="pay-page flex min-h-screen flex-col bg-bg-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pay-page-shell mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="pay-breadcrumb mb-8 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-text-muted"
        >
          <Link
            href="/"
            className="pay-breadcrumb-back inline-flex items-center gap-1.5 transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={12} aria-hidden />
            <span>Home</span>
          </Link>
          <span aria-hidden className="text-text-dim">
            /
          </span>
          <span className="text-text-secondary">Services &amp; pricing</span>
        </nav>

        {/* Header */}
        <header className="pay-header mb-12 max-w-2xl">
          <p className="pay-eyebrow font-serif text-lg italic text-text-muted md:text-xl">
            Work with me, the simple way
          </p>
          <h1 className="pay-heading mt-2 font-serif text-h1 leading-[0.95] tracking-tight text-text-primary">
            Services &amp; pricing
          </h1>
          <p className="pay-intro mt-5 text-base leading-relaxed text-text-secondary md:text-lg">
            I design and build digital work with AI - fast, bespoke, and
            properly directed. Pick an offering below and pay securely by card.
            No invoices, no back-and-forth.
          </p>
        </header>

        <Suspense fallback={null}>
          <PayNotices />
        </Suspense>

        {/* Catalogue grid */}
        <div className="pay-grid grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ordered.map((offering) => (
            <OfferingCard
              key={offering.slug}
              offering={offering}
              featured={offering.status === 'live'}
            />
          ))}
        </div>

        {/* Trust + contact strip */}
        <section className="pay-trust mt-10 rounded-2xl border border-border-subtle bg-bg-secondary p-6 md:p-8">
          <div className="pay-trust-inner flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="pay-trust-text">
              <div className="pay-trust-badge mb-2 inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                <ShieldCheck size={18} className="text-accent-primary" aria-hidden />
                Secure checkout, powered by Stripe
              </div>
              <p className="pay-trust-blurb max-w-xl text-sm leading-relaxed text-text-secondary">
                Payments are processed by Stripe and charged in EUR. You get an
                emailed receipt the moment payment clears. Not sure which
                offering fits? Email me and I&apos;ll point you the right way.
              </p>
            </div>
            <a
              href="mailto:george.efesop@gmail.com?subject=Question%20about%20your%20services"
              className="pay-trust-cta inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary/50 hover:text-accent-primary"
            >
              <Mail size={16} aria-hidden />
              Ask a question
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

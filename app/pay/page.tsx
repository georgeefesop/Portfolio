import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { offerings } from '@/data/offerings';
import OfferingCard from '@/components/pay/OfferingCard';
import CustomPaymentCard from '@/components/pay/CustomPaymentCard';
import PayNotices from '@/components/pay/PayNotices';
import Footer from '@/components/ui/Footer';

const SITE_URL = 'https://efesop.com';
const AUTHOR_NAME = 'George Efesopoulos';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Hire George Efesopoulos - Services & Pricing',
  description:
    'Pay for AI-built digital work: custom video ads, website builds, care plans, and product design. Branded, secure Stripe checkout.',
  alternates: { canonical: `${SITE_URL}/pay` },
  openGraph: {
    title: 'Hire George Efesopoulos - Services & Pricing',
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

      <div className="pay-page-shell mx-auto w-full max-w-4xl px-4 pb-28 pt-32 sm:px-6 lg:px-8">
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
        <header className="pay-header mb-16 max-w-2xl">
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

        {/* Trust + contact strip */}
        <section className="pay-trust mb-16 rounded-2xl border border-border-subtle bg-bg-secondary p-6 md:p-8">
          <div className="pay-trust-inner flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="pay-trust-text">
              <div className="pay-trust-badge mb-2 inline-flex flex-wrap items-center gap-2 text-lg font-semibold text-text-primary">
                <ShieldCheck size={18} className="text-accent-primary" aria-hidden />
                <span>Secure checkout</span>
                <img
                  src="/powered-by-stripe.png"
                  alt="Powered by Stripe"
                  className="pay-trust-stripe-logo h-[2.4rem] w-auto"
                />
              </div>
              <p className="pay-trust-blurb max-w-xl text-sm leading-relaxed text-text-secondary">
                Payments are processed by Stripe and charged in EUR. You get an
                emailed receipt the moment payment clears. Not sure which
                offering fits? Message me and I&apos;ll point you the right way.
              </p>
            </div>
            <a
              href="https://wa.me/35797907137?text=Hi%20George%2C%20I%20have%20a%20question%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="pay-trust-cta inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary/50 hover:text-accent-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Ask a question
            </a>
          </div>
        </section>

        <Suspense fallback={null}>
          <PayNotices />
        </Suspense>

        {/* Flagship: name-your-amount custom payment */}
        <CustomPaymentCard />

        {/* Catalogue grid */}
        <div className="pay-grid grid grid-cols-1 gap-6 md:grid-cols-2">
          {ordered.map((offering) => (
            <OfferingCard
              key={offering.slug}
              offering={offering}
              featured={offering.status === 'live'}
            />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

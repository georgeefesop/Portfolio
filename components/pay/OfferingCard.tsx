'use client';

import { useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { ArrowRight, Check, Loader2, RefreshCw } from 'lucide-react';
import type { Offering } from '@/data/offerings';
import { ENQUIRY_EMAIL } from '@/data/offerings';

interface OfferingCardProps {
  offering: Offering;
  /** Highlights the card visually - used for the flagship live offering. */
  featured?: boolean;
}

export default function OfferingCard({ offering, featured }: OfferingCardProps) {
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLive = offering.status === 'live';

  async function startCheckout() {
    if (loading) return;
    setError(null);
    setLoading(true);
    posthog?.capture('pay_checkout_started', { offering_slug: offering.slug });
    try {
      const res = await fetch('/api/pay/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: offering.slug }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'checkout_failed');
      }
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please try again or email me.');
      setLoading(false);
    }
  }

  return (
    <div
      id={offering.slug}
      className={`offering-card group relative flex h-full scroll-mt-28 flex-col rounded-2xl border p-6 transition-all duration-300 md:p-7 ${
        featured
          ? 'offering-card-featured border-accent-primary bg-bg-elevated shadow-lg shadow-accent-primary/10 hover:shadow-xl hover:shadow-accent-primary/15'
          : 'border-border-subtle bg-bg-secondary hover:border-accent-primary/45 hover:shadow-lg hover:shadow-accent-primary/5'
      }`}
    >
      {/* Status chip */}
      <div className="offering-card-meta mb-4 flex items-center justify-between gap-3">
        <span
          className={`offering-card-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
            isLive
              ? 'bg-accent-primary/15 text-accent-primary'
              : 'bg-bg-tertiary text-text-muted'
          }`}
        >
          {offering.billing === 'recurring' && (
            <RefreshCw size={11} aria-hidden />
          )}
          {isLive
            ? offering.billing === 'recurring'
              ? 'Subscription'
              : 'Available now'
            : 'Coming soon'}
        </span>
      </div>

      {/* Title + description */}
      <h3 className="offering-card-title text-h4 font-bold leading-tight tracking-tight text-text-primary">
        {offering.name}
      </h3>
      <p className="offering-card-description mt-2.5 text-sm leading-relaxed text-text-secondary">
        {offering.description}
      </p>

      {/* Includes list */}
      {offering.includes && offering.includes.length > 0 && (
        <ul className="offering-card-includes mt-4 space-y-2">
          {offering.includes.map((item) => (
            <li
              key={item}
              className="offering-card-include flex items-start gap-2 text-sm text-text-secondary"
            >
              <Check
                size={15}
                className="offering-card-include-icon mt-0.5 shrink-0 text-accent-primary"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Price + CTA pinned to the bottom */}
      <div className="offering-card-footer mt-6 flex flex-col gap-3 border-t border-border-subtle/70 pt-5">
        <div className="offering-card-price-row flex items-baseline gap-1.5">
          <span
            className={`offering-card-price font-bold tracking-tight ${
              offering.priceAmount !== null
                ? 'text-2xl text-text-primary'
                : 'text-lg text-text-muted'
            }`}
          >
            {offering.priceLabel}
          </span>
          {offering.billing === 'recurring' && offering.priceAmount !== null && (
            <span className="offering-card-price-interval text-sm text-text-muted">
              /{offering.interval ?? 'month'}
            </span>
          )}
        </div>
        {offering.turnaround && (
          <p className="offering-card-turnaround text-xs text-text-muted">
            {offering.turnaround}
          </p>
        )}

        {isLive ? (
          <button
            type="button"
            onClick={startCheckout}
            disabled={loading}
            className="offering-card-cta mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary py-3.5 font-semibold text-bg-primary transition-colors hover:bg-accent-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden />
                Redirecting to checkout
              </>
            ) : (
              offering.ctaLabel ?? 'Buy now'
            )}
          </button>
        ) : (
          <a
            href={`mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(
              `Enquiry: ${offering.name}`,
            )}`}
            className="offering-card-cta offering-card-cta-enquire mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary py-3.5 font-semibold text-text-primary transition-colors hover:border-accent-primary/50 hover:text-accent-primary"
          >
            {offering.ctaLabel ?? 'Enquire'}
            <ArrowRight size={16} aria-hidden />
          </a>
        )}

        {error && (
          <p className="offering-card-error text-xs text-accent-coral" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

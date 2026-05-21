'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Info } from 'lucide-react';
import { getOffering } from '@/data/offerings';

/**
 * Client-side helpers for the /pay page:
 *  - shows a dismissible notice if a checkout was canceled (?canceled=slug)
 *  - smooth-scrolls to a specific offering card when deep-linked (?offering=slug)
 */
export default function PayNotices() {
  const params = useSearchParams();
  const canceledSlug = params.get('canceled');
  const offeringSlug = params.get('offering');
  const [showCanceled, setShowCanceled] = useState(Boolean(canceledSlug));

  useEffect(() => {
    if (!offeringSlug) return;
    const el = document.getElementById(offeringSlug);
    if (!el) return;
    // Defer so layout has settled before scrolling.
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
    return () => clearTimeout(t);
  }, [offeringSlug]);

  if (!showCanceled) return null;

  const canceled = canceledSlug ? getOffering(canceledSlug) : undefined;

  return (
    <div
      className="pay-notice mx-auto mb-8 flex max-w-3xl items-start gap-3 rounded-xl border border-border-medium bg-bg-secondary px-4 py-3.5"
      role="status"
    >
      <Info size={18} className="mt-0.5 shrink-0 text-accent-primary" aria-hidden />
      <p className="pay-notice-text flex-1 text-sm text-text-secondary">
        Checkout was canceled{canceled ? ` for ${canceled.name}` : ''}. No charge
        was made - you can pick up where you left off whenever you&apos;re ready.
      </p>
      <button
        type="button"
        onClick={() => setShowCanceled(false)}
        className="pay-notice-dismiss text-xs font-medium text-text-muted hover:text-text-primary"
      >
        Dismiss
      </button>
    </div>
  );
}

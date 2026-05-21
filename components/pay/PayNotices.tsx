'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOffering } from '@/data/offerings';

/** Auto-dismiss the canceled-checkout toast after this long. */
const TOAST_MS = 10_000;

/**
 * Client-side helpers for the /pay page:
 *  - a top toast if a checkout was canceled (?canceled=slug), sliding down
 *    from the top and auto-dismissing after 10s (or on click)
 *  - smooth-scrolls to a specific card when deep-linked (?offering=slug)
 */
export default function PayNotices() {
  const params = useSearchParams();
  const canceledSlug = params.get('canceled');
  const offeringSlug = params.get('offering');
  const [showCanceled, setShowCanceled] = useState(Boolean(canceledSlug));

  // Smooth-scroll to a deep-linked offering card.
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

  // Auto-dismiss the toast after 10s.
  useEffect(() => {
    if (!showCanceled) return;
    const t = setTimeout(() => setShowCanceled(false), TOAST_MS);
    return () => clearTimeout(t);
  }, [showCanceled]);

  const canceled = canceledSlug ? getOffering(canceledSlug) : undefined;

  return (
    <div className="pay-toast-anchor pointer-events-none fixed left-4 right-4 top-[88px] z-[120] mx-auto max-w-md">
      <AnimatePresence>
        {showCanceled && (
          <motion.div
            key="pay-canceled-toast"
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pay-toast pointer-events-auto flex items-start gap-3 rounded-xl border border-border-medium bg-bg-elevated px-4 py-3.5 shadow-lg shadow-black/25"
            role="status"
          >
            <Info
              size={18}
              className="mt-0.5 shrink-0 text-accent-primary"
              aria-hidden
            />
            <p className="pay-toast-text flex-1 text-sm text-text-secondary">
              Checkout was canceled{canceled ? ` for ${canceled.name}` : ''}. No
              charge was made - pick up whenever you&apos;re ready.
            </p>
            <button
              type="button"
              onClick={() => setShowCanceled(false)}
              className="pay-toast-dismiss -mr-1 -mt-1 shrink-0 rounded-md p-1 text-text-muted transition-colors hover:text-text-primary"
              aria-label="Dismiss"
            >
              <X size={16} aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

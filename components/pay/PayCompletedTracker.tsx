'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

interface PayCompletedTrackerProps {
  /** Stripe Checkout session id - used as the dedupe key. */
  sessionId: string;
  /** Amount paid, in major currency units (EUR). null when unknown. */
  amount: number | null;
  /** ISO currency code, lowercase as Stripe returns it. */
  currency: string | null;
  /** Offering slug, or 'custom' for a name-your-amount payment. */
  offering: string | null;
  /** Whether the buyer asked for an invoice. */
  invoiceRequested: boolean;
  /** Buyer email, for PostHog identify. */
  email: string | null;
}

/**
 * Fires a PostHog `pay_completed` conversion event once per confirmed Stripe
 * Checkout session. Rendered only when the server has verified the session is
 * paid, so reaching this component already means a real conversion.
 *
 * Deduped per session_id via sessionStorage: a page refresh re-runs this
 * component but will not re-fire the event.
 */
export default function PayCompletedTracker({
  sessionId,
  amount,
  currency,
  offering,
  invoiceRequested,
  email,
}: PayCompletedTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog || !sessionId) return;

    const dedupeKey = `pay_completed:${sessionId}`;
    try {
      if (sessionStorage.getItem(dedupeKey)) return;
      sessionStorage.setItem(dedupeKey, '1');
    } catch {
      // sessionStorage unavailable (private mode etc.) - fall through and
      // capture anyway; a missing dedupe is better than a missing conversion.
    }

    // Tie the conversion to a person so it rolls up against earlier events.
    if (email) {
      posthog.identify(email, { email });
    }

    posthog.capture('pay_completed', {
      session_id: sessionId,
      amount,
      currency,
      offering,
      invoice_requested: invoiceRequested,
    });
  }, [posthog, sessionId, amount, currency, offering, invoiceRequested, email]);

  return null;
}

'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

/**
 * Fires a single `payment_completed` PostHog event when the success page
 * loads with a confirmed payment.
 */
export default function PayTracker({
  amount,
  currency,
}: {
  amount: number | null;
  currency: string | null;
}) {
  const posthog = usePostHog();
  useEffect(() => {
    posthog?.capture('payment_completed', { amount, currency });
  }, [posthog, amount, currency]);
  return null;
}

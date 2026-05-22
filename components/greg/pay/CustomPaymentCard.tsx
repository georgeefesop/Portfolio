'use client';

import { useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { payContent } from '@/data/greg/content';

/** Keep in sync with app/api/greg/pay/custom-checkout/route.ts. */
const MIN_EUR = 5;
const MAX_EUR = 50_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldBase =
  'w-full rounded-lg border border-border-medium bg-bg-tertiary py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const labelClass = 'mb-1.5 block text-xs font-medium text-text-muted';

export default function CustomPaymentCard() {
  const posthog = usePostHog();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [invoice, setInvoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountNum = Number(amount);
  const nameValid = name.trim() !== '';
  const emailValid = EMAIL_RE.test(email.trim());
  const amountValid =
    amount.trim() !== '' &&
    Number.isFinite(amountNum) &&
    amountNum >= MIN_EUR &&
    amountNum <= MAX_EUR;
  const canSubmit = nameValid && emailValid && amountValid && !loading;

  const hint =
    amount.trim() !== '' && !amountValid
      ? `Enter an amount between EUR ${MIN_EUR} and EUR ${MAX_EUR.toLocaleString('en-US')}.`
      : email.trim() !== '' && !emailValid
        ? 'Enter a valid email address.'
        : null;

  async function startCheckout() {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    posthog?.capture('pay_custom_checkout_started', { amount: amountNum, invoice });
    try {
      const res = await fetch('/api/greg/pay/custom-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum,
          name: name.trim(),
          email: email.trim(),
          reason: reason.trim(),
          invoice,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? 'checkout_failed');
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error && err.message !== 'checkout_failed'
          ? err.message
          : 'Something went wrong. Please try again or message us on WhatsApp.',
      );
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-accent-primary bg-bg-elevated p-6 shadow-lg shadow-accent-primary/10 md:p-8">
      <div className="mb-5 max-w-xl">
        <h2 className="text-h4 font-bold leading-tight tracking-tight text-text-primary">
          {payContent.customTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {payContent.customBlurb}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="greg-pay-name" className={labelClass}>
              Your name
            </label>
            <input
              id="greg-pay-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Andreas Georgiou"
              maxLength={100}
              autoComplete="name"
              className={`${fieldBase} px-3.5`}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="greg-pay-email" className={labelClass}>
              Email
            </label>
            <input
              id="greg-pay-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={`${fieldBase} px-3.5`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="greg-pay-reason" className={labelClass}>
              What is this payment for?
            </label>
            <input
              id="greg-pay-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Bathroom renovation - deposit"
              maxLength={200}
              className={`${fieldBase} px-3.5`}
            />
          </div>
          <div className="sm:w-44">
            <label htmlFor="greg-pay-amount" className={labelClass}>
              Amount (EUR)
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted"
                aria-hidden
              >
                EUR
              </span>
              <input
                id="greg-pay-amount"
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                min={MIN_EUR}
                max={MAX_EUR}
                step="0.01"
                className={`${fieldBase} pl-12 pr-3.5`}
              />
            </div>
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label
            htmlFor="greg-pay-invoice"
            className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-text-secondary"
          >
            <input
              id="greg-pay-invoice"
              type="checkbox"
              checked={invoice}
              onChange={(e) => setInvoice(e.target.checked)}
              className="h-4 w-4 shrink-0 cursor-pointer accent-accent-primary"
            />
            I need an invoice
          </label>
          <button
            type="button"
            onClick={startCheckout}
            disabled={!canSubmit}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-cta-bg px-6 py-3 font-semibold text-cta-fg transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden />
                Redirecting
              </>
            ) : (
              'Pay securely'
            )}
          </button>
        </div>
      </div>

      {(error || hint) && (
        <p className="mt-3 text-xs text-accent-coral" role="alert">
          {error ?? hint}
        </p>
      )}

      <p className="mt-4 inline-flex items-center gap-2 text-xs text-text-muted">
        <ShieldCheck size={14} className="text-accent-primary" aria-hidden />
        Secure checkout by Stripe. Payments are charged in EUR.
      </p>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { Loader2 } from 'lucide-react';

/** Keep in sync with app/api/pay/custom-checkout/route.ts. */
const MIN_EUR = 5;
const MAX_EUR = 10_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldBase =
  'custom-pay-input w-full rounded-lg border border-border-medium bg-bg-tertiary py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const labelClass =
  'custom-pay-label mb-1.5 block text-xs font-medium text-text-muted';

/**
 * Flagship "name your amount" card on /pay. The box is the form: the buyer's
 * details, what it's for, an amount, and an optional invoice - straight into a
 * one-off Stripe Checkout session.
 */
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
      ? `Enter an amount between EUR ${MIN_EUR} and EUR ${MAX_EUR.toLocaleString(
          'en-US',
        )}.`
      : email.trim() !== '' && !emailValid
        ? 'Enter a valid email address.'
        : null;

  async function startCheckout() {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    posthog?.capture('pay_custom_checkout_started', {
      amount: amountNum,
      invoice,
    });
    try {
      const res = await fetch('/api/pay/custom-checkout', {
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
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'checkout_failed');
      }
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error && err.message !== 'checkout_failed'
          ? err.message
          : 'Something went wrong. Please try again or email me.',
      );
      setLoading(false);
    }
  }

  return (
    <section
      id="custom"
      className="custom-pay-card relative mb-8 scroll-mt-28 rounded-2xl border border-accent-primary bg-bg-elevated p-6 shadow-lg shadow-accent-primary/10 md:p-8"
    >
      <span className="custom-pay-ribbon absolute -top-2.5 right-6 rounded-full bg-accent-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bg-primary">
        Secure online payments
      </span>

      <div className="custom-pay-head mb-5 max-w-xl">
        <h2 className="custom-pay-title text-h4 font-bold leading-tight tracking-tight text-text-primary">
          Custom payment to{' '}
          <span className="custom-pay-name font-fraunces-display text-[1.1em] font-medium italic">
            George Efesopoulos
          </span>
        </h2>
        <p className="custom-pay-blurb mt-2 text-sm leading-relaxed text-text-secondary">
          Already agreed a price with me? Add your details and the amount, then
          check out securely by card.
        </p>
      </div>

      <div className="custom-pay-form flex flex-col gap-3">
        {/* Buyer details */}
        <div className="custom-pay-row flex flex-col gap-3 sm:flex-row">
          <div className="custom-pay-field flex-1">
            <label htmlFor="custom-pay-name" className={labelClass}>
              Your name
            </label>
            <input
              id="custom-pay-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              maxLength={100}
              autoComplete="name"
              className={`${fieldBase} px-3.5`}
            />
          </div>
          <div className="custom-pay-field flex-1">
            <label htmlFor="custom-pay-email" className={labelClass}>
              Email
            </label>
            <input
              id="custom-pay-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              autoComplete="email"
              className={`${fieldBase} px-3.5`}
            />
          </div>
        </div>

        {/* What for + amount */}
        <div className="custom-pay-row flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="custom-pay-field flex-1">
            <label htmlFor="custom-pay-reason" className={labelClass}>
              What&apos;s this for?
            </label>
            <input
              id="custom-pay-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Logo design - final payment"
              maxLength={200}
              className={`${fieldBase} px-3.5`}
            />
          </div>
          <div className="custom-pay-field sm:w-44">
            <label htmlFor="custom-pay-amount" className={labelClass}>
              Amount (EUR)
            </label>
            <div className="custom-pay-amount-wrap relative">
              <span
                className="custom-pay-currency pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted"
                aria-hidden
              >
                €
              </span>
              <input
                id="custom-pay-amount"
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250"
                min={MIN_EUR}
                max={MAX_EUR}
                step="0.01"
                className={`${fieldBase} pl-7 pr-3.5`}
              />
            </div>
          </div>
        </div>

        {/* Invoice opt-in + submit */}
        <div className="custom-pay-actions mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label
            htmlFor="custom-pay-invoice"
            className="custom-pay-invoice flex cursor-pointer select-none items-center gap-2.5 text-sm text-text-secondary"
          >
            <input
              id="custom-pay-invoice"
              type="checkbox"
              checked={invoice}
              onChange={(e) => setInvoice(e.target.checked)}
              className="custom-pay-checkbox h-4 w-4 shrink-0 cursor-pointer accent-accent-primary"
            />
            I need an invoice (for business or tax)
          </label>
          <button
            type="button"
            onClick={startCheckout}
            disabled={!canSubmit}
            className="custom-pay-cta inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent-primary px-6 py-3 font-semibold text-bg-primary transition-colors hover:bg-accent-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
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
        <p
          className="custom-pay-msg mt-3 text-xs text-accent-coral"
          role="alert"
        >
          {error ?? hint}
        </p>
      )}
    </section>
  );
}

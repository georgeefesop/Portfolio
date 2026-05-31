'use client';

import { useRef, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { Loader2, Plus, ShieldCheck, X } from 'lucide-react';
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from 'react-icons/fa';
import { payContent } from '@/data/greg/content';

/** Keep in sync with app/api/greg/pay/custom-checkout/route.ts. */
const MIN_EUR = 5;
const MAX_EUR = 50_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldBase =
  'w-full rounded-lg border border-border-medium bg-bg-tertiary py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const labelClass = 'mb-1.5 block text-xs font-medium text-text-muted';

type Line = { id: string; description: string; amount: string };

export default function CustomPaymentCard() {
  const posthog = usePostHog();
  const lineId = useRef(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lines, setLines] = useState<Line[]>([
    { id: '0', description: '', amount: '' },
  ]);
  const [invoice, setInvoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateLine(id: string, field: 'description' | 'amount', value: string) {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  }
  function addLine() {
    setLines((prev) => [
      ...prev,
      { id: String(lineId.current++), description: '', amount: '' },
    ]);
  }
  function removeLine(id: string) {
    setLines((prev) =>
      prev.length > 1 ? prev.filter((l) => l.id !== id) : prev,
    );
  }

  const parsedLines = lines.map((l) => ({ ...l, num: Number(l.amount) }));
  const activeLines = parsedLines.filter(
    (l) => l.amount.trim() !== '' && Number.isFinite(l.num) && l.num > 0,
  );
  const total = activeLines.reduce((sum, l) => sum + l.num, 0);
  const badAmount = parsedLines.some(
    (l) => l.amount.trim() !== '' && (!Number.isFinite(l.num) || l.num <= 0),
  );
  const multiLine = lines.length > 1;

  const nameValid = name.trim() !== '';
  const emailValid = EMAIL_RE.test(email.trim());
  const totalValid =
    activeLines.length > 0 && !badAmount && total >= MIN_EUR && total <= MAX_EUR;
  const canSubmit = nameValid && emailValid && totalValid && !loading;

  const hint =
    activeLines.length > 0 && !totalValid
      ? `Total must be between EUR ${MIN_EUR} and EUR ${MAX_EUR.toLocaleString('en-US')}.`
      : email.trim() !== '' && !emailValid
        ? 'Enter a valid email address.'
        : null;

  async function startCheckout() {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    posthog?.capture('pay_custom_checkout_started', {
      amount: total,
      invoice,
      line_count: activeLines.length,
    });
    try {
      const res = await fetch('/api/greg/pay/custom-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          invoice,
          lines: activeLines.map((l) => ({
            description: l.description.trim(),
            amount: l.num,
          })),
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

        <div className="flex flex-col gap-2.5">
          {lines.map((line, i) => (
            <div
              key={line.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor={`greg-pay-desc-${line.id}`}
                  className={i === 0 ? labelClass : 'sr-only'}
                >
                  {i === 0
                    ? 'What is this payment for?'
                    : `Line ${i + 1} description`}
                </label>
                <input
                  id={`greg-pay-desc-${line.id}`}
                  type="text"
                  value={line.description}
                  onChange={(e) =>
                    updateLine(line.id, 'description', e.target.value)
                  }
                  placeholder={
                    i === 0
                      ? 'e.g. Bathroom renovation - deposit'
                      : 'e.g. Materials'
                  }
                  maxLength={200}
                  className={`${fieldBase} px-3.5`}
                />
              </div>
              <div className="sm:w-44">
                <label
                  htmlFor={`greg-pay-amount-${line.id}`}
                  className={i === 0 ? labelClass : 'sr-only'}
                >
                  {i === 0 ? 'Amount (EUR)' : `Line ${i + 1} amount`}
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted"
                    aria-hidden
                  >
                    EUR
                  </span>
                  <input
                    id={`greg-pay-amount-${line.id}`}
                    type="number"
                    inputMode="decimal"
                    value={line.amount}
                    onChange={(e) =>
                      updateLine(line.id, 'amount', e.target.value)
                    }
                    placeholder="500"
                    min={0}
                    max={MAX_EUR}
                    step="0.01"
                    className={`${fieldBase} pl-12 pr-3.5`}
                  />
                </div>
              </div>
              {multiLine && (
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  aria-label={`Remove line ${i + 1}`}
                  className="flex h-[46px] w-11 shrink-0 items-center justify-center self-end rounded-lg border border-border-medium text-text-muted transition-colors hover:border-accent-coral hover:text-accent-coral"
                >
                  <X size={16} aria-hidden />
                </button>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={addLine}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary transition-colors hover:text-accent-primary/80"
            >
              <Plus size={15} aria-hidden />
              Add another line
            </button>
            {multiLine && (
              <span className="text-sm text-text-secondary">
                Total{' '}
                <span className="font-semibold text-text-primary">
                  EUR{' '}
                  {total.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2.5">
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
            {invoice && (
              <p className="text-xs leading-relaxed text-text-muted">
                You&apos;ll add your VAT / Tax ID and billing details on the
                secure checkout page.
              </p>
            )}
            <p className="inline-flex items-center gap-2 text-xs text-text-muted">
              <ShieldCheck size={14} className="text-accent-primary" aria-hidden />
              Secure checkout by Stripe. Payments are charged in EUR.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-2.5">
            <button
              type="button"
              onClick={startCheckout}
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta-bg px-6 py-3 font-semibold text-cta-fg transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
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
            <div
              role="img"
              aria-label="Accepted cards: Visa, Mastercard, American Express, Discover"
              className="flex items-center justify-center gap-2 text-text-dim"
            >
              <FaCcVisa className="h-6 w-auto" aria-hidden />
              <FaCcMastercard className="h-6 w-auto" aria-hidden />
              <FaCcAmex className="h-6 w-auto" aria-hidden />
              <FaCcDiscover className="h-6 w-auto" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      {(error || hint) && (
        <p className="mt-3 text-xs text-accent-coral" role="alert">
          {error ?? hint}
        </p>
      )}
    </section>
  );
}

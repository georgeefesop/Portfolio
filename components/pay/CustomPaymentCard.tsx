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

/** Keep in sync with app/api/pay/custom-checkout/route.ts. */
const MIN_EUR = 5;
const MAX_EUR = 10_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldBase =
  'custom-pay-input w-full rounded-lg border border-border-medium bg-bg-tertiary py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const labelClass =
  'custom-pay-label mb-1.5 block text-xs font-medium text-text-muted';

type Line = { id: string; description: string; amount: string };

/**
 * Flagship "name your amount" card on /pay. The box is the form: the buyer's
 * details, what it's for, an amount, and an optional invoice - straight into a
 * one-off Stripe Checkout session.
 */
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
      ? `Total must be between EUR ${MIN_EUR} and EUR ${MAX_EUR.toLocaleString(
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
      amount: total,
      invoice,
      line_count: activeLines.length,
    });
    try {
      const res = await fetch('/api/pay/custom-checkout', {
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

        {/* What for + amount, one line per item */}
        <div className="custom-pay-lines flex flex-col gap-2.5">
          {lines.map((line, i) => (
            <div
              key={line.id}
              className="custom-pay-row flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="custom-pay-field flex-1">
                <label
                  htmlFor={`custom-pay-desc-${line.id}`}
                  className={i === 0 ? labelClass : 'sr-only'}
                >
                  {i === 0 ? "What's this for?" : `Line ${i + 1} description`}
                </label>
                <input
                  id={`custom-pay-desc-${line.id}`}
                  type="text"
                  value={line.description}
                  onChange={(e) =>
                    updateLine(line.id, 'description', e.target.value)
                  }
                  placeholder={
                    i === 0
                      ? 'e.g. Logo design - final payment'
                      : 'e.g. Extra revisions'
                  }
                  maxLength={200}
                  className={`${fieldBase} px-3.5`}
                />
              </div>
              <div className="custom-pay-field sm:w-44">
                <label
                  htmlFor={`custom-pay-amount-${line.id}`}
                  className={i === 0 ? labelClass : 'sr-only'}
                >
                  {i === 0 ? 'Amount (EUR)' : `Line ${i + 1} amount`}
                </label>
                <div className="custom-pay-amount-wrap relative">
                  <span
                    className="custom-pay-currency pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted"
                    aria-hidden
                  >
                    €
                  </span>
                  <input
                    id={`custom-pay-amount-${line.id}`}
                    type="number"
                    inputMode="decimal"
                    value={line.amount}
                    onChange={(e) =>
                      updateLine(line.id, 'amount', e.target.value)
                    }
                    placeholder="250"
                    min={0}
                    max={MAX_EUR}
                    step="0.01"
                    className={`${fieldBase} pl-7 pr-3.5`}
                  />
                </div>
              </div>
              {multiLine && (
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  aria-label={`Remove line ${i + 1}`}
                  className="custom-pay-line-remove flex h-[46px] w-11 shrink-0 items-center justify-center self-end rounded-lg border border-border-medium text-text-muted transition-colors hover:border-accent-coral hover:text-accent-coral"
                >
                  <X size={16} aria-hidden />
                </button>
              )}
            </div>
          ))}

          <div className="custom-pay-lines-foot flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={addLine}
              className="custom-pay-add-line inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary transition-colors hover:text-accent-primary/80"
            >
              <Plus size={15} aria-hidden />
              Add another line
            </button>
            {multiLine && (
              <span className="custom-pay-total text-sm text-text-secondary">
                Total{' '}
                <span className="font-semibold text-text-primary">
                  €
                  {total.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Invoice opt-in + submit */}
        <div className="custom-pay-actions mt-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="custom-pay-aside flex flex-col gap-2.5">
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
            {invoice && (
              <p className="custom-pay-invoice-note text-xs leading-relaxed text-text-muted">
                You&apos;ll add your VAT / Tax ID and billing details on the
                secure checkout page.
              </p>
            )}
            <p className="custom-pay-secure inline-flex items-center gap-2 text-xs text-text-muted">
              <ShieldCheck size={14} className="text-accent-primary" aria-hidden />
              Secure checkout by Stripe. Payments are charged in EUR.
            </p>
          </div>
          <div className="custom-pay-submit flex shrink-0 flex-col items-center gap-2.5">
            <button
              type="button"
              onClick={startCheckout}
              disabled={!canSubmit}
              className="custom-pay-cta inline-flex items-center justify-center gap-2 rounded-lg bg-accent-primary px-6 py-3 font-semibold text-bg-primary transition-colors hover:bg-accent-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="custom-pay-cards flex items-center justify-center gap-2 text-text-dim"
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

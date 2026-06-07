'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Euro } from 'lucide-react';
import { eur } from '@/lib/admin/time';

export default function RateCard({
  currentRateCents,
  defaultDate,
}: {
  currentRateCents: number | null;
  defaultDate: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const eurAmount = Number(amount);
    if (!Number.isFinite(eurAmount) || eurAmount <= 0) {
      setError('Enter a rate in euros.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/admin/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hourly_rate_eur: eurAmount, effective_from: date }),
      });
      if (!res.ok) {
        throw new Error(res.status === 401 ? 'Session expired.' : 'Could not set rate.');
      }
      setOpen(false);
      setAmount('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not set rate.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-secondary p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-tertiary text-accent-primary">
            <Euro size={18} aria-hidden />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Current rate
            </p>
            <p className="text-h4 font-bold tabular-nums text-text-primary">
              {currentRateCents != null ? `EUR ${eur(currentRateCents)}/h` : 'Not set'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-border-medium px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent-primary hover:text-text-primary"
        >
          {open ? 'Cancel' : 'Change'}
        </button>
      </div>

      {open && (
        <form
          onSubmit={submit}
          className="mt-4 flex flex-wrap items-end gap-3 border-t border-border-subtle pt-4"
        >
          <div className="grow">
            <label
              className="mb-1.5 block text-xs font-medium text-text-muted"
              htmlFor="rate_amount"
            >
              New rate (EUR / hour)
            </label>
            <input
              id="rate_amount"
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="85"
              className="w-full rounded-lg border border-border-medium bg-bg-tertiary px-3.5 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary"
            />
          </div>
          <div>
            <label
              className="mb-1.5 block text-xs font-medium text-text-muted"
              htmlFor="rate_from"
            >
              Effective from
            </label>
            <input
              id="rate_from"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-border-medium bg-bg-tertiary px-3.5 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 font-semibold text-bg-primary transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : 'Set rate'}
          </button>
          {error && (
            <p className="w-full text-xs text-accent-coral" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

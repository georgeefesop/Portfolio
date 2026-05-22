'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Loader2, MessageCircle } from 'lucide-react';

export interface RenderOrderRow {
  id: string;
  created_at: string;
  status: string;
  quantity: number;
  amount_total: number | null;
  project_description: string;
  location: string | null;
  whatsapp: string | null;
  style_notes: string | null;
  reference_images: string[] | null;
  customer_name: string | null;
  customer_email: string | null;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function RenderOrders({
  orders: initial,
}: {
  orders: RenderOrderRow[];
}) {
  const [orders, setOrders] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function markDone(id: string) {
    setBusy(id);
    try {
      const res = await fetch('/api/greg/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'fulfilled' }),
      });
      if (res.ok) {
        setOrders((o) =>
          o.map((x) => (x.id === id ? { ...x, status: 'fulfilled' } : x)),
        );
      }
    } catch {
      // Leave the row as-is; Gregory can retry.
    }
    setBusy(null);
  }

  if (orders.length === 0) {
    return (
      <p className="rounded-xl border border-border-subtle bg-bg-secondary p-6 text-sm text-text-muted">
        No render orders yet. They appear here as soon as a customer pays.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((o) => {
        const done = o.status === 'fulfilled';
        const images = o.reference_images ?? [];
        return (
          <div
            key={o.id}
            className={`rounded-xl border p-5 ${
              done
                ? 'border-border-subtle bg-bg-secondary'
                : 'border-accent-primary bg-bg-elevated'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-text-primary">
                  {o.customer_name || 'Customer'}
                  {o.quantity > 1 ? ` - ${o.quantity} renders` : ''}
                </p>
                <p className="text-xs text-text-muted">
                  {fmtDate(o.created_at)}
                  {o.customer_email ? ` · ${o.customer_email}` : ''}
                  {o.amount_total ? ` · EUR ${o.amount_total}` : ''}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                  done
                    ? 'bg-bg-tertiary text-text-muted'
                    : 'bg-accent-primary/15 text-accent-primary'
                }`}
              >
                {done ? 'Done' : 'To do'}
              </span>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm text-text-secondary">
              {o.project_description}
            </p>
            {(o.location || o.style_notes) && (
              <p className="mt-2 text-xs text-text-muted">
                {o.location ? `Location: ${o.location}` : ''}
                {o.location && o.style_notes ? ' · ' : ''}
                {o.style_notes ? `Notes: ${o.style_notes}` : ''}
              </p>
            )}

            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-20 w-28 overflow-hidden rounded-lg border border-border-subtle bg-bg-tertiary"
                  >
                    <Image
                      src={url}
                      alt={`Reference ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {o.whatsapp && (
                <a
                  href={`https://wa.me/${o.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary hover:underline"
                >
                  <MessageCircle size={14} aria-hidden />
                  {o.whatsapp}
                </a>
              )}
              {!done && (
                <button
                  type="button"
                  onClick={() => markDone(o.id)}
                  disabled={busy === o.id}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border-medium px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary disabled:opacity-50"
                >
                  {busy === o.id ? (
                    <Loader2 size={14} className="animate-spin" aria-hidden />
                  ) : (
                    <Check size={14} aria-hidden />
                  )}
                  Mark as done
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

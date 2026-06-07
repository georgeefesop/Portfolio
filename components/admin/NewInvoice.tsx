'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Loader2, Send, FileCheck } from 'lucide-react';
import {
  buildInvoiceModel,
  type InvoiceLineRow as ModelLineRow,
  type InvoiceRow as ModelInvoiceRow,
} from '@/lib/admin/invoice-model';
import { renderInvoiceHtml } from '@/lib/admin/invoice-template';
import type { IssuerBlock } from '@/lib/admin/issuer';
import type { TimeEntryRow } from '@/lib/admin/billing';
import type {
  InvoiceDetail,
  InvoiceListRow,
  InvoiceRow as IssuedInvoiceRow,
} from '@/lib/admin/invoices';
import { eur } from '@/lib/admin/time';
import InvoicePreview from './InvoicePreview';

const field =
  'w-full rounded-lg border border-border-medium bg-bg-tertiary px-3.5 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const labelClass = 'mb-1.5 block text-xs font-medium text-text-muted';

type Props = {
  entries: TimeEntryRow[];
  clientName: string;
  clientLegalName: string | null;
  defaultIssueDate: string;
  defaultDueDate: string;
  issuer: IssuerBlock;
};

/**
 * Pick-entries -> preview -> issue flow.
 *
 * Preview builds the invoice model client-side from the checked rows + the
 * frozen issuer block passed down (draft number, since the real one is
 * assigned by the issue RPC). Issue posts to `/api/admin/invoice`, then
 * re-fetches the issued detail and re-previews with the real number.
 */
export default function NewInvoice({
  entries,
  clientName,
  clientLegalName,
  defaultIssueDate,
  defaultDueDate,
  issuer,
}: Props) {
  const router = useRouter();

  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(entries.map((e) => [e.id, true])),
  );
  const [issueDate, setIssueDate] = useState(defaultIssueDate);
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [notes, setNotes] = useState('');

  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [issued, setIssued] = useState<IssuedInvoiceRow | null>(null);
  const [busy, setBusy] = useState<'idle' | 'preview' | 'issue' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  const selectedEntries = useMemo(
    () => entries.filter((e) => checked[e.id]),
    [entries, checked],
  );

  const selectedTotalCents = useMemo(
    () => selectedEntries.reduce((sum, e) => sum + (e.amount_cents || 0), 0),
    [selectedEntries],
  );

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleAll(value: boolean) {
    setChecked(Object.fromEntries(entries.map((e) => [e.id, value])));
  }

  /** Build the InvoiceModel rows from the checked entries, in date order. */
  function modelLinesFromSelection(): ModelLineRow[] {
    return [...selectedEntries]
      .sort((a, b) => (a.work_date < b.work_date ? -1 : a.work_date > b.work_date ? 1 : 0))
      .map((e) => ({
        work_date: e.work_date,
        description: e.work_done || e.comment || '(work)',
        hours: e.hours,
        rate_cents: e.rate_cents_applied ?? 0,
        amount_cents: e.amount_cents || 0,
      }));
  }

  function previewSelection() {
    if (selectedEntries.length === 0) {
      setError('Tick at least one entry to preview.');
      return;
    }
    setError(null);
    setBusy('preview');
    try {
      const lines = modelLinesFromSelection();
      const dates = lines.map((l) => l.work_date).sort();
      const periodFrom = dates[0] ?? null;
      const periodTo = dates[dates.length - 1] ?? null;
      const draft: ModelInvoiceRow = {
        number: 'EFE-YYYY-(draft)',
        issue_date: issueDate,
        due_date: dueDate,
        period_from: periodFrom,
        period_to: periodTo,
        subtotal_cents: selectedTotalCents,
        vat_rate: 0,
        vat_cents: 0,
        total_cents: selectedTotalCents,
        issuer,
      };
      const html = renderInvoiceHtml(
        buildInvoiceModel(draft, lines, {
          name: clientName,
          legal_name: clientLegalName,
        }),
      );
      setPreviewHtml(html);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not build preview.');
    } finally {
      setBusy('idle');
    }
  }

  async function issueInvoiceNow() {
    if (selectedEntries.length === 0) {
      setError('Tick at least one entry to issue.');
      return;
    }
    setError(null);
    setBusy('issue');
    try {
      const res = await fetch('/api/admin/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryIds: selectedEntries.map((e) => e.id),
          issueDate,
          dueDate,
          vatRate: 0,
          notes,
        }),
      });
      const data = (await res.json()) as IssuedInvoiceRow | { error?: string };
      if (!res.ok || !('id' in data)) {
        const message =
          'error' in data && data.error
            ? data.error
            : res.status === 401
              ? 'Session expired.'
              : 'Could not issue the invoice.';
        throw new Error(message);
      }

      setIssued(data);

      // Refresh preview with the real (frozen) number + line items from the
      // database, not the draft. If the detail fetch fails, fall back to a
      // re-render of the draft model with the frozen header.
      const detailRes = await fetch(`/api/admin/invoice?id=${encodeURIComponent(data.id)}`, {
        method: 'GET',
      });
      if (detailRes.ok) {
        const detail = (await detailRes.json()) as InvoiceDetail;
        const html = renderInvoiceHtml(
          buildInvoiceModel(
            detail.invoice as unknown as ModelInvoiceRow,
            detail.lines as unknown as ModelLineRow[],
            { name: clientName, legal_name: clientLegalName },
          ),
        );
        setPreviewHtml(html);
      }

      // Refresh the list so the new invoice shows up if the user navigates back.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not issue the invoice.');
    } finally {
      setBusy('idle');
    }
  }

  async function markSent() {
    if (!issued) return;
    setError(null);
    setBusy('sent');
    try {
      const res = await fetch('/api/admin/invoice', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: issued.id, action: 'sent' }),
      });
      const data = (await res.json()) as InvoiceListRow | { error?: string };
      if (!res.ok || !('id' in data)) {
        const message =
          'error' in data && data.error ? data.error : 'Could not mark as sent.';
        throw new Error(message);
      }
      setIssued({ ...issued, status: 'sent' });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not mark as sent.');
    } finally {
      setBusy('idle');
    }
  }

  const allChecked = entries.length > 0 && entries.every((e) => checked[e.id]);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border-subtle bg-bg-secondary p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-h5 font-semibold tracking-tight text-text-primary">
              Pick entries to invoice
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              {entries.length} unbilled billable {entries.length === 1 ? 'entry' : 'entries'}
              {entries.length > 0 ? ' in this range' : ''}
            </p>
          </div>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={() => toggleAll(!allChecked)}
              className="text-xs font-medium text-accent-primary hover:underline"
            >
              {allChecked ? 'Untick all' : 'Tick all'}
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="rounded-lg border border-border-subtle bg-bg-tertiary p-4 text-sm text-text-muted">
            No unbilled billable entries in this range. Log time first or widen the range.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border-subtle">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border-subtle text-xs uppercase tracking-wide text-text-muted">
                <tr>
                  <th className="w-10 px-3 py-2.5"></th>
                  <th className="px-3 py-2.5 font-medium">Date</th>
                  <th className="px-3 py-2.5 font-medium">Hours</th>
                  <th className="px-3 py-2.5 font-medium">Work done</th>
                  <th className="px-3 py-2.5 text-right font-medium">EUR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {entries.map((e) => (
                  <tr key={e.id} className="text-text-secondary">
                    <td className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border-medium bg-bg-tertiary accent-accent-primary"
                        checked={!!checked[e.id]}
                        onChange={() => toggle(e.id)}
                        aria-label={`Include entry from ${e.work_date}`}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">{e.work_date}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 tabular-nums">{e.hours}</td>
                    <td className="px-3 py-2.5 text-text-primary">
                      {e.work_done || (
                        <span className="text-text-dim">No description</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums">
                      {eur(e.amount_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-border-subtle bg-bg-tertiary px-3 py-3 text-sm">
              <span className="text-text-muted">
                Selected ({selectedEntries.length})
              </span>
              <span className="font-semibold tabular-nums text-text-primary">
                EUR {eur(selectedTotalCents)}
              </span>
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="issue_date">
              Issue date
            </label>
            <input
              id="issue_date"
              type="date"
              className={field}
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="due_date">
              Due date
            </label>
            <input
              id="due_date"
              type="date"
              className={field}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="invoice_notes">
              Notes (optional)
            </label>
            <input
              id="invoice_notes"
              type="text"
              className={field}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes, not printed on the invoice"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          {!issued && (
            <>
              <button
                type="button"
                onClick={previewSelection}
                disabled={busy !== 'idle' || selectedEntries.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy === 'preview' ? (
                  <Loader2 size={15} className="animate-spin" aria-hidden />
                ) : (
                  <Eye size={15} aria-hidden />
                )}
                Preview
              </button>
              <button
                type="button"
                onClick={issueInvoiceNow}
                disabled={busy !== 'idle' || selectedEntries.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-primary transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy === 'issue' ? (
                  <Loader2 size={15} className="animate-spin" aria-hidden />
                ) : (
                  <FileCheck size={15} aria-hidden />
                )}
                Issue invoice
              </button>
            </>
          )}
          {issued && issued.status !== 'sent' && issued.status !== 'paid' && (
            <button
              type="button"
              onClick={markSent}
              disabled={busy !== 'idle'}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-primary transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === 'sent' ? (
                <Loader2 size={15} className="animate-spin" aria-hidden />
              ) : (
                <Send size={15} aria-hidden />
              )}
              Mark sent
            </button>
          )}
        </div>

        {issued && (
          <p className="mt-4 rounded-lg border border-accent-primary/40 bg-bg-tertiary px-4 py-3 text-sm text-text-primary">
            Issued <span className="font-semibold">{issued.number}</span> &middot; status{' '}
            <span className="font-semibold">{issued.status}</span>
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs text-accent-coral" role="alert">
            {error}
          </p>
        )}
      </section>

      {previewHtml && <InvoicePreview html={previewHtml} />}
    </div>
  );
}

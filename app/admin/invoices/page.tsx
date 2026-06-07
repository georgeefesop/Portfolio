import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Plus } from 'lucide-react';
import { isAdmin } from '@/lib/admin/auth';
import LoginForm from '@/components/admin/LoginForm';
import { getClientId } from '@/lib/admin/billing';
import { listInvoices, type InvoiceListRow } from '@/lib/admin/invoices';
import { eur } from '@/lib/admin/time';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Always reflect the latest invoice list (refresh after issuing).
export const dynamic = 'force-dynamic';

const CLIENT_NAME = 'Chris Heinz';

const STATUS_CLASS: Record<InvoiceListRow['status'], string> = {
  issued: 'bg-bg-tertiary text-text-secondary',
  sent: 'bg-bg-tertiary text-accent-primary',
  paid: 'bg-bg-tertiary text-accent-primary',
  void: 'bg-bg-tertiary text-accent-coral',
};

function formatPeriod(from: string | null, to: string | null): string {
  if (from && to) return `${from} - ${to}`;
  if (from) return from;
  if (to) return to;
  return '-';
}

export default async function AdminInvoicesPage() {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
        <LoginForm />
      </main>
    );
  }

  let invoices: InvoiceListRow[] = [];
  let loadError: string | null = null;

  try {
    const clientId = await getClientId(CLIENT_NAME);
    invoices = await listInvoices(clientId);
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Could not load invoices.';
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-28 sm:px-6 md:pt-32">
      <div className="mb-8">
        <Link
          href="/admin"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft size={13} aria-hidden />
          Admin
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-h2 leading-tight tracking-tight text-text-primary">
              Invoices
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary">
              {CLIENT_NAME} &middot; issued invoices
            </p>
          </div>
          <Link
            href="/admin/invoices/new"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-bg-primary transition-all hover:brightness-95"
          >
            <Plus size={15} aria-hidden />
            New invoice
          </Link>
        </div>
      </div>

      {loadError ? (
        <p className="rounded-2xl border border-border-subtle bg-bg-secondary p-6 text-sm text-accent-coral">
          {loadError}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-subtle text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-6">Number</th>
                <th className="px-4 py-3 font-medium">Issued</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium sm:px-6">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-text-muted sm:px-6"
                  >
                    <FileText
                      size={20}
                      aria-hidden
                      className="mx-auto mb-2 text-text-dim"
                    />
                    No invoices yet. Start one from a week of tracked hours.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="text-text-secondary">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-text-primary sm:px-6">
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="transition-colors hover:text-accent-primary"
                      >
                        {inv.number}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{inv.issue_date}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatPeriod(inv.period_from, inv.period_to)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${STATUS_CLASS[inv.status]}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums sm:px-6">
                      EUR {eur(inv.total_cents)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { isAdmin } from '@/lib/admin/auth';
import LoginForm from '@/components/admin/LoginForm';
import QuickAddForm from '@/components/admin/QuickAddForm';
import {
  getClientId,
  currentBillingWeek,
  weekRange,
  listTimeEntries,
  weekSummary,
  type TimeEntryRow,
  type WeekSummary,
} from '@/lib/admin/billing';
import { eur } from '@/lib/admin/time';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Always reflect the latest entries (router.refresh() after an add).
export const dynamic = 'force-dynamic';

const CLIENT_NAME = 'Chris Heinz';

export default async function AdminTimePage() {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
        <LoginForm />
      </main>
    );
  }

  const week = currentBillingWeek();
  const { from, to } = weekRange(week);

  let entries: TimeEntryRow[] = [];
  let summary: WeekSummary = {
    entries: 0,
    total_hours: 0,
    billable_hours: 0,
    billable_cents: 0,
  };
  let loadError: string | null = null;

  try {
    const clientId = await getClientId(CLIENT_NAME);
    [entries, summary] = await Promise.all([
      listTimeEntries(clientId, from, to),
      weekSummary(clientId, week),
    ]);
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Could not load time entries.';
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
        <h1 className="font-serif text-h2 leading-tight tracking-tight text-text-primary">
          Time tracking
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          {CLIENT_NAME} &middot; week {week}
        </p>
      </div>

      <div className="mb-8">
        <QuickAddForm />
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
                <th className="px-4 py-3 font-medium sm:px-6">Date</th>
                <th className="px-4 py-3 font-medium">Hours</th>
                <th className="px-4 py-3 font-medium">Work done</th>
                <th className="px-4 py-3 text-right font-medium sm:px-6">EUR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-text-muted sm:px-6"
                  >
                    No entries this week yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="text-text-secondary">
                    <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                      {entry.work_date}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                      {entry.hours}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {entry.work_done || (
                        <span className="text-text-dim">No description</span>
                      )}
                      {!entry.billable && (
                        <span className="ml-2 rounded bg-bg-tertiary px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">
                          Non-billable
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums sm:px-6">
                      {eur(entry.amount_cents)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-border-subtle px-4 py-4 text-sm sm:px-6">
            <span className="text-text-muted">This week</span>
            <span className="font-semibold tabular-nums text-text-primary">
              {summary.billable_hours}h / EUR {eur(summary.billable_cents)}
            </span>
          </div>
        </div>
      )}
    </main>
  );
}

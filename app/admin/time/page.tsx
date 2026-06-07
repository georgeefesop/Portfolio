import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { isAdmin } from '@/lib/admin/auth';
import LoginForm from '@/components/admin/LoginForm';
import QuickAddForm from '@/components/admin/QuickAddForm';
import TimeTable from '@/components/admin/TimeTable';
import {
  getClientId,
  currentBillingWeek,
  weekRange,
  listTimeEntries,
  resolveRate,
  type TimeEntryRow,
} from '@/lib/admin/billing';
import RateCard from '@/components/admin/RateCard';
import { defaultWorkDate } from '@/lib/admin/time';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Always reflect the latest entries (router.refresh() after add/edit/delete).
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
  const today = defaultWorkDate();

  let entries: TimeEntryRow[] = [];
  let currentRateCents: number | null = null;
  let loadError: string | null = null;

  try {
    const clientId = await getClientId(CLIENT_NAME);
    [entries, currentRateCents] = await Promise.all([
      listTimeEntries(clientId, from, to),
      resolveRate(clientId, today),
    ]);
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Could not load time entries.';
  }

  return (
    <main className="w-full px-4 pb-24 pt-28 sm:px-6 md:pt-32">
      <div className="mx-auto max-w-4xl">
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

        <div className="mb-6">
          <RateCard currentRateCents={currentRateCents} defaultDate={today} />
        </div>

        <div className="mb-8">
          <QuickAddForm />
        </div>
      </div>

      {loadError ? (
        <div className="mx-auto max-w-4xl">
          <p className="rounded-2xl border border-border-subtle bg-bg-secondary p-6 text-sm text-accent-coral">
            {loadError}
          </p>
        </div>
      ) : (
        <TimeTable entries={entries} />
      )}
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { isAdmin } from '@/lib/admin/auth';
import LoginForm from '@/components/admin/LoginForm';
import NewInvoice from '@/components/admin/NewInvoice';
import {
  currentBillingWeek,
  getClientId,
  listClients,
  listTimeEntries,
  weekRange,
  type ClientRow,
  type TimeEntryRow,
} from '@/lib/admin/billing';
import { issuerBlock } from '@/lib/admin/issuer';
import { defaultWorkDate } from '@/lib/admin/time';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Always reflect the freshest list of unbilled entries.
export const dynamic = 'force-dynamic';

const CLIENT_NAME = 'Chris Heinz';

// Add days to an ISO date string (YYYY-MM-DD) in UTC. Used for the default
// due date (+7 from issue).
function addDays(iso: string, days: number): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export default async function NewInvoicePage() {
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
  const dueDefault = addDays(today, 7);

  let entries: TimeEntryRow[] = [];
  let clientRow: ClientRow | null = null;
  let loadError: string | null = null;

  try {
    const clientId = await getClientId(CLIENT_NAME);
    const [unbilled, clients] = await Promise.all([
      listTimeEntries(clientId, from, to, true),
      listClients(),
    ]);
    entries = unbilled.filter((e) => e.billable);
    clientRow = clients.find((c) => c.id === clientId) ?? null;
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Could not load unbilled entries.';
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-28 sm:px-6 md:pt-32">
      <div className="mb-8">
        <Link
          href="/admin/invoices"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft size={13} aria-hidden />
          Invoices
        </Link>
        <h1 className="font-serif text-h2 leading-tight tracking-tight text-text-primary">
          New invoice
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          {CLIENT_NAME} &middot; unbilled billable hours, week {week}
        </p>
      </div>

      {loadError ? (
        <p className="rounded-2xl border border-border-subtle bg-bg-secondary p-6 text-sm text-accent-coral">
          {loadError}
        </p>
      ) : (
        <NewInvoice
          entries={entries}
          clientName={clientRow?.name ?? CLIENT_NAME}
          clientLegalName={clientRow?.legal_name ?? null}
          defaultIssueDate={today}
          defaultDueDate={dueDefault}
          issuer={issuerBlock()}
        />
      )}
    </main>
  );
}

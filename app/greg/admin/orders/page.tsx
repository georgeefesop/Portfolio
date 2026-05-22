import type { Metadata } from 'next';
import { isAdmin } from '@/lib/greg/admin-auth';
import LoginForm from '@/components/greg/invoice/LoginForm';
import AdminShell from '@/components/greg/admin/AdminShell';
import { getGregSupabase } from '@/lib/greg/supabase';
import RenderOrders, {
  type RenderOrderRow,
} from '@/components/greg/admin/RenderOrders';

export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false },
};

interface PaymentRow {
  id: string;
  paid_at: string | null;
  customer_name: string | null;
  customer_email: string | null;
  amount_total: number | null;
  currency: string | null;
  description: string | null;
  source: string | null;
}

const SOURCE_LABELS: Record<string, string> = {
  greg_renders: 'Design render',
  greg_custom_pay: 'Custom payment',
  greg_invoice: 'Invoice',
};

function fmtDate(iso: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function fmtAmount(amt: number | null, cur: string | null): string {
  if (amt == null) return '-';
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: (cur ?? 'eur').toUpperCase(),
  }).format(amt);
}

export default async function AdminOrdersPage() {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
        <LoginForm
          title="G.E. Revamp admin"
          subtitle="Private area. Sign in to see your orders."
        />
      </main>
    );
  }

  const supabase = getGregSupabase();
  let renderOrders: RenderOrderRow[] = [];
  let payments: PaymentRow[] = [];

  if (supabase) {
    const [ro, pm] = await Promise.all([
      supabase
        .from('greg_render_orders')
        .select('*')
        .in('status', ['paid', 'fulfilled'])
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('greg_revamp_payments')
        .select('*')
        .order('paid_at', { ascending: false })
        .limit(100),
    ]);
    renderOrders = (ro.data as RenderOrderRow[] | null) ?? [];
    payments = (pm.data as PaymentRow[] | null) ?? [];
  }

  return (
    <AdminShell
      title="Orders"
      description="Payments and design render orders as they come in."
    >
      <h2 className="mb-3 text-h4 font-bold tracking-tight text-text-primary">
        Design render orders
      </h2>
      <RenderOrders orders={renderOrders} />

      <h2 className="mb-3 mt-10 text-h4 font-bold tracking-tight text-text-primary">
        All payments
      </h2>
      {payments.length === 0 ? (
        <p className="rounded-xl border border-border-subtle bg-bg-secondary p-6 text-sm text-text-muted">
          No payments yet. Card payments appear here once a customer checks out.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-secondary text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">For</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-border-subtle text-text-secondary"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {fmtDate(p.paid_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="block text-text-primary">
                      {p.customer_name || 'Customer'}
                    </span>
                    {p.customer_email && (
                      <span className="block text-xs text-text-muted">
                        {p.customer_email}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{p.description || '-'}</td>
                  <td className="px-4 py-3">
                    {p.source ? SOURCE_LABELS[p.source] ?? p.source : '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-text-primary">
                    {fmtAmount(p.amount_total, p.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

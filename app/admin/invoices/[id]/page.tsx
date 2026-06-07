import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { isAdmin } from '@/lib/admin/auth';
import LoginForm from '@/components/admin/LoginForm';
import InvoicePreview from '@/components/admin/InvoicePreview';
import { listClients } from '@/lib/admin/billing';
import { getInvoice, type InvoiceDetail } from '@/lib/admin/invoices';
import {
  buildInvoiceModel,
  type InvoiceRow as ModelInvoiceRow,
  type InvoiceLineRow as ModelLineRow,
} from '@/lib/admin/invoice-model';
import { renderInvoiceHtml } from '@/lib/admin/invoice-template';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

// View a single issued (or void) invoice: the frozen header + line items
// rendered through the same A4 template, with print-to-PDF. The
// historical-invoices view.
export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
        <LoginForm />
      </main>
    );
  }

  const { id } = await params;

  let detail: InvoiceDetail | null = null;
  let loadError: string | null = null;
  try {
    detail = await getInvoice(id);
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Could not load the invoice.';
  }
  // A genuinely missing invoice is a 404; notFound() must sit outside any
  // try/catch so its control-flow signal reaches the Next boundary.
  if (!loadError && !detail) {
    notFound();
  }

  let html: string | null = null;
  let number = '';
  let status = '';
  if (detail) {
    const inv = detail.invoice;
    const lines = detail.lines;
    try {
      const clients = await listClients();
      const client = clients.find((c) => c.id === inv.client_id) ?? null;
      number = inv.number;
      status = inv.status;
      html = renderInvoiceHtml(
        buildInvoiceModel(
          inv as unknown as ModelInvoiceRow,
          lines as unknown as ModelLineRow[],
          { name: client?.name ?? 'Client', legal_name: client?.legal_name ?? null },
        ),
      );
    } catch (err) {
      loadError = err instanceof Error ? err.message : 'Could not render the invoice.';
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-28 sm:px-6 md:pt-32">
      <div className="mb-6">
        <Link
          href="/admin/invoices"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft size={13} aria-hidden />
          Invoices
        </Link>
        <h1 className="font-serif text-h2 leading-tight tracking-tight text-text-primary">
          {number || 'Invoice'}
        </h1>
        {status && (
          <p className="mt-1.5 text-sm text-text-secondary">Status: {status}</p>
        )}
      </div>

      {loadError ? (
        <p className="rounded-2xl border border-border-subtle bg-bg-secondary p-6 text-sm text-accent-coral">
          {loadError}
        </p>
      ) : (
        html && <InvoicePreview html={html} />
      )}
    </main>
  );
}

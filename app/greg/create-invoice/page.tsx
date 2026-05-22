import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { isAdmin } from '@/lib/greg/admin-auth';
import LoginForm from '@/components/greg/invoice/LoginForm';
import InvoiceTool from '@/components/greg/invoice/InvoiceTool';

export const metadata: Metadata = {
  title: 'Invoice tool',
  robots: { index: false, follow: false },
};

export default async function CreateInvoicePage() {
  const authed = await isAdmin();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
      {authed ? (
        <>
          <Link
            href="/admin"
            className="mb-6 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={13} aria-hidden />
            Admin
          </Link>
          <InvoiceTool />
        </>
      ) : (
        <LoginForm
          title="G.E. Revamp admin"
          subtitle="Private area. Sign in to create payment requests."
        />
      )}
    </main>
  );
}

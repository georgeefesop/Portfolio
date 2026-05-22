import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getGregStripe } from '@/lib/greg/stripe';
import { WhatsAppButton } from '@/components/greg/WhatsApp';
import PayTracker from '@/components/greg/pay/PayTracker';

export const metadata: Metadata = {
  title: 'Payment confirmed',
  description: 'Thank you for your payment to G.E. Revamp Services.',
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

async function loadSession(sessionId: string) {
  try {
    const session = await getGregStripe().checkout.sessions.retrieve(sessionId);
    return {
      paid:
        session.payment_status === 'paid' || session.status === 'complete',
      email: session.customer_details?.email ?? null,
      amount: session.amount_total,
      currency: session.currency,
      reason: (session.metadata?.custom_reason as string | undefined) ?? null,
      source: (session.metadata?.source as string | undefined) ?? null,
      invoiceRequested: session.metadata?.invoice_requested === 'yes',
    };
  } catch {
    return null;
  }
}

export default async function GregPaySuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams;
  const session = session_id ? await loadSession(session_id) : null;
  const confirmed = Boolean(session?.paid);
  const isRenderOrder = session?.source === 'greg_renders';

  const amountLabel =
    session?.amount != null && session.currency
      ? new Intl.NumberFormat('en-IE', {
          style: 'currency',
          currency: session.currency.toUpperCase(),
        }).format(session.amount / 100)
      : null;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col px-4 pb-20 pt-32 sm:px-6 md:pt-40">
      {confirmed && (
        <PayTracker
          amount={session?.amount != null ? session.amount / 100 : null}
          currency={session?.currency ?? null}
        />
      )}

      <div className="rounded-2xl border border-border-subtle bg-bg-secondary p-8 text-center md:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/15">
          <CheckCircle2 size={34} className="text-accent-primary" aria-hidden />
        </div>

        <p className="eyebrow">{confirmed ? 'Payment confirmed' : 'Thank you'}</p>
        <h1 className="mt-2 font-serif text-h2 leading-[1.05] tracking-tight text-text-primary">
          {confirmed ? 'Your payment went through' : 'Payment received'}
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-text-secondary">
          Thank you for your payment to G.E. Revamp Services
          {session?.reason ? (
            <>
              {' '}
              for <strong className="text-text-primary">{session.reason}</strong>
            </>
          ) : null}
          {amountLabel ? <> ({amountLabel})</> : null}. A receipt
          {session?.invoiceRequested ? ' and invoice' : ''} is on the way to
          {session?.email ? (
            <>
              {' '}
              <strong className="text-text-primary">{session.email}</strong>
            </>
          ) : (
            <> your inbox</>
          )}
          .
          {isRenderOrder ? (
            <>
              {' '}
              Gregory has your brief and reference photos, and will start on
              your render today.
            </>
          ) : null}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <WhatsAppButton location="pay_success">
            Message G.E. Revamp
          </WhatsAppButton>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            Back to the homepage
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>

      {!session_id && (
        <p className="mt-6 text-center text-xs text-text-dim">
          If you just paid and landed here, your payment still went through.
          Check your email for the receipt.
        </p>
      )}
    </main>
  );
}

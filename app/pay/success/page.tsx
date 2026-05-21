import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { getPayStripe } from '@/lib/pay/stripe';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Payment confirmed - efesop',
  description: 'Thank you for your purchase.',
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

/** Pull the buyer-facing details off the completed Checkout Session. */
async function loadSession(sessionId: string) {
  try {
    const session = await getPayStripe().checkout.sessions.retrieve(sessionId);
    return {
      paid: session.payment_status === 'paid' || session.status === 'complete',
      email: session.customer_details?.email ?? null,
      name: session.customer_details?.name ?? null,
      amount: session.amount_total,
      currency: session.currency,
      offeringName:
        (session.metadata?.offering_name as string | undefined) ?? null,
    };
  } catch {
    return null;
  }
}

export default async function PaySuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;
  const session = session_id ? await loadSession(session_id) : null;

  const amountLabel =
    session?.amount != null && session.currency
      ? new Intl.NumberFormat('en-IE', {
          style: 'currency',
          currency: session.currency.toUpperCase(),
        }).format(session.amount / 100)
      : null;

  const confirmed = Boolean(session?.paid);

  return (
    <main className="pay-success-page flex min-h-screen flex-col bg-bg-primary">
      <div className="pay-success-shell mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-16 pt-32 sm:px-6">
        <div className="pay-success-card rounded-2xl border border-border-subtle bg-bg-secondary p-8 text-center md:p-12">
          <div className="pay-success-icon mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/15">
            <CheckCircle2 size={34} className="text-accent-primary" aria-hidden />
          </div>

          <p className="pay-success-eyebrow font-serif text-lg italic text-text-muted">
            {confirmed ? 'Payment confirmed' : 'Thank you'}
          </p>
          <h1 className="pay-success-heading mt-2 font-serif text-h2 leading-[1.05] tracking-tight text-text-primary">
            {confirmed ? "You're all set" : 'Order received'}
          </h1>

          <p className="pay-success-body mx-auto mt-5 max-w-md text-base leading-relaxed text-text-secondary">
            {session?.offeringName ? (
              <>
                Thanks for buying{' '}
                <strong className="text-text-primary">
                  {session.offeringName}
                </strong>
                {amountLabel ? <> ({amountLabel})</> : null}.{' '}
              </>
            ) : (
              <>Thanks for your purchase. </>
            )}
            A receipt is on its way to
            {session?.email ? (
              <>
                {' '}
                <strong className="text-text-primary">{session.email}</strong>
              </>
            ) : (
              <> your inbox</>
            )}
            . I&apos;ll be in touch shortly to kick things off.
          </p>

          {/* What happens next */}
          <div className="pay-success-next mt-8 rounded-xl border border-border-subtle/70 bg-bg-tertiary/50 p-5 text-left">
            <p className="pay-success-next-title mb-2 text-sm font-semibold text-text-primary">
              What happens next
            </p>
            <ol className="pay-success-next-list space-y-1.5 text-sm text-text-secondary">
              <li>1. You&apos;ll get a Stripe receipt by email.</li>
              <li>
                2. I&apos;ll email you within one working day to gather the brief.
              </li>
              <li>3. Work starts as soon as the brief is confirmed.</li>
            </ol>
          </div>

          <div className="pay-success-actions mt-8 flex flex-col items-center gap-3">
            <a
              href="mailto:george.efesop@gmail.com?subject=My%20order%20-%20brief"
              className="pay-success-cta inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cta-bg py-3.5 font-bold text-cta-fg transition-all hover:brightness-95 sm:w-auto sm:px-7"
            >
              <Mail size={18} aria-hidden />
              Send me your brief
            </a>
            <Link
              href="/"
              className="pay-success-home inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              Back to efesop.com
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>

        {!session_id && (
          <p className="pay-success-note mt-6 text-center text-xs text-text-dim">
            No order reference found. If you just paid and landed here, your
            payment still went through - check your email for the receipt.
          </p>
        )}
      </div>

      <Footer />
    </main>
  );
}

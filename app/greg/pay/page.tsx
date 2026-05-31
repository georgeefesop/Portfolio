import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
// Temporarily disabled: design-render upsell not working properly yet.
// Reactivate by restoring this import, the uploadsEnabled computation, and
// the <RenderProduct /> line in the product grid below.
// import RenderProduct from '@/components/greg/pay/RenderProduct';
import CustomPaymentCard from '@/components/greg/pay/CustomPaymentCard';
import OfferingCard from '@/components/greg/pay/OfferingCard';
import { WhatsAppButton } from '@/components/greg/WhatsApp';
import { getContent } from '@/lib/greg/content-store';
import {
  payContent,
  services as defaultServices,
  type GregService,
} from '@/data/greg/content';
import { GREG, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/greg/site';

export const metadata: Metadata = {
  title: 'Pay online',
  description: 'Pay G.E. Revamp Services securely by card.',
  alternates: { canonical: `${GREG.siteUrl}/pay` },
};

export default async function GregPayPage() {
  // Render product temporarily disabled - see note on the import above.
  // const uploadsEnabled = Boolean(
  //   process.env.GREG_SUPABASE_URL && process.env.GREG_SUPABASE_SERVICE_KEY,
  // );
  const services = await getContent<GregService[]>(
    'services',
    defaultServices,
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
      <header className="mb-10">
        <p className="eyebrow mb-2">{payContent.eyebrow}</p>
        <h1 className="font-serif text-h1 leading-[0.98] tracking-tight text-text-primary">
          {payContent.heading}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary md:text-lg">
          {payContent.intro}
        </p>
      </header>

      {/* Pay an agreed amount - primary action, kept at the top */}
      <CustomPaymentCard />

      {/* Secure checkout / Powered by Stripe */}
      <section className="mt-8 rounded-2xl border border-border-subtle bg-bg-secondary p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex flex-wrap items-center gap-2 text-lg font-semibold text-text-primary">
              <ShieldCheck
                size={18}
                className="text-accent-primary"
                aria-hidden
              />
              <span>Secure checkout</span>
              <img
                src="/powered-by-stripe.png"
                alt="Powered by Stripe"
                className="h-[2.4rem] w-auto"
              />
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
              Card payments are processed by Stripe and charged in EUR. A
              receipt is emailed to you the moment payment clears.
            </p>
          </div>
          <WhatsAppButton
            location="pay_secure_box"
            message={WHATSAPP_DEFAULT_MESSAGE}
            variant="outline"
            className="shrink-0"
          >
            Ask a question
          </WhatsAppButton>
        </div>
      </section>

      {/* Product grid - the service offerings. Render product temporarily
          disabled (not working properly yet); reactivate by uncommenting the
          <RenderProduct /> line below and its import + uploadsEnabled above. */}
      <div className="mt-14 flex flex-col gap-6">
        {/* <RenderProduct uploadsEnabled={uploadsEnabled} /> */}
        {services.map((service) => (
          <OfferingCard key={service.id} service={service} />
        ))}
      </div>

      <section className="mt-12 rounded-2xl border border-border-subtle bg-bg-secondary p-6 text-center md:p-8">
        <h2 className="text-lg font-bold text-text-primary">
          Not sure what to pay yet?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
          Message us on WhatsApp and Gregory will visit, look at the job, and
          give you a clear quote with no obligation.
        </p>
        <div className="mt-5 flex justify-center">
          <WhatsAppButton location="pay_footer" message={WHATSAPP_DEFAULT_MESSAGE}>
            Get a free quote
          </WhatsAppButton>
        </div>
      </section>
    </main>
  );
}

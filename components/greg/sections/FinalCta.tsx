import FadeIn from '@/components/motion/FadeIn';
import { Mail, Phone } from 'lucide-react';
import { WhatsAppButton } from '../WhatsApp';
import { finalCtaContent } from '@/data/greg/content';
import { GREG, GREG_TEL, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/greg/site';

export default function FinalCta() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-border-subtle bg-bg-hero py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <FadeIn>
          <h2 className="font-serif text-h1 leading-[0.98] tracking-tight text-text-primary">
            {finalCtaContent.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
            {finalCtaContent.body}
          </p>

          <div className="mt-8 flex justify-center">
            <WhatsAppButton
              location="final_cta"
              message={WHATSAPP_DEFAULT_MESSAGE}
              className="text-base"
            >
              {finalCtaContent.cta}
            </WhatsAppButton>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-muted">
            <a
              href={GREG_TEL}
              className="inline-flex items-center gap-2 transition-colors hover:text-accent-primary"
            >
              <Phone size={14} aria-hidden />
              {GREG.phoneDisplay}
            </a>
            <a
              href={`mailto:${GREG.email}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-accent-primary"
            >
              <Mail size={14} aria-hidden />
              {GREG.email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

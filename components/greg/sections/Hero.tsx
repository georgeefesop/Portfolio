import { ArrowRight, ShieldCheck } from 'lucide-react';
import { WhatsAppButton } from '../WhatsApp';
import BeforeAfterSlider from '../BeforeAfterSlider';
import {
  heroContent as defaultHero,
  type HeroContent,
} from '@/data/greg/content';
import { WHATSAPP_DEFAULT_MESSAGE } from '@/lib/greg/site';

export default function Hero({ hero = defaultHero }: { hero?: HeroContent }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-bg-hero pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div className="hero-grid absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <p className="eyebrow mb-3">{hero.eyebrow}</p>
            <h1 className="font-serif text-h1 leading-[0.98] tracking-tight text-text-primary">
              {hero.titleLead}
              <span className="italic font-normal text-accent-primary">
                {hero.titleAccent}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
              {hero.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppButton location="hero" message={WHATSAPP_DEFAULT_MESSAGE}>
                {hero.primaryCta}
              </WhatsAppButton>
              <a
                href="#projects"
                className="greg-para inline-flex items-center justify-center gap-2 bg-bg-tertiary px-12 py-3.5 font-semibold text-text-primary transition-colors hover:text-accent-primary"
              >
                {hero.secondaryCta}
                <ArrowRight size={16} aria-hidden />
              </a>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 text-sm text-text-muted">
              <ShieldCheck size={15} className="text-accent-primary" aria-hidden />
              {hero.trustLine}
            </p>
          </div>

          {/* Visual */}
          <div className="relative">
            <BeforeAfterSlider
              beforeSrc={hero.beforeImage || defaultHero.beforeImage}
              afterSrc={hero.afterImage || defaultHero.afterImage}
              beforeAlt="Dated kitchen in a traditional Cyprus stone house"
              afterAlt="The same kitchen after a full modern renovation"
              className="w-full rounded-2xl border border-border-subtle"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

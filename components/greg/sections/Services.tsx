import FadeIn from '@/components/motion/FadeIn';
import { Check } from 'lucide-react';
import { type GregService, servicesIntro } from '@/data/greg/content';
import ServiceIcon from '@/components/greg/ServiceIcon';

export default function Services({ services }: { services: GregService[] }) {
  return (
    <section id="services" className="scroll-mt-24 bg-bg-primary py-14 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-10 md:mb-12">
            <h2 className="font-serif text-h1 leading-[0.98] tracking-tight text-text-primary">
              {servicesIntro.heading}
            </h2>
            <p className="mt-3 max-w-xl text-base text-text-secondary md:text-lg">
              {servicesIntro.sub}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {services.map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.1}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 md:p-7 ${
                  service.featured
                    ? 'border-accent-primary bg-bg-elevated shadow-lg shadow-accent-primary/10'
                    : 'border-border-subtle bg-bg-secondary hover:border-accent-primary/45'
                }`}
              >
                {service.featured && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-accent-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-primary">
                    Most requested
                  </span>
                )}
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-bg-tertiary text-accent-primary">
                  <ServiceIcon id={service.id} size={20} />
                </div>
                <h3 className="text-h4 font-bold leading-tight tracking-tight text-text-primary">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
                  {service.description}
                </p>
                <ul className="mt-4 space-y-2 border-t border-border-subtle/70 pt-4">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-accent-primary"
                        aria-hidden
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

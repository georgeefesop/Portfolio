import FadeIn from '@/components/motion/FadeIn';
import { processSteps, processIntro } from '@/data/greg/content';

export default function Process() {
  return (
    <section
      id="process"
      className="scroll-mt-24 border-y border-border-subtle bg-bg-hero py-14 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-10 max-w-2xl md:mb-14">
            <h2 className="font-serif text-h1 leading-[0.98] tracking-tight text-text-primary">
              {processIntro.heading}
            </h2>
            <p className="mt-3 text-base text-text-secondary md:text-lg">
              {processIntro.sub}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.1}>
              <div className="relative h-full overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-bg-tertiary text-accent-primary">
                  <step.icon size={18} aria-hidden />
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
                <span
                  className="pointer-events-none absolute right-3 top-3 font-mono text-5xl font-bold text-text-primary opacity-[0.07]"
                  aria-hidden
                >
                  {step.number}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

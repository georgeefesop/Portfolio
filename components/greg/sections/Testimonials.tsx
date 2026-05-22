import FadeIn from '@/components/motion/FadeIn';
import { Star, Quote } from 'lucide-react';
import { type GregTestimonial, testimonialsIntro } from '@/data/greg/content';

export default function Testimonials({
  testimonials,
}: {
  testimonials: GregTestimonial[];
}) {
  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-bg-secondary py-14 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-10 max-w-2xl md:mb-14">
            <h2 className="font-serif text-h1 leading-[0.98] tracking-tight text-text-primary">
              {testimonialsIntro.heading}
            </h2>
            <p className="mt-3 text-base text-text-secondary md:text-lg">
              {testimonialsIntro.sub}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <figure className="relative flex h-full flex-col rounded-2xl border border-border-subtle bg-bg-primary p-7">
                <Quote
                  size={40}
                  className="absolute right-6 top-6 rotate-180 text-bg-tertiary"
                  aria-hidden
                />
                {item.placeholder && (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-accent-primary/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-primary">
                    Placeholder
                  </span>
                )}
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      size={15}
                      className="text-accent-primary"
                      fill="currentColor"
                      aria-hidden
                    />
                  ))}
                </div>
                <blockquote className="relative z-10 flex-1 text-sm leading-relaxed text-text-secondary">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border-subtle/70 pt-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-tertiary font-bold text-text-muted">
                    {item.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-text-primary">
                      {item.name}
                    </span>
                    <span className="block text-xs text-text-muted">
                      {item.project}, {item.location}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

import FadeIn from '@/components/motion/FadeIn';
import { aboutContent } from '@/data/greg/content';

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-bg-primary py-14 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Copy */}
            <div className="lg:col-span-7">
              <h2 className="font-serif text-h1 leading-[0.98] tracking-tight text-text-primary">
                {aboutContent.heading}
                <span className="italic font-normal text-accent-primary">
                  {aboutContent.headingAccent}
                </span>
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-text-secondary md:text-lg">
                {aboutContent.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Photo */}
            <div
              className="min-h-[280px] rounded-2xl border border-border-subtle bg-cover bg-center lg:col-span-5"
              style={{ backgroundImage: "url('/greg/greg-about.jpg')" }}
              role="img"
              aria-label="Gregory Efesopoulos on a building site"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

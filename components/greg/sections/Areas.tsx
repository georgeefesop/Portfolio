import FadeIn from '@/components/motion/FadeIn';
import { MapPin } from 'lucide-react';
import { areasContent } from '@/data/greg/content';

export default function Areas() {
  return (
    <section className="bg-bg-primary pb-14 md:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="rounded-2xl border border-border-subtle bg-bg-secondary p-8 md:p-10">
            <h2 className="font-serif text-h3 leading-tight tracking-tight text-text-primary">
              {areasContent.heading}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">
              {areasContent.body}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {areasContent.areas.map((area) => (
                <li
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-medium bg-bg-tertiary px-3.5 py-1.5 text-sm font-medium text-text-secondary"
                >
                  <MapPin size={13} className="text-accent-primary" aria-hidden />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

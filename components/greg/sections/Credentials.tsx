import FadeIn from '@/components/motion/FadeIn';
import { credentials } from '@/data/greg/content';

export default function Credentials() {
  return (
    <section className="border-y border-border-subtle/60 bg-bg-primary py-8 md:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {credentials.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-tertiary text-accent-primary">
                  <item.icon size={18} aria-hidden />
                </span>
                <span className="text-sm font-medium leading-snug text-text-secondary">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

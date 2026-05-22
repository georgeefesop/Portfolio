import type { LegalDoc } from '@/data/greg/legal';

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
      <h1 className="font-serif text-h1 leading-[0.98] tracking-tight text-text-primary">
        {doc.title}
      </h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: {doc.updated}</p>
      <p className="mt-5 text-base leading-relaxed text-text-secondary">
        {doc.intro}
      </p>

      <div className="mt-10 space-y-8">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-h4 font-bold leading-tight tracking-tight text-text-primary">
              {section.heading}
            </h2>
            {section.body.map((para, i) => (
              <p
                key={i}
                className="mt-2.5 text-sm leading-relaxed text-text-secondary md:text-base"
              >
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}

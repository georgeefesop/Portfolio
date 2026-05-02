import {
    Inter,
    Fraunces,
    Newsreader,
    Instrument_Serif,
    Bricolage_Grotesque,
    Crimson_Pro,
    Cormorant,
    Playfair_Display,
    Geist,
    Geist_Mono,
} from 'next/font/google';

// Body sans for all options.
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });

// Display options.
const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
const newsreader = Newsreader({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: ['400'], style: ['normal', 'italic'] });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['400', '500', '600'] });
const crimsonPro = Crimson_Pro({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
const cormorant = Cormorant({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600'] });
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'] });

type Pairing = {
    name: string;
    description: string;
    displayFont: string;
    displayClass: string;
    bodyClass: string;
    labelClass: string;
    italicClass?: string;
};

const pairings: Pairing[] = [
    {
        name: 'Inter only (current state)',
        description: 'What the site looks like today. Clean, capable, totally generic.',
        displayFont: 'Inter',
        displayClass: inter.className,
        bodyClass: inter.className,
        labelClass: inter.className,
    },
    {
        name: 'Fraunces + Inter',
        description: 'Editorial soft serif. Variable axes for SOFT/WONK give the italics real personality. My pick.',
        displayFont: 'Fraunces',
        displayClass: fraunces.className,
        bodyClass: inter.className,
        labelClass: inter.className,
        italicClass: fraunces.className,
    },
    {
        name: 'Instrument Serif + Inter',
        description: 'Display serif used by Vercel marketing. Refined, confident, big-tech-tasteful.',
        displayFont: 'Instrument Serif',
        displayClass: instrumentSerif.className,
        bodyClass: inter.className,
        labelClass: inter.className,
        italicClass: instrumentSerif.className,
    },
    {
        name: 'Newsreader + Inter',
        description: 'Functional editorial serif from Production Type. Reads as a magazine, not a logo.',
        displayFont: 'Newsreader',
        displayClass: newsreader.className,
        bodyClass: inter.className,
        labelClass: inter.className,
        italicClass: newsreader.className,
    },
    {
        name: 'Playfair Display + Inter',
        description: 'High-contrast classic. Strong fashion-magazine voice, slightly more familiar than Fraunces.',
        displayFont: 'Playfair Display',
        displayClass: playfair.className,
        bodyClass: inter.className,
        labelClass: inter.className,
        italicClass: playfair.className,
    },
    {
        name: 'Cormorant + Inter',
        description: 'Tall, elegant, slightly fragile. Editorial fashion / luxury cosmetics vibes.',
        displayFont: 'Cormorant',
        displayClass: cormorant.className,
        bodyClass: inter.className,
        labelClass: inter.className,
        italicClass: cormorant.className,
    },
    {
        name: 'Crimson Pro + Inter',
        description: 'Quiet old-style serif. Reads as "I know what I am doing", not "look at me".',
        displayFont: 'Crimson Pro',
        displayClass: crimsonPro.className,
        bodyClass: inter.className,
        labelClass: inter.className,
        italicClass: crimsonPro.className,
    },
    {
        name: 'Bricolage Grotesque + Inter',
        description: 'Distinctive contemporary sans (no serif). Modern editorial without leaving the sans family.',
        displayFont: 'Bricolage Grotesque',
        displayClass: bricolage.className,
        bodyClass: inter.className,
        labelClass: inter.className,
    },
    {
        name: 'Geist Sans + Geist Mono',
        description: 'Vercel\'s house pair. Pure modern sans, no serif anywhere. Risks looking like every Next.js demo.',
        displayFont: 'Geist Sans',
        displayClass: geist.className,
        bodyClass: geist.className,
        labelClass: geistMono.className,
    },
];

function EyebrowOptions() {
    // All rendered with the chosen pair: Newsreader display + Inter body.
    const heading = (
        <h3 className={`${newsreader.className} text-5xl md:text-7xl font-medium leading-[0.95] tracking-tight text-text-primary`}>
            Selected{' '}
            <span className={`${newsreader.className} italic font-normal text-accent-primary`}>Projects</span>
        </h3>
    );
    const body = (
        <p className={`${inter.className} text-text-secondary leading-relaxed max-w-2xl mt-4`}>
            Product, web, AI, and brand work - across fintech, hospitality, trades, and Web3.
        </p>
    );

    return (
        <section className="border-t border-accent-primary/30 pt-12">
            <div className="mb-12">
                <p className={`${inter.className} text-text-muted text-sm uppercase tracking-wider mb-3`}>
                    Section label patterns · Newsreader + Inter
                </p>
                <h2 className={`${newsreader.className} text-4xl md:text-5xl font-medium tracking-tight mb-3`}>
                    Eyebrow alternatives
                </h2>
                <p className={`${inter.className} text-text-secondary max-w-2xl`}>
                    Five ways to mark a section without the tiny uppercase mono tag everyone uses. Same headline below each so you can compare.
                </p>
            </div>

            <div className="space-y-20">
                {/* A. NO EYEBROW */}
                <div>
                    <p className={`${inter.className} text-xs uppercase tracking-wider text-accent-primary/80 mb-3`}>A · No eyebrow</p>
                    {heading}
                    {body}
                    <p className={`${inter.className} text-text-dim text-xs mt-4 italic`}>The heading does the work. Most editorial magazines do this.</p>
                </div>

                {/* B. SERIF ITALIC EYEBROW */}
                <div>
                    <p className={`${inter.className} text-xs uppercase tracking-wider text-accent-primary/80 mb-3`}>B · Serif italic, sentence case</p>
                    <p className={`${newsreader.className} italic text-text-muted text-xl md:text-2xl mb-2`}>Selected work</p>
                    {heading}
                    {body}
                    <p className={`${inter.className} text-text-dim text-xs mt-4 italic`}>Distinctive. The serif italic IS the editorial signature - no need for the tiny tracked tag.</p>
                </div>

                {/* C. LARGE NUMBER */}
                <div>
                    <p className={`${inter.className} text-xs uppercase tracking-wider text-accent-primary/80 mb-3`}>C · Big numeral, no label</p>
                    <div className="flex items-baseline gap-5 mb-2">
                        <span className={`${newsreader.className} italic text-5xl md:text-6xl font-normal text-accent-primary leading-none`}>01</span>
                        <span className={`${inter.className} text-text-muted text-sm`}>Work</span>
                    </div>
                    {heading}
                    {body}
                    <p className={`${inter.className} text-text-dim text-xs mt-4 italic`}>Confident and editorial. The number does the heavy visual work; the word is just context.</p>
                </div>

                {/* D. RULE + LABEL */}
                <div>
                    <p className={`${inter.className} text-xs uppercase tracking-wider text-accent-primary/80 mb-3`}>D · Inline rule + label</p>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="block h-px w-12 bg-accent-primary" />
                        <span className={`${inter.className} text-text-muted text-base font-medium`}>Selected work</span>
                    </div>
                    {heading}
                    {body}
                    <p className={`${inter.className} text-text-dim text-xs mt-4 italic`}>Functional, restrained. Works well when several sections need the same treatment.</p>
                </div>

                {/* E. INTER SENTENCE CASE, BIGGER */}
                <div>
                    <p className={`${inter.className} text-xs uppercase tracking-wider text-accent-primary/80 mb-3`}>E · Inter sentence-case, readable size</p>
                    <p className={`${inter.className} text-text-muted text-base mb-3 font-medium`}>Selected work · 2024–2026</p>
                    {heading}
                    {body}
                    <p className={`${inter.className} text-text-dim text-xs mt-4 italic`}>Honest. Reads like a competent editor wrote it. Compatible with metadata (date range, count, etc).</p>
                </div>
            </div>
        </section>
    );
}

export default function TypeMocks() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary py-16 px-6 md:px-12">
            <div className="max-w-5xl mx-auto mb-16">
                <p className={`${inter.className} text-text-muted text-sm uppercase tracking-wider mb-3`}>Type · Mockups</p>
                <h1 className={`${inter.className} text-5xl md:text-7xl font-medium tracking-tight mb-4`}>
                    Font pairing options
                </h1>
                <p className="text-text-secondary max-w-2xl">
                    Same content, eight typeface pairings. Display font is the variable; body is Inter throughout
                    (except Geist, which uses its own pair). Pick by eye - the descriptions are opinions, not facts.
                </p>
                <p className={`${inter.className} text-text-muted text-sm mt-3`}>
                    Scroll past the pairings for <a href="#eyebrows" className="text-accent-primary underline-offset-2 hover:underline">eyebrow alternatives</a> on the chosen pair (Newsreader + Inter).
                </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-24">
                {pairings.map((p, i) => (
                    <article key={p.name} className="border-t border-border-subtle pt-10">
                        <header className="mb-10 flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
                            <div>
                                <p className={`${p.labelClass} text-[11px] uppercase tracking-[0.22em] text-text-muted mb-2`}>
                                    Option · {String(i).padStart(2, '0')}
                                </p>
                                <h2 className={`${p.displayClass} text-3xl font-medium tracking-tight`}>
                                    {p.name}
                                </h2>
                                <p className="text-text-muted text-sm mt-2 max-w-xl">{p.description}</p>
                            </div>
                            <p className="text-text-dim text-xs font-mono shrink-0">
                                Display: {p.displayFont}
                            </p>
                        </header>

                        {/* Sample 1: hero-style display */}
                        <div className="mb-12">
                            <p className={`${p.labelClass} text-[11px] uppercase tracking-[0.22em] text-text-muted mb-4`}>
                                Work · 01
                            </p>
                            <h3 className={`${p.displayClass} text-5xl md:text-7xl font-medium leading-[0.95] tracking-tight text-text-primary`}>
                                Selected{' '}
                                <span className={`${p.italicClass ?? p.displayClass} ${p.italicClass ? 'italic font-normal' : ''} text-accent-primary`}>
                                    Projects
                                </span>
                            </h3>
                        </div>

                        {/* Sample 2: lead paragraph */}
                        <div className="mb-10 grid md:grid-cols-[1fr_2fr] gap-6">
                            <p className={`${p.labelClass} text-[11px] uppercase tracking-[0.22em] text-text-muted pt-2`}>
                                Lead
                            </p>
                            <p className={`${p.bodyClass} text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl`}>
                                Product · Web · Brand · AI. I partner with founders, agencies, and small businesses
                                to design and build the web, end to end - from systems thinking through to a deployed
                                Next.js site that wins Core Web Vitals.
                            </p>
                        </div>

                        {/* Sample 3: section heading + body */}
                        <div className="mb-10 grid md:grid-cols-[1fr_2fr] gap-6">
                            <p className={`${p.labelClass} text-[11px] uppercase tracking-[0.22em] text-text-muted pt-2`}>
                                Section
                            </p>
                            <div>
                                <h4 className={`${p.displayClass} text-3xl md:text-4xl font-medium tracking-tight mb-3 text-text-primary`}>
                                    Your technology is complex.{' '}
                                    <span className={`${p.italicClass ?? p.displayClass} ${p.italicClass ? 'italic' : ''} text-accent-primary`}>
                                        Your product should be simple.
                                    </span>
                                </h4>
                                <p className={`${p.bodyClass} text-text-secondary leading-relaxed max-w-2xl`}>
                                    Great products deserve great design. I turn complex workflows into clear,
                                    shippable product structure - flows, states, edge cases, and component logic
                                    that engineers can build.
                                </p>
                            </div>
                        </div>

                        {/* Sample 4: case-study card */}
                        <div className="border border-border-subtle rounded-sm p-6 bg-bg-secondary">
                            <p className={`${p.labelClass} text-[10px] uppercase tracking-[0.2em] text-text-muted mb-2`}>
                                Case Study · 2025
                            </p>
                            <h5 className={`${p.displayClass} text-2xl md:text-3xl font-medium tracking-tight mb-2 text-text-primary`}>
                                Instant Access Locksmiths
                            </h5>
                            <p className={`${p.bodyClass} text-sm text-text-muted leading-relaxed`}>
                                Next.js rebuild for a Solihull locksmith - built phone-first for late-night visitors
                                with programmatic local-SEO landing pages.
                            </p>
                        </div>
                    </article>
                ))}
            </div>

            <div id="eyebrows" className="max-w-5xl mx-auto mt-32">
                <EyebrowOptions />
            </div>
        </main>
    );
}

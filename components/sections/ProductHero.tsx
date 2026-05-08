'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroGrid from '@/components/ui/HeroGrid';

const UPWORK_URL = 'https://www.upwork.com/freelancers/~0192f6c9c9c1e1bf83';
const UPWORK_GREEN = '#14A800';

const FADE_UP = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.15 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

function scrollToWork(e: React.MouseEvent) {
    e.preventDefault();
    const el = document.getElementById('work');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
}

export default function ProductHero() {
    return (
        <section className="product-hero-section relative min-h-[100svh] w-full overflow-hidden bg-bg-hero flex items-center">
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            >
                <HeroGrid />
            </motion.div>

            <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 pt-28 pb-32 md:pt-32 md:pb-40">
                <div className="text-left">
                    <motion.p
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="text-[11px] md:text-xs font-mono uppercase tracking-[0.18em] text-text-dim mb-6"
                    >
                        Product Designer + Developer · Cyprus
                    </motion.p>

                    <motion.h1
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight leading-[1.05] text-text-primary"
                    >
                        <span className="block lg:whitespace-nowrap">
                            Websites designed with{' '}
                            <span
                                className="italic font-normal text-accent-highlight"
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                intent.
                            </span>
                        </span>
                        <span className="block lg:whitespace-nowrap">
                            Built to be{' '}
                            <span
                                className="italic font-normal text-accent-highlight"
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                used.
                            </span>
                        </span>
                    </motion.h1>

                    <motion.p
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="mt-6 md:mt-8 text-lg md:text-xl text-text-muted leading-relaxed max-w-xl text-balance"
                    >
                        Product UX, websites, and prototypes for founders and teams who want something they can actually use, change, and be proud to show off. End-to-end by one person.
                    </motion.p>

                    <motion.p
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="mt-6 text-sm text-text-dim max-w-lg"
                    >
                        Previously lead designer on RealFi, Cardano&apos;s $80bn ecosystem · 12 years web design &amp; development
                    </motion.p>

                    <motion.div
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="mt-10 md:mt-12 flex flex-wrap items-center gap-5"
                    >
                        <a
                            href={UPWORK_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 rounded-xl px-7 py-4 text-base font-semibold text-white shadow-sm transition-[filter,transform] duration-200 hover:brightness-110 hover:-translate-y-0.5"
                            style={{ backgroundColor: UPWORK_GREEN }}
                        >
                            Hire me on Upwork
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </a>

                        <a
                            href="#work"
                            onClick={scrollToWork}
                            className="text-sm text-text-dim hover:text-text-primary transition-colors"
                        >
                            or see selected work ↓
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroGrid from '@/components/ui/HeroGrid';
import CtaLink from '@/components/analytics/CtaLink';

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
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 xl:gap-16 items-center">
                <div className="text-left">
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="hero-signature mb-5"
                    >
                        <div
                            role="img"
                            aria-label="George Efesopoulos"
                            className="theme-signature h-[60px] w-full max-w-[280px]"
                            style={{ aspectRatio: '375 / 73' }}
                        />
                    </motion.div>

                    <motion.p
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="text-[11px] md:text-xs font-mono uppercase tracking-[0.18em] text-text-dim mb-6"
                    >
                        UI / UX Product Designer &amp; Developer · Cyprus
                    </motion.p>

                    <motion.div
                        custom={1.5}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="hero-feature-image-mobile xl:hidden mb-8"
                    >
                        <div className="hero-feature-image-frame relative rounded-xl overflow-hidden border border-border-subtle bg-bg-secondary shadow-xl">
                            <Image
                                src="/images/estia-kitchens/estia-kitchens-thumb-v4.jpg"
                                alt="Estia Kitchens homepage"
                                width={1200}
                                height={745}
                                sizes="100vw"
                                className="w-full h-auto block"
                                priority
                            />
                        </div>
                    </motion.div>

                    <motion.h1
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight leading-[1.05] text-text-primary"
                    >
                        <span className="block lg:whitespace-nowrap">
                            Websites with{' '}
                            <span
                                className="italic font-normal text-accent-primary lg:text-[80px]"
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                purpose.
                            </span>
                        </span>
                        <span className="block lg:whitespace-nowrap">
                            Built to work for{' '}
                            <span
                                className="italic font-normal text-accent-primary lg:text-[80px]"
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                you.
                            </span>
                        </span>
                    </motion.h1>

                    <motion.p
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="mt-6 md:mt-8 text-lg md:text-xl text-text-muted leading-relaxed max-w-xl text-balance"
                    >
                        Product UX, sites, and prototypes for founders and teams who want something they can actually use, change, and be proud to show off. End-to-end by one person.
                    </motion.p>

                    <motion.div
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="mt-10 md:mt-12 flex flex-wrap items-center gap-5"
                    >
                        <CtaLink
                            destination="upwork"
                            ctaLocation="hero"
                            href={UPWORK_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 rounded-xl px-7 py-4 text-base font-semibold text-white shadow-sm transition-[filter,transform] duration-200 hover:brightness-110 hover:-translate-y-0.5"
                            style={{ backgroundColor: UPWORK_GREEN }}
                        >
                            Hire me on Upwork
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </CtaLink>

                        <a
                            href="#work"
                            onClick={scrollToWork}
                            className="text-sm text-text-dim hover:text-text-primary transition-colors"
                        >
                            or see selected work ↓
                        </a>
                    </motion.div>

                    <motion.p
                        custom={5}
                        initial="hidden"
                        animate="visible"
                        variants={FADE_UP}
                        className="mt-6 text-sm text-text-dim max-w-lg"
                    >
                        Previously lead designer on RealFi, Cardano&apos;s $80bn ecosystem · 12 years web design &amp; development
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="hero-feature-image hidden xl:block relative w-full"
                >
                    <div className="hero-feature-image-frame relative rounded-xl overflow-hidden border border-border-subtle bg-bg-secondary shadow-xl">
                        <Image
                            src="/images/estia-kitchens/estia-kitchens-thumb-v4.jpg"
                            alt="Estia Kitchens homepage"
                            width={1200}
                            height={745}
                            sizes="(max-width: 1024px) 90vw, 720px"
                            className="w-full h-auto block"
                            priority
                        />
                    </div>
                </motion.div>
                </div>
            </div>
        </section>
    );
}

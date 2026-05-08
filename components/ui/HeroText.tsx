'use client';

import { useEffect, useState } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { StepId } from '../sections/ProductHero';
import ProjectEstimator from '../sections/ProjectEstimator';
import MicroUpworkCard from './MicroUpworkCard';

interface HeroTextProps {
    scrollProgress: MotionValue<number>;
    step?: StepId;
    isMobile?: boolean;
    headerActions?: React.ReactNode;
}

export default function HeroText({ scrollProgress, headerActions }: HeroTextProps) {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const y = useTransform(scrollProgress, [0, 1], [0, -20]);
    const opacity = useTransform(scrollProgress, [0, 0.5], [1, 0]);

    const line = (delay: number) => ({
        initial: { opacity: 0, y: 12 } as const,
        animate: { opacity: 1, y: 0 } as const,
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
    });

    return (
        <>
            <motion.div
                className="hero-text-root absolute inset-0 z-20 w-full h-full p-6 pb-12 md:p-12 md:pb-24 lg:p-16 flex flex-col justify-end pointer-events-none"
                style={{ y, opacity }}
            >
                {/* Top Row */}
                <div className="hero-text-top flex justify-between items-start w-full text-xs md:text-sm font-mono tracking-widest uppercase text-text-muted mb-auto">
                    <div className="hero-text-top-spacer" />
                    {headerActions && (
                        <div className="hero-text-header-actions hidden md:block pointer-events-auto">
                            {headerActions}
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="hero-text-body flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-8 md:gap-0">

                    {/* Left Side */}
                    <div className="hero-text-left w-full md:max-w-[60%] lg:max-w-[640px] xl:max-w-[720px] text-left">
                        <motion.div {...line(0.0)} className="hero-text-signature-wrap mb-2 md:mb-4">
                            <div
                                role="img"
                                aria-label="George Efesopoulos"
                                className="hero-text-signature theme-signature h-[69px] md:h-[110px] max-w-full md:translate-y-[10px] md:-translate-x-[15px]"
                                style={{ aspectRatio: '375 / 73' }}
                            />
                        </motion.div>
                        <h1 className="hero-text-heading font-black tracking-tighter text-text-secondary leading-[0.85] transition-all duration-500 uppercase">
                            <span className="hero-text-heading-mobile md:hidden block">
                                <motion.span {...line(0.05)} className="hero-text-heading-line block text-3xl sm:text-4xl">UX / UI Product</motion.span>
                                <motion.span {...line(0.14)} className="hero-text-heading-line block text-xl sm:text-2xl mt-1">Designer &amp; Developer</motion.span>
                            </span>
                            <span className="hero-text-heading-desktop hidden md:block">
                                <motion.span {...line(0.1)} className="hero-text-heading-line block text-4xl lg:text-5xl xl:text-7xl">UX / UI PRODUCT</motion.span>
                                <motion.span {...line(0.2)} className="hero-text-heading-line block text-2xl lg:text-3xl xl:text-5xl mt-1">DESIGNER &amp; DEVELOPER</motion.span>
                            </span>
                        </h1>
                        <motion.div {...line(0.3)} className="hero-text-subtitle-wrap mt-2 md:mt-3">
                            <span className="hero-text-subtitle theme-hero-subtitle font-medium tracking-widest uppercase block text-sm sm:text-base md:text-lg">
                                End to end · By one person
                            </span>
                        </motion.div>
                    </div>

                    {/* Right Side */}
                    <div className="hero-text-right hidden md:flex text-right flex-col items-end gap-3 mt-4 md:mt-0 md:min-w-[300px] lg:min-w-[340px]">
                        <motion.div {...line(0.0)} className="xl:hidden">
                            <MicroUpworkCard />
                        </motion.div>
                        <motion.p {...line(0.0)} className="hero-text-meta-disciplines text-base md:text-xl font-medium text-text-primary">
                            Product · Web · Brand · AI
                        </motion.p>
                        <motion.p {...line(0.1)} className="hero-text-meta-previous text-xs md:text-sm text-text-muted">
                            Previously: <span className="hero-text-meta-previous-name text-text-primary">Input Output (Cardano)</span>
                        </motion.p>
                        <motion.div {...line(0.2)} className="hero-text-availability flex items-start justify-end gap-1.5 transition-all mt-1 md:mt-2 ml-auto w-fit">
                            <span className="hero-text-availability-label font-mono tracking-widest uppercase text-[10px] md:text-sm text-text-muted text-right">
                                Open for new projects
            </span>
                            <span className="hero-text-availability-dot w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse mt-1 md:mt-1.5 shrink-0" />
                        </motion.div>
                    </div>
                </div>

            </motion.div>

            {false && (
                <div className="hero-text-estimator-wrap absolute inset-0 z-30 flex items-start justify-center pt-[20vh] md:pt-[22vh] px-4 md:px-0 pointer-events-none">
                    <ProjectEstimator />
                </div>
            )}
        </>
    );
}

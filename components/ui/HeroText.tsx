'use client';

import { useEffect, useState } from 'react';
import { motion, useTransform, MotionValue, Variants } from 'framer-motion';
import { StepId } from '../sections/ProductHero';
import ProjectEstimator from '../sections/ProjectEstimator';

interface HeroTextProps {
    scrollProgress: MotionValue<number>;
    step?: StepId;
    isMobile?: boolean;
    headerActions?: React.ReactNode;
}

export default function HeroText({ scrollProgress, headerActions }: HeroTextProps) {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const y = useTransform(scrollProgress, [0, 1], [0, -20]);
    const opacity = useTransform(scrollProgress, [0, 0.5], [1, 0]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: isMobile ? 0 : 0.1,
                delayChildren: isMobile ? 0 : 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: isMobile ? 0.1 : 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <>
            <motion.div
                className="hero-text-root absolute inset-0 z-20 w-full h-full p-6 pb-12 md:p-12 md:pb-24 lg:p-16 flex flex-col justify-end pointer-events-none"
                style={{ y, opacity }}
                initial={isMobile ? false : "hidden"}
                animate="visible"
                variants={containerVariants}
            >
                {/* Top Row - Adaptive Logo/Hamburger Space */}
                <div className="hero-text-top flex justify-between items-start w-full text-xs md:text-sm font-mono tracking-widest uppercase text-text-muted mb-auto">
                    <div className="hero-text-top-spacer" />
                    {headerActions && (
                        <div className="hero-text-header-actions hidden md:block pointer-events-auto">
                            {headerActions}
                        </div>
                    )}
                </div>

                {/* Main Content Area - Always at bottom */}
                <div className="hero-text-body flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-8 md:gap-0">

                    {/* Left Side: Main Title */}
                    <motion.div
                        variants={itemVariants}
                        className="hero-text-left w-full md:max-w-[65%] lg:max-w-[720px] text-left"
                    >
                        <div className="hero-text-signature-wrap mb-2 md:mb-4">
                            <div
                                role="img"
                                aria-label="George Efesopoulos"
                                className="hero-text-signature theme-signature h-[69px] md:h-[110px] max-w-full md:translate-y-[10px] md:-translate-x-[15px]"
                                style={{ aspectRatio: '375 / 73' }}
                            />
                        </div>
                        <h1 className="hero-text-heading font-black tracking-tighter text-text-secondary leading-[0.85] transition-all duration-500 uppercase">
                            <span className="hero-text-heading-mobile md:hidden block">
                                <span className="hero-text-heading-line block text-3xl sm:text-4xl">UX / UI Product</span>
                                <span className="hero-text-heading-line block text-xl sm:text-2xl mt-1">Designer &amp; Developer</span>
                            </span>
                            <span className="hero-text-heading-desktop hidden md:block">
                                <span className="hero-text-heading-line block text-5xl lg:text-7xl">UX / UI PRODUCT</span>
                                <span className="hero-text-heading-line block text-3xl lg:text-5xl mt-1">DESIGNER &amp; DEVELOPER</span>
                            </span>
                        </h1>

                        <div className="hero-text-subtitle-wrap mt-2 md:mt-3">
                            <span className="hero-text-subtitle theme-hero-subtitle font-medium tracking-widest uppercase block text-sm sm:text-base md:text-lg">
                                End to end · By one person
                            </span>
                        </div>

                    </motion.div>

                    {/* Right Side: Details */}
                    <motion.div
                        variants={itemVariants}
                        className="hero-text-right hidden md:flex text-right flex-col items-end gap-3 mt-4 md:mt-0"
                    >
                        <div className="hero-text-meta space-y-1 transition-all">
                            <p className="hero-text-meta-disciplines text-base md:text-xl font-medium text-text-primary">Product · Web · Brand · AI</p>
                            <p className="hero-text-meta-previous text-xs md:text-sm text-text-muted">Previously: <span className="hero-text-meta-previous-name text-text-primary">Input Output (Cardano)</span></p>
                        </div>
                        <div className="hero-text-availability flex items-start justify-end gap-1.5 transition-all mt-1 md:mt-2 ml-auto w-fit">
                            <span className="hero-text-availability-label font-mono tracking-widest uppercase text-[10px] md:text-sm text-text-muted text-right">
                                Open for new projects
                            </span>
                            <span className="hero-text-availability-dot w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse mt-1 md:mt-1.5 shrink-0" />
                        </div>
                    </motion.div>
                </div>

            </motion.div>

            {/* FEATURE FLAG: Set to true to re-enable project estimator */}
            {false && (
                <div className="hero-text-estimator-wrap absolute inset-0 z-30 flex items-start justify-center pt-[20vh] md:pt-[22vh] px-4 md:px-0 pointer-events-none">
                    <ProjectEstimator />
                </div>
            )}
        </>
    );
}

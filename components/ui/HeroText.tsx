'use client';

import { motion, MotionValue, useTransform, Variants } from 'framer-motion';
import { StepId } from '../sections/ProductHero';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface HeroTextProps {
    scrollProgress: MotionValue<number>;
    step?: StepId;
}

function HeroAnnotationArrow({ isMobile }: { isMobile: boolean }) {
    // Desktop: Heading is bottom-left, Canvas is center. Arrow goes from bottom-left UP and RIGHT.
    // Mobile: Heading is top-leftish, Canvas is center. Arrow goes from top DOWN.
    const path = isMobile
        ? "M 10 10 Q 30 50 20 90" // Simple mobile curve
        : "M 20 180 Q 40 50 160 20"; // Desktop curve: from heading up and right

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
                "absolute pointer-events-none z-50",
                isMobile
                    ? "top-[100px] left-[60%]"
                    : "bottom-[120px] left-[380px] lg:left-[450px]"
            )}
        >
            <svg
                width={isMobile ? "100" : "200"}
                height={isMobile ? "100" : "200"}
                viewBox={isMobile ? "0 0 100 100" : "0 0 200 200"}
                fill="none"
                className="text-accent-primary"
            >
                <motion.path
                    d={path}
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
                <motion.path
                    d={isMobile ? "M 10 80 L 20 90 L 30 80" : "M 145 35 L 160 20 L 140 15"}
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                />
                <motion.text
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    x={isMobile ? "35" : "110"}
                    y={isMobile ? "85" : "55"}
                    className="fill-accent-primary font-bold text-[12px] md:text-[14px]"
                    style={{ fontFamily: 'var(--font-caveat)' }}
                >
                    Final Polished UI
                </motion.text>
            </svg>
        </motion.div>
    );
}

export default function HeroText({ scrollProgress, step }: HeroTextProps) {
    const y = useTransform(scrollProgress, [0, 1], [0, -20]);
    const opacity = useTransform(scrollProgress, [0, 0.5], [1, 0]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <motion.div
            className="absolute inset-0 z-10 w-full h-full p-6 md:p-12 lg:p-16 flex flex-col justify-between pointer-events-none select-none"
            style={{ y, opacity }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Top Row - Adaptive Logo/Hamburger Space */}
            <div className="flex justify-between items-start w-full text-xs md:text-sm font-mono tracking-widest uppercase text-zinc-400">
                {/* Space reserved for top nav */}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full h-full gap-8 md:gap-0 mt-[52px] md:mt-0">

                {/* Left Side: Main Title */}
                <motion.div
                    variants={itemVariants}
                    className="md:max-w-2xl text-left transition-all duration-500"
                >
                    <div className="mb-1 md:mb-2">
                        <span className="text-lg md:text-3xl font-serif italic text-white font-light tracking-wide font-['Times_New_Roman'] whitespace-nowrap">
                            George Efesopoulos
                        </span>
                    </div>
                    <h1 className="font-black tracking-tighter text-white leading-[0.85] transition-all duration-500 text-3xl md:text-5xl lg:text-7xl uppercase">
                        <span className="md:hidden block whitespace-nowrap">Product Designer</span>
                        <span className="hidden md:block">PRODUCT<br />DESIGNER</span>
                        <span className="text-white/50 font-medium tracking-tight block mt-1 md:mt-2 text-lg md:text-3xl">
                            FOR COMPLEX SYSTEMS
                        </span>
                    </h1>

                    {/* Annotation Arrow for Step 3 - Mobile */}
                    <AnimatePresence>
                        {step === 2 && (
                            <div className="md:hidden">
                                <HeroAnnotationArrow isMobile={true} />
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Desktop Arrow - Positioned relative to the main content area */}
                <AnimatePresence>
                    {step === 2 && (
                        <div className="hidden md:block">
                            <HeroAnnotationArrow isMobile={false} />
                        </div>
                    )}
                </AnimatePresence>

                {/* Right Side: Details + CTA (Hidden on mobile) */}
                <motion.div
                    variants={itemVariants}
                    className="hidden md:flex text-right flex-col items-end gap-6 transition-all duration-500 mt-4 md:mt-0"
                >
                    {/* Secondary Info */}
                    <div className="space-y-1 transition-all">
                        <p className="text-base md:text-xl font-medium text-white">Web3 · Fintech · SaaS</p>
                        <p className="text-xs md:text-sm text-zinc-400">Previously: <span className="text-white">Input Output (Cardano)</span></p>
                    </div>

                    {/* View Work CTA */}
                    <div className="transition-all">
                        <a
                            href="#work"
                            className="group flex items-center gap-2 text-white font-medium hover:text-accent transition-colors duration-300 pointer-events-auto"
                            aria-label="View Work"
                        >
                            <span className="text-base md:text-lg">View Work</span>
                            <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
                        </a>
                    </div>

                    <div className="flex items-center gap-2 transition-all mt-2 md:mt-4">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-mono tracking-widest uppercase text-zinc-400 text-[10px] md:text-sm">
                            Available for select projects
                        </span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
            </div >
        </motion.div >
    );
}

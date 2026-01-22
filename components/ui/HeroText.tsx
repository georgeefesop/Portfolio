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
                </motion.div>

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

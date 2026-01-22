'use client';

import { motion, MotionValue, useTransform, Variants } from 'framer-motion';
import { StepId } from '../sections/ProductHero';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface HeroTextProps {
    scrollProgress: MotionValue<number>;
    step: StepId;
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
            className={cn(
                "absolute inset-0 z-10 w-full h-full p-6 md:p-12 lg:p-16 flex flex-col pointer-events-none select-none",
                step === 0 ? "justify-start md:justify-between" : "justify-between"
            )}
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
            <div className={cn(
                "flex flex-col md:flex-row justify-between w-full h-full",
                step === 0 ? "items-start md:items-end gap-4 md:gap-0" : "items-end gap-8 md:gap-0"
            )}>

                {/* Left Side: Main Title */}
                <motion.div
                    variants={itemVariants}
                    className={cn(
                        "md:max-w-xl text-left transition-all duration-500",
                        step === 0 && "mt-16 md:mt-0" // Push down slightly on mobile slide 1 to clear logo
                    )}
                >
                    <div className={cn("mb-2 md:mb-6", step === 0 && "hidden md:block")}>
                        <span className="text-xl md:text-3xl font-serif italic text-white font-light tracking-wide font-['Times_New_Roman']">
                            George Efesopoulos
                        </span>
                    </div>
                    <h1 className={cn(
                        "font-black tracking-tighter text-white leading-[0.85] transition-all duration-500",
                        step === 0
                            ? "text-2xl md:text-5xl lg:text-6xl" // Aggressive reduction on mobile slide 1
                            : "text-4xl md:text-5xl lg:text-6xl"
                    )}>
                        PRODUCT<br />DESIGNER<br />
                        <span className={cn(
                            "text-white/50 font-medium tracking-tight block mt-1 transition-all",
                            step === 0 ? "text-sm md:text-3xl mt-0" : "text-2xl md:text-3xl mt-2"
                        )}>
                            FOR COMPLEX SYSTEMS
                        </span>
                    </h1>
                </motion.div>

                {/* Right Side: Details + CTA */}
                <motion.div
                    variants={itemVariants}
                    className={cn(
                        "text-right flex flex-col transition-all duration-500",
                        step === 0 ? "items-start md:items-end gap-2 md:gap-6" : "items-end gap-6"
                    )}
                >
                    {/* Secondary Info - Hidden on Slide 1 Mobile */}
                    <div className={cn("space-y-1 transition-all", step === 0 ? "hidden md:block" : "block")}>
                        <p className="text-lg md:text-xl font-medium text-white">Web3 · Fintech · SaaS</p>
                        <p className="text-sm text-zinc-400">Previously: <span className="text-white">Input Output (Cardano)</span></p>
                    </div>

                    {/* View Work CTA - Hidden on Slide 1 Mobile to avoid tap conflict */}
                    <div className={cn("transition-all", step === 0 ? "hidden md:block" : "block")}>
                        <a
                            href="#work"
                            className="group flex items-center gap-2 text-white font-medium hover:text-accent transition-colors duration-300 pointer-events-auto"
                            aria-label="View Work"
                        >
                            <span className="text-lg">View Work</span>
                            <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
                        </a>
                    </div>

                    <div className={cn(
                        "flex items-center gap-2 transition-all",
                        step === 0 ? "mt-0 md:mt-4" : "mt-4"
                    )}>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className={cn(
                            "font-mono tracking-widest uppercase text-zinc-400",
                            step === 0 ? "text-[8px] md:text-sm" : "text-xs md:text-sm"
                        )}>
                            {step === 0 ? "Available" : "Available for select projects"}
                        </span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

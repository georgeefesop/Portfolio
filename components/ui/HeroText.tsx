'use client';

import { motion, MotionValue, useTransform, Variants } from 'framer-motion';

interface HeroTextProps {
    scrollProgress: MotionValue<number>;
}

export default function HeroText({ scrollProgress }: HeroTextProps) {
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
            {/* Top Row - Completely Empty now as requested */}
            <div className="flex justify-between items-start w-full text-xs md:text-sm font-mono tracking-widest uppercase text-zinc-400">
                {/* Empty divs to maintain spacing if needed, or just remove content */}
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row justify-between items-end w-full gap-8 md:gap-0">

                {/* Bottom Left: Main Title */}
                <motion.div variants={itemVariants} className="md:max-w-xl text-left">
                    <div className="mb-6">
                        <span className="text-2xl md:text-3xl font-serif italic text-white font-light tracking-wide font-['Times_New_Roman']">
                            George Efesopoulos
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] mb-4">
                        PRODUCT<br />DESIGNER<br />
                        <span className="text-white/50 font-medium tracking-tight text-3xl md:text-5xl block mt-2">
                            FOR COMPLEX SYSTEMS
                        </span>
                    </h1>
                </motion.div>

                {/* Bottom Right: Details + CTA */}
                <motion.div variants={itemVariants} className="text-right flex flex-col items-end gap-6">
                    <div className="space-y-1">
                        <p className="text-lg md:text-xl font-medium text-white">Web3 · Fintech · SaaS</p>
                        <p className="text-sm text-zinc-400">Previously: <span className="text-white">Input Output (Cardano)</span></p>
                    </div>

                    <a
                        href="#work"
                        className="group flex items-center gap-2 text-white font-medium hover:text-accent transition-colors duration-300 pointer-events-auto"
                        aria-label="View Work"
                    >
                        <span className="text-lg">View Work</span>
                        <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
                    </a>

                    <div className="flex items-center gap-2 mt-4">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs md:text-sm font-mono tracking-widest uppercase text-zinc-400">Available for select projects</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

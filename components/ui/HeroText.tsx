'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useTransform, MotionValue, Variants } from 'framer-motion';
import { StepId } from '../sections/ProductHero';
import ProjectEstimator from '../sections/ProjectEstimator';

interface HeroTextProps {
    scrollProgress: MotionValue<number>;
    step?: StepId;
    isVibrantMode?: boolean;
    isMobile?: boolean;
    headerActions?: React.ReactNode;
}

export default function HeroText({ scrollProgress, isVibrantMode = false, headerActions }: HeroTextProps) {
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
                className="absolute inset-0 z-20 w-full h-full p-6 pb-12 md:p-12 md:pb-24 lg:p-16 flex flex-col justify-end pointer-events-none"
                style={{ y, opacity }}
                initial={isMobile ? false : "hidden"}
                animate="visible"
                variants={containerVariants}
            >
                {/* Top Row - Adaptive Logo/Hamburger Space */}
                <div className="flex justify-between items-start w-full text-xs md:text-sm font-mono tracking-widest uppercase text-zinc-400 mb-auto">
                    <div />
                    {headerActions && (
                        <div className="hidden md:block pointer-events-auto">
                            {headerActions}
                        </div>
                    )}
                </div>

                {/* Main Content Area - Always at bottom */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-8 md:gap-0">

                    {/* Left Side: Main Title */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full md:max-w-[60%] lg:max-w-[600px] text-left"
                    >
                        <div className="mb-2 md:mb-4">
                            <Image
                                src="/signature.png"
                                alt="George Efesopoulos"
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: 'auto', height: 'auto' }}
                                className="h-10 md:h-16 w-auto max-w-full object-contain md:translate-y-[10px] md:-translate-x-[15px]"
                                priority
                            />
                        </div>
                        <h1 className="font-black tracking-tighter text-white leading-[0.85] transition-all duration-500 text-3xl sm:text-4xl md:text-5xl lg:text-7xl uppercase">
                            <span className="md:hidden block">Product Designer<br />&amp; Developer</span>
                            <span className="hidden md:block">PRODUCT DESIGNER<br />&amp; DEVELOPER</span>
                        </h1>

                        <div className="mt-1 md:mt-2">
                            <span className="text-white/50 font-medium tracking-tight block text-lg sm:text-xl md:text-3xl">
                                End to end. By one person.
                            </span>
                        </div>

                    </motion.div>

                    {/* Right Side: Details */}
                    <motion.div
                        variants={itemVariants}
                        className="hidden md:flex text-right flex-col items-end gap-3 mt-4 md:mt-0"
                    >
                        <div className="space-y-1 transition-all">
                            <p className="text-base md:text-xl font-medium text-white">Product · Web · Brand · AI</p>
                            <p className={`text-xs md:text-sm transition-colors duration-500 ${isVibrantMode ? 'text-white' : 'text-zinc-400'}`}>Previously: <span className="text-white">Input Output (Cardano), Nike Training Club</span></p>
                        </div>
                        <div className="flex items-start justify-end gap-1.5 transition-all mt-1 md:mt-2 ml-auto w-fit">
                            <span className={`font-mono tracking-widest uppercase text-[10px] md:text-sm transition-colors duration-500 text-right ${isVibrantMode ? 'text-white' : 'text-zinc-400'}`}>
                                Open for new projects
                            </span>
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse mt-1 md:mt-1.5 shrink-0" />
                        </div>
                    </motion.div>
                </div>

            </motion.div>

            {/* FEATURE FLAG: Set to true to re-enable project estimator */}
            {false && (
                <div className="absolute inset-0 z-30 flex items-start justify-center pt-[20vh] md:pt-[22vh] px-4 md:px-0 pointer-events-none">
                    <ProjectEstimator />
                </div>
            )}
        </>
    );
}

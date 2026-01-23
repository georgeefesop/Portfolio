'use client';

import { motion, AnimatePresence, MotionValue, useTransform, Variants } from 'framer-motion';
import { StepId } from '../sections/ProductHero';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

import { useRef, useEffect, useState } from 'react';

interface HeroTextProps {
    scrollProgress: MotionValue<number>;
    step?: StepId;
}

function HeroAnnotationArrow({ isMobile, startRef }: { isMobile: boolean, startRef: React.RefObject<HTMLElement | null> }) {
    const [path, setPath] = useState("");
    const [arrowheadPath, setArrowheadPath] = useState("");

    useEffect(() => {
        const calculatePath = () => {
            const startElement = startRef.current;
            const endElement = document.getElementById('dashboard-frame');

            if (!startElement || !endElement) return;

            const startRect = startElement.getBoundingClientRect();
            const endRect = endElement.getBoundingClientRect();

            // Start point (right side of the 'R')
            const startX = startRect.right;
            const startY = startRect.top + (startRect.height / 2);

            // Find the nearest point on the endRect boundary (all 4 sides)
            // dashboard-frame could be anywhere.

            // Candidate points on the 4 segment lines
            const nearestX = Math.max(endRect.left, Math.min(startX, endRect.right));
            const nearestY = Math.max(endRect.top, Math.min(startY, endRect.bottom));

            // If start point is inside the rect, something is wrong, but we'll use nearest boundary point
            let targetX = nearestX;
            let targetY = nearestY;

            // If we are outside, the nearest point on the AABB is (nearestX, nearestY)
            // However, to make it look like it's pointing TO an edge, we force it to the boundary
            const distLeft = Math.abs(startX - endRect.left);
            const distRight = Math.abs(startX - endRect.right);
            const distTop = Math.abs(startY - endRect.top);
            const distBottom = Math.abs(startY - endRect.bottom);

            const minDist = Math.min(distLeft, distRight, distTop, distBottom);

            if (minDist === distLeft) { targetX = endRect.left; targetY = nearestY; }
            else if (minDist === distRight) { targetX = endRect.right; targetY = nearestY; }
            else if (minDist === distTop) { targetX = nearestX; targetY = endRect.top; }
            else { targetX = nearestX; targetY = endRect.bottom; }

            const dx = targetX - startX;
            const dy = targetY - startY;

            // Curvature: control point should be pushed "outwards" from the straight line
            // We'll push it UP and slightly towards the center
            const cpX = startX + dx * 0.4;
            const cpY = Math.min(startY, targetY) - (isMobile ? 120 : 180);

            setPath(`M ${startX} ${startY} Q ${cpX} ${cpY} ${targetX} ${targetY}`);

            // Arrowhead logic: Calculate angle from control point to target
            const angle = Math.atan2(targetY - cpY, targetX - cpX);
            const headLen = 16;
            const head1X = targetX - headLen * Math.cos(angle - Math.PI / 5);
            const head1Y = targetY - headLen * Math.sin(angle - Math.PI / 5);
            const head2X = targetX - headLen * Math.cos(angle + Math.PI / 5);
            const head2Y = targetY - headLen * Math.sin(angle + Math.PI / 5);

            setArrowheadPath(`M ${head1X} ${head1Y} L ${targetX} ${targetY} L ${head2X} ${head2Y}`);
        };

        calculatePath();
        window.addEventListener('resize', calculatePath);
        const timer = setTimeout(calculatePath, 600);
        return () => {
            window.removeEventListener('resize', calculatePath);
            clearTimeout(timer);
        };
    }, [startRef, isMobile]);

    if (!path) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-0"
        >
            <svg width="100%" height="100%" fill="none" className="text-accent-primary opacity-80">
                <motion.path
                    d={path}
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25, delay: 1.8, ease: "easeOut" }}
                />
                <motion.path
                    d={arrowheadPath}
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ delay: 2.05, duration: 0.1, ease: "easeOut" }}
                />
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

    const refR = useRef<HTMLSpanElement>(null);
    const [isMobileScreen, setIsMobileScreen] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobileScreen(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                    className="md:max-w-2xl text-left transition-all duration-500 relative z-10"
                >
                    <div className="mb-1 md:mb-2">
                        <span className="text-lg md:text-3xl font-serif italic text-white font-light tracking-wide font-['Times_New_Roman'] whitespace-nowrap">
                            George Efesopoulos
                        </span>
                    </div>
                    <h1 className="font-black tracking-tighter text-white leading-[0.85] transition-all duration-500 text-3xl md:text-5xl lg:text-7xl uppercase">
                        <span className="md:hidden block whitespace-nowrap">Product Designe<span ref={isMobileScreen ? refR : null}>r</span></span>
                        <span className="hidden md:block">PRODUCT<br />DESIGNER<span ref={!isMobileScreen ? refR : null}>R</span></span>
                        <span className="text-white/50 font-medium tracking-tight block mt-1 md:mt-2 text-lg md:text-3xl">
                            FOR COMPLEX SYSTEMS
                        </span>
                    </h1>

                    {/* Annotation Arrow for Step 3 - Mobile */}
                    <AnimatePresence>
                        {step === 2 && (
                            <div className="md:hidden">
                                <HeroAnnotationArrow isMobile={true} startRef={refR} />
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Desktop Arrow - Component handles its own visibility via Step 3 trigger */}
                <AnimatePresence>
                    {step === 2 && (
                        <div className="hidden md:block">
                            <HeroAnnotationArrow isMobile={false} startRef={refR} />
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

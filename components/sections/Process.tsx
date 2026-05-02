'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { Lightbulb, Users, Filter, GitMerge, Rocket, BarChart3, Repeat, Layers, Search } from 'lucide-react';
import FadeIn from '../motion/FadeIn';

// 4 Core Steps - Personal/Founder focus
const processSteps = [
    {
        id: 'discovery',
        icon: Search,
        title: "Listen & Map",
        desc: "Send me everything. The brief, the constraints, the half-formed ideas, the stakeholder noise. We map it out together until the real problem surfaces.",
    },
    {
        id: 'definition',
        icon: Users,
        title: "Figure It Out",
        desc: "I go quiet for a bit. Mind maps, user flows, whiteboarding until something clicks. Then we align before anything gets built.",
    },
    {
        id: 'build',
        icon: Rocket,
        title: "Build & Test",
        desc: "A working prototype your team can put in front of real users and actually learn from. You're in the loop the whole time.",
    },
    {
        id: 'iteration',
        icon: Repeat,
        title: "Iterate or Ship",
        desc: "We refine based on what users say, or it's ready to hand off to dev. Sometimes both happen at once.",
    },
];

export default function Process() {
    return (
        <section id="how-i-work" className="process-section bg-bg-primary py-16 md:py-32 overflow-hidden relative border-b border-border-subtle select-none scroll-mt-20">
            {/* Background Grid */}
            <div className="process-background-grid absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="process-container max-w-7xl mx-auto px-4 relative z-10">
                <FadeIn>
                    <div className="process-header text-center mb-12 md:mb-20">
                        <h2 className="process-heading font-serif text-h1 leading-[0.95] tracking-tight mb-4 md:mb-6">
                            <span className="process-heading-prefix text-text-dim">From</span>{' '}
                            <span className="process-heading-accent italic font-normal text-text-primary">Brief to Build</span>
                        </h2>
                        <p className="process-description text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
                            From messy brief to working product - listening, mapping, prototyping, then iterating until the right shape ships.
                        </p>
                    </div>
                </FadeIn>

                {/* Mobile: simple stacked column with consistent spacing */}
                <div className="process-mobile-list md:hidden flex flex-col gap-4 max-w-md mx-auto">
                    {processSteps.map((step, i) => (
                        <MobileProcessCard key={step.id} step={step} index={i} />
                    ))}
                </div>

                {/* Desktop / tablet: interactive draggable canvas */}
                <div className="process-desktop-canvas hidden md:block">
                    <InteractiveCanvas steps={processSteps} />
                </div>
            </div>
        </section>
    );
}

function MobileProcessCard({ step, index }: { step: typeof processSteps[number]; index: number }) {
    return (
        <div className="mobile-process-card bg-bg-secondary/90 backdrop-blur-md p-5 rounded-xl border border-border-subtle shadow-lg flex flex-col gap-3 relative">
            <div className="mobile-process-card-header flex justify-between items-start">
                <div className="mobile-process-card-icon-wrap w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-secondary">
                    <step.icon size={16} />
                </div>
            </div>
            <div className="mobile-process-card-body">
                <h3 className="mobile-process-card-title font-bold text-text-primary text-base mb-2">{step.title}</h3>
                <p className="mobile-process-card-description text-sm text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
            <div className="mobile-process-card-step-number absolute top-2 right-4 text-4xl font-bold opacity-[0.18] font-mono pointer-events-none">
                0{index + 1}
            </div>
        </div>
    );
}

function InteractiveCanvas({ steps }: { steps: typeof processSteps }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    const isSmallDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024 && window.innerWidth < 1280;

    useEffect(() => {
        if (!containerRef.current) return;
        const updateSize = () => {
            const { offsetWidth } = containerRef.current!;
            // Tablet height tuned so bottom row has ~60px breathing room.
            const h = isMobile ? steps.length * 240 + 100 : (isTablet ? 820 : 400);
            setSize({ w: offsetWidth, h });
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [isMobile, steps.length]);

    if (size.w === 0) return <div ref={containerRef} className="interactive-canvas-placeholder h-[400px] w-full" />;

    return (
        <div ref={containerRef} className="interactive-canvas relative w-full" style={{ height: size.h }}>
            <CanvasNodes steps={steps} size={size} containerRef={containerRef} isMobile={isMobile} isTablet={isTablet} isSmallDesktop={isSmallDesktop} />
        </div>
    );
}

function CanvasNodes({ steps, size, containerRef, isMobile, isTablet, isSmallDesktop }: { steps: any[], size: any, containerRef: any, isMobile: boolean, isTablet: boolean, isSmallDesktop: boolean }) {
    // FIX: Don't call useMotionValue in loop. Instantiate directly in useRef to maintain stable number of hooks.
    const motionValues = useRef(steps.map(() => ({
        x: new MotionValue(0),
        y: new MotionValue(0)
    }))).current;

    const { w, h } = size;
    // Consolidate into a stable string to prevent HMR dependency size mismatches
    const layoutKey = `${w}-${h}-${isMobile}-${isTablet}-${isSmallDesktop}`;

    React.useLayoutEffect(() => {
        steps.forEach((_, i) => {
            const pos = getInitialPosition(i, w, h, isMobile, isTablet, isSmallDesktop);
            motionValues[i].x.set(pos.x);
            motionValues[i].y.set(pos.y);
        });
    }, [layoutKey]); // Single stable string dependency

    // Jiggle fix for line attachment
    useEffect(() => {
        const timer = setTimeout(() => {
            steps.forEach((_, i) => {
                const prev = motionValues[i].x.get();
                motionValues[i].x.set(prev + 0.01);
            });
        }, 100);
        return () => clearTimeout(timer);
    }, [layoutKey]); // Same stable key

    return (
        <>
            <svg className="canvas-nodes-connections absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
                {steps.map((_, i) => {
                    if (i === steps.length - 1 || isMobile || isTablet) return null;
                    return (
                        <SmartConnection
                            key={`line-${i}`}
                            from={motionValues[i]}
                            to={motionValues[i + 1]}
                        />
                    );
                })}
            </svg>

            {steps.map((step, i) => (
                <ProcessNode
                    key={step.id}
                    step={step}
                    index={i}
                    x={motionValues[i].x}
                    y={motionValues[i].y}
                />
            ))}
        </>
    )
}

function SmartConnection({ from, to }: { from: { x: any, y: any }, to: { x: any, y: any } }) {
    const pathD = useTransform([from.x, from.y, to.x, to.y], ([x1, y1, x2, y2]: any[]) => {
        const CARD_W = 260; // Increased width
        const CARD_H_MID = 75;

        const c1 = { x: x1 + CARD_W / 2, y: y1 + CARD_H_MID };
        const c2 = { x: x2 + CARD_W / 2, y: y2 + CARD_H_MID };

        const isRight = c2.x > c1.x;
        // Check if strictly vertical stack (roughly same X, Target Below Source)
        const isVerticalStack = Math.abs(c2.x - c1.x) < 50 && c2.y > c1.y;

        let start = { x: 0, y: 0 };
        let end = { x: 0, y: 0 };
        let cp1 = { x: 0, y: 0 };
        let cp2 = { x: 0, y: 0 };

        if (isVerticalStack) {
            // Mobile/Vertical: Connect Right to Right with a loop
            start = { x: x1 + CARD_W + 5, y: y1 + CARD_H_MID };
            end = { x: x2 + CARD_W + 5, y: y2 + CARD_H_MID };

            const loopSize = 80;
            cp1 = { x: start.x + loopSize, y: start.y };
            cp2 = { x: end.x + loopSize, y: end.y };
        } else {
            // Desktop/Horizontal: Simple Right to Left

            if (isRight) {
                start = { x: x1 + CARD_W + 5, y: y1 + CARD_H_MID };
                end = { x: x2 - 5, y: y2 + CARD_H_MID };
            } else {
                // Dragged backwards
                start = { x: x1 - 5, y: y1 + CARD_H_MID };
                end = { x: x2 + CARD_W + 5, y: y2 + CARD_H_MID };
            }

            const dist = Math.abs(end.x - start.x);
            const controlDist = Math.max(dist * 0.5, 50);
            cp1 = { x: isRight ? start.x + controlDist : start.x - controlDist, y: start.y };
            cp2 = { x: isRight ? end.x - controlDist : end.x + controlDist, y: end.y };
        }

        return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
    });

    return (
        <motion.path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="4 4"
            className="smart-connection-path text-accent-primary/40 transition-colors duration-500"
        />
    );
}

function ProcessNode({ step, index, x, y }: any) {
    return (
        <motion.div
            style={{ x, y }}
            className="process-node absolute top-0 left-0 w-[260px] z-10"
        >
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="process-node-card bg-bg-secondary/90 backdrop-blur-md p-5 rounded-xl border border-border-subtle hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/10 flex flex-col gap-3 group transition-all duration-300 select-none relative"
            >
                <div className="process-node-header flex justify-between items-start">
                    <div className="process-node-icon-wrap w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-secondary group-hover:text-accent-primary transition-colors">
                        <step.icon size={16} />
                    </div>
                </div>

                <div className="process-node-body">
                    <h3 className="process-node-title font-bold text-text-primary text-base mb-2 group-hover:text-accent-primary transition-colors">{step.title}</h3>
                    {/* Removed line-clamp to show full text */}
                    <p className="process-node-description text-sm text-text-secondary leading-relaxed">
                        {step.desc}
                    </p>
                </div>

                {/* Big Number */}
                <div className="process-node-step-number absolute top-2 right-4 text-4xl font-bold opacity-[0.18] group-hover:opacity-[0.3] transition-opacity font-mono pointer-events-none">
                    0{index + 1}
                </div>

                {/* Visible Anchors */}
                <div className="process-node-anchor process-node-anchor-left absolute top-[75px] -left-1.5 w-3 h-3 rounded-full bg-bg-secondary border-2 border-border-medium group-hover:border-accent-primary transition-colors z-20" />
                <div className="process-node-anchor process-node-anchor-right absolute top-[75px] -right-1.5 w-3 h-3 rounded-full bg-bg-secondary border-2 border-border-medium group-hover:border-accent-primary transition-colors z-20" />
            </motion.div>
        </motion.div>
    )
}

function getInitialPosition(index: number, w: number, h: number, isMobile: boolean, isTablet: boolean, isSmallDesktop: boolean) {
    if (isMobile) {
        // Simple Vertical Stack
        return { x: (w - 260) / 2, y: index * 240 + 20 };
    }

    if (isTablet) {
        // Tablet: 2x2 Grid
        const cols = 2;
        const cardW = 260;
        const gapX = 40;
        const gapY = 280; // Vertical spacing including card height

        // Center the 2x2 block
        const totalW = cols * cardW + (cols - 1) * gapX;
        const startX = (w - totalW) / 2;
        const startY = 50;

        const col = index % 2;
        const row = Math.floor(index / 2);

        return {
            x: startX + col * (cardW + gapX),
            y: startY + row * gapY
        };
    }

    if (isSmallDesktop) {
        // Small Desktop (1024-1280): Staggered Zigzag
        const cols = 4;
        const cardW = 260;
        const gapX = 20; // Tighter gap
        const totalW = cols * cardW + (cols - 1) * gapX;
        const startX = (w - totalW) / 2;

        // Zigzag heights
        const yOffset = index % 2 === 0 ? 40 : 180;

        return {
            x: startX + index * (cardW + gapX),
            y: yOffset
        };
    }

    // Desktop: Single Row 
    const cols = 4;
    const cardW = 260;
    // Center the minimal grid
    const totalW = cols * cardW + (cols - 1) * 60; // 60px gap
    const startX = (w - totalW) / 2;
    const startY = (h - 150) / 2;

    return {
        x: startX + index * (cardW + 60),
        y: startY
    };
}

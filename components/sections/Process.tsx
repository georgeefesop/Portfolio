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
        title: "Logic & Strategy",
        desc: "I start by mapping the business logic and market requirements. No pixels until the problem is strictly defined.",
    },
    {
        id: 'definition',
        icon: Users,
        title: "User Simulation",
        desc: "I simulate specific user personas to predict behavioral patterns and identify the most valuable interactions.",
    },
    {
        id: 'build',
        icon: Rocket,
        title: "MVP Build",
        desc: "I build the core value quickly using a scalable stack, focusing on shipping a functional product over perfection.",
    },
    {
        id: 'iteration',
        icon: Repeat,
        title: "Data Iteration",
        desc: "I use early analytics and feedback to refine the product, removing friction and optimizing for retention.",
    },
];

export default function Process() {
    return (
        <section id="how-i-work" className="bg-bg-primary py-32 overflow-hidden relative border-b border-border-subtle select-none scroll-mt-20">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <FadeIn>
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">How I Work</h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            My process balances speed with scalability.<br />
                            <span className="text-sm opacity-50 text-mono mt-2 block">(Interactive — Drag to break things)</span>
                        </p>
                    </div>
                </FadeIn>

                <InteractiveCanvas steps={processSteps} />
            </div>
        </section>
    );
}

function InteractiveCanvas({ steps }: { steps: typeof processSteps }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    useEffect(() => {
        if (!containerRef.current) return;
        const updateSize = () => {
            const { offsetWidth } = containerRef.current!;
            // Compact height for single row
            const h = isMobile ? steps.length * 240 + 100 : 400;
            setSize({ w: offsetWidth, h });
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [isMobile, steps.length]);

    if (size.w === 0) return <div ref={containerRef} className="h-[400px] w-full" />;

    return (
        <div ref={containerRef} className="relative w-full" style={{ height: size.h }}>
            <CanvasNodes steps={steps} size={size} containerRef={containerRef} isMobile={isMobile} />
        </div>
    );
}

function CanvasNodes({ steps, size, containerRef, isMobile }: { steps: any[], size: any, containerRef: any, isMobile: boolean }) {
    // FIX: Don't call useMotionValue in loop. Instantiate directly in useRef to maintain stable number of hooks.
    const motionValues = useRef(steps.map(() => ({
        x: new MotionValue(0),
        y: new MotionValue(0)
    }))).current;

    React.useLayoutEffect(() => {
        steps.forEach((_, i) => {
            const pos = getInitialPosition(i, size.w, size.h, isMobile);
            motionValues[i].x.set(pos.x);
            motionValues[i].y.set(pos.y);
        });
    }, [size, isMobile, steps, motionValues]); // motionValues stable ref

    // Jiggle fix for line attachment
    useEffect(() => {
        const timer = setTimeout(() => {
            steps.forEach((_, i) => {
                const prev = motionValues[i].x.get();
                motionValues[i].x.set(prev + 0.01);
            });
        }, 100);
        return () => clearTimeout(timer);
    }, [steps, motionValues]);

    return (
        <>
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
                {steps.map((_, i) => {
                    if (i === steps.length - 1) return null;
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
                    containerRef={containerRef}
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
            className="text-accent-primary/40 transition-colors duration-500"
        />
    );
}

function ProcessNode({ step, index, x, y, containerRef }: any) {
    return (
        <motion.div
            drag
            dragElastic={0.1}
            dragMomentum={false}
            style={{ x, y }}
            className="absolute top-0 left-0 w-[260px] cursor-grab active:cursor-grabbing z-10"
        >
            <motion.div
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(20,20,20,0.95)' }}
                whileDrag={{ scale: 1.1, zIndex: 100, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                className="bg-bg-secondary/90 backdrop-blur-md p-5 rounded-xl border border-border-subtle shadow-lg flex flex-col gap-3 group transition-colors select-none relative"
            >
                <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-secondary group-hover:text-accent-primary transition-colors">
                        <step.icon size={16} />
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-text-primary text-base mb-2 group-hover:text-accent-primary transition-colors">{step.title}</h3>
                    {/* Removed line-clamp to show full text */}
                    <p className="text-sm text-text-secondary leading-relaxed">
                        {step.desc}
                    </p>
                </div>

                {/* Big Number */}
                <div className="absolute top-2 right-4 text-4xl font-bold opacity-[0.07] group-hover:opacity-[0.15] transition-opacity font-mono pointer-events-none">
                    0{index + 1}
                </div>

                {/* Visible Anchors */}
                <div className="absolute top-[75px] -left-1.5 w-3 h-3 rounded-full bg-bg-secondary border-2 border-border-medium group-hover:border-accent-primary transition-colors z-20" />
                <div className="absolute top-[75px] -right-1.5 w-3 h-3 rounded-full bg-bg-secondary border-2 border-border-medium group-hover:border-accent-primary transition-colors z-20" />
            </motion.div>
        </motion.div>
    )
}

function getInitialPosition(index: number, w: number, h: number, isMobile: boolean) {
    if (isMobile) {
        // Simple Vertical Stack
        return { x: (w - 260) / 2, y: index * 240 + 20 };
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

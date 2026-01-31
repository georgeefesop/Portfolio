'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, MotionValue, useTransform, Variants } from 'framer-motion';
import { StepId } from '../sections/ProductHero';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface HeroTextProps {
    scrollProgress: MotionValue<number>;
    step?: StepId;
    onOpenDemo?: () => void;
    isVibrantMode?: boolean;
}

// Shared audio context singleton to avoid browser autoplay restrictions
let sharedContext: AudioContext | null = null;
const getSharedContext = () => {
    if (typeof window === 'undefined') return null;
    if (!sharedContext) {
        sharedContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return sharedContext;
};

export default function HeroText({ scrollProgress, step, onOpenDemo, isVibrantMode = false }: HeroTextProps) {
    const y = useTransform(scrollProgress, [0, 1], [0, -20]);
    const opacity = useTransform(scrollProgress, [0, 0.5], [1, 0]);

    const isSimpleMode = !!onOpenDemo;

    // Primes the audio context on first user interaction
    useEffect(() => {
        const unlock = () => {
            const ctx = getSharedContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume();
            }
            window.removeEventListener('mousedown', unlock);
            window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('mousedown', unlock);
        window.addEventListener('touchstart', unlock);
        return () => {
            window.removeEventListener('mousedown', unlock);
            window.removeEventListener('touchstart', unlock);
        };
    }, []);

    const playPrototypeSound = () => {
        try {
            const ctx = getSharedContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            // "The Carbon Click" - A purely percussive, noise-based transient
            const bufferSize = ctx.sampleRate * 0.02; // 20ms burst
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(3200, now);
            filter.Q.setValueAtTime(10, now);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.05, now + 0.001);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(now);
            noise.stop(now + 0.02);
        } catch (e) { }
    };

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
            className="absolute inset-0 z-10 w-full h-full p-6 pb-24 md:p-12 lg:p-16 flex flex-col justify-end pointer-events-none select-none"
            style={{ y, opacity }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Top Row - Adaptive Logo/Hamburger Space */}
            <div className="flex justify-between items-start w-full text-xs md:text-sm font-mono tracking-widest uppercase text-zinc-400 mb-auto">
                {/* Space reserved for top nav */}
            </div>

            {/* Main Content Area - Always at bottom */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-8 md:gap-0">

                {/* Left Side: Main Title */}
                <motion.div
                    variants={itemVariants}
                    className="max-w-[min(60%,600px)] text-left transition-all duration-500"
                >
                    <div className="mb-2 md:mb-4">
                        <Image
                            src="/signature.png"
                            alt="George Efesopoulos"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: 'auto', height: 'auto' }}
                            className="h-8 md:h-16 w-auto max-w-full object-contain translate-y-[-10px] translate-x-[15px] md:translate-y-[10px] md:-translate-x-[15px]"
                            priority
                        />
                    </div>
                    <h1 className="font-black tracking-tighter text-white leading-[0.85] transition-all duration-500 text-3xl sm:text-4xl md:text-5xl lg:text-7xl uppercase">
                        <span className="md:hidden block whitespace-nowrap">Product Designer</span>
                        <span className="hidden md:block">PRODUCT<br />DESIGNER</span>
                        <span className="text-white/50 font-medium tracking-tight block mt-1 md:mt-2 text-lg sm:text-xl md:text-3xl">
                            FOR COMPLEX SYSTEMS
                        </span>
                    </h1>

                    {/* Value Proposition + CTA - Only in simple mode */}
                    {isSimpleMode && (
                        <motion.div
                            variants={itemVariants}
                            className="mt-6 md:mt-10"
                        >
                            <motion.button
                                onClick={() => {
                                    playPrototypeSound();
                                    onOpenDemo();
                                }}
                                whileHover="hover"
                                whileTap="push"
                                variants={{
                                    hover: { scale: 1.015 },
                                    push: { scale: 0.985 }
                                }}
                                transition={{ type: "spring", stiffness: 800, damping: 35 }}
                                initial="initial"
                                className={`pointer-events-auto relative group overflow-hidden px-6 py-3 font-bold text-sm md:text-base rounded-lg shadow-lg transition-all duration-500 ${isVibrantMode ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-accent-primary text-black'
                                    }`}
                                aria-label="Play with a Prototype"
                            >
                                {/* Glossy Sweep Effect */}
                                <motion.div
                                    variants={{
                                        initial: { x: '-100%', skewX: -45 },
                                        hover: { x: '200%', transition: { duration: 0.4, ease: "easeOut" } }
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                                />

                                <div className="flex items-center gap-2 relative z-10">
                                    <span>Play with a Prototype</span>
                                    <motion.span
                                        variants={{
                                            initial: { x: 0 },
                                            hover: { x: 5, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.4 } }
                                        }}
                                    >
                                        →
                                    </motion.span>
                                </div>
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Right Side: Details + CTA */}
                <motion.div
                    variants={itemVariants}
                    className="hidden md:flex text-right flex-col items-end gap-3 transition-all duration-500 mt-4 md:mt-0"
                >
                    {/* Secondary Info */}
                    <div className="space-y-1 transition-all">
                        <p className="text-base md:text-xl font-medium text-white">Web3 · Fintech · SaaS</p>
                        <p className={`text-xs md:text-sm transition-colors duration-500 ${isVibrantMode ? 'text-white' : 'text-zinc-400'}`}>Previously: <span className="text-white">Input Output (Cardano)</span></p>
                    </div>

                    {/* View Work CTA */}
                    <div className="transition-all">
                        <motion.a
                            href="mailto:contact@efesop.com"
                            className={`group flex items-center gap-2 font-medium transition-colors duration-500 pointer-events-auto ${isVibrantMode ? 'text-white hover:text-white/80' : 'text-white hover:text-accent-primary'
                                }`}
                            aria-label="Start a project"
                        >
                            <span className="text-base md:text-lg">Start a project</span>
                            <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
                        </motion.a>
                    </div>

                    <div className="flex items-center gap-2 transition-all mt-1 md:mt-2">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className={`font-mono tracking-widest uppercase text-[10px] md:text-sm transition-colors duration-500 ${isVibrantMode ? 'text-white' : 'text-zinc-400'}`}>
                            Available for select projects
                        </span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

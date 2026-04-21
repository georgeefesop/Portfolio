'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useTransform, useScroll, useSpring, useDragControls, MotionValue, Variants } from 'framer-motion';
import InstrumentButton from './InstrumentButton';
import { StepId } from '../sections/ProductHero';
import ProjectEstimator from '../sections/ProjectEstimator';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface HeroTextProps {
    scrollProgress: MotionValue<number>;
    step?: StepId;
    onOpenDemo?: () => void;
    isVibrantMode?: boolean;
    isMobile?: boolean;
    headerActions?: React.ReactNode;
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

export default function HeroText({ scrollProgress, step, onOpenDemo, isVibrantMode = false, isMobile: isMobileProp = false, headerActions }: HeroTextProps) {
    const [isMobile, setIsMobile] = useState(true); // Default to true for instant mobile appearance

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

    const isSimpleMode = !!onOpenDemo;
    const [isDebugOpen, setIsDebugOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'button' | 'typography' | 'magnify'>('button');
    const dragControls = useDragControls();
    const [dims, setDims] = useState({ width: 768, height: 600 }); // Starting size (max-w-3xl roughly)

    const handleResize = (direction: 'e' | 's' | 'se') => (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = dims.width;
        const startHeight = dims.height;

        const onMove = (moveEvent: PointerEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            setDims({
                width: (direction === 'e' || direction === 'se') ? Math.max(400, startWidth + deltaX) : startWidth,
                height: (direction === 's' || direction === 'se') ? Math.max(300, startHeight + deltaY) : startHeight
            });
        };

        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    };

    // Primes the audio context on first user interaction
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isDebugOpen) {
                setIsDebugOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDebugOpen]);

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
                className="absolute inset-0 z-20 w-full h-full p-6 pb-24 md:p-12 lg:p-16 flex flex-col justify-end pointer-events-none select-none"
                style={{ y, opacity }}
                initial={isMobile ? false : "hidden"}
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
                            <span className="md:hidden block">Product Designer</span>
                            <span className="hidden md:block">PRODUCT<br />DESIGNER</span>
                        </h1>

                        <div className="mt-1 md:mt-2">
                            <span className="text-white/50 font-medium tracking-tight block text-lg sm:text-xl md:text-3xl">
                                FOR COMPLEX SYSTEMS
                            </span>
                        </div>

                    </motion.div>

                    {/* Right Side: Details + CTA */}
                    <motion.div
                        variants={itemVariants}
                        className="hidden md:flex text-right flex-col items-end gap-3 mt-4 md:mt-0"
                    >
                        <div className="space-y-1 transition-all">
                            <p className="text-base md:text-xl font-medium text-white">Web3 · Fintech · SaaS</p>
                            <p className={`text-xs md:text-sm transition-colors duration-500 ${isVibrantMode ? 'text-white' : 'text-zinc-400'}`}>Previously: <span className="text-white">Input Output (Cardano)</span></p>
                        </div>
                        <div className="transition-all">
                            <p className="text-base md:text-lg font-medium text-white">Start a project</p>
                        </div>
                        <div className="flex items-start justify-end gap-1.5 transition-all mt-1 md:mt-2 ml-auto w-fit">
                            <span className={`font-mono tracking-widest uppercase text-[10px] md:text-sm transition-colors duration-500 text-right ${isVibrantMode ? 'text-white' : 'text-zinc-400'}`}>
                                Available for select projects
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

            {/* Test a Prototype button - centered where estimator was */}
            {isSimpleMode && (
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                    <div className="pointer-events-auto">
                        <InstrumentButton
                            onClick={() => {
                                playPrototypeSound();
                                onOpenDemo();
                            }}
                            isVibrantMode={isVibrantMode}
                            className="px-8 md:px-10 py-3 md:py-4 text-base md:text-[18px]"
                        >
                            Test a Prototype
                        </InstrumentButton>
                    </div>
                </div>
            )}



            {/* SYSTEM LAB MODAL */}
            <AnimatePresence>
                {isDebugOpen && (
                    <motion.div
                        drag
                        dragControls={dragControls}
                        dragListener={false}
                        dragMomentum={false}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{
                            width: dims.width,
                            height: dims.height,
                            left: '50%',
                            top: '50%',
                            x: '-50%',
                            y: '-50%',
                            position: 'fixed'
                        }}
                        className="z-[9999] pointer-events-auto flex flex-col bg-black/95 border border-white/20 rounded-2xl backdrop-blur-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    >
                        {/* HEADER BAR */}
                        <div
                            onPointerDown={(e) => dragControls.start(e)}
                            className="h-12 border-b border-white/10 bg-white/5 flex items-center justify-between px-6 flex-shrink-0 cursor-grab active:cursor-grabbing"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-white opacity-40 text-sm">⌘</span>
                                <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.2em]">System Lab Browser</span>
                            </div>
                            <button
                                onClick={() => setIsDebugOpen(false)}
                                className="text-zinc-500 hover:text-white transition-colors group"
                            >
                                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10 group-hover:border-white/30">ESC</span>
                            </button>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            {/* SIDEBAR */}
                            <div
                                onPointerDown={(e) => dragControls.start(e)}
                                className="w-56 border-r border-white/10 bg-white/5 flex flex-col p-6 gap-8 cursor-grab active:cursor-grabbing"
                            >
                                <div
                                    onPointerDown={(e) => e.stopPropagation()} // Stop drag on title/text
                                    className="flex flex-col gap-1 cursor-default"
                                >
                                    <h2 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] font-black opacity-30">SYSTEM LAB</h2>
                                    <p className="text-zinc-500 font-mono text-[8px] uppercase tracking-widest">PERSISTENT DEBUG v3.0</p>
                                </div>

                                <nav className="flex flex-col gap-2">
                                    <SidebarTab
                                        label="Prototype"
                                        icon="🎯"
                                        active={activeTab === 'button'}
                                        onClick={() => setActiveTab('button')}
                                    />
                                    <SidebarTab
                                        label="Typography"
                                        icon="Aa"
                                        active={activeTab === 'typography'}
                                        onClick={() => setActiveTab('typography')}
                                    />
                                    <SidebarTab
                                        label="Magnify"
                                        icon="🔍"
                                        active={activeTab === 'magnify'}
                                        onClick={() => setActiveTab('magnify')}
                                    />
                                </nav>

                                <div
                                    onPointerDown={(e) => e.stopPropagation()} // Stop drag on inspector
                                    className="mt-auto cursor-default"
                                >
                                    <DebugInspector short />
                                </div>
                            </div>

                            {/* CONTENT AREA */}
                            <div
                                onPointerDown={(e) => dragControls.start(e)}
                                className="flex-1 overflow-y-auto p-10 scrollbar-hide cursor-grab active:cursor-grabbing relative"
                            >
                                <div
                                    onPointerDown={(e) => e.stopPropagation()} // Stop drag on content
                                    className="cursor-default"
                                >
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'button' ? (
                                            <motion.div
                                                key="button"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="space-y-12"
                                            >
                                                <header className="space-y-2">
                                                    <h3 className="text-white text-2xl font-black uppercase tracking-tight">The Reconstruction</h3>
                                                    <p className="text-zinc-500 text-sm font-mono tracking-tight">Verifying the 1:1 vs Supersampled render logic.</p>
                                                </header>

                                                <div className="bg-white/5 rounded-3xl p-16 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden gap-12 group/debug">
                                                    {/* Original Logic Reconstruction */}
                                                    <div className="flex flex-col items-center gap-6">
                                                        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest font-bold">01. Live Button Reconstruction (1:1 Native)</p>
                                                        <div style={{ width: 300, height: 56 }} className="relative">
                                                            <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ isolation: 'isolate' }}>
                                                                <div className="absolute inset-0 rounded-full backdrop-blur-sm" />
                                                                <div className={`absolute inset-0 rounded-full bg-white/90`} />
                                                                <div className="absolute inset-0 flex items-center justify-center pt-[2px] z-10">
                                                                    <span style={{ fontFamily: '"Instrument Sans", sans-serif', fontWeight: 600, fontSize: '20px', letterSpacing: '-0.02em', color: '#000000', fontVariationSettings: '"wdth" 100, "wght" 600' }}>
                                                                        Play with a Prototype
                                                                    </span>
                                                                </div>
                                                                <div className="absolute inset-0 rounded-full border border-black/5 pointer-events-none z-20" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Comparison Point */}
                                                    <div className="flex flex-col items-center gap-6 w-full">
                                                        <p className="text-[10px] font-mono text-blue-500/50 uppercase tracking-widest font-bold">02. Direct Raw Reference (Standard Render)</p>
                                                        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-white/10 w-full max-w-sm">
                                                            <span className="text-[9px] font-mono text-zinc-500 w-12 text-black/50">W:900</span>
                                                            <div style={{ fontFamily: '"Instrument Sans", sans-serif', fontWeight: 600, fontSize: '20px', letterSpacing: '-0.02em', color: '#000000', fontVariationSettings: `"wght" 600, "wdth" 100` }} className="flex-1">
                                                                Play with a Prototype
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : activeTab === 'magnify' ? (
                                            <motion.div
                                                key="magnify"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="space-y-12"
                                            >
                                                <header className="space-y-2">
                                                    <h3 className="text-white text-2xl font-black uppercase tracking-tight">Large Scale Audit</h3>
                                                    <p className="text-zinc-500 text-sm font-mono tracking-tight">Verifying font weight and stroke rendering at 2x magnitude.</p>
                                                </header>

                                                <div className="bg-white/5 rounded-3xl p-16 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden gap-12 group/debug min-h-[400px]">
                                                    <div className="flex flex-col items-center gap-8">
                                                        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest font-bold text-center">2x Magnitude Button (600x112 Output)</p>

                                                        <div style={{ width: 600, height: 112 }} className="relative origin-center">
                                                            <div
                                                                className="group pointer-events-auto absolute top-0 left-0 rounded-full origin-top-left flex items-center justify-center"
                                                                style={{
                                                                    width: 750, // 600 / 0.8
                                                                    height: 140, // 112 / 0.8
                                                                    transform: 'scale(0.8) translateZ(0)',
                                                                    isolation: 'isolate',
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                }}
                                                            >
                                                                <div className="absolute inset-0 rounded-full backdrop-blur-md" />
                                                                <div className="absolute inset-0 rounded-full bg-white/90" />
                                                                <div className="absolute inset-0 flex items-center justify-center pt-[4px] z-10">
                                                                    <span
                                                                        className="text-[50px] tracking-tight text-black"
                                                                        style={{
                                                                            fontFamily: '"Instrument Sans", sans-serif',
                                                                            fontWeight: 600,
                                                                            fontVariationSettings: '"wdth" 100, "wght" 600',
                                                                            fontOpticalSizing: 'auto',
                                                                            textRendering: 'optimizeLegibility'
                                                                        }}
                                                                    >
                                                                        Play with a Prototype
                                                                    </span>
                                                                </div>
                                                                <div className="absolute inset-0 rounded-full border border-black/10 pointer-events-none z-20" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="typography"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="space-y-12"
                                            >
                                                <header className="space-y-2">
                                                    <h3 className="text-white text-2xl font-black uppercase tracking-tight">Hardened Typography</h3>
                                                    <p className="text-zinc-500 text-sm font-mono tracking-tight">Verifying variable weights and fallback cascades.</p>
                                                </header>

                                                <div className="grid grid-cols-1 gap-8">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest border-b border-white/10 pb-2">Weight Ramp (System Font Variable)</h4>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {[400, 500, 600, 700, 800].map((w) => (
                                                                <div key={w} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                                                    <span className="text-[9px] font-mono text-zinc-500 w-12">W:{w}</span>
                                                                    <div style={{ fontFamily: '"Instrument Sans", sans-serif', fontWeight: w, fontVariationSettings: `"wght" ${w}, "wdth" 100` }} className="text-xl text-white flex-1">
                                                                        Instrument Sans {w}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest border-b border-white/10 pb-2">Implementation Fallbacks</h4>
                                                        <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/5">
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-mono text-zinc-500 italic">Test A: Tailwind (.font-instrument-sans)</p>
                                                                <div id="test-1" className="font-instrument-sans font-bold text-lg text-white">INSTRUMENT SANS 700</div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-mono text-zinc-500 italic">Test B: CSS Variable (var(--font-instrument))</p>
                                                                <div id="test-2" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 700 }} className="text-lg text-white">INSTRUMENT SANS 700</div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-mono text-zinc-500 italic">Test C: Raw Name ("Instrument Sans")</p>
                                                                <div id="test-3" style={{ fontFamily: '"Instrument Sans", sans-serif', fontWeight: 700 }} className="text-lg text-white">INSTRUMENT SANS 700</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* RESIZE HANDLES */}
                        {/* Right Edge Handle */}
                        <div
                            onPointerDown={handleResize('e')}
                            className="absolute top-0 right-0 w-1.5 h-full cursor-e-resize z-[100] hover:bg-white/5 transition-colors"
                        />
                        {/* Bottom Edge Handle */}
                        <div
                            onPointerDown={handleResize('s')}
                            className="absolute bottom-0 left-0 w-full h-1.5 cursor-s-resize z-[100] hover:bg-white/5 transition-colors"
                        />
                        {/* Bottom-Right Corner Handle */}
                        <div
                            onPointerDown={handleResize('se')}
                            className="absolute bottom-1 right-1 w-6 h-6 cursor-nwse-resize z-[101] flex items-center justify-center group/resize"
                        >
                            <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-white/10 group-hover/resize:border-white/40 transition-colors rounded-br-[2px]" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function SidebarTab({ label, icon, active, onClick }: { label: string, icon: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-mono text-xs text-left ${active ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
            <span className={`transition-transform duration-500 ${active ? 'scale-110' : 'opacity-40'}`}>{icon}</span>
            <span className="tracking-tight uppercase font-bold">{label}</span>
        </button>
    );
}

function DebugInspector({ short = false }: { short?: boolean }) {
    const [fonts, setFonts] = useState<string[]>(['...', '...', '...']);

    useEffect(() => {
        const interval = setInterval(() => {
            if (typeof window === 'undefined') return;

            const getFont = (id: string) => {
                const el = document.getElementById(id);
                return el ? window.getComputedStyle(el).fontFamily : 'inactive';
            };

            const f1 = getFont('test-1');
            const f2 = getFont('test-2');
            const f3 = getFont('test-3');

            setFonts([f1, f2, f3]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 font-mono text-[8px] space-y-2">
            <p className="text-zinc-500 font-bold uppercase tracking-widest opacity-50">Inspector</p>
            <div className="flex flex-col gap-1">
                <p className="truncate text-zinc-400">TA: <span className="text-white">{fonts[0]}</span></p>
                <p className="truncate text-zinc-400">TB: <span className="text-white">{fonts[1]}</span></p>
                <p className="truncate text-zinc-400">TC: <span className="text-white">{fonts[2]}</span></p>
            </div>
        </div>
    );
}


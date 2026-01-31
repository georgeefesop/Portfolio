'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Shared audio context from HeroText
let sharedContext: AudioContext | null = null;
const getSharedContext = () => {
    if (typeof window === 'undefined') return null;
    if (!sharedContext) {
        sharedContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return sharedContext;
};

interface BackgroundToggleProps {
    onToggle: (isVibrant: boolean) => void;
}

export default function BackgroundToggle({ onToggle }: BackgroundToggleProps) {
    const [isVibrant, setIsVibrant] = useState(false);

    // Load saved preference
    useEffect(() => {
        const saved = localStorage.getItem('bg-mode');
        if (saved === 'vibrant') {
            setIsVibrant(true);
            onToggle(true);
        }
    }, [onToggle]);

    const playToggleSound = () => {
        try {
            const ctx = getSharedContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            // A "mode switch" sound - two-tone chirp
            const note1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            note1.type = 'sine';
            note1.frequency.setValueAtTime(isVibrant ? 600 : 800, now);

            gain1.gain.setValueAtTime(0, now);
            gain1.gain.linearRampToValueAtTime(0.04, now + 0.01);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            note1.connect(gain1);
            gain1.connect(ctx.destination);

            const note2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            note2.type = 'sine';
            note2.frequency.setValueAtTime(isVibrant ? 800 : 600, now + 0.05);

            gain2.gain.setValueAtTime(0, now + 0.05);
            gain2.gain.linearRampToValueAtTime(0.03, now + 0.06);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            note2.connect(gain2);
            gain2.connect(ctx.destination);

            note1.start(now);
            note1.stop(now + 0.08);
            note2.start(now + 0.05);
            note2.stop(now + 0.12);
        } catch (e) { }
    };

    const handleToggle = () => {
        const newState = !isVibrant;
        setIsVibrant(newState);
        onToggle(newState);
        localStorage.setItem('bg-mode', newState ? 'vibrant' : 'dark');
        playToggleSound();
    };

    return (
        <motion.button
            onClick={handleToggle}
            className="fixed right-8 top-1/2 -translate-y-1/2 z-50 group scale-[0.8] origin-right"
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            aria-label={isVibrant ? 'Switch to dark mode' : 'Switch to vibrant mode'}
        >
            {/* Toggle Container */}
            <motion.div
                className="relative w-16 h-32 rounded-full p-1.5 backdrop-blur-sm"
                animate={{
                    background: isVibrant
                        ? 'rgba(255, 255, 255, 0.4)'
                        : 'rgba(255, 255, 255, 0.1)'
                }}
                transition={{ duration: 0.5 }}
            >
                {/* Sliding Pill */}
                <motion.div
                    className="w-full h-14 rounded-full shadow-lg"
                    animate={{
                        y: isVibrant ? 0 : 64,
                        background: isVibrant
                            ? '#FFFFFF'
                            : '#1a1a1f',
                        boxShadow: isVibrant
                            ? '0 0 20px rgba(255, 255, 255, 0.6)'
                            : '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />

                {/* Icons */}
                <div className="absolute inset-0 flex flex-col items-center justify-between py-4 pointer-events-none">
                    <motion.div
                        animate={{
                            opacity: isVibrant ? 1 : 0.4,
                            color: isVibrant ? '#000000' : '#FFFFFF'
                        }}
                        className="text-xl"
                    >
                        ✨
                    </motion.div>
                    <motion.div
                        animate={{
                            opacity: isVibrant ? 0.4 : 1,
                            color: isVibrant ? '#000000' : '#FFFFFF'
                        }}
                        className="text-xl"
                    >
                        🌙
                    </motion.div>
                </div>
            </motion.div>
        </motion.button>
    );
}

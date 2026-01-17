'use client';

import { motion } from 'framer-motion';

interface HeroToggleProps {
    mode: 'kinetic' | 'chrome';
    setMode: (mode: 'kinetic' | 'chrome') => void;
}

export default function HeroToggle({ mode, setMode }: HeroToggleProps) {
    return (
        <div className="absolute top-24 left-6 md:left-12 z-50 flex items-center bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button
                onClick={() => setMode('kinetic')}
                className={`relative px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-full transition-colors duration-300 ${mode === 'kinetic' ? 'text-black' : 'text-zinc-400 hover:text-white'
                    }`}
            >
                {mode === 'kinetic' && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="relative z-10">Kinetic</span>
            </button>

            <button
                onClick={() => setMode('chrome')}
                className={`relative px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-full transition-colors duration-300 ${mode === 'chrome' ? 'text-black' : 'text-zinc-400 hover:text-white'
                    }`}
            >
                {mode === 'chrome' && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="relative z-10">Circle</span>
            </button>
        </div>
    );
}

'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cases } from '@/data/case-studies';

const FEATURED_IDS = [
    'kingfisher-mortgages',
    'akti',
    'instant-access-locksmiths',
    'uk-vehicles',
    'realfi',
    'ai-tools',
];

function openProject(id: string, onClose: () => void) {
    onClose();
    const work = document.getElementById('work');
    if (work) window.scrollTo({ top: work.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('featured:open', { detail: { id } }));
    }, 350);
}

function viewAll(e: React.MouseEvent, onClose: () => void) {
    e.preventDefault();
    onClose();
    const work = document.getElementById('work');
    if (work) window.scrollTo({ top: work.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
}

type Props = {
    open: boolean;
    onClose: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

export default function WorkDropdown({ open, onClose, onMouseEnter, onMouseLeave }: Props) {
    const featured = FEATURED_IDS
        .map((id) => cases.find((c) => c.id === id))
        .filter(Boolean) as typeof cases;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="work-dropdown"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className="work-dropdown absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[640px] max-w-[92vw] rounded-2xl border p-3 z-[101]"
                    style={{
                        background: 'var(--nav-island-bg)',
                        borderColor: 'var(--nav-island-border)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.04) inset',
                    }}
                >
                    <div className="work-dropdown-grid grid grid-cols-2 gap-2">
                        {featured.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => openProject(c.id, onClose)}
                                className="work-dropdown-item group flex items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-bg-secondary/60"
                            >
                                <div className="work-dropdown-thumb relative h-12 w-16 shrink-0 overflow-hidden rounded-md ring-1 ring-border-subtle/50 bg-bg-secondary">
                                    <Image
                                        src={c.images.thumbnail}
                                        alt={c.title}
                                        fill
                                        sizes="64px"
                                        className="object-cover object-top"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="work-dropdown-title text-sm font-semibold text-text-primary truncate">
                                        {c.title}
                                    </div>
                                    <div className="work-dropdown-subtitle text-xs text-text-dim truncate">
                                        {c.subtitle}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <a
                        href="#work"
                        onClick={(e) => viewAll(e, onClose)}
                        className="work-dropdown-all mt-2 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60 transition-colors"
                    >
                        <span>View all {cases.length}+ projects</span>
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

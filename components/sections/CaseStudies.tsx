'use client';

import { useState, useEffect, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import FadeIn from '../motion/FadeIn';
import CaseStudyModal from '../ui/CaseStudyModal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { cases, externalCases, type CaseStudy, type ExternalCase, type CategoryId } from '@/data/case-studies';

const FILTER_PILLS: { id: CategoryId | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'design', label: 'Design' },
    { id: 'wordpress', label: 'WordPress' },
    { id: 'nextjs', label: 'Next.js' },
    { id: 'ai-image', label: 'AI Image & Video' },
];

type DrawerItem = CaseStudy & { kind: 'drawer' };
type ExternalItem = ExternalCase & { kind: 'external' };
type Item = DrawerItem | ExternalItem;

const allItems: Item[] = [
    ...cases.map((c) => ({ ...c, kind: 'drawer' as const })),
    ...externalCases.map((c) => ({ ...c, kind: 'external' as const })),
];

const PINNED_IDS = ['realfi', 'kingfisher-mortgages'];
const ALL_VIEW_INITIAL_COUNT = 4;

export default function CaseStudies() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
    const [showAllInAllView, setShowAllInAllView] = useState(false);
    // null on SSR / first client render → deterministic source order.
    // Set once on mount → shuffled order persists across category changes.
    const [shuffledAllOrderIds, setShuffledAllOrderIds] = useState<string[] | null>(null);

    useEffect(() => {
        const restIds = allItems.filter((i) => !PINNED_IDS.includes(i.id)).map((i) => i.id);
        for (let i = restIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [restIds[i], restIds[j]] = [restIds[j], restIds[i]];
        }
        setShuffledAllOrderIds([...PINNED_IDS, ...restIds]);
    }, []);

    // Open a specific project modal when the featured-work strip in the hero is clicked.
    useEffect(() => {
        const handler = (e: Event) => {
            const id = (e as CustomEvent<{ id?: string }>).detail?.id;
            if (!id) return;
            setActiveCategory('all');
            setShowAllInAllView(true);
            setActiveId(id);
        };
        window.addEventListener('featured:open', handler);
        return () => window.removeEventListener('featured:open', handler);
    }, []);

    const handlePillClick = (id: CategoryId | 'all') => {
        setActiveCategory(id);
        setShowAllInAllView(false);
    };

    const activeProject = activeId
        ? cases.find((c) => c.id === activeId) ?? null
        : null;

    const ordered = useMemo<Item[]>(() => {
        if (activeCategory === 'all') {
            if (shuffledAllOrderIds) {
                return shuffledAllOrderIds
                    .map((id) => allItems.find((i) => i.id === id))
                    .filter(Boolean) as Item[];
            }
            const pinned = PINNED_IDS.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as Item[];
            const rest = allItems.filter((i) => !PINNED_IDS.includes(i.id));
            return [...pinned, ...rest];
        }
        // Category view: drawer cards first, externals after, source order
        const drawer = allItems.filter((i) => i.kind === 'drawer' && i.categories.includes(activeCategory));
        const ext = allItems.filter((i) => i.kind === 'external' && i.categories.includes(activeCategory));
        return [...drawer, ...ext];
    }, [activeCategory, shuffledAllOrderIds]);

    const visible = useMemo<Item[]>(() => {
        if (activeCategory === 'all' && !showAllInAllView) return ordered.slice(0, ALL_VIEW_INITIAL_COUNT);
        return ordered;
    }, [ordered, activeCategory, showAllInAllView]);

    const getCount = (id: CategoryId | 'all') =>
        id === 'all' ? allItems.length : allItems.filter((i) => i.categories.includes(id as CategoryId)).length;

    return (
        <section id="work" className="bg-bg-primary py-12 md:py-32 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">Selected Projects</h2>
                            <p className="text-text-muted text-lg max-w-xl">
                                Product, web, AI, and brand work - across fintech, hospitality, trades, and Web3.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {FILTER_PILLS.map((pill) => {
                            const isActive = activeCategory === pill.id;
                            const count = getCount(pill.id);
                            return (
                                <button
                                    key={pill.id}
                                    onClick={() => handlePillClick(pill.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isActive
                                        ? 'bg-accent-primary/15 text-accent-primary border-accent-primary/40'
                                        : 'bg-bg-tertiary/45 text-text-secondary border-border-medium/70 hover:bg-bg-secondary/70 hover:text-text-primary hover:border-border-strong'
                                        }`}
                                    aria-pressed={isActive}
                                >
                                    {pill.label} <span className="opacity-60 font-normal tabular-nums">({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {visible.map((item, idx) =>
                            item.kind === 'drawer' ? (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveId(item.id)}
                                    className="group block w-full text-left border border-border-subtle rounded-xl overflow-hidden bg-bg-secondary hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/10 transition-all duration-300 focus:outline-none focus-visible:border-accent-primary/60"
                                    aria-haspopup="dialog"
                                >
                                    <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center">
                                        <div className="relative w-full md:w-64 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 bg-bg-tertiary">
                                            <ImageWithFallback
                                                src={item.images.thumbnail}
                                                alt={item.title}
                                                fill
                                                quality={100}
                                                priority={idx < 2}
                                                sizes="(max-width: 768px) 100vw, 300px"
                                                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${item.id === 'realfi' ? 'scale-[1.03]' : ''} ${item.id === 'instant-access-locksmiths' ? 'scale-[1.12]' : ['olympus-sports', 'la-hacienda', 'saxseat'].includes(item.id) ? 'scale-[1.10]' : ''}`}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-1 h-1 rounded-full bg-accent-primary" />
                                                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent-primary">
                                                    {item.role}
                                                </span>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-1.5 group-hover:text-accent-primary transition-colors tracking-tight leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-text-muted text-sm md:text-base mb-3 max-w-xl font-light leading-snug">
                                                {item.subtitle}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {item.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="bg-bg-tertiary/35 px-2 py-1 rounded text-xs font-mono text-text-muted border border-border-subtle/70">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ) : (
                                <a
                                    key={item.id}
                                    href={item.externalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block border border-border-subtle rounded-xl overflow-hidden bg-bg-secondary hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/10 transition-all duration-300"
                                >
                                    <div className="w-full text-left p-6 flex flex-col md:flex-row gap-6 md:items-center">
                                        <div className="relative w-full md:w-64 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 bg-bg-tertiary">
                                            <ImageWithFallback
                                                src={item.thumbnail}
                                                alt={item.title}
                                                fill
                                                quality={100}
                                                sizes="(max-width: 768px) 100vw, 300px"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-1 group-hover:text-accent-primary transition-colors tracking-tight">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-text-muted text-sm md:text-base mb-3 max-w-xl font-light">
                                                        {item.subtitle}
                                                    </p>
                                                </div>
                                                <div className="hidden md:flex items-center justify-center p-2 rounded-full border border-border-subtle text-text-muted group-hover:text-text-primary group-hover:border-border-medium transition-all duration-300">
                                                    <ExternalLink size={18} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {item.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="bg-bg-tertiary/35 px-2 py-1 rounded text-xs font-mono text-text-muted border border-border-subtle/70">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ),
                        )}
                        {visible.length === 0 && (
                            <p className="text-text-muted text-center py-12 lg:col-span-2">No projects in this category yet.</p>
                        )}
                    </div>

                    {activeCategory === 'all' && !showAllInAllView && ordered.length > ALL_VIEW_INITIAL_COUNT && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setShowAllInAllView(true)}
                                className="px-6 py-3 rounded-full text-sm font-medium border bg-bg-tertiary/45 text-text-secondary border-border-medium/70 hover:bg-bg-secondary/70 hover:text-text-primary hover:border-border-strong transition-colors"
                            >
                                Show {ordered.length - ALL_VIEW_INITIAL_COUNT} more
                            </button>
                        </div>
                    )}
                </FadeIn>
            </div>

            <CaseStudyModal project={activeProject} onClose={() => setActiveId(null)} />
        </section>
    );
}

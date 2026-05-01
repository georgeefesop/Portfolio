'use client';

import { useState, useEffect, useMemo } from 'react';
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

type CardItem = DrawerItem | ExternalItem;

function FeaturedCard({ item, onOpen, priority }: { item: CardItem; onOpen: (id: string) => void; priority: boolean }) {
    if (item.kind === 'external') {
        return (
            <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full h-full min-h-[320px] overflow-hidden border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 focus:outline-none"
            >
                <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    quality={90}
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60 mb-2 block">
                        {item.tags[0]}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight group-hover:text-white/90 transition-colors">
                        {item.title}
                    </h3>
                </div>
            </a>
        );
    }
    return (
        <button
            type="button"
            onClick={() => onOpen(item.id)}
            aria-haspopup="dialog"
            className="group relative block w-full h-full min-h-[320px] overflow-hidden border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 focus:outline-none"
        >
            <ImageWithFallback
                src={item.images.thumbnail}
                alt={item.title}
                fill
                quality={90}
                priority={priority}
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60 mb-2 block">
                    {item.role}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight group-hover:text-white/90 transition-colors">
                    {item.title}
                </h3>
            </div>
        </button>
    );
}

function StackedCard({ item, onOpen, priority }: { item: CardItem; onOpen: (id: string) => void; priority: boolean }) {
    if (item.kind === 'external') {
        return (
            <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full text-left border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 overflow-hidden focus:outline-none"
            >
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-bg-tertiary">
                    <ImageWithFallback
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        quality={90}
                        priority={priority}
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted mb-1.5 block">
                        {item.tags[0]}
                    </span>
                    <h3 className="text-base font-bold text-text-primary leading-tight tracking-tight group-hover:text-accent-primary transition-colors">
                        {item.title}
                    </h3>
                </div>
            </a>
        );
    }
    return (
        <button
            type="button"
            onClick={() => onOpen(item.id)}
            aria-haspopup="dialog"
            className="group block w-full text-left border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 overflow-hidden focus:outline-none"
        >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-bg-tertiary">
                <ImageWithFallback
                    src={item.images.thumbnail}
                    alt={item.title}
                    fill
                    quality={90}
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
            </div>
            <div className="p-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted mb-1.5 block">
                    {item.role}
                </span>
                <h3 className="text-base font-bold text-text-primary leading-tight tracking-tight group-hover:text-accent-primary transition-colors">
                    {item.title}
                </h3>
            </div>
        </button>
    );
}

function GridCard({ item, onOpen, priority }: { item: CardItem; onOpen: (id: string) => void; priority: boolean }) {
    if (item.kind === 'external') {
        return (
            <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full text-left border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 overflow-hidden focus:outline-none"
            >
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-bg-tertiary">
                    <ImageWithFallback
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        quality={90}
                        priority={priority}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted mb-1.5 block">
                        {item.tags[0]}
                    </span>
                    <h3 className="text-sm font-bold text-text-primary mb-1 leading-tight tracking-tight group-hover:text-accent-primary transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-text-muted text-xs leading-snug line-clamp-2">{item.subtitle}</p>
                </div>
            </a>
        );
    }
    return (
        <button
            type="button"
            onClick={() => onOpen(item.id)}
            aria-haspopup="dialog"
            className="group block w-full text-left border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 overflow-hidden focus:outline-none"
        >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-bg-tertiary">
                <ImageWithFallback
                    src={item.images.thumbnail}
                    alt={item.title}
                    fill
                    quality={90}
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
            </div>
            <div className="p-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted mb-1.5 block">
                    {item.role}
                </span>
                <h3 className="text-sm font-bold text-text-primary mb-1 leading-tight tracking-tight group-hover:text-accent-primary transition-colors">
                    {item.title}
                </h3>
                <p className="text-text-muted text-xs leading-snug line-clamp-2">{item.subtitle}</p>
            </div>
        </button>
    );
}

const allItems: Item[] = [
    ...cases.map((c) => ({ ...c, kind: 'drawer' as const })),
    ...externalCases.map((c) => ({ ...c, kind: 'external' as const })),
];

const PINNED_IDS = ['realfi', 'kingfisher-mortgages'];
const ALL_VIEW_INITIAL_COUNT = 7;

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
                    <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted mb-10 block">
                        Selected Projects
                    </span>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 border-b border-border-subtle pb-0">
                        {FILTER_PILLS.map((pill) => {
                            const isActive = activeCategory === pill.id;
                            const count = getCount(pill.id);
                            return (
                                <button
                                    key={pill.id}
                                    onClick={() => handlePillClick(pill.id)}
                                    className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                        isActive
                                            ? 'border-text-primary text-text-primary'
                                            : 'border-transparent text-text-muted hover:text-text-secondary'
                                    }`}
                                    aria-pressed={isActive}
                                >
                                    {pill.label}{' '}
                                    <span className="opacity-50 font-normal tabular-nums">({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    {activeCategory === 'all' ? (
                        <div className="space-y-px">
                            {visible.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-px min-h-[360px]">
                                    <div className="md:col-span-3">
                                        <FeaturedCard
                                            item={visible[0]}
                                            onOpen={(id) => setActiveId(id)}
                                            priority
                                        />
                                    </div>
                                    {visible.slice(1, 3).map((item, i) => (
                                        <div key={item.id} className="md:col-span-2">
                                            <StackedCard item={item} onOpen={(id) => setActiveId(id)} priority={i === 0} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {visible.length > 3 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
                                    {visible.slice(3).map((item) => (
                                        <GridCard key={item.id} item={item} onOpen={(id) => setActiveId(id)} priority={false} />
                                    ))}
                                </div>
                            )}
                            {visible.length === 0 && (
                                <p className="text-text-muted text-center py-12">No projects in this category yet.</p>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
                            {visible.map((item) => (
                                <GridCard key={item.id} item={item} onOpen={(id) => setActiveId(id)} priority={false} />
                            ))}
                            {visible.length === 0 && (
                                <p className="text-text-muted text-center py-12 col-span-3">No projects in this category yet.</p>
                            )}
                        </div>
                    )}

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

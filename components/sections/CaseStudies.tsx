'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import FadeIn from '../motion/FadeIn';
import { StackLogosOverlay } from '../ui/TechLogoMark';
import posthog from 'posthog-js';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { cases, externalCases, type CaseStudy, type ExternalCase, type CategoryId } from '@/data/case-studies';

const MotionLink = motion.create(Link);

const FILTER_PILLS: { id: CategoryId | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'design', label: 'Design' },
    { id: 'wordpress', label: 'WordPress' },
    { id: 'nextjs', label: 'Next.js' },
    { id: 'react', label: 'React' },
    { id: 'webflow', label: 'Webflow' },
    { id: 'tailwind', label: 'Tailwind' },
    { id: 'sanity', label: 'Sanity' },
    { id: 'ai-image', label: 'AI Image & Video' },
];

const STACK_TO_CATEGORY: Record<string, CategoryId> = {
    react: 'react',
    webflow: 'webflow',
    tailwindcss: 'tailwind',
    sanity: 'sanity',
    nextjs: 'nextjs',
    wordpress: 'wordpress',
};

type DrawerItem = CaseStudy & { kind: 'drawer' };
type ExternalItem = ExternalCase & { kind: 'external' };
type Item = DrawerItem | ExternalItem;

function getEffectiveCategories(item: Item): Set<CategoryId> {
    const set = new Set<CategoryId>(item.categories);
    if (item.kind === 'drawer') {
        const stacks: string[] = [...(item.stack ?? [])];
        item.builds?.forEach((b) => { if (b.stack) stacks.push(...b.stack); });
        for (const s of stacks) {
            const c = STACK_TO_CATEGORY[s];
            if (c) set.add(c);
        }
    }
    return set;
}

const ZOOM_IDS = new Set(['la-hacienda', 'saxseat']);

function ThumbCard({ item, onOpen, priority }: { item: Item; onOpen: (id: string) => void; priority: boolean }) {
    const src = item.kind === 'external' ? item.thumbnail : item.images.thumbnail;
    const isVideo = item.kind === 'external' && !!item.duration;
    const stack = item.kind === 'drawer' ? item.stack ?? [] : [];
    const isZoomed = ZOOM_IDS.has(item.id);

    const sharedClass =
        'group relative block w-full overflow-hidden border bg-bg-secondary transition-colors duration-300 focus:outline-none aspect-[3/2]'
        + ' [border-color:var(--thumb-card-border)] hover:[border-color:var(--thumb-card-border)]'
        + ' rounded-[6px]'
        + ' [box-shadow:var(--thumb-card-shadow)]';

    const overlays = (
        <>
            {/* Play button + duration badge - video tiles */}
            {isVideo && (
                <>
                    <div className="thumb-card-play-wrap absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="thumb-card-play-button w-12 h-12 bg-black/50 rounded-full flex items-center justify-center group-hover:bg-accent-primary/80 transition-colors duration-300">
                            <Play className="thumb-card-play-icon w-5 h-5 text-white ml-0.5" fill="currentColor" />
                        </div>
                    </div>
                    <div className="thumb-card-duration absolute top-3 right-3 bg-black/80 px-2 py-0.5 rounded text-xs text-white font-mono">
                        {(item as ExternalCase).duration}
                    </div>
                </>
            )}

            {/* External link icon */}
            {!isVideo && item.kind === 'external' && (
                <div className="thumb-card-external-wrap absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <ExternalLink className="thumb-card-external-icon w-4 h-4 text-white drop-shadow-md" />
                </div>
            )}

            {stack.length > 0 && (
                <div className="thumb-card-stack-wrap absolute bottom-3 right-3 z-10">
                    <StackLogosOverlay ids={stack} size={13} />
                </div>
            )}
        </>
    );

    const img = (
        <ImageWithFallback
            src={src}
            alt={item.title}
            fill
            quality={90}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`thumb-card-image object-cover object-top ${isZoomed ? 'scale-110' : ''}`}
        />
    );
    if (item.kind === 'external') {
        return (
            <motion.a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.title}
                className={`thumb-card thumb-card-external ${sharedClass}`}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
                {img}
                {overlays}
            </motion.a>
        );
    }
    return (
        <MotionLink
            href={`/case-studies/${item.id}`}
            onClick={() => onOpen(item.id)}
            aria-label={item.title}
            className={`thumb-card thumb-card-drawer ${sharedClass}`}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
            {img}
            {overlays}
        </MotionLink>
    );
}

const allItems: Item[] = [
    ...cases.map((c) => ({ ...c, kind: 'drawer' as const })),
    ...externalCases.map((c) => ({ ...c, kind: 'external' as const })),
];

const PINNED_IDS = [
    'ai-visual-production',
    'la-hacienda-rebrand',
    'realfi',
    'estia-kitchens',
    'kingfisher-mortgages',
    'akti',
    'instant-access-locksmiths',
    'uk-vehicles',
    'ai-tools',
    'shackle',
    'sidechains',
    'saxseat',
    'allsop-francis',
    'bank-of-cyprus',
    'la-hacienda',
];

const SHOW_MORE_THRESHOLD = 12;

const TRAILING_IDS = ['figma-microinteractions'];

export default function CaseStudies() {
    const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
    const [shuffledAllOrderIds, setShuffledAllOrderIds] = useState<string[] | null>(null);
    const [showAll, setShowAll] = useState(false);
    useEffect(() => {
        const restIds = allItems
            .filter((i) => !PINNED_IDS.includes(i.id) && !TRAILING_IDS.includes(i.id))
            .map((i) => i.id);
        for (let i = restIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [restIds[i], restIds[j]] = [restIds[j], restIds[i]];
        }
        setShuffledAllOrderIds([...PINNED_IDS, ...restIds, ...TRAILING_IDS]);
    }, []);

    const visible = useMemo<Item[]>(() => {
        if (activeCategory === 'all') {
            if (shuffledAllOrderIds) {
                return shuffledAllOrderIds
                    .map((id) => allItems.find((i) => i.id === id))
                    .filter(Boolean) as Item[];
            }
            const pinned = PINNED_IDS.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as Item[];
            const trailing = TRAILING_IDS.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as Item[];
            const rest = allItems.filter((i) => !PINNED_IDS.includes(i.id) && !TRAILING_IDS.includes(i.id));
            return [...pinned, ...rest, ...trailing];
        }
        const drawer = allItems.filter((i) => i.kind === 'drawer' && getEffectiveCategories(i).has(activeCategory));
        const ext = allItems.filter((i) => i.kind === 'external' && getEffectiveCategories(i).has(activeCategory));
        return [...drawer, ...ext];
    }, [activeCategory, shuffledAllOrderIds]);

    const getCount = (id: CategoryId | 'all') =>
        id === 'all' ? allItems.length : allItems.filter((i) => getEffectiveCategories(i).has(id as CategoryId)).length;

    return (
        <section id="work" className="case-studies-section bg-bg-primary py-12 md:py-32 scroll-mt-20">
            <div className="case-studies-container px-4 sm:px-6 lg:px-10 xl:px-14">
                <FadeIn>
                    <div className="case-studies-header mb-12">
                        <h2 className="case-studies-heading font-serif text-h1 leading-[0.95] tracking-tight">
                            <span className="case-studies-heading-prefix text-text-dim">Selected</span>{' '}
                            <span className="case-studies-heading-accent italic font-normal text-text-primary">Projects</span>
                        </h2>
                    </div>

                    <div className="case-studies-filter-bar flex flex-wrap gap-x-6 gap-y-2 mb-8 border-b [border-color:var(--bg-secondary)] pb-0">
                        {FILTER_PILLS.map((pill) => {
                            const isActive = activeCategory === pill.id;
                            const count = getCount(pill.id);
                            return (
                                <button
                                    key={pill.id}
                                    onClick={() => setActiveCategory(pill.id)}
                                    className={`case-studies-filter ${isActive ? 'case-studies-filter-active' : ''} pb-3 text-base font-medium transition-colors border-b-2 -mb-px ${
                                        isActive
                                            ? 'border-text-primary text-text-primary'
                                            : 'border-transparent text-text-dim hover:text-text-secondary'
                                    }`}
                                    aria-pressed={isActive}
                                >
                                    {pill.label}{' '}
                                    <span className="case-studies-filter-count font-normal tabular-nums text-sm text-accent-primary">({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    {(() => {
                        const isAllCategory = activeCategory === 'all';
                        const displayed = isAllCategory && !showAll ? visible.slice(0, SHOW_MORE_THRESHOLD) : visible;
                        const hiddenCount = isAllCategory && !showAll ? Math.max(0, visible.length - SHOW_MORE_THRESHOLD) : 0;
                        return (
                            <>
                                <div className="case-studies-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                    {displayed.map((item, i) => (
                                        <ThumbCard
                                            key={item.id}
                                            item={item}
                                            onOpen={(id) => {
                                                posthog.capture?.('case_study_opened', { case_id: id, kind: item.kind, category: activeCategory });
                                            }}
                                            priority={i < 4}
                                        />
                                    ))}
                                    {displayed.length === 0 && (
                                        <p className="case-studies-empty text-text-muted text-center py-12 col-span-full">
                                            No projects in this category yet.
                                        </p>
                                    )}
                                </div>
                                {hiddenCount > 0 && (
                                    <div className="case-studies-show-more flex justify-center mt-10">
                                        <button
                                            onClick={() => setShowAll(true)}
                                            className="text-sm font-medium text-text-secondary hover:text-text-primary border [border-color:var(--border-medium)] hover:[border-color:var(--text-primary)] px-6 py-2.5 rounded transition-colors duration-200"
                                        >
                                            Show {hiddenCount} more
                                        </button>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </FadeIn>
            </div>
        </section>
    );
}

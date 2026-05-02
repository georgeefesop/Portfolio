'use client';

import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Play } from 'lucide-react';
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

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
    FILTER_PILLS.filter((p) => p.id !== 'all').map((p) => [p.id, p.label])
);

const PILL = 'inline-block text-xs font-mono uppercase tracking-wider text-text-secondary bg-bg-tertiary/40 border border-border-medium/60 px-2.5 py-1 rounded';

function ThumbCard({ item, onOpen, priority }: { item: Item; onOpen: (id: string) => void; priority: boolean }) {
    const src = item.kind === 'external' ? item.thumbnail : item.images.thumbnail;
    const isVideo = item.kind === 'external' && !!item.duration;
    const sharedClass =
        'group relative block w-full overflow-hidden border-2 border-border-subtle bg-bg-secondary hover:border-accent-primary transition-colors duration-300 focus:outline-none rounded aspect-[3/2]';

    const overlays = (
        <>
            {/* Title + category pills - bottom left */}
            <div className="thumb-card-overlay absolute bottom-0 left-0 right-0 p-3 flex flex-row items-end gap-2 pointer-events-none">
                <span className="thumb-card-title min-w-0 shrink text-base font-medium normal-case tracking-[0.2px] border-2 px-[14px] pt-1 pb-[5px] rounded whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.title}
                </span>
                <div className="thumb-card-tag-list flex flex-wrap gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {item.categories.map((cat) => (
                        <span key={cat} className={`thumb-card-tag ${PILL} !font-medium !tracking-[1.4px] !leading-[1.2]`}>{CATEGORY_LABEL[cat] ?? cat}</span>
                    ))}
                </div>
            </div>

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
            className="thumb-card-image object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
    );
    if (item.kind === 'external') {
        return (
            <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.title}
                className={`thumb-card thumb-card-external ${sharedClass}`}
            >
                {img}
                {overlays}
            </a>
        );
    }
    return (
        <button
            type="button"
            onClick={() => onOpen(item.id)}
            aria-haspopup="dialog"
            aria-label={item.title}
            className={`thumb-card thumb-card-drawer ${sharedClass}`}
        >
            {img}
            {overlays}
        </button>
    );
}

const allItems: Item[] = [
    ...cases.map((c) => ({ ...c, kind: 'drawer' as const })),
    ...externalCases.map((c) => ({ ...c, kind: 'external' as const })),
];

const PINNED_IDS = ['kingfisher-mortgages', 'realfi'];

export default function CaseStudies() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
    const [shuffledAllOrderIds, setShuffledAllOrderIds] = useState<string[] | null>(null);

    useEffect(() => {
        const restIds = allItems.filter((i) => !PINNED_IDS.includes(i.id)).map((i) => i.id);
        for (let i = restIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [restIds[i], restIds[j]] = [restIds[j], restIds[i]];
        }
        setShuffledAllOrderIds([...PINNED_IDS, ...restIds]);
    }, []);

    useEffect(() => {
        const handler = (e: Event) => {
            const id = (e as CustomEvent<{ id?: string }>).detail?.id;
            if (!id) return;
            setActiveCategory('all');
            setActiveId(id);
        };
        window.addEventListener('featured:open', handler);
        return () => window.removeEventListener('featured:open', handler);
    }, []);

    const activeProject = activeId ? cases.find((c) => c.id === activeId) ?? null : null;

    const visible = useMemo<Item[]>(() => {
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
        const drawer = allItems.filter((i) => i.kind === 'drawer' && i.categories.includes(activeCategory));
        const ext = allItems.filter((i) => i.kind === 'external' && i.categories.includes(activeCategory));
        return [...drawer, ...ext];
    }, [activeCategory, shuffledAllOrderIds]);

    const getCount = (id: CategoryId | 'all') =>
        id === 'all' ? allItems.length : allItems.filter((i) => i.categories.includes(id as CategoryId)).length;

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

                    <div className="case-studies-filter-bar flex flex-wrap gap-x-6 gap-y-2 mb-8 border-b border-border-subtle pb-0">
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
                                    <span className="case-studies-filter-count opacity-40 font-normal tabular-nums text-sm">({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="case-studies-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                        {visible.map((item, i) => (
                            <ThumbCard
                                key={item.id}
                                item={item}
                                onOpen={(id) => setActiveId(id)}
                                priority={i < 4}
                            />
                        ))}
                        {visible.length === 0 && (
                            <p className="case-studies-empty text-text-muted text-center py-12 col-span-full">
                                No projects in this category yet.
                            </p>
                        )}
                    </div>
                </FadeIn>
            </div>

            <CaseStudyModal project={activeProject} onClose={() => setActiveId(null)} />
        </section>
    );
}

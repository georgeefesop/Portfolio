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

function ThumbCard({ item, onOpen, priority }: { item: Item; onOpen: (id: string) => void; priority: boolean }) {
    const src = item.kind === 'external' ? item.thumbnail : item.images.thumbnail;
    const sharedClass =
        'group relative block w-full overflow-hidden border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 focus:outline-none rounded-sm aspect-[3/2]';
    const img = (
        <ImageWithFallback
            src={src}
            alt={item.title}
            fill
            quality={90}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
    );
    if (item.kind === 'external') {
        return (
            <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.title}
                className={sharedClass}
            >
                {img}
            </a>
        );
    }
    return (
        <button
            type="button"
            onClick={() => onOpen(item.id)}
            aria-haspopup="dialog"
            aria-label={item.title}
            className={sharedClass}
        >
            {img}
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
        <section id="work" className="bg-bg-primary py-12 md:py-32 scroll-mt-20">
            <div className="px-4 sm:px-6 lg:px-10 xl:px-14">
                <FadeIn>
                    <div className="mb-12">
                        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted mb-4 block">
                            Work · 01
                        </span>
                        <h2 className="font-sans text-h1 leading-[0.95] tracking-tight text-text-primary">
                            Selected{' '}
                            <span className="italic font-light text-accent-primary">Projects</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 border-b border-border-subtle pb-0">
                        {FILTER_PILLS.map((pill) => {
                            const isActive = activeCategory === pill.id;
                            const count = getCount(pill.id);
                            return (
                                <button
                                    key={pill.id}
                                    onClick={() => setActiveCategory(pill.id)}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                        {visible.map((item, i) => (
                            <ThumbCard
                                key={item.id}
                                item={item}
                                onOpen={(id) => setActiveId(id)}
                                priority={i < 4}
                            />
                        ))}
                        {visible.length === 0 && (
                            <p className="text-text-muted text-center py-12 col-span-full">
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

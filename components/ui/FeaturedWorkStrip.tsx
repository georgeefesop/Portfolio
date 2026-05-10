'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';
import { StackLogosOverlay } from './TechLogoMark';
import { cases } from '@/data/case-studies';

type FeaturedItem = {
    id: string;
    title: string;
    tag: string;
    thumbnail: string;
    externalLink?: string;
};

// Pull each featured item's stack from the canonical case-study data so the
// thumbnail overlay stays in sync when a case's tech list changes.
const stackById: Record<string, string[]> = Object.fromEntries(
    cases.map((c) => [c.id, c.stack ?? []])
);

const ZOOM_IDS = new Set([
    'la-hacienda',
    'instant-access-locksmiths',
    'saxseat',
]);

const items: FeaturedItem[] = [
    { id: 'kingfisher-mortgages', title: 'Kingfisher Mortgages', tag: 'WordPress · Brand', thumbnail: '/images/kingfisher-thumb.jpg' },
    { id: 'akti', title: 'Aktí', tag: 'Brand · Configurator', thumbnail: '/images/akti/akti-hero.jpg' },
    { id: 'uk-vehicles', title: 'UK Vehicles Cyprus', tag: 'Next.js · Commerce', thumbnail: '/images/uk-vehicles/hero-4.jpg' },
    { id: 'ai-tools', title: 'AI User Tools', tag: 'UX · AI', thumbnail: '/images/ai-tools/AIUT-2.png' },
    { id: 'instant-access-locksmiths', title: 'Instant Access Locksmiths', tag: 'Local SEO · Conversion', thumbnail: '/images/instant-access-locksmiths/hero-thumb.jpg' },
];

function dispatchOpen(item: FeaturedItem) {
    window.dispatchEvent(new CustomEvent('featured:open', { detail: { id: item.id } }));
}

function HorizontalCard({ item, priority }: { item: FeaturedItem; priority?: boolean }) {
    const isInstantAccess = item.id === 'instant-access-locksmiths';
    const isZoomed = ZOOM_IDS.has(item.id);
    const baseScale = isInstantAccess ? 'scale-[1.12]' : isZoomed ? 'scale-110' : '';
    const stack = stackById[item.id] ?? [];
    return (
        <div className="featured-work-strip-card featured-work-strip-card-horizontal w-[312px] group">
            <motion.div
                className="featured-work-strip-thumb-wrap relative aspect-[3/2] rounded-lg overflow-hidden bg-white/5 border-2 border-white/10 group-hover:[border-color:var(--thumb-card-border)] [box-shadow:2px_2px_3px_2px_rgba(74,56,38,0.08)] group-hover:[box-shadow:var(--thumb-card-shadow)] transition-[box-shadow,border-color] duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
                <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="312px"
                    priority={priority}
                    className={`featured-work-strip-thumb object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500 featured-strip-img ${baseScale}`}
                />
                {stack.length > 0 && (
                    <div className="featured-work-strip-stack-wrap absolute bottom-3 right-3 z-10">
                        <StackLogosOverlay ids={stack} size={12} />
                    </div>
                )}
            </motion.div>
            <div className="featured-work-strip-meta mt-3">
                <div className="featured-work-strip-title text-base font-medium text-text-primary truncate group-hover:text-accent-primary transition-colors">
                    {item.title}
                </div>
            </div>
        </div>
    );
}

function VerticalCard({ item, priority }: { item: FeaturedItem; priority?: boolean }) {
    const isInstantAccess = item.id === 'instant-access-locksmiths';
    const isZoomed = ZOOM_IDS.has(item.id);
    const zoomClass = isInstantAccess ? 'scale-[1.12]' : isZoomed ? 'scale-110' : '';
    const posClass = isInstantAccess ? 'object-top' : 'object-center';
    const stack = stackById[item.id] ?? [];
    return (
        <div className="featured-work-strip-card featured-work-strip-card-vertical w-full group">
            <div className="featured-work-strip-thumb-wrap relative aspect-[3/2] rounded-lg overflow-hidden bg-bg-tertiary border-2 border-border-subtle">
                <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 312px"
                    priority={priority}
                    className={`featured-work-strip-thumb object-cover opacity-95 transition-transform duration-500 featured-strip-img ${posClass} ${zoomClass}`}
                />
                {stack.length > 0 && (
                    <div className="featured-work-strip-stack-wrap absolute bottom-3 right-3 z-10">
                        <StackLogosOverlay ids={stack} size={12} />
                    </div>
                )}
            </div>
            <div className="featured-work-strip-meta mt-3">
                <div className="featured-work-strip-title text-base font-medium text-text-primary truncate">
                    {item.title}
                </div>
            </div>
        </div>
    );
}

function renderClickable(
    item: FeaturedItem,
    key: string,
    extraClass: string,
    Inner: React.ComponentType<{ item: FeaturedItem; priority?: boolean }>,
    priority?: boolean,
    animIndex?: number,
) {
    const inner = item.externalLink ? (
        <a
            href={item.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`featured-work-strip-item featured-work-strip-item-link block shrink-0 pointer-events-auto ${extraClass}`}
        >
            <Inner item={item} priority={priority} />
        </a>
    ) : (
        <button
            type="button"
            onClick={() => dispatchOpen(item)}
            className={`featured-work-strip-item featured-work-strip-item-button block shrink-0 pointer-events-auto text-left ${extraClass}`}
        >
            <Inner item={item} priority={priority} />
        </button>
    );

    if (animIndex !== undefined) {
        return (
            <motion.div
                key={key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 + animIndex * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
                {inner}
            </motion.div>
        );
    }

    return <div key={key}>{inner}</div>;
}

export default function FeaturedWorkStrip({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
    if (orientation === 'vertical') return <VerticalStrip />;
    return <HorizontalStrip />;
}

function HorizontalStrip() {
    const x = useMotionValue(0);
    const [isHover, setIsHover] = useState(false);
    const speedRef = useRef(0);
    const halfWidth = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const visibleRef = useRef(true);

    useEffect(() => {
        const update = () => {
            const track = trackRef.current;
            if (!track || track.children.length <= items.length) return;
            // Distance from first item of set A to first item of set B = exact
            // seamless wrap distance. Don't use scrollWidth / N - that includes
            // edge gaps and is off by half a gap per loop, causing visible jumps.
            const first = track.children[0] as HTMLElement;
            const second = track.children[items.length] as HTMLElement;
            halfWidth.current = second.offsetLeft - first.offsetLeft;
        };
        update();
        const ro = new ResizeObserver(update);
        if (trackRef.current) ro.observe(trackRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; }, { threshold: 0 });
        if (rootRef.current) io.observe(rootRef.current);
        return () => io.disconnect();
    }, []);

    useAnimationFrame((_t, delta) => {
        if (!visibleRef.current) return;
        if (typeof document !== 'undefined' && document.documentElement.dataset.modalOpen) return;
        if (isHover) {
            const k = 1 - Math.exp(-delta * 0.005);
            speedRef.current += (0 - speedRef.current) * k;
        } else {
            speedRef.current = 60;
        }
        let next = x.get() - speedRef.current * (delta / 1000);
        if (halfWidth.current > 0 && next <= -halfWidth.current) next += halfWidth.current;
        x.set(next);
    });

    return (
        <div
            ref={rootRef}
            className="featured-work-strip-root featured-work-strip-root-horizontal hidden md:block w-full [overflow-x:clip] py-3"
            style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <motion.div ref={trackRef} style={{ x }} className="featured-work-strip-track flex gap-16 w-max will-change-transform">
                {items.map((item, idx) => renderClickable(item, `a-${idx}`, '', HorizontalCard, idx === 0, idx))}
                {items.map((item, idx) => renderClickable(item, `b-${idx}`, '', HorizontalCard, false, items.length + idx))}
                {items.map((item, idx) => renderClickable(item, `c-${idx}`, '', HorizontalCard, false, items.length * 2 + idx))}
            </motion.div>
        </div>
    );
}

function VerticalStrip() {
    const y = useMotionValue(0);
    const speedRef = useRef(0);
    const halfHeight = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const visibleRef = useRef(true);

    useEffect(() => {
        const update = () => {
            const track = trackRef.current;
            if (!track || track.children.length <= items.length) return;
            const first = track.children[0] as HTMLElement;
            const second = track.children[items.length] as HTMLElement;
            halfHeight.current = second.offsetTop - first.offsetTop;
        };
        update();
        const ro = new ResizeObserver(update);
        if (trackRef.current) ro.observe(trackRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; }, { threshold: 0 });
        if (rootRef.current) io.observe(rootRef.current);
        return () => io.disconnect();
    }, []);

    useAnimationFrame((_t, delta) => {
        if (!visibleRef.current) return;
        if (typeof document !== 'undefined' && document.documentElement.dataset.modalOpen) return;
        const target = 35;
        const k = 1 - Math.exp(-delta * 0.003);
        speedRef.current += (target - speedRef.current) * k;
        let next = y.get() - speedRef.current * (delta / 1000);
        if (halfHeight.current > 0 && next <= -halfHeight.current) next += halfHeight.current;
        y.set(next);
    });

    return (
        <div
            ref={rootRef}
            className="featured-work-strip-root featured-work-strip-root-vertical md:hidden w-full h-full overflow-hidden"
            style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, black 14%, black 86%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 0, black 14%, black 86%, transparent 100%)',
            }}
        >
            <motion.div ref={trackRef} style={{ y }} className="featured-work-strip-track featured-work-strip-track-vertical flex flex-col gap-5 h-max will-change-transform px-12">
                {items.map((item, idx) => renderClickable(item, `va-${idx}`, 'block w-full', VerticalCard, idx === 0, idx))}
                {items.map((item, idx) => renderClickable(item, `vb-${idx}`, 'block w-full', VerticalCard))}
                {items.map((item, idx) => renderClickable(item, `vc-${idx}`, 'block w-full', VerticalCard))}
            </motion.div>
        </div>
    );
}

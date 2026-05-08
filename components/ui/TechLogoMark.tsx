'use client';

import { techLogos, type TechLogoId } from '@/data/tech-logos';

/** Renders a brand mark using CSS mask-image so the SVG fill inherits a
 *  parent-controlled colour (currentColor or any background-color override).
 *  Next/Image loads SVGs in an isolated document where `currentColor` doesn't
 *  inherit, so mask-image is the established pattern in this project (see
 *  CLAUDE.md, CredibilityBar precedent).
 *
 *  Pass `id` from the tech-logos registry. Unknown ids render nothing. */
export default function TechLogoMark({
    id,
    size = 14,
    title,
    className = '',
    style,
}: {
    id: string;
    size?: number;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
}) {
    const logo = techLogos[id as TechLogoId];
    if (!logo) return null;
    return (
        <span
            role="img"
            aria-label={title ?? logo.name}
            title={title ?? logo.name}
            className={`tech-logo-mark inline-block flex-shrink-0 ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: 'currentColor',
                WebkitMaskImage: `url(${logo.src})`,
                maskImage: `url(${logo.src})`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                ...style,
            }}
        />
    );
}

/** Horizontal strip of stack logos. Pass in tech-logo ids; unknown ids are
 *  skipped silently. Used in the modal intro and per-build header. */
export function StackLogos({
    ids,
    size = 18,
    className = '',
    showLabels = false,
}: {
    ids: string[];
    size?: number;
    className?: string;
    showLabels?: boolean;
}) {
    if (!ids.length) return null;
    return (
        <div className={`stack-logos flex items-center gap-3 ${className}`}>
            {ids.map((id) => {
                const logo = techLogos[id as TechLogoId];
                if (!logo) return null;
                return (
                    <span key={id} className="stack-logos-item inline-flex items-center gap-1.5 text-text-muted">
                        <TechLogoMark id={id} size={size} />
                        {showLabels && (
                            <span className="stack-logos-label text-[11px] font-mono uppercase tracking-[0.14em]">
                                {logo.name}
                            </span>
                        )}
                    </span>
                );
            })}
        </div>
    );
}

/** Compact white-on-dark logo overlay for use over project thumbnails.
 *  Renders a small pill containing the marks at low opacity so they read
 *  as a watermark rather than a primary UI element. */
export function StackLogosOverlay({
    ids,
    size = 13,
    className = '',
}: {
    ids: string[];
    size?: number;
    className?: string;
}) {
    if (!ids.length) return null;
    // Cap at 4 to avoid clutter on thumbnail-size cards.
    const capped = ids.slice(0, 4);
    return (
        <div
            className={`stack-logos-overlay pointer-events-none flex items-center gap-2 px-2 py-1.5 rounded text-white/85 ${className}`}
            style={{ backgroundColor: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)' }}
        >
            {capped.map((id) => (
                <TechLogoMark key={id} id={id} size={size} style={{ color: 'currentColor' }} />
            ))}
        </div>
    );
}

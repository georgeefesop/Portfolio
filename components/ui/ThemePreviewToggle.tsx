'use client';

/**
 * Temporary 4-way theme preview picker.
 * Lets us A/B/C/D dark + 3 light palettes on the live site before locking one in.
 * Will be replaced by a 2-way light/dark toggle once a palette is chosen.
 */

import { useEffect, useState } from 'react';

type ThemeId = 'dark' | 'light-olive';

const THEMES: { id: ThemeId; label: string; swatch: string; ring: string }[] = [
    { id: 'dark', label: 'Dark', swatch: '#0F0F0F', ring: '#AB7B62' },
    { id: 'light-olive', label: 'Light', swatch: '#E8E0CA', ring: '#2A1B08' },
];

const STORAGE_KEY = 'theme-preview';

function applyTheme(id: ThemeId) {
    if (id === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', id);
    }
}

export default function ThemePreviewToggle() {
    const [active, setActive] = useState<ThemeId>('light-olive');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
            if (saved && THEMES.some(t => t.id === saved)) {
                setActive(saved);
                applyTheme(saved);
            } else {
                applyTheme('light-olive');
            }
        } catch { }
    }, []);

    const handlePick = (id: ThemeId) => {
        setActive(id);
        applyTheme(id);
        try {
            localStorage.setItem(STORAGE_KEY, id);
        } catch { }
    };

    if (!mounted) {
        return <div className="h-8 w-[160px]" aria-hidden />;
    }

    return (
        <div
            role="radiogroup"
            aria-label="Theme preview"
            className="flex items-center gap-2.5 rounded-full border border-border-subtle bg-bg-secondary/60 backdrop-blur-sm px-2 py-1"
        >
            {THEMES.map(t => {
                const isActive = t.id === active;
                return (
                    <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        aria-label={`Preview ${t.label} theme`}
                        title={t.label}
                        onClick={() => handlePick(t.id)}
                        className={`relative h-6 w-6 rounded-full transition-transform duration-200 ${isActive ? 'scale-110' : 'hover:scale-105'
                            }`}
                        style={{
                            backgroundColor: t.swatch,
                            boxShadow: isActive
                                ? `0 0 0 2px var(--bg-secondary), 0 0 0 3.5px ${t.ring}`
                                : 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                        }}
                    />
                );
            })}
        </div>
    );
}

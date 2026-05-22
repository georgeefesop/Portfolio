'use client';

import { Moon, Sun } from 'lucide-react';

/**
 * Light/dark toggle for greg.efesop.com.
 *
 * Stateless: it flips `data-theme` on <html> and the `theme-preview` key
 * directly. The visible icon is CSS-driven (.theme-only-dark / .theme-only-light
 * in globals.css), so there is no React state, no hydration mismatch and no
 * flash. The inline script in the root layout applies the saved theme on first
 * paint; greg's light palette keys off any `data-theme` starting with "light-".
 */

const STORAGE_KEY = 'theme-preview';
const LIGHT = 'light-greg';

function toggleTheme() {
  const root = document.documentElement;
  const isLight = root.getAttribute('data-theme')?.startsWith('light-');
  if (isLight) {
    root.removeAttribute('data-theme');
    try {
      localStorage.setItem(STORAGE_KEY, 'dark');
    } catch {}
  } else {
    root.setAttribute('data-theme', LIGHT);
    try {
      localStorage.setItem(STORAGE_KEY, LIGHT);
    } catch {}
  }
}

export default function GregThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light or dark mode"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 bg-black/5 text-[var(--nav-link)] transition-colors hover:text-[var(--nav-fg)]"
    >
      <Sun size={16} className="theme-only-dark" aria-hidden />
      <Moon size={16} className="theme-only-light" aria-hidden />
    </button>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemePreviewToggle from './ThemePreviewToggle';
import WorkDropdown from './WorkDropdown';
import { cases } from '@/data/case-studies';

const FEATURED_IDS = [
    'kingfisher-mortgages',
    'akti',
    'instant-access-locksmiths',
    'uk-vehicles',
    'realfi',
    'ai-tools',
];

const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'How I Work', href: '#how-i-work' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
];

// Background and border come from CSS variables so the pill flips with the
// active theme (see `--nav-island-bg` / `--nav-island-border` in globals.css).
// Box-shadow stays inline because both inset highlights work on light AND
// dark surfaces (4% white top highlight reads on either, 12% black bottom
// shade just disappears on dark - acceptable rather than wrong).
const ISLAND_STYLE: React.CSSProperties = {
    background: 'var(--nav-island-bg)',
    borderColor: 'var(--nav-island-border)',
    boxShadow: '0 2px 8px rgb(0 0 0 / 6%), 0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.12) inset',
};

export default function Navigation() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [workOpen, setWorkOpen] = useState(false);
    const [mobileWorkExpanded, setMobileWorkExpanded] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    const openWork = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setWorkOpen(true);
    };
    const scheduleCloseWork = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setWorkOpen(false), 120);
    };

    // greg.efesop.com (rewritten to /greg/*) and the kingfisher sub-app both
    // render their own navigation - hide the portfolio nav there.
    if (pathname?.startsWith('/kingfisher') || pathname?.startsWith('/greg')) return null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        const sections = navLinks
            .map(link => document.getElementById(link.href.substring(1)))
            .filter((el): el is HTMLElement => !!el);
        if (sections.length === 0) return;

        const visible = new Map<Element, number>();
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio);
                    else visible.delete(entry.target);
                }
                let bestId = '';
                let bestRatio = 0;
                for (const [el, ratio] of visible) {
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        bestId = el.id;
                    }
                }
                setActiveSection(bestId);
            },
            { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
        );
        sections.forEach(el => io.observe(el));
        return () => io.disconnect();
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // Off the homepage, let the <a href="/#..."> navigate to the homepage section.
        if (pathname !== '/') return;
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) {
            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
            setTimeout(() => setIsOpen(false), 100);
        }
    };

    return (
        <motion.div
            className="nav-root fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pt-4 pointer-events-none"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <div
                ref={navRef}
                className={`nav-island pointer-events-auto w-full max-w-5xl border transition-[border-radius] duration-300 ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`}
                style={ISLAND_STYLE}
            >
                {/* Bar */}
                <div className="nav-bar flex justify-between items-center h-14 px-5 sm:px-6">
                    <Link
                        href="/"
                        className="nav-logo text-xl font-bold tracking-tight text-text-primary hover:text-accent-primary transition-colors"
                    >
                        efesop
                    </Link>

                    {/* Desktop links */}
                    <div className="nav-desktop hidden md:flex items-center gap-7">
                        {navLinks.map((link) => {
                            const isActive = activeSection === link.href.substring(1);
                            const baseLinkClass = `nav-link relative text-sm font-medium transition-colors duration-200 after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:bg-accent-primary after:transition-[width] after:duration-200 after:ease-out ${isActive
                                ? 'nav-link-active text-accent-primary after:w-full'
                                : 'text-text-secondary hover:text-text-primary after:w-0 hover:after:w-full'
                                }`;

                            if (link.name === 'Work') {
                                return (
                                    <div
                                        key={link.name}
                                        className="relative"
                                        onMouseEnter={openWork}
                                        onMouseLeave={scheduleCloseWork}
                                    >
                                        <a
                                            href={`/${link.href}`}
                                            onClick={(e) => scrollToSection(e, link.href)}
                                            className={`${baseLinkClass} inline-flex items-center gap-1`}
                                            aria-haspopup="menu"
                                            aria-expanded={workOpen}
                                        >
                                            {link.name}
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-200 ${workOpen ? 'rotate-180' : ''}`}
                                            />
                                        </a>
                                        <WorkDropdown
                                            open={workOpen}
                                            onClose={() => setWorkOpen(false)}
                                            onMouseEnter={openWork}
                                            onMouseLeave={scheduleCloseWork}
                                        />
                                    </div>
                                );
                            }

                            return (
                                <a
                                    key={link.name}
                                    href={`/${link.href}`}
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    className={baseLinkClass}
                                >
                                    {link.name}
                                </a>
                            );
                        })}
                        <ThemePreviewToggle />
                    </div>

                    {/* Mobile cluster */}
                    <div className="nav-mobile-cluster md:hidden flex items-center gap-3">
                        <ThemePreviewToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="nav-mobile-toggle text-text-secondary hover:text-text-primary p-1.5 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile drawer */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="drawer"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="nav-mobile-drawer md:hidden overflow-hidden rounded-b-2xl border-t border-white/[0.07]"
                        >
                            <div className="nav-mobile-list px-4 pt-2 pb-5 space-y-1">
                                {navLinks.map((link) => {
                                    const isActive = activeSection === link.href.substring(1);
                                    const baseClass = `nav-mobile-link block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'nav-mobile-link-active text-accent-primary bg-bg-secondary/60'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40'
                                        }`;

                                    if (link.name === 'Work') {
                                        const featured = FEATURED_IDS
                                            .map((id) => cases.find((c) => c.id === id))
                                            .filter(Boolean) as typeof cases;
                                        return (
                                            <div key={link.name}>
                                                <button
                                                    type="button"
                                                    onClick={() => setMobileWorkExpanded((v) => !v)}
                                                    className={`${baseClass} w-full flex items-center justify-between`}
                                                    aria-expanded={mobileWorkExpanded}
                                                >
                                                    {link.name}
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${mobileWorkExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {mobileWorkExpanded && (
                                                        <motion.div
                                                            key="mobile-work-sub"
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pl-3 pr-1 py-1 space-y-0.5">
                                                                {featured.map((c) => (
                                                                    <Link
                                                                        key={c.id}
                                                                        href={`/case-studies/${c.id}`}
                                                                        onClick={() => {
                                                                            setIsOpen(false);
                                                                            setMobileWorkExpanded(false);
                                                                        }}
                                                                        className="w-full text-left block px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40 transition-colors"
                                                                    >
                                                                        {c.title}
                                                                    </Link>
                                                                ))}
                                                                <a
                                                                    href="/#work"
                                                                    onClick={(e) => {
                                                                        if (pathname === '/') e.preventDefault();
                                                                        setIsOpen(false);
                                                                        setMobileWorkExpanded(false);
                                                                        setTimeout(() => {
                                                                            const work = document.getElementById('work');
                                                                            if (work) window.scrollTo({ top: work.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
                                                                        }, 300);
                                                                    }}
                                                                    className="block px-3 py-2 rounded-lg text-sm font-medium text-accent-primary hover:bg-bg-secondary/40 transition-colors"
                                                                >
                                                                    View all {cases.length}+ projects →
                                                                </a>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    }

                                    return (
                                        <a
                                            key={link.name}
                                            href={`/${link.href}`}
                                            onClick={(e) => {
                                                setIsOpen(false);
                                                if (pathname !== '/') return;
                                                e.preventDefault();
                                                setTimeout(() => {
                                                    const el = document.querySelector(link.href);
                                                    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
                                                }, 300);
                                            }}
                                            className={baseClass}
                                        >
                                            {link.name}
                                        </a>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemePreviewToggle from './ThemePreviewToggle';

const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'How I Work', href: '#how-i-work' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
];

const ISLAND_STYLE: React.CSSProperties = {
    background: 'rgba(221, 213, 189, 0.91)',
    boxShadow: '0 2px 8px rgb(0 0 0 / 6%), 0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.12) inset',
};

export default function Navigation() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const navRef = useRef<HTMLDivElement>(null);

    if (pathname?.startsWith('/kingfisher')) return null;

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
        const handleScroll = () => {
            const sections = navLinks.map(link => link.href.substring(1));
            const current = sections.find(section => {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    return rect.top <= 300 && rect.bottom > 300;
                }
                return false;
            });
            setActiveSection(current || '');
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
                className={`nav-island pointer-events-auto w-full max-w-5xl border border-black/[0.05] transition-[border-radius] duration-300 ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`}
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
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className={`nav-link relative text-sm font-medium transition-colors duration-200 after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:bg-accent-primary after:transition-[width] after:duration-200 after:ease-out ${activeSection === link.href.substring(1)
                                    ? 'nav-link-active text-accent-primary after:w-full'
                                    : 'text-text-secondary hover:text-text-primary after:w-0 hover:after:w-full'
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
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
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsOpen(false);
                                            setTimeout(() => {
                                                const el = document.querySelector(link.href);
                                                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
                                            }, 300);
                                        }}
                                        className={`nav-mobile-link block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === link.href.substring(1)
                                            ? 'nav-mobile-link-active text-accent-primary bg-bg-secondary/60'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40'
                                            }`}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemePreviewToggle from './ThemePreviewToggle';

const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'How I Work', href: '#how-i-work' },
    { name: 'Resources', href: '#resources' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const navRef = useRef<HTMLElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Handle scroll for background and active section
    useEffect(() => {
        const handleScroll = () => {
            // Background toggle
            setScrolled(window.scrollY > 50);

            // Active Section Spy
            const sections = navLinks.map(link => link.href.substring(1));
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 300 && rect.bottom > 300;
                }
                return false;
            });
            setActiveSection(current || '');
        };

        window.addEventListener('scroll', handleScroll);
        // Check initially
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            // Delay closing menu to allow scroll to complete
            setTimeout(() => setIsOpen(false), 100);
        }
    };

    return (
        <nav
            ref={navRef}
            className={`nav-root fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${(scrolled || isOpen) ? 'bg-bg-primary/95 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'
                }`}
        >
            <div className="nav-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="nav-bar flex justify-between items-center h-14 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="nav-logo text-2xl font-bold tracking-tight text-text-primary hover:text-accent-primary transition-colors">
                        efesop
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="nav-desktop hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className={`nav-link text-sm font-medium transition-colors duration-200 ${activeSection === link.href.substring(1)
                                    ? 'nav-link-active text-accent-primary'
                                    : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <ThemePreviewToggle />
                    </div>

                    {/* Mobile right cluster */}
                    <div className="nav-mobile-cluster md:hidden flex items-center gap-3">
                        <ThemePreviewToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="nav-mobile-toggle text-text-secondary hover:text-text-primary p-2"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="nav-mobile-drawer md:hidden bg-bg-primary border-b border-border-subtle overflow-hidden"
                    >
                        <div className="nav-mobile-list px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsOpen(false);
                                        // Wait for menu to close before scrolling
                                        setTimeout(() => {
                                            const element = document.querySelector(link.href);
                                            if (element) {
                                                const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
                                                window.scrollTo({
                                                    top: offsetTop,
                                                    behavior: 'smooth'
                                                });
                                            }
                                        }, 300);
                                    }}
                                    className={`nav-mobile-link block px-3 py-3 rounded-md text-base font-medium ${activeSection === link.href.substring(1)
                                        ? 'nav-mobile-link-active text-accent-primary bg-bg-secondary'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
}

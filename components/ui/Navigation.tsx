'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-border-subtle' : 'bg-transparent'
                }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-24">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold tracking-tight text-white hover:text-accent-primary transition-colors">
                        efesop
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className={`text-sm font-medium transition-colors duration-200 ${activeSection === link.href.substring(1)
                                    ? 'text-accent-primary'
                                    : 'text-text-secondary hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            onClick={(e) => scrollToSection(e, '#contact')}
                            className="bg-accent-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-accent-primary/90 transition-all hover:scale-105"
                        >
                            Start Project
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-text-secondary hover:text-white p-2"
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
                        className="md:hidden bg-bg-primary border-b border-border-subtle overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    className={`block px-3 py-3 rounded-md text-base font-medium ${activeSection === link.href.substring(1)
                                        ? 'text-accent-primary bg-bg-secondary'
                                        : 'text-text-secondary hover:text-white hover:bg-bg-secondary'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

'use client';

import Link from 'next/link';
import { Linkedin, Mail, Youtube, ExternalLink, Phone } from 'lucide-react';

const socialLinks = [
    { name: 'LinkedIn', href: 'https://linkedin.com/in/giorgoe', icon: Linkedin },
    { name: 'TikTok', href: 'https://www.tiktok.com/@georgeefesop', icon: ExternalLink }, // Lucide doesn't have TikTok, utilizing generic or custom if needed
    { name: 'YouTube', href: 'https://www.youtube.com/@georgeefesop', icon: Youtube },
    { name: 'Behance', href: 'https://www.behance.net/giorgo', icon: ExternalLink },
    { name: 'Email', href: 'mailto:george.efesop@gmail.com', icon: Mail },
    { name: 'Phone', href: 'tel:+35797907137', icon: Phone },
];

export default function Footer() {
    return (
        <footer className="bg-bg-hero text-text-primary py-16 border-t border-border-subtle">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-bold tracking-tight">
                            efesop
                        </Link>
                        <p className="text-text-muted text-sm max-w-xs">
                            Product Designer specializing in complex systems, Web3, and AI integrations. Based in Cyprus.
                        </p>
                        <p className="text-text-dim text-xs">
                            © 2026 George Efesopoulos - Efesop. All rights reserved.
                        </p>
                        <div
                            role="img"
                            aria-label="George Efesopoulos"
                            className="theme-signature h-[52px] w-full max-w-[320px] mt-2"
                            style={{ aspectRatio: '375 / 73' }}
                        />
                    </div>

                    {/* Links Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                            Explore
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Work', href: '#work' },
                                { label: 'Services', href: '#services' },
                                { label: 'Resources', href: '#resources' },
                                { label: 'About', href: '#about' },
                                { label: 'Hire on Upwork', href: '#contact' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        className="text-text-secondary hover:text-accent-primary transition-colors text-sm"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                            Connect
                        </h3>
                        <ul className="space-y-3">
                            {socialLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-text-secondary hover:text-accent-primary transition-colors text-sm group"
                                    >
                                        <link.icon size={18} className="group-hover:scale-110 transition-transform" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4">
                        {/* Optional extra legal links could go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
}

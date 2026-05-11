'use client';

import Link from 'next/link';
import { Linkedin, Mail, Youtube, ExternalLink, Phone } from 'lucide-react';
import CtaLink, { type CtaDestination } from '../analytics/CtaLink';

const socialLinks: { name: string; href: string; icon: typeof Linkedin; destination: CtaDestination }[] = [
    { name: 'LinkedIn', href: 'https://linkedin.com/in/giorgoe', icon: Linkedin, destination: 'linkedin' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@georgeefesop', icon: ExternalLink, destination: 'tiktok' },
    { name: 'YouTube', href: 'https://www.youtube.com/@georgeefesop', icon: Youtube, destination: 'youtube' },
    { name: 'Behance', href: 'https://www.behance.net/giorgo', icon: ExternalLink, destination: 'behance' },
    { name: 'Email', href: 'mailto:george.efesop@gmail.com', icon: Mail, destination: 'email' },
    { name: 'Phone', href: 'tel:+35797907137', icon: Phone, destination: 'phone' },
];

export default function Footer() {
    return (
        <footer className="footer-root bg-bg-hero text-text-primary py-16 border-t border-border-subtle">
            <div className="footer-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="footer-grid grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="footer-brand space-y-4">
                        <Link href="/" className="footer-brand-logo text-2xl font-bold tracking-tight">
                            efesop
                        </Link>
                        <p className="footer-brand-description text-text-muted text-sm max-w-xs">
                            Product Designer specializing in complex systems, Web3, and AI integrations. Based in Cyprus.
                        </p>
                        <p className="footer-brand-copyright text-text-dim text-xs">
                            © 2026 George Efesopoulos - Efesop. All rights reserved.
                        </p>
                        <div
                            role="img"
                            aria-label="George Efesopoulos"
                            className="footer-brand-signature theme-signature h-[52px] w-full max-w-[320px] mt-2"
                            style={{ aspectRatio: '375 / 73' }}
                        />
                    </div>

                    {/* Links Column */}
                    <div className="footer-column">
                        <h3 className="footer-column-heading text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                            Explore
                        </h3>
                        <ul className="footer-link-list space-y-3">
                            {[
                                { label: 'Work', href: '#work' },
                                { label: 'Services', href: '#services' },
                                { label: 'Resources', href: '#resources' },
                                { label: 'About', href: '#about' },
                                { label: 'Hire on Upwork', href: '#contact' },
                            ].map((item) => (
                                <li key={item.label} className="footer-link-item">
                                    <a
                                        href={item.href}
                                        className="footer-link text-text-secondary hover:text-accent-primary transition-colors text-sm"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials Column */}
                    <div className="footer-column">
                        <h3 className="footer-column-heading text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                            Connect
                        </h3>
                        <ul className="footer-social-list space-y-3">
                            {socialLinks.map((link) => (
                                <li key={link.name} className="footer-social-item">
                                    <CtaLink
                                        destination={link.destination}
                                        ctaLocation="footer"
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-social-link flex items-center gap-3 text-text-secondary hover:text-accent-primary transition-colors text-sm group"
                                    >
                                        <link.icon size={18} className="footer-social-icon group-hover:scale-110 transition-transform" />
                                        {link.name}
                                    </CtaLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="footer-bottom-links flex gap-4">
                        {/* Optional extra legal links could go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
}

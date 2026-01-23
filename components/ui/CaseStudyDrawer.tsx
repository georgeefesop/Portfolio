'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, X } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback'; // Using new component

interface CaseStudyData {
    id: string;
    title: string;
    subtitle: string;
    role: string;
    period: string;
    tags: string[];
    description: {
        challenge: string;
        work: string[];
        outcome: string;
    };
    links: {
        live?: string;
        behance?: string;
    };
    images: {
        thumbnail: string;
        hero: string;
        gallery: string[];
    };
}

interface CaseStudyDrawerProps {
    project: CaseStudyData; // Changed from 'data' to 'project' to match prop usage
    isOpen: boolean;
    onToggle: () => void;
    priority?: boolean;
}

export default function CaseStudyDrawer({ project, isOpen, onToggle, priority = false }: CaseStudyDrawerProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Prevent scrolling when lightbox is open
    // In a real app we might use a lockBodyScroll hook, for now simple is fine.

    return (
        <>
            <div
                className={`group border transition-all duration-500 rounded-xl overflow-hidden ${isOpen
                    ? 'bg-zinc-900 border-white/20 cursor-pointer shadow-2xl'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-accent-primary/30'
                    }`}
                onClick={(e) => {
                    // Close if clicked anywhere on the card while open
                    // But ignore if user is selecting text
                    if (isOpen && !window.getSelection()?.toString()) {
                        onToggle();
                    }
                }}
            >
                {/* Collapsed Header / Trigger */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                    className="w-full text-left p-6 flex flex-col md:flex-row gap-6 md:items-center focus:outline-none"
                    aria-expanded={isOpen}
                >
                    {/* Thumbnail - Compact & Horizontal */}
                    <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                        <ImageWithFallback
                            src={project.images.thumbnail}
                            alt={project.title}
                            fill
                            quality={100}
                            priority={priority}
                            sizes="(max-width: 768px) 100vw, 300px"
                            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${project.id === 'realfi' ? 'scale-[1.03]' : ''}`}
                        />
                    </div>

                    {/* Text Info - Compact */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-accent-primary transition-colors tracking-tight">
                                    {project.title}
                                </h3>
                                <p className="text-text-muted text-sm md:text-base mb-3 max-w-xl font-light">
                                    {project.subtitle}
                                </p>
                            </div>

                            {/* Icon */}
                            <div className={`hidden md:flex items-center justify-center p-2 rounded-full border border-white/10 text-text-muted group-hover:text-white group-hover:border-white/30 transition-all duration-300 ${isOpen ? 'rotate-180 bg-white/5' : ''}`}>
                                <ChevronDown size={20} />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {project.tags.slice(0, 3).map((tag, i) => (
                                <span key={tag} className="bg-white/5 px-2 py-1 rounded text-xs font-mono text-text-dim border border-white/5">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        >

                            <div className="px-6 pb-8 md:px-8 md:pb-8 border-t border-white/5">
                                {/* Removed Hero Image Block */}

                                {/* Meta Info */}
                                <div className="flex flex-wrap gap-6 mt-8 mb-12 font-mono text-sm text-text-muted pb-6 border-b border-border-medium">
                                    <div>
                                        <span className="block text-text-dim text-xs mb-1">ROLE</span>
                                        {project.role}
                                    </div>
                                    <div>
                                        <span className="block text-text-dim text-xs mb-1">PERIOD</span>
                                        {project.period}
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="grid md:grid-cols-3 gap-12 mb-12">
                                    {/* Challenge */}
                                    <div className="md:col-span-3 lg:col-span-1">
                                        <h4 className="text-sm font-bold text-accent-primary uppercase tracking-widest mb-4">The Challenge</h4>
                                        <p className="text-text-secondary leading-relaxed">
                                            {project.description.challenge}
                                        </p>
                                    </div>

                                    {/* Work */}
                                    <div className="md:col-span-3 lg:col-span-1">
                                        <h4 className="text-sm font-bold text-accent-primary uppercase tracking-widest mb-4">The Work</h4>
                                        <ul className="space-y-2">
                                            {project.description.work.map((item, i) => (
                                                <li key={i} className="text-text-secondary leading-relaxed flex gap-2">
                                                    <span className="text-accent-primary">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Outcome */}
                                    <div className="md:col-span-3 lg:col-span-1">
                                        <h4 className="text-sm font-bold text-accent-primary uppercase tracking-widest mb-4">The Outcome</h4>
                                        <p className="text-text-secondary leading-relaxed mb-6">
                                            {project.description.outcome}
                                        </p>

                                        {project.links.live && (
                                            <a
                                                href={project.links.live}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary rounded-lg font-semibold transition-colors relative z-10"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View live platform <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Gallery Grid which triggers Lightbox */}
                                <div className={`grid gap-4 ${project.id === 'ai-tools' ? 'grid-cols-2 md:grid-cols-4' : project.id === 'stellar' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                                    {project.images.gallery.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLightboxIndex(idx);
                                            }}
                                            className={`relative rounded-lg overflow-hidden bg-bg-tertiary cursor-zoom-in hover:brightness-110 transition-all aspect-video`}
                                        >
                                            <ImageWithFallback
                                                src={img}
                                                alt={`${project.title} screenshot ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Close Button at bottom */}
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggle();
                                        }}
                                        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm font-medium px-4 py-2 hover:bg-bg-tertiary rounded-full relative z-10"
                                    >
                                        <ChevronUp size={16} />
                                        Collapse Case Study
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Lightbox Portal/Overlay */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setLightboxIndex(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <X size={32} />
                        </button>

                        {/* Image */}
                        <div
                            className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
                        >
                            <ImageWithFallback
                                src={project.images.gallery[lightboxIndex]}
                                alt="Gallery View"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

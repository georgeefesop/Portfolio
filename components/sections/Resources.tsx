'use client';

import FadeIn from '../motion/FadeIn';
import { Play } from 'lucide-react';
import Image from 'next/image';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

const videos = [
    {
        title: 'How to Generate Flawless AI Images Using the FLUX Model',
        duration: '7:49',
        url: 'https://www.youtube.com/watch?v=bK-EKarIC80',
        thumbnail: 'https://img.youtube.com/vi/bK-EKarIC80/maxresdefault.jpg'
    },
    {
        title: 'How to Find Winning Dropshipping Products (2025)',
        duration: '8:53',
        url: 'https://www.youtube.com/watch?v=wbGv7MalJ7Q',
        thumbnail: 'https://img.youtube.com/vi/wbGv7MalJ7Q/maxresdefault.jpg'
    }
];

export default function Resources() {
    return (
        <section id="resources" className="bg-bg-primary py-24 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Tutorials & Resources</h2>
                            <p className="text-text-secondary">Curated insights and tutorials.</p>
                        </div>
                    </div>
                </FadeIn>

                {/* YouTube Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {videos.map((video, idx) => (
                        <FadeIn key={idx} delay={idx * 0.1}>
                            <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                            >
                                <div className="relative aspect-video bg-bg-secondary rounded-xl overflow-hidden mb-4 border border-border-subtle group-hover:border-accent-primary/50 transition-colors">
                                    <ImageWithFallback
                                        src={video.thumbnail}
                                        alt={video.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-accent-primary/90 transition-colors">
                                            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-black/80 px-2 py-1 rounded text-xs text-white font-mono">
                                        {video.duration}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                                    {video.title}
                                </h3>
                            </a>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}

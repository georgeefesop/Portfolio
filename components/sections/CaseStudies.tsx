'use client';

import { useState } from 'react';
import FadeIn from '../motion/FadeIn';
import CaseStudyDrawer from '../ui/CaseStudyDrawer';

// Mock data assets (placeholders)
const PLACEHOLDER_IMG = "/placeholder.svg";

const cases = [
    {
        id: 'realfi',
        title: 'RealFi',
        subtitle: 'Financial inclusion platform for emerging markets',
        role: 'Product Designer',
        period: '2023-2024 (Input Output)',
        tags: ['Web3', 'Fintech', 'Product Design'],
        description: {
            challenge: 'Design a financial platform enabling 3 billion underbanked people to access credit, insurance, and identity services through blockchain infrastructure.',
            work: [
                'User research with target markets in emerging economies',
                'Complex lending workflows simplified for low-connectivity environments',
                'Design system built for scale across multiple financial products',
                'Daily collaboration with product, engineering, and blockchain teams'
            ],
            outcome: 'Platform launched 2024. Active lending to SMEs in East Africa. Part of Cardano\'s $80bn blockchain ecosystem.'
        },
        links: {
            live: 'https://realfi.co'
        },
        images: {
            thumbnail: "/images/realfi/realfi-thumbnail.png", // Local image
            hero: "/images/realfi/financial-analysis.webp", // Local image
            gallery: [
                "/images/realfi/impact-analysis.webp",
                "/images/realfi/credit-analysis.webp"
            ]
        }
    },
    {
        id: 'ai-tools',
        title: 'AI User Tools',
        subtitle: 'SaaS Platform for Generative AI Workflows',
        role: 'Product Designer',
        period: '2024',
        tags: ['SaaS', 'AI', 'Product Design'],
        description: {
            challenge: 'Design a unified SaaS platform that aggregates scattered generative AI tools into a seamless, user-friendly workflow for non-technical professionals.',
            work: [
                'Developed a modular interface to house diverse AI models (Text, Image, Audio)',
                'Created a unified design system to normalize controls across different tools',
                'Designed comprehensive usage analytics and credit management dashboards',
                'Streamlined the prompt engineering experience with visual helpers'
            ],
            outcome: 'Empowered professional users to leverage varying AI models without technical overhead. Reduced workflow time by 60% compared to using fragmented tools.'
        },
        links: {},
        images: {
            thumbnail: "/images/ai-tools/AIUT-2.png",
            hero: "/images/ai-tools/AIUT-2.png",
            gallery: [
                "/images/ai-tools/AIUT-2.png",
                "/images/ai-tools/1.PNG",
                "/images/ai-tools/2.PNG",
                "/images/ai-tools/3.PNG",
                "/images/ai-tools/4.PNG",
                "/images/ai-tools/7.PNG",
                "/images/ai-tools/8.PNG",
                "/images/ai-tools/11.PNG"
            ]
        }
    },

    {
        id: 'stellar',
        title: 'Stellar Observatory',
        subtitle: 'Interactive Generative Art Console',
        role: 'Design Engineer',
        period: '2025',
        tags: ['Generative Art', 'React', 'Canvas', 'UI Design'],
        description: {
            challenge: 'Design a futuristic, immersive interface for manipulating generative cosmic visualizations in real-time, blending diegetic UI elements with performant web graphics.',
            work: [
                'Built a high-performance rendering engine using Canvas API & React',
                'Designed a comprehensive sci-fi design system with retro-futuristic aesthetics',
                'Implemented complex state management for real-time parameter tuning',
                'Created a "vault" system for users to save and catalog unique generative outputs'
            ],
            outcome: 'A highly engaging interactive playground that demonstrates the intersection of creative coding, complex state management, and thematic UI design.'
        },
        links: {
            live: 'https://playground-jet-omega.vercel.app/'
        },
        images: {
            thumbnail: "/images/stellar/so-1.png",
            hero: "/images/stellar/so-1.png",
            gallery: [
                "/images/stellar/so-1.png",
                "/images/stellar/so-2.png",
                "/images/stellar/so-3.png"
            ]
        }
    },
    {
        id: 'sidechains',
        title: 'Sidechain Interoperability',
        subtitle: 'Developer infrastructure for blockchain crosschain protocols',
        role: 'Product Designer',
        period: '2023-2024 (Input Output)',
        tags: ['Blockchain', 'Dev Tools', 'Infrastructure'],
        description: {
            challenge: 'Design developer tooling for Cardano\'s sidechain ecosystem — enabling seamless interoperability between Cardano, Ethereum, Bitcoin, and other blockchains.',
            work: [
                'Technical abstraction for developer audiences',
                'Dashboard design for crosschain transactions',
                'Documentation and onboarding flows for blockchain developers',
                'Simplified complex concepts without losing technical depth'
            ],
            outcome: 'Enabled Cardano\'s crosschain infrastructure. Live technology supporting ecosystem growth. Contributed to Wanchain integration launch.'
        },
        links: {},
        images: {
            thumbnail: "/images/sidechains/sidechain-thumbnail.png",
            hero: "/images/sidechains/hero.png",
            gallery: []
        }
    }
];

export default function CaseStudies() {
    const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setActiveDrawer(prev => prev === id ? null : id);
    };

    return (
        <section id="work" className="bg-bg-primary py-24 md:py-32 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Selected Projects</h2>
                            <p className="text-text-muted text-lg max-w-xl">
                                Deep dives into complex problem solving for fintech, blockchain, and data systems.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {cases.map((project, idx) => (
                            <CaseStudyDrawer
                                key={project.id}
                                project={project}
                                isOpen={activeDrawer === project.id}
                                onToggle={() => handleToggle(project.id)}
                                priority={idx === 0}
                            />
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}

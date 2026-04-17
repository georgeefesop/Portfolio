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
            overview: 'RealFi is Input Output\'s blockchain-based initiative connecting underserved businesses in emerging markets with global capital. I designed the platform\'s core user experience, focusing on simplifying complex financial processes—KYC verification, credit assessment, and impact measurement—while remaining accessible for users in markets with limited digital infrastructure.\n\nThe platform serves two distinct user groups: businesses seeking capital and investors seeking impact-driven opportunities. Each required tailored workflows balancing regulatory compliance with ease of use.',
            challenge: 'Design a financial platform enabling 3 billion underbanked people to access credit, insurance, and identity services through blockchain infrastructure while addressing:\n\n• Digital literacy variance across global user base\n• Low-bandwidth and offline-first requirements\n• Complex regulatory compliance across jurisdictions\n• Cross-cultural UX for emerging and developed markets',
            work: [
                'Dual user journey design: capital seekers (businesses) and capital providers (investors)',
                'Complex lending workflows simplified for low-connectivity environments',
                'Impact measurement dashboard with real-time ESG metrics',
                'KYC/onboarding systems tailored to each user type with progressive disclosure',
                'Daily collaboration with product, engineering, and blockchain teams',
                'Portfolio dashboards with impact and financial performance metrics',
                'Risk assessment interfaces with regulatory compliance',
                'Multi-stage application and approval workflows'
            ],
            outcome: 'Platform launched 2024. Active lending to SMEs in East Africa. Part of Cardano\'s $80bn blockchain ecosystem.\n\nRealFi has been publicly identified by Cardano founder Charles Hoskinson as a cornerstone initiative for bringing real-world financial utility to blockchain technology, targeting billions in total value locked by 2026.'
        },
        links: {
            live: 'https://realfi.co'
        },
        images: {
            thumbnail: "/images/realfi/realfi-thumbnail.png",
            hero: "/images/realfi/financial-analysis.webp",
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
        id: 'uk-vehicles',
        title: 'UK Vehicles Cyprus',
        subtitle: 'Vehicle import platform saving Cyprus businesses thousands per purchase',
        role: 'Full-Stack Developer',
        period: '2025',
        tags: ['Next.js', 'Web Development', 'E-Commerce'],
        description: {
            challenge: 'Build a professional web platform for a UK-to-Cyprus vehicle import business that communicates complex processes—customs, VAT reclaim, shipping logistics—clearly enough that tradespeople and small businesses could confidently make €20,000+ purchasing decisions without a single phone call.',
            work: [
                'Designed and built a full multi-language site (English, Greek, Russian, German) using Next.js',
                'Built an interactive import savings calculator showing real-time cost breakdowns vs. Cyprus dealers',
                'Developed a live vehicle stock system with filtering, detailed listings, and pricing transparency',
                'Implemented WhatsApp inquiry integration and lead capture flows for high-intent buyers',
                'Structured content architecture to address every stage of buyer hesitation across FAQ and process pages',
                'Optimised for Core Web Vitals and SEO to drive organic traffic from local business searches'
            ],
            outcome: 'Platform live at ukvehiclescyprus.com. Business has delivered hundreds of vehicles, generating €150k+ in cumulative client savings. The site\'s transparent pricing model and calculator convert hesitant buyers into high-ticket customers with minimal sales overhead.'
        },
        links: {
            live: 'https://ukvehiclescyprus.com/en'
        },
        images: {
            thumbnail: "/images/uk-vehicles/hero.png",
            hero: "/images/uk-vehicles/hero.png",
            gallery: [
                "/images/uk-vehicles/hero.png",
                "/images/uk-vehicles/calc.png",
                "/images/uk-vehicles/info.png"
            ]
        }
    },
    {
        id: 'sidechains',
        title: 'Sidechain Interoperability',
        subtitle: 'Developer infrastructure for blockchain crosschain protocols',
        role: 'Product Designer',
        period: '2022-2024 (Input Output)',
        tags: ['Blockchain', 'Dev Tools', 'Infrastructure'],
        description: {
            overview: 'Input Output\'s sidechain toolkit enables developers to build custom sidechains connected to the Cardano mainnet, expanding the ecosystem\'s capabilities without compromising the main chain\'s security. I helped to design the developer experience for the EVM sidechain. (Ethereum Virtual Machine) \n\nThe challenge was creating infrastructure that bridged two fundamentally different blockchain architectures: Cardano\'s UTXO model using Plutus/Haskell versus Ethereum\'s account-based model using Solidity. The solution needed to be technically robust while remaining accessible to developers from both ecosystems.',
            challenge: 'Design developer infrastructure enabling interoperability between Cardano and Ethereum ecosystems while addressing:\n\n• Incompatible smart contract environments (Plutus vs Solidity)\n• Different transaction models (UTXO vs account-based)\n• Asset transfer security between chains\n• Developer tooling compatibility across ecosystems',
            work: [
                'Cross-chain bridge interface design for secure asset transfers',
                'Developer documentation and onboarding flows for Solidity developers',
                'Testnet environment UX for validating sidechain functionality',
                'Stake pool operator dashboard for sidechain validation'
            ],
            outcome: 'EVM sidechain alpha launched 2022, mainnet deployment 2023.\nEnables Solidity developers to build on Cardano using familiar Ethereum tools.\nOpens Cardano ecosystem to billions in Ethereum development investment.\nBecomes framework for future specialized sidechains (privacy, gaming, DeFi).\nTransitions Cardano into multi-chain architecture with enhanced scalability.\nPublicly identified by CPO as expanding Cardano\'s feature set for niche applications.'
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

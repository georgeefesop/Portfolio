import type { CaseStudy } from './types';

const realfi: CaseStudy = {
    id: 'realfi',
    title: 'RealFi',
    subtitle: 'Blockchain-backed lending platform serving underbanked SMEs across emerging markets, part of Cardano\'s $80bn ecosystem.',
    role: 'Product Designer',
    period: '2023-2024 (Input Output)',
    tags: ['Web3', 'Fintech', 'Product Design'],
    categories: ['design'],
    description: {
        overview: 'RealFi is Input Output\'s blockchain-based initiative connecting underserved businesses in emerging markets with global capital. I designed the platform\'s core user experience, focusing on simplifying complex financial processes-KYC verification, credit assessment, and impact measurement-while remaining accessible for users in markets with limited digital infrastructure.\n\nThe platform serves two distinct user groups: businesses seeking capital and investors seeking impact-driven opportunities. Each required tailored workflows balancing regulatory compliance with ease of use.',
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
        thumbnail: "/images/realfi/realfi-hero-2026-05-02.png",
        hero: "/images/realfi/hero.png",
        gallery: [
            "/images/realfi/hero.png",
            "/images/realfi/2.png",
            "/images/realfi/3.png"
        ]
    }
};

export default realfi;

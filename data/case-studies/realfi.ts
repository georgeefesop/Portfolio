import type { CaseStudy } from './types';

const realfi: CaseStudy = {
    id: 'realfi',
    title: 'RealFi',
    subtitle: 'I led product design on RealFi for a year at Input Output: an emerging-markets lending platform with two completely different users, and the dual-journey decision that kept both credible.',
    role: 'Product Designer',
    period: '2023-2024 (Input Output)',
    tags: ['Product Design', 'Fintech', 'Dual journey', 'Emerging markets', 'Cardano'],
    categories: ['design'],
    links: {
        live: 'https://realfi.co',
    },
    visual: {
        situation: 'RealFi connects East African SMEs raising capital with impact-focused investors in developed markets, inside Cardano\'s ecosystem at Input Output. My role was to design the product for two completely different users without watering either down.',
        audience: 'SME owners in East Africa applying for credit on patchy mobile connections, sometimes in a second language, and institutional impact investors in developed markets evaluating ESG performance alongside financial return.',
        what_made_it_hard: 'A single onboarding flow had been specced for both users; KYC and credit assessment are regulated surfaces, so every UX simplification had to survive compliance review.',
        honest_note: 'I led product design on the dual-journey surfaces below for a year. The platform shipped behind a much larger team of engineers, blockchain architects, compliance, and research.',
        process: 'A year of daily work with product, engineering, blockchain and compliance teams: dual-track design, multi-stage application and approval workflows, risk-assessment interfaces, and cross-cultural UX research bridging emerging and developed markets in one product.',
        outcome: 'Platform launched 2024 with active lending to SMEs in East Africa. The dual-journey split survived a year of pressure from product, compliance and engineering reviews and shipped intact. RealFi was named by IO leadership as a cornerstone of Cardano\'s real-world utility thesis.',
        links: [
            { href: 'https://realfi.co', label: 'Live site' },
        ],
        gallery: [
            {
                image: '/images/realfi/2.png',
                title: 'Two products, one platform.',
                description: 'Distinct onboarding, dashboards and KYC flows for capital seekers and capital providers, held together by one visual system, one brand and one data model.',
            },
            {
                image: '/images/realfi/3.png',
                title: 'Impact metrics as first-class data.',
                description: 'ESG and financial performance on the same visual axis inside the investor dashboard, not in a separate tab or marketing PDF.',
            },
            {
                image: '/images/realfi/credit-analysis.webp',
                title: 'Credit analysis interface.',
                description: 'Risk-assessment surface designed with progressive disclosure to keep regulated complexity manageable for borrowers on low-bandwidth connections.',
            },
            {
                image: '/images/realfi/financial-analysis.webp',
                title: 'Financial analysis view.',
                description: 'Structured data layout letting investors evaluate loan portfolios against both return profiles and social outcome metrics in a single screen.',
            },
            {
                image: '/images/realfi/impact-analysis.webp',
                title: 'Impact analysis panel.',
                description: 'Dedicated impact data panel surfaced at portfolio level, so ESG outcomes read as auditable numbers, not marketing claims.',
            },
        ],
    },
    images: {
        thumbnail: '/images/realfi/realfithumb-v2.png',
        hero: '/images/realfi/hero.png',
        gallery: [
            '/images/realfi/hero.png',
            '/images/realfi/2.png',
            '/images/realfi/3.png',
        ],
    },
};

export default realfi;

import type { CaseStudy } from './types';

const realfi: CaseStudy = {
    id: 'realfi',
    title: 'RealFi',
    subtitle: 'I led product design on RealFi for a year at Input Output: an emerging-markets lending platform with two completely different users, and the dual-journey decision that kept both credible.',
    role: 'Product Designer',
    period: '2023-2024 (Input Output)',
    tags: ['Product Design', 'Fintech', 'Dual journey', 'Emerging markets', 'Cardano'],
    categories: ['design'],
    body: {
        honest_note: 'I led product design on the dual-journey surfaces below for a year. The platform itself shipped behind a much larger team of engineers, blockchain architects, compliance, and research.',
        brief: {
            situation: 'RealFi connects East African SMEs raising capital with impact-focused investors in developed markets, sitting inside Cardano\'s ecosystem at Input Output. My job was to design the product around two completely different users without watering either down: a Nairobi small-business owner applying for credit on a patchy mobile connection, and a London impact fund evaluating ESG performance alongside financial return. The starting brief assumed one polished onboarding template could serve both. The first thing I argued out was the assumption.',
            audience: 'On one side, SME owners in East Africa applying for credit on patchy mobile connections, sometimes filling regulated forms in a second language. On the other, institutional and impact-focused investors in developed markets evaluating portfolios on ESG performance alongside financial return. Both decisions are high-stakes; neither user looks anything like the other.',
            what_made_it_hard: [
                'A single onboarding flow had been speced for both users; one of them would have been patronised, the other underserved.',
                'KYC and credit assessment are regulated surfaces, so every UX simplification had to survive compliance review.',
            ],
        },
        decisions: [
            {
                title: 'Two products, one platform',
                what: 'Two separate user journeys, each with its own onboarding, dashboards and KYC progression, on a shared platform with one visual system, one brand and one data model.',
                why: 'A SME owner in Nairobi and an impact fund in London are not the same user. The starting spec assumed one polished onboarding template would do; I argued the split through in the first month. Keeping one visual system, one brand and one data model across the two journeys is what let the product feel native to two audiences who scan the screen for completely different signals: "will this work on my phone in Mombasa" versus "is the impact data audited."',
                screenshot: '/images/realfi/2.png',
                caption: 'Dual journey design: distinct flows for capital seekers and capital providers, on one shared visual system.',
            },
            {
                title: 'Impact metrics on the dashboard, not the marketing site',
                what: 'Real-time ESG and impact metrics rendered inside the investor dashboard, on the same visual axis as financial performance. No separate impact tab, no marketing PDF.',
                why: 'Impact-driven investors evaluate two numbers at once: a return profile and a measurable social outcome. The moment those live in different surfaces, one of them stops being treated as real. ESG-as-marketing-PDF is the category default, and it is why most impact platforms read as performative. The dashboard had to put impact metrics on the same visual axis as financial performance, not in a separate tab, because tabs make data feel optional and the entire ESG case depends on the data being mandatory.',
                screenshot: '/images/realfi/3.png',
                caption: 'Portfolio dashboard with impact metrics treated as first-class data, not marketing copy.',
            },
        ],
        process: 'A year of daily work with product, engineering, blockchain and compliance teams: dual-track design, multi-stage application and approval workflows, risk-assessment interfaces, and the cross-cultural UX research that had to bridge emerging and developed markets in the same product. KYC and onboarding designed with progressive disclosure to survive low-bandwidth conditions; portfolio dashboards built so financial and impact metrics share the same visual axis. The political work, protecting the dual-journey split and keeping the impact data on the dashboard rather than in a brochure, was as much of the role as the screen design.',
        outcome: {
            summary: 'Platform launched 2024 with active lending to SMEs in East Africa. The dual-journey split survived a year of pressure from product, compliance and engineering reviews and shipped intact, which is rare. RealFi was named publicly by IO leadership as a cornerstone of Cardano\'s real-world utility thesis; the product design carries the weight the marketing thesis depends on.',
        },
    },
    links: {
        live: 'https://realfi.co',
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

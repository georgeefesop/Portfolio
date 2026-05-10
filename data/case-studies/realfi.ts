import type { CaseStudy } from './types';

const realfi: CaseStudy = {
    id: 'realfi',
    title: 'RealFi',
    subtitle: 'Blockchain-backed lending platform serving underbanked SMEs across emerging markets, part of Cardano\'s ecosystem at Input Output.',
    role: 'Product Designer',
    period: '2023-2024 (Input Output)',
    tags: ['Web3', 'Fintech', 'Product Design'],
    categories: ['design'],
    body: {
        brief: {
            situation: 'RealFi is Input Output\'s blockchain-based initiative connecting underserved businesses in emerging markets with global capital. I designed the platform\'s core user experience: simplifying complex financial processes - KYC verification, credit assessment, impact measurement - while keeping the surface accessible for users in markets with limited digital infrastructure. Two distinct user groups, one platform: businesses seeking capital and investors seeking impact-driven opportunities, each with workflows that had to balance regulatory compliance with usability.',
            audience: 'On one side, SME owners in East Africa applying for credit through the platform - often on patchy mobile connections, sometimes filling regulated forms in a second language. On the other, institutional and impact-focused investors in developed markets evaluating portfolios on ESG performance alongside financial return.',
            what_made_it_hard: [
                'Digital literacy variance across a global user base meant a single onboarding flow could not serve both ends - capital seekers and capital providers needed tailored journeys, not one polished template',
            ],
        },
        decisions: [
            {
                title: 'Two products, one platform',
                what: 'Separate dual journeys for capital seekers (businesses) and capital providers (investors), each with its own onboarding, dashboards, and KYC progression - rather than a unified flow that compromised both.',
                why: 'A SME owner in Nairobi and an impact fund in London are not the same user. Forcing them through a shared onboarding would have made one of them feel patronised and the other underserved. Splitting the journeys explicitly - while keeping the visual system, brand, and underlying data model unified - is what made the platform credible to both audiences without watering either down.',
                screenshot: '/images/realfi/2.png',
                caption: 'Dual journey design - distinct flows for capital seekers and capital providers.',
            },
            {
                title: 'Impact metrics on the dashboard, not the marketing site',
                what: 'Real-time ESG and impact metrics surfaced inside the investor dashboard alongside financial performance, instead of relegated to a marketing PDF.',
                why: 'Impact-driven investors are evaluating both numbers at once - a return profile and a measurable social outcome - and the moment those live in different surfaces, one of them stops being treated as real. Putting them on the same dashboard makes the impact case as auditable as the financial one, which is the credibility move the platform needed against a category that talks about ESG but rarely shows the data.',
                screenshot: '/images/realfi/3.png',
                caption: 'Portfolio dashboard with impact metrics treated as first-class data, not marketing copy.',
            },
        ],
        process: 'Daily collaboration with product, engineering, and blockchain teams across multi-stage application and approval workflows, risk-assessment interfaces, and cross-cultural UX research that had to bridge emerging and developed markets. KYC and onboarding designed with progressive disclosure to survive low-bandwidth conditions, with portfolio dashboards that paired financial and impact metrics on a single surface.',
        outcome: {
            summary: 'Platform launched 2024 with active lending to SMEs in East Africa, sitting inside Cardano\'s blockchain ecosystem. RealFi was publicly identified by Cardano founder Charles Hoskinson as a cornerstone initiative for bringing real-world financial utility to blockchain technology, with the dual-journey product design quietly carrying the weight that the marketing thesis depends on.',
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

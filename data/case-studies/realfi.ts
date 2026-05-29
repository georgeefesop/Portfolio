import type { CaseStudy } from './types';

const realfi: CaseStudy = {
    id: 'realfi',
    title: 'RealFi',
    subtitle: 'A Cardano Foundation-funded fintech connecting impact investors with East African SMEs. I led product design inside Input Output, designing for two opposite users on one platform without watering either down.',
    role: 'Lead Product Designer',
    period: '2022-2024 (Input Output)',
    tags: ['Product Design', 'Fintech', 'Dual journey', 'Emerging markets', 'Cardano'],
    categories: ['design'],
    links: {
        live: 'https://realfi.co',
    },
    visual: {
        situation: 'RealFi connects impact investors in developed markets with East African SMEs raising capital, inside Cardano\'s ecosystem at Input Output. The brief was to design for two completely different users on one platform.',
        audience: 'SME owners applying for credit on patchy mobile connections, sometimes in a second language, and family-office impact investors weighing ESG performance alongside financial return.',
        what_made_it_hard: 'Regulated KYC on both sides, and a single platform that had to hold two opposite journeys together with one data model, one brand and one compliance surface.',
        honest_note: 'I led product design and a remote design team on the surfaces below. The platform shipped behind a much larger team of engineers, blockchain architects, compliance and research.',
        process: 'Dual-track design from one role-select fork: multi-stage KYC and credit-assessment flows, dual dashboards where impact and return read on the same axis, and a brand system explored across five directions.',
        outcome: 'The brand directions, KYC architecture and dual-dashboard system designed in this engagement secured the Cardano Foundation funding to continue the initiative.',
        links: [
            { href: 'https://realfi.co', label: 'Live site' },
        ],
        gallery: [
            { image: '/images/realfi/deck/02.webp', title: 'What RealFi is', description: 'An investment platform built inside Cardano\'s ecosystem: compliance-first, designed for two opposite users on the same rails.' },
            { image: '/images/realfi/deck/03.webp', title: 'Compliance, not just convenience', description: 'Regulated KYC surfaces on both sides, with applicants often on low-bandwidth mobile and investors running family-office diligence.' },
            { image: '/images/realfi/deck/04.webp', title: 'Split at sign-in, converge at reporting', description: 'Two parallel flows from one role-select fork, held together by a single data model, brand and compliance surface.' },
            { image: '/images/realfi/deck/05.webp', title: 'Selected screens', description: 'Impact and return on one axis; company information built for due diligence. The dual-journey logic runs under every screen.' },
            { image: '/images/realfi/deck/06a.webp', title: 'The brand system', description: 'Five directions explored; a dark forest-green locked for impact-investment seriousness without the aid-platform earnestness.' },
            { image: '/images/realfi/deck/06b.webp', title: 'Palette', description: 'Twelve tones across four roles: a dark spine for trust, one accent for action, mid-teal greys for hierarchy.' },
            { image: '/images/realfi/deck/06c.webp', title: 'Type', description: 'An editorial serif for the moments that matter, a geometric sans for everything else.' },
            { image: '/images/realfi/deck/07a.webp', title: 'The borrower', description: 'An SME founder in Nairobi: a route to international capital that does not presume Western paperwork, infrastructure or timelines.' },
            { image: '/images/realfi/deck/07b.webp', title: 'The investor', description: 'Family-office capital weighing verifiable impact alongside financial return, on the same screen.' },
            { image: '/images/realfi/deck/08.webp', title: 'Architecture', description: 'The product splits at sign-in and converges at reporting; KYC on each side speaks to one shared compliance surface.' },
            { image: '/images/realfi/deck/09.webp', title: 'Where it sat', description: 'Three adjacent routes existed when RealFi launched. Each solved a piece; none covered the overlap.' },
            { image: '/images/realfi/deck/10.webp', title: 'From signup to disbursement', description: 'The investor journey in five honest steps, running in parallel with the borrower journey through the same KYC and reporting layer.' },
            { image: '/images/realfi/deck/11.webp', title: 'The prototype that secured the funding', description: 'The brand, KYC architecture and dual-dashboard system that took the initiative forward.' },
        ],
    },
    images: {
        thumbnail: '/images/realfi/deck/thumb.webp',
        hero: '/images/realfi/deck/01.webp',
        gallery: [
            '/images/realfi/deck/01.webp',
            '/images/realfi/deck/05.webp',
            '/images/realfi/deck/06a.webp',
        ],
    },
};

export default realfi;

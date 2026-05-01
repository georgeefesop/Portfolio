import type { CaseStudy } from './types';

const stellar: CaseStudy = {
    id: 'stellar',
    title: 'Stellar Observatory',
    subtitle: 'Real-time generative art console blending sci-fi UI with Canvas-API performance, including a vault for cataloguing cosmic outputs.',
    role: 'Design Engineer',
    period: '2025',
    tags: ['Generative Art', 'React', 'Canvas', 'UI Design'],
    categories: ['design', 'nextjs'],
    aiBuilt: true,
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
};

export default stellar;

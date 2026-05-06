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
    body: {
        honest_note: 'A playground project, not a product. The brief was self-set: see how far a diegetic sci-fi UI can go while keeping a Canvas-API render loop performant enough to feel alive.',
        brief: {
            situation: 'A self-set brief: build a futuristic, immersive interface for manipulating generative cosmic visualisations in real time. The challenge was keeping the diegetic sci-fi UI - the kind of console you see on a starship bridge - readable as a real piece of design rather than dressing, while a Canvas-API render loop did the actual creative work underneath.',
            audience: 'People who like creative coding playgrounds - designers, generative artists, the kind of visitor who shows up via a CodePen tweet and stays because the controls actually do something interesting.',
            what_made_it_hard: [
                'Diegetic UI - the kind of "in-world" interface that pretends to belong to a starship - usually collapses into theming once you ask it to do real interactive work, so the system had to survive being functional',
            ],
        },
        decisions: [
            {
                title: 'Diegetic UI that still does the job',
                what: 'A retro-futuristic sci-fi design system - heavy mono type, scan-line textures, console panels - applied as the actual UI rather than a chrome layer. The same components carry the parameter controls, the render viewport, and the vault.',
                why: 'Most diegetic interfaces are decorative. The point of this exercise was to find out whether the system could carry real interactive work - sliders, toggles, saved states - without breaking character. Using one component vocabulary for everything is what kept the world coherent: a parameter slider in a panel that looks like the rest of the bridge does not pull the visitor out of the experience the way a generic Tailwind input would.',
                screenshot: '/images/stellar/so-1.png',
                caption: 'Sci-fi console UI carrying real interactive controls, not just dressing.',
            },
            {
                title: 'Vault as a save state, not a feature bolt-on',
                what: 'A vault system where users can save and catalogue unique generative outputs, integrated into the same component vocabulary as the live console.',
                why: 'A generative playground without a save state is forgettable - the visitor makes something interesting, refreshes the page, and loses it. A vault makes the playground worth coming back to, and integrating it as part of the console vocabulary (rather than a separate gallery page) keeps the experience seamless: catalogue and creation share the same surface.',
                screenshot: '/images/stellar/so-2.png',
                caption: 'Vault catalogue using the same console vocabulary as the live render surface.',
            },
        ],
        process: 'High-performance rendering engine using the Canvas API and React, with a state-management layer designed for real-time parameter tuning across multiple control surfaces. A retro-futuristic design system applied as the operational UI rather than as theming. Vault system for save states, integrated into the same component library so cataloguing and creation share the same visual world.',
        outcome: {
            summary: 'A highly engaging interactive playground that demonstrates the intersection of creative coding, complex state management, and thematic UI design - a self-set brief that holds together as both a piece of design and a piece of working software.',
        },
    },
    links: {
        live: 'https://playground-jet-omega.vercel.app/',
    },
    images: {
        thumbnail: '/images/stellar/so-1.png',
        hero: '/images/stellar/so-1.png',
        gallery: [
            '/images/stellar/so-1.png',
            '/images/stellar/so-2.png',
            '/images/stellar/so-3.png',
        ],
    },
};

export default stellar;

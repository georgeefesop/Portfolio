import type { CaseStudy } from './types';

const sidechains: CaseStudy = {
    id: 'sidechains',
    title: 'Sidechain Interoperability',
    subtitle: 'I worked on the developer experience for Input Output\'s EVM sidechain toolkit across two years at IO: the bridge UX and Solidity-first onboarding that let Solidity developers ship on Cardano without learning Plutus.',
    role: 'Product Designer',
    period: '2022-2024 (Input Output)',
    tags: ['Product Design', 'Dev Tools', 'Cardano', 'Bridge UX', 'Infrastructure'],
    categories: ['design'],
    links: {},
    visual: {
        situation: 'Input Output\'s sidechain toolkit lets developers build custom sidechains on Cardano. My piece was the EVM sidechain developer experience: bridge UX and Solidity-first onboarding that let Ethereum developers ship on Cardano using the tools they already know.',
        audience: 'Solidity developers evaluating whether they could ship on Cardano without learning Plutus, plus Cardano-native developers extending into specialised sidechains (privacy, gaming, DeFi). Two technical audiences with different mental models on the same toolkit.',
        what_made_it_hard: 'Two fundamentally different blockchain architectures (Cardano UTXO vs Ethereum account-based) had to be bridged in UI without papering over the difference; and bridge UX where ambiguity is a wallet-drain required every step to read as obviously safe and obviously reversible up to the point where it is not.',
        honest_note: 'Two-year engagement at Input Output across multiple sidechain surfaces, EVM-first. I contributed to bridge UX and Solidity-first onboarding alongside engineers, blockchain architects and product.',
        process: 'Two years of cross-functional work across the bridge interface, developer documentation and onboarding flows, testnet UX and the stake pool operator dashboard. Arguing bridge-UX-first prioritisation against the engineering roadmap, and inverting the documentation register to pitch at Solidity engineers rather than Cardano-natives, was as much the role as the screen design.',
        outcome: 'EVM sidechain alpha launched 2022, mainnet 2023. Solidity developers can build on Cardano with familiar Ethereum tools; the toolkit became the framework for future specialised sidechains across privacy, gaming and DeFi. Publicly identified by IO leadership as expanding Cardano into multi-chain architecture.',
        stack: [],
        links: [],
        gallery: [
            {
                image: '/images/sidechains/diagram.png',
                title: 'Two chains, one architectural diagram.',
                description: 'The UTXO-to-account-based boundary visualised so Solidity developers can orient before touching the bridge.',
            },
            {
                image: '/images/sidechains/sidechain-thumbnail-v2.png',
                title: 'Bridge UX over feature parity.',
                description: 'Cross-chain asset transfer interface designed for deterministic, unambiguous steps. Ambiguity costs wallets, so the bridge was prioritised above lower-stakes feature work.',
            },
            {
                image: '/images/sidechains/sidechain-thumbnail.png',
                title: 'Onboarding pitched at Solidity, not Plutus.',
                description: 'Documentation and flows written for engineers who have shipped Solidity contracts, with Cardano as the thing being explained rather than assumed.',
            },
        ],
    },
    images: {
        thumbnail: '/images/sidechains/sidechain-thumbnail-v2.png',
        hero: '/images/sidechains/hero.png',
        gallery: [
            '/images/sidechains/hero.png',
            '/images/sidechains/diagram.png',
            '/images/sidechains/sidechain-thumbnail-v2.png',
            '/images/sidechains/sidechain-thumbnail.png',
        ],
    },
};

export default sidechains;

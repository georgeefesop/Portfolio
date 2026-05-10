import type { CaseStudy } from './types';

const sidechains: CaseStudy = {
    id: 'sidechains',
    title: 'Sidechain Interoperability',
    subtitle: 'I worked on the developer experience for Input Output\'s EVM sidechain toolkit across two years at IO: the bridge UX and Solidity-first onboarding that let Solidity developers ship on Cardano without learning Plutus.',
    role: 'Product Designer',
    period: '2022-2024 (Input Output)',
    tags: ['Product Design', 'Dev Tools', 'Cardano', 'Bridge UX', 'Infrastructure'],
    categories: ['design'],
    body: {
        honest_note: 'Two-year engagement at Input Output across multiple sidechain surfaces, EVM-first. I contributed to the bridge UX and the Solidity-first developer onboarding alongside a wider team of engineers, blockchain architects and product. This case credits the surfaces and decisions I owned end to end.',
        brief: {
            situation: 'Input Output\'s sidechain toolkit lets developers build custom sidechains connected to the Cardano mainnet without compromising the main chain\'s security. My piece of the work was the developer experience for the EVM sidechain: the bridge between Cardano and Ethereum that lets Solidity developers ship on Cardano using the tools they already know. The strategic prize the project bet on was the Ethereum developer pool, not the Cardano-native one. The design had to make Cardano feel native to a Solidity audience without watering down the underlying differences.',
            audience: 'Solidity developers from the Ethereum ecosystem evaluating whether they could ship on Cardano without learning Plutus or Haskell, plus Cardano-native developers extending into specialised sidechains (privacy, gaming, DeFi). Two technical audiences with different mental models on the same toolkit.',
            what_made_it_hard: [
                'Two fundamentally different blockchain architectures (Cardano\'s UTXO model vs Ethereum\'s account-based model) had to be bridged in UI without papering over the underlying difference.',
                'Bridge UX where ambiguity is a wallet-drain: every step had to read as obviously safe and obviously reversible up to the point where it is not.',
            ],
        },
        decisions: [
            {
                title: 'Bridge UX over feature parity',
                what: 'A cross-chain bridge interface focused on making asset transfers feel deterministic and unambiguous, prioritised above any cleverer feature work elsewhere in the toolkit.',
                why: 'In bridge UX, ambiguity is a wallet-drain. The first time a Solidity developer moves real funds across a chain boundary, every step has to read as obviously safe and obviously reversible up to the point where it is not. Concentrating the design time on the bridge surface, rather than on more impressive lower-stakes features elsewhere, is the move that makes the product credible to a sceptical audience that has been burned by other bridges. I argued the priority through against the more visible feature work the engineering roadmap was pushing on.',
                screenshot: '/images/sidechains/sidechain-thumbnail-v2.png',
                caption: 'Bridge interface designed for deterministic, unambiguous asset transfers.',
            },
            {
                title: 'Onboarding pitched at Solidity, not Plutus',
                what: 'Developer documentation and onboarding flows written for Solidity developers arriving cold, with the Cardano-native context as the thing being explained, rather than the other way round.',
                why: 'The strategic prize for the EVM sidechain is the Ethereum developer pool, not the Cardano-native one. Pitching the onboarding at someone who has shipped Solidity contracts before, and treating the Cardano-native context as the thing being explained, inverts the default IO documentation register, which traditionally explains Solidity to Cardano developers. That convention got reversed for this product specifically because the audience the strategic case depended on were Solidity engineers, not Cardano-natives.',
                screenshot: '/images/sidechains/sidechain-thumbnail.png',
                caption: 'Onboarding written for Solidity developers crossing into Cardano, not the other way round.',
            },
        ],
        process: 'Two years of cross-functional work with engineering, ecosystem teams and product across multiple sidechain surfaces: the bridge interface for secure asset transfers, developer documentation and onboarding flows pitched at Solidity developers arriving cold, testnet UX for validating sidechain functionality before mainnet, and the stake pool operator dashboard for sidechain validation. The political work of arguing the bridge-UX-first prioritisation, and the documentation register inversion, was as much of the role as the screen design.',
        outcome: {
            summary: 'EVM sidechain alpha launched 2022, mainnet deployment 2023. Solidity developers can now build on Cardano with familiar Ethereum tools, and the toolkit became the framework for future specialised sidechains across privacy, gaming and DeFi. Publicly identified by IO leadership as expanding Cardano\'s feature set into multi-chain architecture; the bridge UX and Solidity-first onboarding carry the developer-acquisition case the strategy depends on.',
        },
    },
    links: {},
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

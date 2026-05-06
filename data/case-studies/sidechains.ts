import type { CaseStudy } from './types';

const sidechains: CaseStudy = {
    id: 'sidechains',
    title: 'Sidechain Interoperability',
    subtitle: 'Developer experience for Input Output\'s EVM sidechain toolkit, bridging Cardano and Ethereum so Solidity developers can build on Cardano.',
    role: 'Product Designer',
    period: '2022-2024 (Input Output)',
    tags: ['Blockchain', 'Dev Tools', 'Infrastructure'],
    categories: ['design'],
    body: {
        brief: {
            situation: 'Input Output\'s sidechain toolkit lets developers build custom sidechains connected to the Cardano mainnet, expanding the ecosystem without compromising the main chain\'s security. I helped design the developer experience for the EVM (Ethereum Virtual Machine) sidechain - the piece that lets Solidity developers ship on Cardano using the tools they already know.',
            audience: 'Solidity developers from the Ethereum ecosystem evaluating whether they could ship on Cardano without learning Plutus/Haskell from scratch, plus Cardano-native developers extending into specialised use cases (privacy, gaming, DeFi). Two technical audiences with different mental models, sharing the same toolkit.',
            what_made_it_hard: [
                'Two fundamentally different blockchain architectures - Cardano\'s UTXO model versus Ethereum\'s account-based model - which meant the bridge interface had to translate the underlying difference rather than paper over it',
            ],
        },
        decisions: [
            {
                title: 'Bridge UX over feature parity',
                what: 'A cross-chain bridge interface focused on making asset transfers feel deterministic and unambiguous, prioritised above any clever feature work elsewhere in the toolkit.',
                why: 'In bridge UX, ambiguity is a wallet-drain. The first time a Solidity developer moves real funds across a chain boundary, they need every step to read as obviously safe and obviously reversible up to the point where it is not. Spending the design time on that surface, rather than on more impressive but lower-stakes features, is what makes the toolkit credible to a sceptical audience that has been burned by other bridges.',
                screenshot: '/images/sidechains/sidechain-thumbnail.png',
                caption: 'Bridge interface designed for deterministic, unambiguous asset transfers.',
            },
            {
                title: 'Onboarding pitched at Solidity, not Plutus',
                what: 'Developer documentation and onboarding flows written for Solidity developers arriving cold, not for Cardano-native developers extending what they already know.',
                why: 'The strategic prize for the EVM sidechain is the Ethereum developer pool, not the Cardano-native pool. Pitching the onboarding at someone who has shipped Solidity contracts before - and treating the Cardano-native context as the thing being explained - inverts the default IO documentation register and makes the product easier to adopt for the audience the strategy actually depends on.',
                screenshot: '/images/sidechains/sidechain-thumbnail.png',
                caption: 'Onboarding written for Solidity developers crossing into Cardano, not the other way round.',
            },
        ],
        process: 'Cross-chain bridge interface design for secure asset transfers; developer documentation and onboarding flows pitched at Solidity developers arriving cold; testnet environment UX for validating sidechain functionality before mainnet; stake pool operator dashboard for sidechain validation. Daily collaboration with engineering and ecosystem teams across multi-year delivery.',
        outcome: {
            summary: 'EVM sidechain alpha launched 2022, mainnet deployment 2023. Solidity developers can now build on Cardano with familiar Ethereum tools, opening the ecosystem to billions in Ethereum development investment and becoming the framework for future specialised sidechains across privacy, gaming, and DeFi. Publicly identified by the CPO as expanding Cardano\'s feature set for niche applications and transitioning the ecosystem into multi-chain architecture.',
        },
    },
    links: {},
    images: {
        thumbnail: '/images/sidechains/sidechain-thumbnail.png',
        hero: '/images/sidechains/hero.png',
        gallery: ['/images/sidechains/sidechain-thumbnail.png'],
    },
};

export default sidechains;

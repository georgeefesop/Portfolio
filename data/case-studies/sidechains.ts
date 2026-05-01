import type { CaseStudy } from './types';

const sidechains: CaseStudy = {
    id: 'sidechains',
    title: 'Sidechain Interoperability',
    subtitle: 'Developer experience for Input Output\'s EVM sidechain toolkit, bridging Cardano and Ethereum so Solidity developers can build on Cardano.',
    role: 'Product Designer',
    period: '2022-2024 (Input Output)',
    tags: ['Blockchain', 'Dev Tools', 'Infrastructure'],
    categories: ['design'],
    description: {
        overview: 'Input Output\'s sidechain toolkit enables developers to build custom sidechains connected to the Cardano mainnet, expanding the ecosystem\'s capabilities without compromising the main chain\'s security. I helped to design the developer experience for the EVM sidechain. (Ethereum Virtual Machine) \n\nThe challenge was creating infrastructure that bridged two fundamentally different blockchain architectures: Cardano\'s UTXO model using Plutus/Haskell versus Ethereum\'s account-based model using Solidity. The solution needed to be technically robust while remaining accessible to developers from both ecosystems.',
        challenge: 'Design developer infrastructure enabling interoperability between Cardano and Ethereum ecosystems while addressing:\n\n• Incompatible smart contract environments (Plutus vs Solidity)\n• Different transaction models (UTXO vs account-based)\n• Asset transfer security between chains\n• Developer tooling compatibility across ecosystems',
        work: [
            'Cross-chain bridge interface design for secure asset transfers',
            'Developer documentation and onboarding flows for Solidity developers',
            'Testnet environment UX for validating sidechain functionality',
            'Stake pool operator dashboard for sidechain validation'
        ],
        outcome: 'EVM sidechain alpha launched 2022, mainnet deployment 2023.\nEnables Solidity developers to build on Cardano using familiar Ethereum tools.\nOpens Cardano ecosystem to billions in Ethereum development investment.\nBecomes framework for future specialized sidechains (privacy, gaming, DeFi).\nTransitions Cardano into multi-chain architecture with enhanced scalability.\nPublicly identified by CPO as expanding Cardano\'s feature set for niche applications.'
    },
    links: {},
    images: {
        thumbnail: "/images/sidechains/sidechain-thumbnail.png",
        hero: "/images/sidechains/hero.png",
        gallery: [
            "/images/sidechains/sidechain-thumbnail.png"
        ]
    }
};

export default sidechains;

import type { CaseStudy } from './types';

const sidechains: CaseStudy = {
    id: 'sidechains',
    title: 'Cardano Side Chain Bridge',
    subtitle: 'A cross-chain bridge for moving tokens between the Cardano main chain and a sidechain. As the only designer on Input Output\'s Sidechains team, I turned an intimidating multi-wallet, multi-chain operation into one guided flow.',
    role: 'Lead UI/UX Designer',
    period: '2022-2024 (Input Output)',
    tags: ['Product Design', 'Interaction Design', 'Web3', 'Cardano', 'Bridge UX'],
    categories: ['design'],
    links: {},
    visual: {
        situation: 'A graphical front door to moving MFT tokens between the Cardano main chain and a Cardano sidechain, built inside Input Output\'s Sidechains department.',
        audience: 'Two specific people: someone comfortable with crypto but not the command line, and a developer who could bridge by hand but wanted the time back.',
        what_made_it_hard: 'Two wallets on two networks, a testnet, a faucet, collateral, a smart contract and two-sided signing, then trusting a transfer you could not watch settle.',
        honest_note: 'The visual language was inherited from the client\'s existing brand. My work here was the information architecture, the flows and the interaction model behind every screen.',
        process: 'Mapped the full set of states a cross-chain transfer can reach, then collapsed them into one legible four-step rail with the real mechanics wrapped in plain language.',
        outcome: 'A non-coder could finish a transfer and a developer could fly through one. The internal engineering team used it as day-to-day tooling, and the groundwork fed into the parallel Lace wallet and Midnight products that ship publicly today.',
        links: [],
        gallery: [
            { image: '/images/sidechains/deck/02.webp', title: 'What the Bridge is', description: 'A graphical front door to a cross-chain process that otherwise lived in the command line.' },
            { image: '/images/sidechains/deck/03.webp', title: 'Built for code, not for people', description: 'Two wallets, two networks, a testnet, faucet, collateral, a smart contract and two-sided signing, then a transfer you could not watch settle.' },
            { image: '/images/sidechains/deck/04.webp', title: 'Make it legible, do not dumb it down', description: 'Keep the real mechanics; wrap each step in plain language, an obvious order, and a state you can always read.' },
            { image: '/images/sidechains/deck/05.webp', title: 'Six decisions that tamed the complexity', description: 'One rail, pinned chain state, plain-language wrapping, in-flow token acquisition, confirm-before-commit, and status for the parts you cannot see.' },
            { image: '/images/sidechains/deck/06-01.webp', title: 'Bridge Home', description: 'A four-step rail, both wallet slots, and a plain-language explainer before any chain action.' },
            { image: '/images/sidechains/deck/06-02.webp', title: 'Connect the origin wallet', description: 'Nami connects on the Cardano side; the origin wallet goes live and the rail advances itself.' },
            { image: '/images/sidechains/deck/06-03.webp', title: 'Connect the destination', description: 'Metamask connects and switches network; the destination wallet comes online without leaving the flow.' },
            { image: '/images/sidechains/deck/06-04.webp', title: 'Acquire inside the shell', description: 'tADA from the faucet and MFT from the smart contract, acquired in-flow with balances confirmed in place.' },
            { image: '/images/sidechains/deck/06-05.webp', title: 'Stage and confirm', description: 'Assets staged for the cross-chain move, every committing action wrapped in a confirmation.' },
            { image: '/images/sidechains/deck/07.webp', title: 'One model underneath', description: 'Two chains, one bridge between them, surfaced as four destinations plus a support rail.' },
            { image: '/images/sidechains/deck/08.webp', title: 'Who it\'s for', description: 'Not consumer scale: a crypto-comfortable non-coder, and a time-pressed developer who wanted the steps off their plate.' },
            { image: '/images/sidechains/deck/09.webp', title: 'What came before', description: 'Three routes already existed, each fine for someone and wrong for most. The Bridge kept the trustlessness and dropped the jargon.' },
            { image: '/images/sidechains/deck/10.webp', title: 'The transfer', description: 'From two empty wallets to a settled transfer, kept to five honest steps.' },
            { image: '/images/sidechains/deck/11.webp', title: 'Daily tooling, and groundwork for what shipped', description: 'Used by the internal engineering team as day-to-day tooling; the groundwork fed into Lace and Midnight.' },
        ],
    },
    images: {
        thumbnail: '/images/sidechains/deck/thumb.webp',
        hero: '/images/sidechains/deck/01.webp',
        gallery: [
            '/images/sidechains/deck/01.webp',
            '/images/sidechains/deck/05.webp',
            '/images/sidechains/deck/06-01.webp',
        ],
    },
};

export default sidechains;

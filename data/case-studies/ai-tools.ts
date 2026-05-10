import type { CaseStudy } from './types';

const aiTools: CaseStudy = {
    id: 'ai-tools',
    title: 'AI User Tools',
    subtitle: 'A self-initiated product exploration for an AI-powered audience simulation tool that lets early-stage founders validate ideas against synthetic personas before spending real money on real users.',
    role: 'Product Designer',
    period: '2024',
    tags: ['UI/UX', 'Product Strategy', 'AI', 'Miro', 'Landing Page'],
    categories: ['design'],
    links: {},
    body: {
        honest_note: 'Self-initiated concept work. The output was a defended product shape, an MVP scope, a working no-code proof of concept, and a landing page direction. Engineering never followed; the case study is the thinking, not a launch.',
        brief: {
            situation: 'Early-stage founders waste months building things nobody wants because real user research is slow, expensive, and gated by recruiting. The hypothesis: GPT-class models are now good enough to stand in for a target audience for the very first round of validation, the round most founders skip entirely. AI User Tools (working name Persona Sim) was an exploration of what that product could be. The remit I set for myself: do the strategy on the canvas, scope an MVP that is actually buildable, prove the core loop works with a no-code rig, then design a landing page that could test the positioning before any engineering time got spent.',
            audience: 'Solopreneurs, indie hackers, and small product teams in the pre-validation phase. People with an idea and a shoestring budget who would not commission a real research project, but who would pay a small monthly fee for a fast, directionally correct sanity check before they commit hundreds of build hours.',
            what_made_it_hard: [
                'Open self-set brief with no client to push back, so the strategy work had to be rigorous enough to defend on its own merits, not just produced.',
                'The category did not really exist yet, which meant inventing a vocabulary (audiences, modes, synthetic surveys, idea score) at the same time as the product.',
                'Easy to over-promise: synthetic feedback is directional, not real research, and the messaging had to land that honestly without undercutting the value.',
            ],
        },
        decisions: [
            {
                title: 'Market and mission first, pixels much later',
                what: 'Opened with company overview, mission, vision, market sizing, and 12-month objectives on the canvas before any UI work. Set a concrete target (2,000 paid users in year one) so every later decision had something to be measured against.',
                why: 'A self-initiated product is the easiest place in the world to drift into making things look nice without a reason. Writing the mission, the market thesis, and a numeric goal at the start meant scope arguments later (which features ship, which modes belong in the MVP, what the landing page promises) had a fixed point to negotiate against. Without it the rest of the work would have been decoration.',
                screenshot: '/images/ai-tools/1.PNG',
                caption: 'Opening Miro board: company overview, mission, vision, and market sizing before anything visual got opened.',
            },
            {
                title: 'JTBD mapping before features',
                what: 'Mapped user personas to jobs-to-be-done, pains, expected outcomes, and the output formats those outcomes need to take. Each column fed the next, so the feature list later had a chain of reasoning behind it instead of vibes.',
                why: 'Most validation tools assume the user wants more data. The JTBD pass kept exposing the opposite: founders mostly want a clear go or no-go in plain language. That insight reshaped the output side of the product (a single Idea Score and three plain-English recommendations) and killed several "more dashboards" features that would have been built by default.',
                screenshot: '/images/ai-tools/5.PNG',
                caption: 'JTBD board: personas, jobs, pains, expected outcomes, and the output formats those outcomes call for.',
            },
            {
                title: 'Vision sketch of the core loop',
                what: 'A two-panel vision diagram showing the same engine running two ways: a generic mode where the system simulates a buyer audience from a product description, and a customer-data mode where the system clones a company\'s real customers from CSV input. Same loop, different inputs, different positioning.',
                why: 'Naming the two modes early (Generic Audience, Real Customer Clone) split the product into a free-tier hook and a paid-tier moat without writing a pricing page. It also made the rest of the work obvious: the MVP only needed to ship the generic mode well, the customer-data mode could wait, and the landing page could lead with the cheaper promise.',
                screenshot: '/images/ai-tools/3.PNG',
                caption: 'Problem, vision, and use cases laid out side by side. The two-panel sketch on the right is the core engine.',
            },
            {
                title: 'Possible features, then a brutal MVP cut',
                what: 'Brainstormed every feature the product could have, then refined that list down to a three-phase MVP architecture: User Input, Internal Processing, Output and Export. Stars next to the features that survived the cut.',
                why: 'The unrefined list had a Pro Personas library, custom charts, white-label exports, a paywalled privacy mode, and ten other things that would have made the MVP a year-long build. The cut down version is the smallest thing that still demonstrates the core loop end to end: user types an idea, system spins up an audience, runs a survey, returns a report. Everything else became roadmap.',
                screenshot: '/images/ai-tools/6.PNG',
                caption: 'Possible features on the left, MVP scope on the right. The three-phase architecture is what the build would actually have shipped.',
            },
            {
                title: 'Modes as the long-term shape',
                what: 'Designed a "modes" system that lets the same engine present as different products: Survey Mode, JTBD Mode, Recession Mode, Pitch Testing Mode, Empathy Mode, Analysis Mode. Each mode reframes the inputs and outputs for one specific job.',
                why: 'A single "AI survey tool" tops out at one workflow. Modes turn one engine into a portfolio of jobs the product can be hired for, which is what made the unit economics in the roadmap plausible (more jobs equals more reasons to keep the subscription). Designing the mode system early also kept the MVP honest: the first mode shipped is just one of many, so it does not need to do everything.',
                screenshot: '/images/ai-tools/7.PNG',
                caption: 'Modes board: each card is a different job-to-be-done the same engine could be hired for.',
            },
            {
                title: 'No-code proof of concept before designing the real UI',
                what: 'Wired up a working version of the core loop in Webflow + Zapier + ChatGPT. User fills a form, Zapier passes the input to GPT, GPT generates a persona and a survey response, the result comes back into a Webflow page. Pros and cons captured directly on the canvas: it works, it is slow, the formatting is a pain.',
                why: 'Designing high-fidelity screens for a product whose core loop has never been tested is a fast way to design something impossible. The no-code rig was the cheapest way to find out which assumptions about the loop survived contact with a real model. Several screens in the eventual wireframe set were specifically reshaped because of what the POC surfaced (latency forced an explicit "generating..." state, GPT formatting forced a strict output schema, the survey-question UX changed once I felt how slow batch generation actually was).',
                screenshot: '/images/ai-tools/8.PNG',
                caption: 'PersonaCraft proof of concept, plus the lists of design and paywalled features that came out of running it.',
            },
            {
                title: 'Landing page that takes a position',
                what: 'A dark, type-led landing page leading with "Innovate smarter, validate faster", a yellow CTA, a 3D persona card on the right, and four bullets that frame the product as a toolkit, not another dashboard. Multiple variants explored which persona render and which secondary copy block tested cleanest.',
                why: 'The landing page is the single artefact that tests the positioning before any code gets written. Pushing the visual identity hard (saturated yellow on near-black, big claims, a literal AI-generated persona staring out of the page) was the cheapest way to make the offer memorable and to make the "synthetic personas" claim feel concrete rather than abstract. Variants existed so the page could be A/B tested against itself once a waitlist started running.',
                screenshot: '/images/ai-tools/AIUT-2.png',
                caption: 'Hero of the landing page direction. The 3D persona on the right makes the abstract pitch ("simulate target customers") visually concrete.',
            },
        ],
        process: 'Strategy on the canvas first: company overview, mission, vision, market analysis, business model canvas, JTBD mapping, problem-vision-use-cases. Then product shape: vision diagram of the core loop, possible features, MVP cut, modes system, wireframes, build strategy, pricing thinking, 12-month roadmap with three revenue scenarios. Then a Webflow + Zapier + ChatGPT proof of concept to confirm the loop actually works before committing to high-fidelity UI. Finally a landing page direction with multiple hero variants ready to A/B against a waitlist. Output: a defendable product shape, an MVP scope that fits one engineer for a quarter, and a landing page that can carry the positioning. No build phase ever followed.',
        outcome: {
            summary: 'A complete product exploration end to end: market thesis, JTBD-grounded feature set, MVP scope, working proof of concept, and a landing page direction with a defended point of view. The artefact set demonstrates how I move from an open brief to a buildable product without skipping the strategy or pretending the engineering would have been trivial. The brief was to find the shape of the product and prove the core loop, and that is what shipped.',
        },
    },
    images: {
        thumbnail: '/images/ai-tools/AIUT-2.png',
        hero: '/images/ai-tools/AIUT-2.png',
        gallery: [
            '/images/ai-tools/AIUT-2.png',
            '/images/ai-tools/11.PNG',
            '/images/ai-tools/1.PNG',
            '/images/ai-tools/3.PNG',
            '/images/ai-tools/5.PNG',
            '/images/ai-tools/6.PNG',
            '/images/ai-tools/7.PNG',
            '/images/ai-tools/8.PNG',
            '/images/ai-tools/9.PNG',
            '/images/ai-tools/2.PNG',
            '/images/ai-tools/10.PNG',
            '/images/ai-tools/12.PNG',
            '/images/ai-tools/4.PNG',
        ],
    },
};

export default aiTools;

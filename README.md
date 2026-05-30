# GE Portfolio (georgeefesop/Portfolio)

George Efesopoulos' product-design + AI-build portfolio. Live, deployed on Vercel, and fully populated.

> Heads-up for future agents: this site is NOT empty. A previous default create-next-app README led an agent to wrongly conclude there was no content. The real content lives in `data/case-studies/` and `components/`. Check the tree, not assumptions.

## Stack
- Next.js 16 (App Router) + React 19, TypeScript
- Tailwind v4, Framer Motion, @react-three/fiber + drei (3D hero / product canvas)
- Sanity (headless CMS, e.g. Kingfisher content), Supabase (leads persistence)
- Stripe (client payment flows), Resend (email), PostHog + Vercel Analytics
- Package manager: npm (package-lock.json). Dev: `npm run dev` then open http://localhost:3000

## Layout
- `app/` - routes: homepage, `admin/leads`, `api/*` (contact, estimate, leads, webhooks), client-specific routes (e.g. `kingfisher`, `kingfisher-sanity/studio`)
- `components/sections/` - homepage sections (Hero, About, CaseStudies, Services, Process, Testimonials, Gallery, Contact, ...)
- `components/ui/` - shared UI (CaseStudyModal, Navigation, Footer, canvases, ...)
- `components/kingfisher/` - the Kingfisher client microsite components
- `data/case-studies/` - case study CONTENT (one `.ts` per study) + `types.ts` + the `index.ts` registry
- `lib/`, `hooks/`, `sanity/`, `public/`, `screens/`, `scripts/`

## Case studies (the important part)
Each case study is a typed object in `data/case-studies/<slug>.ts`, imported and added to the `cases[]` array in `data/case-studies/index.ts`. They render via `components/sections/CaseStudies.tsx` + `components/ui/CaseStudyModal.tsx`.

To add one:
1. Create `data/case-studies/<name>.ts` exporting a `CaseStudy` (see `types.ts`; copy an existing file like `akti.ts` as a template).
2. Import it in `index.ts` and add it to the `cases[]` array (array order = display order).
3. External / link-only references go in `external.ts`.

Currently live: la-hacienda-rebrand, realfi, estia-kitchens, ai-tools, instant-access-locksmiths, uk-vehicles, kingfisher-mortgages, la-hacienda, allsop-francis, sidechains, saxseat, shackle, akti.

## Conventions
- No em dashes anywhere (U+2014). A husky + lint-staged pre-commit hook (`scripts/fix-emdashes.mjs`) auto-replaces them on commit. Do not reintroduce.
- Project quirks, decisions, and internal tools are logged in `CLAUDE.md` (auto-maintained dossier). Read it before non-trivial work.
- Env in `.env.local` (Stripe, Sanity, Supabase, Resend). Never commit secrets.

## Deploy
Vercel, from `github.com/georgeefesop/Portfolio` (origin). Commits to the default branch auto-deploy.

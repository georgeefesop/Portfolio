
# Sanity Kingfisher schema overview

The Kingfisher Mortgages microsite content (the only CMS-backed surface in this repo) is modeled in Sanity. Everything else - case studies, portfolio copy, pay catalogue, greg copy - is typed source code or static.

## Project and dataset

- Sanity project ID: `bfonjqiz`.
- Dataset: `kingfisher`.
- Configured in `sanity.config.ts` (`basePath: '/kingfisher-sanity/studio'`).
- CLI config: `sanity.cli.ts` reads `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
- Studio is hosted IN this Next app at `/kingfisher-sanity/studio` (not a separate Sanity hosted deployment). Visit `http://localhost:3000/kingfisher-sanity/studio` in dev.

## Schemas

All 13 types live in `sanity/schemas/kingfisher/` and are re-exported via `sanity/schemas/kingfisher/index.ts`. Every Sanity `name:` is prefixed `kf_` to keep the namespace clean.

| File | Sanity name | Purpose |
|---|---|---|
| `siteSettings.ts` | `kf_siteSettings` | Site-wide settings (site name, logos light/dark, nav links). |
| `hero.ts` | `kf_hero` | Hero section (eyebrow, headline, lede, CTAs, hero image, rate badge, lender logos). |
| `marquee.ts` | `kf_marquee` | Scrolling marquee block. |
| `problemFrame.ts` | `kf_problemFrame` | "Problem framing" section. |
| `calculator.ts` | `kf_calculator` | Mortgage calculator block. |
| `howItWorks.ts` | `kf_howItWorks` | "How it works" steps. |
| `audiences.ts` | `kf_audiences` | Audience-segmented panels (self-employed / contractor / etc). |
| `receiptTestimonial.ts` | `kf_receiptTestimonial` | Receipt-styled testimonial block. |
| `caseStudy.ts` | `kf_caseStudy` | Kingfisher's own case-study entries (NOT the portfolio's `data/case-studies/`). |
| `freelancerFair.ts` | `kf_freelancerFair` | Freelancer Fair event/section. |
| `productBand.ts` | `kf_productBand` | Product band (mortgage product rows). |
| `faq.ts` | `kf_faq` | FAQ entries. |
| `finalCta.ts` | `kf_finalCta` | Bottom-of-page CTA block. |

## Env vars

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=bfonjqiz
NEXT_PUBLIC_SANITY_DATASET=kingfisher
```

Both are NEXT_PUBLIC because the in-app Studio (`sanity.config.ts`) needs them on the client. Read-only access to the dataset uses the standard Sanity public CDN; mutating from the Studio uses the visitor's Sanity login.

## Seeding

```bash
npm run seed:kingfisher
# -> node scripts/seed-kingfisher-sanity.mjs
```

Seeds initial content into the dataset. Re-run is safe / idempotent per the script (verify before re-running in prod).

## Image transforms

`next.config.ts` whitelists `cdn.sanity.io` under `images.remotePatterns`. Use `@sanity/image-url` (already a dep) to build typed transform URLs in components.

## Where to render

Kingfisher pages live under `app/kingfisher/*`. Component code is under `components/kingfisher/`. The studio at `/kingfisher-sanity/studio` is a separate route tree from the rendered marketing pages, but reads the same dataset.

## Adding a new schema type

1. Create `sanity/schemas/kingfisher/<name>.ts` exporting `defineType({ name: 'kf_<name>', ... })`.
2. Add a re-export line to `sanity/schemas/kingfisher/index.ts`.
3. The schema appears in the in-app Studio at `/kingfisher-sanity/studio` after a dev-server restart.
4. Build the rendering component under `components/kingfisher/` and consume via `next-sanity` GROQ queries.

## NOT canonical for ge-portfolio content

To avoid confusion: Sanity is canonical ONLY for Kingfisher Mortgages microsite content. The portfolio's case studies are typed source code in `data/case-studies/` (see `docs/how-to/add-case-study.md`). Do not propose moving the portfolio into Sanity - the typed-code model is deliberate.

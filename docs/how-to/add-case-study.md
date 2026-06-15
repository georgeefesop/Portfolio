
# How to add a case study

Case studies are typed `CaseStudy` objects in source, not CMS rows. Adding one means writing a `.ts` file, importing it, and adding it to the display array.

## 1. Pick a slug and copy a template

Slugs are kebab-case and become both the filename and the `id`. Existing slugs live in `data/case-studies/index.ts`. Use `akti.ts`, `realfi.ts`, or `kingfisher-mortgages.ts` as templates depending on the layout you want:

```bash
# tabbed builds (e.g. React vs Webflow comparison)
cp data/case-studies/akti.ts data/case-studies/<your-slug>.ts

# single rich body (brief + decisions + outcome)
cp data/case-studies/realfi.ts data/case-studies/<your-slug>.ts

# visual-led gallery
cp data/case-studies/ai-visual-production.ts data/case-studies/<your-slug>.ts
```

## 2. Fill in the fields

Required (from `data/case-studies/types.ts`):

- `id` - matches the filename slug.
- `title`, `subtitle`, `role`, `period`, `tags`, `categories`.
- `links` - `{ live?, behance?, github? }`.
- `images` - `thumbnail`, `hero`, and `gallery` (flat array or per-breakpoint object).
- One of: `description` (legacy short shape), `body` (rich `CaseStudyBody`), `builds` (tabbed `CaseStudyBuild[]`), or `visual` (`CaseStudyVisual` gallery layout). The modal picks the layout based on which is present.

`CategoryId` is one of: `'design' | 'wordpress' | 'nextjs' | 'ai-image' | 'react' | 'webflow' | 'tailwind' | 'sanity'`.

Optional but common:

- `aiBuilt: true` - flags the case as AI-built on the card.
- `stack` - tech-logo ids from `data/tech-logos.ts`.
- `comparison` - top-level `StackComparison` block with Lighthouse rings + delta table.

## 3. Register it in `index.ts`

`data/case-studies/index.ts` imports each case and pushes it onto `cases[]`. ARRAY ORDER IS DISPLAY ORDER. Insert at the desired position:

```ts
import yourSlug from './your-slug';

export const cases: CaseStudy[] = [
  yourSlug,        // newest first
  aiVisualProduction,
  laHaciendaRebrand,
  // ...
];
```

## 4. Add images

Drop optimized images into `public/` (path depends on the project's convention; check sibling cases). The `thumbnail`, `hero`, and `gallery` paths in your case file are absolute URLs starting with `/`.

For SVG logos that need to inherit text color, use CSS `mask-image`, NOT Next.js `<Image>` - the `<Image>` document context isolates `currentColor`. See `AGENTS.md` Gotchas.

## 5. External / link-only entries

If the case is link-only (no full modal), add it to `data/case-studies/external.ts` instead. These render as click-out tiles without opening the modal.

## 6. Verify

```bash
npm run dev
open http://localhost:3000             # confirm the card appears in the work grid
                                       # click it; confirm the modal renders all sections
npm run lint                           # eslint
npm run build                          # catches type errors the dev server hides
```

`npm run test` exercises `lib/admin/*` unit tests; it does not cover case study rendering. The verify step is visual.

## 7. Commit

The husky pre-commit hook will auto-replace any em dashes (U+2014) with hyphens via `scripts/fix-emdashes.mjs`. Do not introduce em dashes by hand.

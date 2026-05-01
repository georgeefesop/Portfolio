# Case-Study Generator - Design Spec

Date: 2026-05-01
Author: George (with Claude)
Status: Approved, ready for implementation plan

---

## 1. Goal

A user-scope Claude Code skill (`case-study-generator`) that turns any URL into a portfolio-grade case study: multi-viewport screenshots, curated section captures, narrative analysis of design decisions, and a typed data file ready to drop into the GE-Portfolio site.

The skill exists to solve three problems simultaneously:

1. The current case studies on the portfolio (`components/sections/CaseStudies.tsx`) are thin - `overview / challenge / work[] / outcome` - and don't carry "here's the section, here's what I decided, here's why" annotations
2. Generating screenshots, cropping a 4:3 Upwork hero, and writing structured case-study copy is repetitive friction that scales poorly across 13+ projects
3. The eventual case-study modal redesign needs a richer content shape to design *against* - this skill produces that shape

## 2. Non-goals

- **Modal redesign.** Deferred. The redesigned modal will be designed against the rich schema this skill produces, not the other way round.
- **Bulk re-generation of existing case studies.** Skill is one-at-a-time; the user picks which entries get rewritten.
- **Auto-commit / auto-PR / auto-publish.** Skill writes files and stops.
- **Brand-specific styling beyond GE-Portfolio.** Skill is brand-agnostic in capture, but the writing voice and output schema are tuned to George's existing case-study tone.

## 3. Architecture

### 3.1 Skill shape

Single skill, agent-orchestrated (option B from brainstorming). The skill folder contains:

```
~/.claude/skills/case-study-generator/
  SKILL.md                            # phase orchestration, prompts, sub-agent dispatch templates
  recon.mjs                           # Playwright DOM inspection → section manifest JSON
  capture-viewports.mjs               # multi-viewport batched capture (wraps screenshot-section/shot.mjs)
  crop-thumbnail.mjs                  # sharp-based 4:3 crop with anchor flag
  emit.mjs                            # deterministic file writer (assets → public/, data → data/case-studies/)
  reference/
    case-study-structure.md           # distilled best-practices (researched once during build)
    decision-prompts.md               # per-section analysis prompt template
    voice-anchors.md                  # excerpts of George's existing case studies for tone matching
  package.json + node_modules/        # local Playwright (reused install) + sharp
```

No new external services. Zero baseline cost - pure local Playwright + sharp.

### 3.2 Invocation contract

```
/case-study-generator <url>
```

URL-only trigger. Skill conducts a short conversational onboarding once invoked:

1. Role and timeframe on this project?
2. One paragraph: brief + what made it hard?
3. Concrete outcomes? (numbers, launches, follow-on work)
4. Existing portfolio entry to update, or new project? → if new, asks for `id` slug + tags + category

If pre-supplied in the trigger message, skill skips that question.

## 4. Phases

| Phase | Owner | Output |
|---|---|---|
| 0. Setup | skill | working dirs created |
| 1. Recon | sub-agent (general-purpose) | `manifest.json` of candidate sections + site metadata |
| 2. Curation checkpoint | main agent ↔ user | confirmed section list + any extra paths |
| 3. Multi-viewport capture | single sub-agent | PNGs in `working/captures/{desktop,tablet,mobile}/` |
| 4. Review + decision-picking | main agent ↔ user | 3–5 highlighted decisions + hero choice + crop anchor |
| 5. Crop | deterministic script | `<id>-thumb.jpg` (1200×900) + `<id>-hero.png` |
| 6. Write | main agent | structured case study (TS module + .md mirror) |
| 7. Emit | deterministic script | files copied into repo at final destinations |

### 4.1 Phase 0 - Setup

Create working dir under `~/Documents/Claude Local/case-studies/<id>/` (mirrors existing `image-generation` skill convention):

```
working/captures/{desktop,tablet,mobile}/
working/notes/
final/
```

### 4.2 Phase 1 - Recon (sub-agent)

A `general-purpose` sub-agent runs `recon.mjs <url>` which:

- Loads URL via Playwright (reusing `screenshot-section`'s chromium install)
- Lists candidate sections in priority order:
  1. Semantic: `<section>`, `<main > *`, `[role="region"]`
  2. Builder patterns: `.elementor-section`, `.wp-block-cover`, `[data-component]`, `[class*="section"]`
  3. Viewport-chunking fallback: scroll top→bottom, capture every ~800px gap between content blocks
- Returns JSON manifest:
  ```json
  {
    "url": "...",
    "site": { "title": "...", "meta_description": "...", "primary_nav": [...], "stack_hints": [...] },
    "sections": [
      { "id": "s1", "selector": "main > section:nth-of-type(1)", "label_guess": "hero", "height_px": 720, "top_y": 0, "role_guess": "hero" },
      ...
    ]
  }
  ```
- Saves to `working/notes/manifest.json`

Sub-agent returns the manifest as its result. Main agent reads it.

### 4.3 Phase 2 - Curation checkpoint (main agent ↔ user)

Main agent presents the section list inline:

```
Found 7 sections:
1. hero
2. credibility-bar
3. feature-grid (3-up)
4. case-studies-strip
5. testimonial wall
6. faq
7. footer-cta

Capture all? Skip any? Any extra paths to also capture (e.g. /pricing, /about)?
```

User confirms. Defaults: skip footer + cookie banner. Main agent writes the confirmed list to `working/notes/sections-to-capture.json`.

### 4.4 Phase 3 - Multi-viewport capture (single sub-agent)

One sub-agent runs `capture-viewports.mjs --manifest <path> --out <dir>`. Script internally:

- Spins one Playwright browser, runs all viewports sequentially (cheap, deterministic) OR parallel browsers if it makes sense - implementation detail
- Captures each confirmed section at three viewport profiles:

| Viewport | Width × Height | Scale | Coverage |
|---|---|---|---|
| Desktop | 1440 × 900 | 2× | every confirmed section |
| Tablet | 820 × 1180 | 2× | ≥2 sections (auto-pick: hero + most layout-revealing - usually a grid or feature row) |
| Mobile | 390 × 844 | 2× | ≥2 sections (same logic) |

- Naming: `<id>__<section-slug>__<viewport>.png`
- Saves all to `working/captures/{viewport}/`
- Returns a JSON manifest of every capture written

Sub-agent's job is execution + reporting. No judgement work.

### 4.5 Phase 4 - Review + decision-picking (main agent ↔ user)

Main agent reads the captures inline, then runs a structured review *with the user* covering:

1. **Hero thumbnail.** Default = hero section's desktop capture. User confirms or picks a different source. User can specify a crop anchor (`top`, `center`, `left`, `right`, or pixel offsets) if the centred default would lose important content.
2. **Highlighted decisions.** Pick 3–5 sections to deep-dive in `body.decisions`. User and main agent collaboratively decide which sections best showcase the design thinking - not necessarily the prettiest, but the most decision-rich.
3. **Gallery picks.** Confirm which desktop / tablet / mobile shots ship to `final/` (default: all desktop + chosen tablet/mobile).
4. **Throwaways.** Mark any captures to drop (loading states, broken layouts, off-brand pop-ups).

Output: `working/notes/curation.json`:

```json
{
  "hero": { "source": "desktop/site__hero__desktop.png", "anchor": "center" },
  "decisions": ["hero", "feature-grid", "testimonial", "calculator"],
  "gallery": {
    "desktop": ["hero", "feature-grid", "testimonial"],
    "tablet": ["hero", "feature-grid"],
    "mobile": ["hero", "calculator"]
  },
  "drop": ["footer-cta__desktop"]
}
```

### 4.6 Phase 5 - Crop (deterministic script)

`crop-thumbnail.mjs --source <path> --anchor <anchor> --out <path>`:

- Uses `sharp` to crop a 4:3 region (1200×900 final) from the source image
- Anchor logic:
  - `center` → centre-crop the longest dimension to match 4:3
  - `top` / `bottom` / `left` / `right` → biased crop preserving that edge
  - `x,y` (e.g. `--anchor 200,100`) → manual offset
- Output: JPEG q90, sRGB, stripped of EXIF

Also writes `<id>-hero.png` (the chosen source image, full size, copied as-is - no crop).

### 4.7 Phase 6 - Write (main agent)

Main agent writes the case study directly, in conversation. Reads:

- User's brief from Phase 0
- `working/notes/manifest.json` (for site context)
- `working/notes/curation.json` (for which sections are highlighted)
- `~/.claude/skills/case-study-generator/reference/case-study-structure.md` (best-practices template)
- `~/.claude/skills/case-study-generator/reference/voice-anchors.md` (existing case studies for tone)

Produces a structured TypeScript module conforming to the schema in §5, plus a `case-study.md` mirror in `final/` for human review.

**Voice rules** (enforced via SKILL.md prompts):

- British English (`organised`, `behaviour`, `colour`, `licence`)
- No em-dashes (`-`) - use hyphens, commas, or full stops. Hard rule from project CLAUDE.md.
- Terse. Information-dense. Honest about constraints and what didn't work.
- No marketing puffery ("revolutionary", "cutting-edge", "leveraged"). Match George's existing voice.
- Word count target: 600–900 words across `body.brief` + `body.decisions[].why` + `body.process` combined.

### 4.8 Phase 7 - Emit (deterministic script)

`emit.mjs --case-id <id> --working <dir> --repo <repo-root>`:

1. Copies chosen images from `working/` → `<repo>/public/images/<id>/`:
   - `<id>-thumb.jpg` (4:3, 1200×900)
   - `<id>-hero.png` (wide hero)
   - `gallery/<viewport>/<n>.png` for each gallery pick
2. Writes `<repo>/data/case-studies/<id>.ts` (typed module, default export)
3. Mirrors `case-study.md` to `<repo-root>/docs/case-studies/<id>.md` (human-readable)
4. Prints a manifest of every file written + a one-line "next step":
   > Add `<id>` to `data/case-studies/index.ts` exports - or run `emit.mjs --wire` to do it automatically.

The `--wire` flag opens `data/case-studies/index.ts` and appends the import + entry. Idempotent; checks for existing entry first.

## 5. Output schema

`data/case-studies/types.ts` (new file):

```ts
export type CategoryId = 'design' | 'wordpress' | 'nextjs' | 'ai-image';

export type CaseStudy = {
  // Flat fields - required, used by card UI today (CaseStudies.tsx grid + filter pills)
  id: string;
  title: string;
  subtitle: string;
  role: string;
  period: string;
  tags: string[];
  categories: CategoryId[];
  aiBuilt?: boolean;
  links: { live?: string; behance?: string; github?: string };

  // EITHER `description` (legacy) OR `body` (new rich block) must be present.
  // Both optional at the type level for backwards compatibility; modal adapter handles either.

  description?: {
    overview?: string;
    challenge: string;
    work: string[];
    outcome: string;
  };

  body?: {
    brief: {
      situation: string;
      audience: string;
      what_made_it_hard: string[];
    };
    decisions: Array<{
      title: string;                // "Estimator over contact form"
      what: string;                 // 1–2 sentences
      why: string;                  // 2–4 sentences
      rejected_alternative?: string;
      screenshot: string;           // path under public/images/<id>/
      caption: string;
    }>;
    process?: string;               // optional 100–200 word prose
    outcome: {
      summary: string;
      metrics?: Array<{ label: string; value: string }>;
      honest_note?: string;
    };
  };

  images: {
    thumbnail: string;              // 4:3 1200×900 - cards + Upwork
    hero: string;                   // wide, modal top
    gallery: string[] | {           // discriminated by shape
      desktop: string[];
      tablet?: string[];
      mobile?: string[];
    };
  };
};
```

`data/case-studies/index.ts`:

```ts
import realfi from './realfi';
import kingfisher from './kingfisher-mortgages';
// ... (one import per migrated entry)

export const cases: CaseStudy[] = [realfi, kingfisher, ...];
```

## 6. CaseStudies.tsx refactor (companion task)

This is **part of the same body of work** but technically separate from the skill itself. Sequence: skill build → refactor → first generated case study → modal redesign (later).

1. Move every entry in `components/sections/CaseStudies.tsx`'s `cases` array to a per-project file under `data/case-studies/<id>.ts`. Pure mechanical move; no schema changes - existing entries keep their `description` shape.
2. Move the `externalCases` array to `data/case-studies/external.ts` similarly.
3. `CaseStudies.tsx` becomes ~250 lines (currently ~700) and imports the data from `@/data/case-studies`.
4. Add a small `caseStudyAdapter` that the modal will eventually use to render either `description` or `body` shape - stub for now, full implementation lands with modal redesign.

## 7. Companion housekeeping (separate task, follows skill build)

Not part of the skill or its plan - but in the same body of work:

1. **Root cleanup.** Audit and place each loose root file:
   - `ESTIMATOR_AMENDMENT.md`, `ESTIMATOR_PROMPT_FOR_DEV.md`, `GOOGLE_SHEETS_SETUP.md`, `GOOGLE_SHEET_WEBHOOK.md` → review with user, archive to `docs/archive/` or delete
   - `Screenshots/` → review contents, archive to `docs/archive/screenshots-legacy/` if still useful, delete otherwise
   - `download_assets.ps1` → review, keep at root or move to `scripts/`
   - `tailwind.config.ts.bak` → delete (backup file)
   - `__pycache__/` → gitignore + delete
2. **Hand-written `ONBOARDING.md` at project root**, replacing reliance on the auto-generated `.claude/ONBOARDING.md`. Modelled on the kingfisher onboarding doc:
   - Section 1: What this project is
   - Section 2: Hard rules (no em-dashes, British English, surgical changes, no comments explaining WHAT)
   - Section 3: Project layout
   - Section 4: Tooling cheat sheet (which tool for which job - `screenshot-section`, `redesign-section`, `case-study-generator`, `runware`, etc.)
   - Section 5: Key gotchas (current CLAUDE.md quirks list)
   - Section 6: Voice / writing rules (case-study tone anchors)
   - Section 7: Where to find things (BRIEFING.md, CLAUDE.md, etc.)

## 8. Verification (what "done" means for one skill run)

End of a successful run:

- `working/captures/` has ≥7 images: ≥3 desktop + 2 tablet + 2 mobile
- `working/notes/{manifest,sections-to-capture,curation}.json` exist
- `<repo>/public/images/<id>/` exists with hero, thumbnail, and chosen gallery
- `<repo>/data/case-studies/<id>.ts` exists, type-checks clean (`npx tsc --noEmit`)
- `<repo>/docs/case-studies/<id>.md` mirror exists for human review
- Word count: 600–900 across `body.brief` + `body.decisions[].why` + `body.process`
- Voice check: zero em-dashes, British spellings, no marketing puffery

## 9. Open questions / risks

1. **DOM recon accuracy.** Builder-pattern sites (Webflow, Framer) sometimes wrap real sections in 3–4 layers of div. Recon may need site-specific heuristics. Mitigation: viewport-chunking fallback always available; user can override in Phase 2.
2. **Authenticated / paywalled URLs.** Skill currently assumes public URLs. Out of scope for v1; document as a known limitation.
3. **Sharp install.** Adds native deps. Skill folder must run `npm install` cleanly on first use; verify on Windows specifically (existing `screenshot-section` skill works on Windows, so the pattern is proven).
4. **Voice-anchor staleness.** `voice-anchors.md` snapshots existing case studies; if George rewrites his tone, the skill will keep producing in the old voice. Mitigation: skill's onboarding in §10 includes "review and update reference docs annually" note.

## 10. Implementation order

1. Build `recon.mjs` - verify against ≥3 real URLs (one Next.js, one WordPress, one external)
2. Build `capture-viewports.mjs` - verify 7-section site captures cleanly across all 3 viewports
3. Build `crop-thumbnail.mjs` - verify centre + edge anchors produce sensible crops
4. Refactor `CaseStudies.tsx` → `data/case-studies/*` - schema-compatible, no behaviour change
5. Add `data/case-studies/types.ts` with the new optional `body` shape
6. Build `emit.mjs` - depends on schema in step 5
7. Research case-study best-practices, write reference docs:
   - `case-study-structure.md` (best-practices template)
   - `decision-prompts.md` (per-section analysis prompt)
   - `voice-anchors.md` (extract from existing entries)
8. Write `SKILL.md` with all phase prose + dispatch templates
9. End-to-end dry run on one project (suggest UK Vehicles - has live site + George knows the brief inside out)
10. Iterate based on the dry run

Companion housekeeping (root cleanup + ONBOARDING.md) is a separate task done after step 4 or in parallel with steps 1–3.

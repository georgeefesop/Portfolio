<!-- DOSSIER:auto-maintained -->

## Project Dossier

### Quirks & Gotchas

- 2026-04-30: Next.js <Image> loading SVGs ignores currentColor fills because SVGs load in their own document context - use CSS mask-image instead to inherit parent color
- 2026-04-30: The fix-emdashes.mjs script must never contain a literal U+2014 byte; first attempt had em dashes in comments, the hook ran against itself and silently became a no-op. Script uses String.fromCodePoint(0x2014) to stay pure ASCII.
- 2026-04-30: Turbopack aggressively caches CSS chunks in dev - token changes (e.g. --text-dim value) may not reflect until dev server restart even after prod build shows the correct value
- 2026-04-30: layout.tsx inline theme script now defaults all visitors to light-olive when no localStorage key exists; dark theme is no longer the default

### Internal Tools Created

- 2026-04-30: scripts/fix-emdashes.mjs - pre-commit script that replaces U+2014 em dashes with hyphens in all staged source files; wired via husky + lint-staged

### Decisions

- 2026-04-30: Removed vibrant mode (colour blob background + BackgroundToggle) from ProductHero entirely - it was a visual experiment that didn't fit the repositioned portfolio aesthetic (removed in window starting at 9170faa)
- 2026-04-30: CornerBrackets HUD decoration removed from CaseStudyModal desktop panel - simplified to clean border, less visual noise (same window)
- 2026-04-30: Hero H1 changed to UX / UI PRODUCT / DESIGNER & DEVELOPER so visitors who don't know 'Product Designer' means UX/UI see the term immediately (commit 2260f83)
- 2026-04-30: prototype:open custom event is the single source of truth for opening the POS modal - sound fires from the event listener in ProductHero, not from individual callers
- 2026-04-30: Light-mode theme system added with three palettes (light-sand, light-linen, light-olive) all defined as [data-theme] CSS overrides; POS prototype has its own pos-* token scale so it stays visually coherent across both dark and light themes (commit 51c1c66)
- 2026-04-30: Chose CSS mask-image over Next.js <Image> for SVG logos in CredibilityBar because Image loads SVGs in isolated document context where currentColor does not inherit

### Workflows

- 2026-04-30: Em-dash guard: husky pre-commit hook runs scripts/fix-emdashes.mjs via lint-staged on all staged ts/tsx/js/jsx/css/html/svg/json/md files - em dashes are auto-replaced before any commit lands

<!-- /DOSSIER:auto-maintained -->

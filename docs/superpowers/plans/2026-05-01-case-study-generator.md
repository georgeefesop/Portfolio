# Case-Study Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a user-scope `case-study-generator` skill that turns any URL into a portfolio-grade case study: multi-viewport screenshots, curated section captures, narrative analysis of design decisions, and a typed data file ready to drop into the GE-Portfolio site.

**Architecture:** Single skill at `~/.claude/skills/case-study-generator/`. Agent-orchestrated via `SKILL.md`. Four small Node helpers handle deterministic work (DOM recon, multi-viewport capture, 4:3 crop, file emission). Main agent runs the high-judgement phases (curation, decision-picking, writing) in conversation with the user. Schema in the portfolio repo is backwards-compatible with existing entries (legacy `description` block stays valid; new `body` block is additive).

**Tech Stack:** Node 20+ ESM, Playwright (reused install from `screenshot-section`), `sharp` for cropping, `node:test` for skill smoke tests, TypeScript for the portfolio data schema.

**Spec:** `docs/superpowers/specs/2026-05-01-case-study-generator-design.md`

---

## File map

**Skill (outside repo):** `~/.claude/skills/case-study-generator/`

| File | Responsibility |
|---|---|
| `package.json` | Local deps: `sharp`. Reuses Playwright from `screenshot-section`. |
| `recon.mjs` | Phase 1 - Playwright DOM inspection, returns section manifest JSON |
| `capture-viewports.mjs` | Phase 3 - wraps `screenshot-section/shot.mjs`, batched multi-viewport |
| `crop-thumbnail.mjs` | Phase 5 - `sharp`-based 4:3 crop with anchor flag |
| `emit.mjs` | Phase 7 - deterministic file writer (assets → `public/`, data → `data/case-studies/`) |
| `SKILL.md` | All phase prose, prompts, sub-agent dispatch templates |
| `reference/case-study-structure.md` | Best-practices template (researched up front) |
| `reference/decision-prompts.md` | Per-section analysis prompt |
| `reference/voice-anchors.md` | Excerpts of George's existing case studies |
| `test/fixtures/sample-site.html` | Static HTML for offline tests of recon + capture |
| `test/fixtures/sample-image.png` | 2000×1500 source for crop tests |
| `test/recon.test.mjs` | Smoke test for `recon.mjs` |
| `test/capture-viewports.test.mjs` | Smoke test for `capture-viewports.mjs` |
| `test/crop-thumbnail.test.mjs` | Smoke test for `crop-thumbnail.mjs` |
| `test/emit.test.mjs` | Smoke test for `emit.mjs` |

**Portfolio repo:** `C:\Users\georg\Documents\GitHub\GE-Portfolio\`

| File | Responsibility |
|---|---|
| `data/case-studies/types.ts` | Schema (CategoryId, CaseStudy types) |
| `data/case-studies/index.ts` | Aggregates per-project case studies into the `cases` array |
| `data/case-studies/external.ts` | The `externalCases` array, moved out of the component |
| `data/case-studies/<id>.ts` | One file per case study (13 files initially, mechanical move) |
| `components/sections/CaseStudies.tsx` | Imports from `@/data/case-studies`, no inline data |
| `ONBOARDING.md` | New, hand-written, root-level (replacing reliance on auto-generated `.claude/ONBOARDING.md`) |
| `docs/archive/` | Destination for moved root files (estimator + sheets docs) |

---

## Task 1: Skill scaffolding and dependencies

**Files:**
- Create: `~/.claude/skills/case-study-generator/package.json`
- Create: `~/.claude/skills/case-study-generator/.gitignore` (skill folder is git-ignored anyway, but local hygiene)
- Create folder structure

- [ ] **Step 1: Create folder layout**

```bash
cd ~/.claude/skills && mkdir -p case-study-generator/{reference,test/fixtures}
```

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "case-study-generator",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "description": "Skill scripts for generating portfolio case studies from URLs",
  "dependencies": {
    "sharp": "^0.33.5"
  },
  "devDependencies": {},
  "scripts": {
    "test": "node --test test/"
  }
}
```

Note: Playwright is reused from `~/.claude/skills/screenshot-section/node_modules/playwright`. The capture script imports it from there directly.

- [ ] **Step 3: Install deps**

Run: `cd ~/.claude/skills/case-study-generator && npm install`
Expected: `sharp` installed, no errors. On Windows, `sharp` includes prebuilt binaries - should be a clean install.

- [ ] **Step 4: Verify Playwright import path resolves**

Run:
```bash
node -e "import('../screenshot-section/node_modules/playwright').then(m => console.log('ok:', !!m.chromium))"
```
Expected: `ok: true`

- [ ] **Step 5: Commit**

The skill folder lives outside any git repo, so no commit. Continue.

---

## Task 2: Test fixtures (static HTML site + sample image)

**Files:**
- Create: `~/.claude/skills/case-study-generator/test/fixtures/sample-site.html`
- Create: `~/.claude/skills/case-study-generator/test/fixtures/sample-image.png`

- [ ] **Step 1: Write `sample-site.html`**

A small page with 4 obvious sections so recon + capture tests have stable DOM.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Sample Site</title>
<meta name="description" content="Test fixture for case-study-generator">
<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  section { min-height: 600px; padding: 80px 40px; box-sizing: border-box; }
  .hero { background: #1a3530; color: #efe9dd; }
  .features { background: #efe9dd; color: #1a3530; }
  .testimonial { background: #d4714e; color: #efe9dd; }
  .cta { background: #1a3530; color: #efe9dd; min-height: 300px; }
  h1, h2 { margin: 0 0 16px; }
  nav { padding: 16px 40px; background: #1a3530; color: #efe9dd; }
  nav a { color: inherit; margin-right: 16px; }
</style>
</head>
<body>
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/work">Work</a>
</nav>
<main>
  <section class="hero" role="region" aria-label="Hero">
    <h1>Sample Hero</h1>
    <p>This is the hero section.</p>
  </section>
  <section class="features" role="region" aria-label="Features">
    <h2>Features</h2>
    <p>Three columns of features would go here.</p>
  </section>
  <section class="testimonial" role="region" aria-label="Testimonial">
    <h2>What clients say</h2>
    <blockquote>"It worked."</blockquote>
  </section>
  <section class="cta" role="region" aria-label="Footer CTA">
    <h2>Ready?</h2>
    <a href="#">Get in touch</a>
  </section>
</main>
</body>
</html>
```

- [ ] **Step 2: Generate `sample-image.png` (2000×1500 solid colour)**

Run from `~/.claude/skills/case-study-generator/`:
```bash
node -e "import('sharp').then(({default:sharp})=>sharp({create:{width:2000,height:1500,channels:3,background:{r:212,g:113,b:78}}}).png().toFile('test/fixtures/sample-image.png').then(r=>console.log(r)))"
```
Expected: file written, dimensions `2000x1500`.

- [ ] **Step 3: Verify fixture files**

Run:
```bash
ls -la test/fixtures/
```
Expected: `sample-site.html` (~1.2 KB), `sample-image.png` (~5 KB).

---

## Task 3: `recon.mjs` - Playwright DOM inspection

**Files:**
- Create: `~/.claude/skills/case-study-generator/recon.mjs`
- Create: `~/.claude/skills/case-study-generator/test/recon.test.mjs`

- [ ] **Step 1: Write the failing test**

`test/recon.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { recon } from '../recon.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function withFixtureServer(fn) {
  const html = await readFile(resolve(__dirname, 'fixtures/sample-site.html'), 'utf8');
  const server = createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(html);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  try { return await fn(`http://127.0.0.1:${port}`); }
  finally { server.close(); }
}

test('recon returns site metadata + sections from semantic HTML', async () => {
  await withFixtureServer(async (url) => {
    const result = await recon(url);
    assert.equal(result.url, url);
    assert.equal(result.site.title, 'Sample Site');
    assert.equal(result.site.meta_description, 'Test fixture for case-study-generator');
    assert.ok(Array.isArray(result.site.primary_nav));
    assert.ok(result.site.primary_nav.length >= 3);
    assert.ok(Array.isArray(result.sections));
    assert.equal(result.sections.length, 4, 'expected 4 sections from fixture');
    const hero = result.sections[0];
    assert.match(hero.selector, /section/);
    assert.equal(hero.role_guess, 'hero');
    assert.ok(hero.height_px > 0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ~/.claude/skills/case-study-generator && node --test test/recon.test.mjs`
Expected: FAIL with "Cannot find module '../recon.mjs'" or similar.

- [ ] **Step 3: Implement `recon.mjs`**

```js
// recon.mjs - DOM inspection -> section manifest
// Usage: node recon.mjs <url>  (CLI prints JSON to stdout)
//        import { recon } from './recon.mjs'; await recon(url) -> object
import { chromium } from '../screenshot-section/node_modules/playwright/index.mjs';

const SECTION_PROBES = [
  // Priority 1: semantic
  'main > section, main > article, [role="region"]',
  // Priority 2: builder patterns
  '.elementor-section, .elementor-top-section, .wp-block-cover, [data-component], [class*="section"]',
];

function guessRole(label, idx, total) {
  const l = (label || '').toLowerCase();
  if (idx === 0 || /hero|intro|landing/.test(l)) return 'hero';
  if (idx === total - 1 || /footer|cta-end|outro/.test(l)) return 'footer-cta';
  if (/feature|service|grid/.test(l)) return 'feature-grid';
  if (/testimonial|quote|review/.test(l)) return 'testimonial';
  if (/faq|question/.test(l)) return 'faq';
  if (/pricing|plan/.test(l)) return 'pricing';
  if (/credibility|logos|trusted/.test(l)) return 'credibility-bar';
  return 'content-block';
}

export async function recon(url) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    const meta = await page.evaluate(() => ({
      title: document.title,
      meta_description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
      primary_nav: Array.from(document.querySelectorAll('nav a, header a')).slice(0, 10).map((a) => ({
        text: a.textContent?.trim() ?? '',
        href: a.getAttribute('href') ?? '',
      })).filter((l) => l.text),
      stack_hints: Array.from(document.scripts).map((s) => s.src).filter((s) => /elementor|wp-content|next|webflow|framer|squarespace|shopify/i.test(s)).slice(0, 5),
    }));

    let raw = [];
    for (const probe of SECTION_PROBES) {
      raw = await page.$$eval(probe, (els) =>
        els.map((el, i) => {
          const r = el.getBoundingClientRect();
          const aria = el.getAttribute('aria-label');
          const id = el.id;
          const cls = el.className && typeof el.className === 'string' ? el.className.split(/\s+/)[0] : '';
          const label = aria || id || cls || `section-${i + 1}`;
          let selector;
          if (id) selector = `#${id}`;
          else if (cls) selector = `${el.tagName.toLowerCase()}.${cls}`;
          else selector = `${el.tagName.toLowerCase()}:nth-of-type(${i + 1})`;
          return {
            selector,
            label,
            top_y: Math.round(window.scrollY + r.top),
            height_px: Math.round(r.height),
          };
        }).filter((s) => s.height_px >= 200)
      );
      if (raw.length >= 3) break;
    }

    const sections = raw.map((s, i) => ({
      id: `s${i + 1}`,
      selector: s.selector,
      label_guess: s.label,
      height_px: s.height_px,
      top_y: s.top_y,
      role_guess: guessRole(s.label, i, raw.length),
    }));

    return { url, site: meta, sections };
  } finally {
    await browser.close();
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const url = process.argv[2];
  if (!url) { console.error('usage: node recon.mjs <url>'); process.exit(1); }
  recon(url).then((r) => console.log(JSON.stringify(r, null, 2))).catch((e) => { console.error(e); process.exit(1); });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/recon.test.mjs`
Expected: PASS, 1 test.

- [ ] **Step 5: Smoke test against a real public URL**

Run: `node recon.mjs https://ukvehiclescyprus.com/en | head -50`
Expected: JSON with `url`, `site.title`, and a populated `sections` array. (Manual sanity check - not a test assertion.)

---

## Task 4: `capture-viewports.mjs` - multi-viewport batched capture

**Files:**
- Create: `~/.claude/skills/case-study-generator/capture-viewports.mjs`
- Create: `~/.claude/skills/case-study-generator/test/capture-viewports.test.mjs`

- [ ] **Step 1: Write the failing test**

`test/capture-viewports.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp, readdir, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { captureViewports } from '../capture-viewports.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function withFixtureServer(fn) {
  const html = await readFile(resolve(__dirname, 'fixtures/sample-site.html'), 'utf8');
  const server = createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(html);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  try { return await fn(`http://127.0.0.1:${port}`); }
  finally { server.close(); }
}

test('captureViewports writes desktop, tablet, mobile PNGs', async () => {
  await withFixtureServer(async (url) => {
    const out = await mkdtemp(join(tmpdir(), 'cs-cap-'));
    const sections = [
      { id: 's1', selector: 'section.hero', label_guess: 'hero', role_guess: 'hero' },
      { id: 's2', selector: 'section.features', label_guess: 'features', role_guess: 'feature-grid' },
    ];
    const result = await captureViewports({ url, sections, outDir: out, caseId: 'sample' });

    assert.ok(result.captures.desktop.length === 2, 'desktop: 1 per section');
    assert.ok(result.captures.tablet.length >= 2, 'tablet: at least 2');
    assert.ok(result.captures.mobile.length >= 2, 'mobile: at least 2');

    for (const dir of ['desktop', 'tablet', 'mobile']) {
      const files = await readdir(join(out, dir));
      assert.ok(files.length >= 2, `${dir} should have files`);
      for (const f of files) {
        const s = await stat(join(out, dir, f));
        assert.ok(s.size > 1000, `${f} should be a real PNG, not empty`);
        assert.match(f, /\.png$/);
        assert.match(f, /^sample__/);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/capture-viewports.test.mjs`
Expected: FAIL with "Cannot find module '../capture-viewports.mjs'".

- [ ] **Step 3: Implement `capture-viewports.mjs`**

```js
// capture-viewports.mjs - multi-viewport batched capture
// Usage: node capture-viewports.mjs --url <url> --sections <json> --out <dir> --case-id <id>
import { chromium } from '../screenshot-section/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, scale: 2 },
  { name: 'tablet',  width: 820,  height: 1180, scale: 2 },
  { name: 'mobile',  width: 390,  height: 844,  scale: 2 },
];

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
}

// Pick which sections to capture at tablet/mobile.
// Rule: hero (always) + most layout-revealing (first feature-grid, or s2/s3 fallback).
function pickResponsiveSections(sections) {
  if (sections.length === 0) return [];
  const hero = sections.find((s) => s.role_guess === 'hero') || sections[0];
  const featureGrid = sections.find((s) => s.role_guess === 'feature-grid');
  const second = featureGrid || sections.find((s) => s !== hero) || sections[1];
  return [hero, second].filter(Boolean).filter((s, i, a) => a.findIndex((x) => x.id === s.id) === i);
}

export async function captureViewports({ url, sections, outDir, caseId }) {
  for (const v of VIEWPORTS) await mkdir(join(outDir, v.name), { recursive: true });

  const responsiveSections = pickResponsiveSections(sections);
  const captures = { desktop: [], tablet: [], mobile: [] };
  const browser = await chromium.launch({ headless: true });

  try {
    for (const v of VIEWPORTS) {
      const targets = v.name === 'desktop' ? sections : responsiveSections;
      const context = await browser.newContext({
        viewport: { width: v.width, height: v.height },
        deviceScaleFactor: v.scale,
      });
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});

      for (const sec of targets) {
        const slug = slugify(sec.label_guess || sec.id);
        const file = join(outDir, v.name, `${caseId}__${slug}__${v.name}.png`);
        try {
          const loc = page.locator(sec.selector).first();
          await loc.scrollIntoViewIfNeeded({ timeout: 5000 });
          await loc.screenshot({ path: file });
          captures[v.name].push({ section_id: sec.id, slug, file });
        } catch (e) {
          captures[v.name].push({ section_id: sec.id, slug, file, error: String(e.message || e) });
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  return { url, caseId, captures };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => {
    if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1]]);
    return a;
  }, []));
  if (!args.url || !args.sections || !args.out || !args['case-id']) {
    console.error('usage: capture-viewports.mjs --url <url> --sections <json-path> --out <dir> --case-id <id>');
    process.exit(1);
  }
  const { readFile } = await import('node:fs/promises');
  const sections = JSON.parse(await readFile(args.sections, 'utf8'));
  const result = await captureViewports({ url: args.url, sections, outDir: args.out, caseId: args['case-id'] });
  console.log(JSON.stringify(result, null, 2));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/capture-viewports.test.mjs`
Expected: PASS, 1 test. Should take 5–15 seconds (real Playwright browser starts).

- [ ] **Step 5: Verify image dimensions are correct**

Run:
```bash
node -e "import('sharp').then(({default:sharp})=>sharp(require('node:fs').readdirSync('test/fixtures').filter(()=>0)).metadata())" 2>/dev/null
# Pick one captured file from the temp dir output above and inspect it manually:
node -e "const sharp=(await import('sharp')).default; sharp('<path-from-test-output>').metadata().then(console.log)"
```
Expected: a desktop capture should report width 2880 (1440 × 2), tablet 1640, mobile 780. (Skip if temp dir already cleaned - tests already asserted file-size > 1KB.)

---

## Task 5: `crop-thumbnail.mjs` - sharp 4:3 crop with anchor

**Files:**
- Create: `~/.claude/skills/case-study-generator/crop-thumbnail.mjs`
- Create: `~/.claude/skills/case-study-generator/test/crop-thumbnail.test.mjs`

- [ ] **Step 1: Write the failing test**

`test/crop-thumbnail.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { cropThumbnail } from '../crop-thumbnail.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(__dirname, 'fixtures/sample-image.png');

test('cropThumbnail produces 1200x900 JPEG with center anchor', async () => {
  const out = join(await mkdtemp(join(tmpdir(), 'cs-crop-')), 'thumb.jpg');
  await cropThumbnail({ source: SOURCE, anchor: 'center', out });
  const meta = await sharp(out).metadata();
  assert.equal(meta.width, 1200);
  assert.equal(meta.height, 900);
  assert.equal(meta.format, 'jpeg');
});

test('cropThumbnail respects top anchor', async () => {
  const out = join(await mkdtemp(join(tmpdir(), 'cs-crop-')), 'thumb-top.jpg');
  await cropThumbnail({ source: SOURCE, anchor: 'top', out });
  const meta = await sharp(out).metadata();
  assert.equal(meta.width, 1200);
  assert.equal(meta.height, 900);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/crop-thumbnail.test.mjs`
Expected: FAIL with "Cannot find module '../crop-thumbnail.mjs'".

- [ ] **Step 3: Implement `crop-thumbnail.mjs`**

```js
// crop-thumbnail.mjs - sharp-based 4:3 crop
// Usage: node crop-thumbnail.mjs --source <path> --anchor <center|top|bottom|left|right|x,y> --out <path>
import sharp from 'sharp';

const TARGET_W = 1200;
const TARGET_H = 900;
const TARGET_AR = TARGET_W / TARGET_H; // 4:3 = 1.3333

function computeCrop(srcW, srcH, anchor) {
  const srcAR = srcW / srcH;
  let w, h;
  if (srcAR > TARGET_AR) { h = srcH; w = Math.round(srcH * TARGET_AR); }
  else                   { w = srcW; h = Math.round(srcW / TARGET_AR); }

  let x, y;
  if (typeof anchor === 'string' && anchor.includes(',')) {
    const [ax, ay] = anchor.split(',').map((n) => parseInt(n, 10));
    x = Math.max(0, Math.min(srcW - w, ax));
    y = Math.max(0, Math.min(srcH - h, ay));
  } else {
    switch (anchor) {
      case 'top':    x = Math.round((srcW - w) / 2); y = 0; break;
      case 'bottom': x = Math.round((srcW - w) / 2); y = srcH - h; break;
      case 'left':   x = 0;                            y = Math.round((srcH - h) / 2); break;
      case 'right':  x = srcW - w;                     y = Math.round((srcH - h) / 2); break;
      case 'center':
      default:       x = Math.round((srcW - w) / 2); y = Math.round((srcH - h) / 2);
    }
  }
  return { left: x, top: y, width: w, height: h };
}

export async function cropThumbnail({ source, anchor = 'center', out }) {
  const src = sharp(source);
  const { width: srcW, height: srcH } = await src.metadata();
  if (!srcW || !srcH) throw new Error(`could not read dimensions of ${source}`);
  const region = computeCrop(srcW, srcH, anchor);
  await sharp(source)
    .extract(region)
    .resize(TARGET_W, TARGET_H, { fit: 'cover' })
    .jpeg({ quality: 90, mozjpeg: true })
    .withMetadata({ exif: undefined })
    .toFile(out);
  return { out, width: TARGET_W, height: TARGET_H };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => {
    if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1]]);
    return a;
  }, []));
  if (!args.source || !args.out) {
    console.error('usage: crop-thumbnail.mjs --source <path> --anchor <anchor> --out <path>');
    process.exit(1);
  }
  const r = await cropThumbnail({ source: args.source, anchor: args.anchor || 'center', out: args.out });
  console.log(JSON.stringify(r));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/crop-thumbnail.test.mjs`
Expected: PASS, 2 tests.

- [ ] **Step 5: Run all skill tests so far**

Run: `npm test` (from skill folder)
Expected: 4 tests pass (recon, capture, 2× crop).

---

## Task 6: Portfolio repo - `data/case-studies/types.ts`

**Files:**
- Create: `C:\Users\georg\Documents\GitHub\GE-Portfolio\data\case-studies\types.ts`

- [ ] **Step 1: Verify directory**

Run: `ls C:/Users/georg/Documents/GitHub/GE-Portfolio/data/`
Expected: directory exists. If `case-studies/` doesn't exist, create it: `mkdir C:/Users/georg/Documents/GitHub/GE-Portfolio/data/case-studies`.

- [ ] **Step 2: Write `types.ts`**

```ts
// data/case-studies/types.ts
// Schema for portfolio case studies. Backwards-compatible:
// - Existing entries use the legacy `description` block.
// - New entries (from case-study-generator skill) use the rich `body` block.
// - At least one of `description` or `body` must be present.

export type CategoryId = 'design' | 'wordpress' | 'nextjs' | 'ai-image';

export type ExternalCase = {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    categories: CategoryId[];
    thumbnail: string;
    externalLink: string;
};

export type LegacyDescription = {
    overview?: string;
    challenge: string;
    work: string[];
    outcome: string;
};

export type CaseStudyBody = {
    brief: {
        situation: string;
        audience: string;
        what_made_it_hard: string[];
    };
    decisions: Array<{
        title: string;
        what: string;
        why: string;
        rejected_alternative?: string;
        screenshot: string;
        caption: string;
    }>;
    process?: string;
    outcome: {
        summary: string;
        metrics?: Array<{ label: string; value: string }>;
        honest_note?: string;
    };
};

export type CaseStudyImages = {
    thumbnail: string;
    hero: string;
    gallery: string[] | {
        desktop: string[];
        tablet?: string[];
        mobile?: string[];
    };
};

export type CaseStudy = {
    id: string;
    title: string;
    subtitle: string;
    role: string;
    period: string;
    tags: string[];
    categories: CategoryId[];
    aiBuilt?: boolean;
    links: { live?: string; behance?: string; github?: string };
    description?: LegacyDescription;
    body?: CaseStudyBody;
    images: CaseStudyImages;
};
```

- [ ] **Step 3: Type-check**

Run: `cd C:/Users/georg/Documents/GitHub/GE-Portfolio && npx tsc --noEmit`
Expected: zero errors. (If unrelated existing errors appear, fix only the ones touching the new file.)

- [ ] **Step 4: Commit**

```bash
cd C:/Users/georg/Documents/GitHub/GE-Portfolio
git add data/case-studies/types.ts
git commit -m "feat(case-studies): add type schema for richer case study body"
```

---

## Task 7: Portfolio repo - extract case-study data out of `CaseStudies.tsx`

**Files:**
- Create: `data/case-studies/realfi.ts` (and 12 more - one per existing entry)
- Create: `data/case-studies/external.ts`
- Create: `data/case-studies/index.ts`
- Modify: `components/sections/CaseStudies.tsx`

- [ ] **Step 1: Create `data/case-studies/index.ts` skeleton**

```ts
// data/case-studies/index.ts
// Aggregates all case-study entries. New entries should be added here as imports.
import type { CaseStudy, ExternalCase } from './types';

import realfi from './realfi';
import aiTools from './ai-tools';
import stellar from './stellar';
import ukVehicles from './uk-vehicles';
import kingfisher from './kingfisher-mortgages';
import olympus from './olympus-sports';
import instantAccess from './instant-access-locksmiths';
import forecast from './forecast';
import laHacienda from './la-hacienda';
import allsop from './allsop-francis';
import saxseat from './saxseat';
import sidechains from './sidechains';

import { externalCases } from './external';

export const cases: CaseStudy[] = [
    realfi,
    aiTools,
    stellar,
    ukVehicles,
    kingfisher,
    olympus,
    instantAccess,
    forecast,
    laHacienda,
    allsop,
    saxseat,
    sidechains,
];

export { externalCases };
export type { CaseStudy, ExternalCase, CategoryId } from './types';
```

- [ ] **Step 2: Move each case-study entry into its own file**

Pattern (do this for all 12 drawer entries - `realfi`, `ai-tools`, `stellar`, `uk-vehicles`, `kingfisher-mortgages`, `olympus-sports`, `instant-access-locksmiths`, `forecast`, `la-hacienda`, `allsop-francis`, `saxseat`, `sidechains`):

`data/case-studies/realfi.ts`:

```ts
import type { CaseStudy } from './types';

const realfi: CaseStudy = {
    id: 'realfi',
    title: 'RealFi',
    subtitle: "Blockchain-backed lending platform serving underbanked SMEs across emerging markets, part of Cardano's $80bn ecosystem.",
    role: 'Product Designer',
    period: '2023-2024 (Input Output)',
    tags: ['Web3', 'Fintech', 'Product Design'],
    categories: ['design'],
    description: {
        overview: "RealFi is Input Output's blockchain-based initiative connecting underserved businesses in emerging markets with global capital. I designed the platform's core user experience, focusing on simplifying complex financial processes-KYC verification, credit assessment, and impact measurement-while remaining accessible for users in markets with limited digital infrastructure.\n\nThe platform serves two distinct user groups: businesses seeking capital and investors seeking impact-driven opportunities. Each required tailored workflows balancing regulatory compliance with ease of use.",
        challenge: 'Design a financial platform enabling 3 billion underbanked people to access credit, insurance, and identity services through blockchain infrastructure while addressing:\n\n- Digital literacy variance across global user base\n- Low-bandwidth and offline-first requirements\n- Complex regulatory compliance across jurisdictions\n- Cross-cultural UX for emerging and developed markets',
        work: [
            'Dual user journey design: capital seekers (businesses) and capital providers (investors)',
            'Complex lending workflows simplified for low-connectivity environments',
            'Impact measurement dashboard with real-time ESG metrics',
            'KYC/onboarding systems tailored to each user type with progressive disclosure',
            'Daily collaboration with product, engineering, and blockchain teams',
            'Portfolio dashboards with impact and financial performance metrics',
            'Risk assessment interfaces with regulatory compliance',
            'Multi-stage application and approval workflows',
        ],
        outcome: "Platform launched 2024. Active lending to SMEs in East Africa. Part of Cardano's $80bn blockchain ecosystem.\n\nRealFi has been publicly identified by Cardano founder Charles Hoskinson as a cornerstone initiative for bringing real-world financial utility to blockchain technology, targeting billions in total value locked by 2026.",
    },
    links: { live: 'https://realfi.co' },
    images: {
        thumbnail: '/images/realfi/hero.png',
        hero: '/images/realfi/hero.png',
        gallery: ['/images/realfi/hero.png', '/images/realfi/2.png', '/images/realfi/3.png'],
    },
};

export default realfi;
```

**Critical:** The em-dash hook will fire on commit. The original file uses bullet character `•` and various dashes. When extracting, replace `•` with `-` (matches existing project copy style) and ensure no U+2014 em-dashes leak in.

Repeat the extraction for each of the 12 entries. Source content lives in `components/sections/CaseStudies.tsx` lines 22–432. Take the full object literal, prepend `import type { CaseStudy } from './types';\n\nconst <name>: CaseStudy = {`, and append `};\n\nexport default <name>;`. Remove the inline `as CategoryId[]` annotations - the named type makes them unnecessary.

- [ ] **Step 3: Create `data/case-studies/external.ts`**

```ts
import type { ExternalCase } from './types';

export const externalCases: ExternalCase[] = [
    {
        id: 'shackle',
        title: 'Shackle App',
        subtitle: 'Mobile app concept for a hospitality booking experience, available to view in detail on Behance.',
        tags: ['Mobile', 'Hospitality', 'Product Design'],
        categories: ['design'],
        thumbnail: '/images/gallery/shackle.jpg',
        externalLink: 'https://www.behance.net/gallery/126781545/Shackle',
    },
    {
        id: 'smartjobs',
        title: 'SmartJobs Platform',
        subtitle: 'SaaS-style job-board UX/UI design for an enterprise hiring platform - full case study available on Behance.',
        tags: ['SaaS', 'Job Board', 'UX/UI'],
        categories: ['design'],
        thumbnail: '/images/gallery/smartjobs.png',
        externalLink: 'https://www.behance.net/gallery/126787469/SmartJobs-UX-UI-Design',
    },
    {
        id: 'bank-of-cyprus',
        title: 'Bank of Cyprus',
        subtitle: 'Page redesign for Bank of Cyprus, refreshing key flows and presentation - viewable on my Upwork profile.',
        tags: ['Web', 'Fintech', 'Page Redesign'],
        categories: ['design'],
        thumbnail: '/images/gallery/bank-of-cyprus.jpg',
        externalLink: 'https://www.upwork.com/freelancers/georgeefesopoulos2?p=1437670522820513792',
    },
];
```

- [ ] **Step 4: Refactor `CaseStudies.tsx` to import from `@/data/case-studies`**

In `components/sections/CaseStudies.tsx`:

- Delete lines 22–471 (the `cases` array + `externalCases` array + the inline `CategoryId` and DrawerItem/ExternalItem `kind` typedefs that depend on them - keep the runtime `kind` mapping logic).
- Add at the top imports section (replacing the existing `useState/useEffect/useMemo` line):

```tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import FadeIn from '../motion/FadeIn';
import CaseStudyModal from '../ui/CaseStudyModal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { cases, externalCases, type CaseStudy, type ExternalCase, type CategoryId } from '@/data/case-studies';
```

- Update the `Item` discriminated union (around old line 473) to use the imported types:

```tsx
type DrawerItem = CaseStudy & { kind: 'drawer' };
type ExternalItem = ExternalCase & { kind: 'external' };
type Item = DrawerItem | ExternalItem;

const allItems: Item[] = [
    ...cases.map((c) => ({ ...c, kind: 'drawer' as const })),
    ...externalCases.map((c) => ({ ...c, kind: 'external' as const })),
];
```

- Leave the rest of the component (state, handlers, JSX) unchanged.

- [ ] **Step 5: Type-check**

Run: `cd C:/Users/georg/Documents/GitHub/GE-Portfolio && npx tsc --noEmit`
Expected: zero new errors. Common gotchas:
- Missing import: `CaseStudyModal` expects a `CaseStudyData` shape - verify that the modal still type-checks against the imported `CaseStudy`. If they differ, add a small adapter inline in `CaseStudies.tsx` for now (full modal redesign comes later).

If the modal's `CaseStudyData` interface doesn't accept `body?` or the discriminated `gallery` shape, add a temporary loosening to its props by changing the import: `import CaseStudyModal from '../ui/CaseStudyModal';` and inside the modal change `images.gallery: string[]` to `images.gallery: string[] | { desktop: string[]; tablet?: string[]; mobile?: string[] }` and add an inline `Array.isArray(gallery) ? gallery : gallery.desktop` adapter where it iterates.

- [ ] **Step 6: Build the project to confirm runtime parity**

Run: `npm run build`
Expected: build succeeds. No new warnings about case studies.

- [ ] **Step 7: Visual smoke test in dev**

Run: `npm run dev`
Open: `http://localhost:3000` and scroll to "Selected Projects". Verify:
- All 13 cards render (12 drawer + 3 external = 15 total in the "All" view, with first 4 visible)
- Filter pills work (Design / WordPress / Next.js / AI Image)
- Clicking a drawer card opens the modal with the correct content
- Pinned RealFi + Kingfisher appear first

- [ ] **Step 8: Commit**

```bash
git add data/case-studies/ components/sections/CaseStudies.tsx
git commit -m "refactor(case-studies): extract data into per-project files

Mechanical move - schema unchanged. Cases array, externalCases array,
and shared types now live under data/case-studies/. CaseStudies.tsx
imports from @/data/case-studies instead of declaring inline.

Sets up the skill-generated case studies (with new body block) to drop
in as new files without touching the component."
```

---

## Task 8: `emit.mjs` - deterministic file writer

**Files:**
- Create: `~/.claude/skills/case-study-generator/emit.mjs`
- Create: `~/.claude/skills/case-study-generator/test/emit.test.mjs`

- [ ] **Step 1: Write the failing test**

`test/emit.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { emit } from '../emit.mjs';

async function setupRepo() {
  const repo = await mkdtemp(join(tmpdir(), 'cs-emit-repo-'));
  await mkdir(join(repo, 'data', 'case-studies'), { recursive: true });
  await mkdir(join(repo, 'public', 'images'), { recursive: true });
  await mkdir(join(repo, 'docs', 'case-studies'), { recursive: true });
  await writeFile(join(repo, 'data', 'case-studies', 'index.ts'),
    `import type { CaseStudy, ExternalCase } from './types';\n\nimport realfi from './realfi';\n\nimport { externalCases } from './external';\n\nexport const cases: CaseStudy[] = [realfi];\n\nexport { externalCases };\nexport type { CaseStudy, ExternalCase, CategoryId } from './types';\n`);
  return repo;
}

async function setupWorking() {
  const w = await mkdtemp(join(tmpdir(), 'cs-emit-w-'));
  await mkdir(join(w, 'final'), { recursive: true });
  await writeFile(join(w, 'final', 'demo-thumb.jpg'), Buffer.from('fakejpeg'));
  await writeFile(join(w, 'final', 'demo-hero.png'), Buffer.from('fakepng'));
  await writeFile(join(w, 'final', 'desktop-1.png'), Buffer.from('d1'));
  await writeFile(join(w, 'final', 'tablet-1.png'), Buffer.from('t1'));
  await writeFile(join(w, 'final', 'mobile-1.png'), Buffer.from('m1'));
  await writeFile(join(w, 'final', 'case-study.md'), '# demo\n');
  await writeFile(join(w, 'final', 'demo.ts'),
    `import type { CaseStudy } from './types';\nconst demo: CaseStudy = { id: 'demo', title: 'Demo', subtitle: 's', role: 'r', period: 'p', tags: [], categories: ['design'], links: {}, images: { thumbnail: '/images/demo/demo-thumb.jpg', hero: '/images/demo/demo-hero.png', gallery: { desktop: ['/images/demo/desktop-1.png'] } }, body: { brief: { situation: 's', audience: 'a', what_made_it_hard: [] }, decisions: [], outcome: { summary: 'ok' } } };\nexport default demo;\n`);
  return w;
}

test('emit copies images and writes data file', async () => {
  const repo = await setupRepo();
  const working = await setupWorking();
  const result = await emit({
    caseId: 'demo',
    workingDir: working,
    repoRoot: repo,
    galleryFiles: { desktop: ['desktop-1.png'], tablet: ['tablet-1.png'], mobile: ['mobile-1.png'] },
  });
  assert.ok((await stat(join(repo, 'public', 'images', 'demo', 'demo-thumb.jpg'))).size > 0);
  assert.ok((await stat(join(repo, 'public', 'images', 'demo', 'demo-hero.png'))).size > 0);
  assert.ok((await stat(join(repo, 'data', 'case-studies', 'demo.ts'))).size > 0);
  assert.ok((await stat(join(repo, 'docs', 'case-studies', 'demo.md'))).size > 0);
  assert.ok(result.files.length >= 4);
});

test('emit --wire patches index.ts idempotently', async () => {
  const repo = await setupRepo();
  const working = await setupWorking();
  await emit({ caseId: 'demo', workingDir: working, repoRoot: repo, galleryFiles: { desktop: [], tablet: [], mobile: [] }, wire: true });
  const idx1 = await readFile(join(repo, 'data', 'case-studies', 'index.ts'), 'utf8');
  assert.match(idx1, /import demo from '\.\/demo';/);
  assert.match(idx1, /demo,/);

  // Second call should not duplicate
  await emit({ caseId: 'demo', workingDir: working, repoRoot: repo, galleryFiles: { desktop: [], tablet: [], mobile: [] }, wire: true });
  const idx2 = await readFile(join(repo, 'data', 'case-studies', 'index.ts'), 'utf8');
  const importCount = (idx2.match(/import demo from '\.\/demo';/g) || []).length;
  assert.equal(importCount, 1, 'import should appear exactly once after second wire');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/emit.test.mjs`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement `emit.mjs`**

```js
// emit.mjs - copies final assets into the portfolio repo and writes the data file
// Usage: node emit.mjs --case-id <id> --working <dir> --repo <root> [--wire] [--gallery-json <path>]
import { copyFile, mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, basename } from 'node:path';

async function fileExists(p) { try { await stat(p); return true; } catch { return false; } }

async function copyIfPresent(src, dst) {
  if (!(await fileExists(src))) return null;
  await mkdir(dst.replace(/[/\\][^/\\]+$/, ''), { recursive: true });
  await copyFile(src, dst);
  return dst;
}

export async function emit({ caseId, workingDir, repoRoot, galleryFiles = { desktop: [], tablet: [], mobile: [] }, wire = false }) {
  const finalDir = join(workingDir, 'final');
  const publicDir = join(repoRoot, 'public', 'images', caseId);
  const dataDir = join(repoRoot, 'data', 'case-studies');
  const docsDir = join(repoRoot, 'docs', 'case-studies');

  await mkdir(publicDir, { recursive: true });
  await mkdir(dataDir, { recursive: true });
  await mkdir(docsDir, { recursive: true });

  const written = [];

  // Hero + thumbnail
  for (const name of [`${caseId}-thumb.jpg`, `${caseId}-hero.png`]) {
    const r = await copyIfPresent(join(finalDir, name), join(publicDir, name));
    if (r) written.push(r);
  }

  // Gallery (per viewport)
  for (const v of ['desktop', 'tablet', 'mobile']) {
    for (const f of galleryFiles[v] || []) {
      const r = await copyIfPresent(join(finalDir, f), join(publicDir, basename(f)));
      if (r) written.push(r);
    }
  }

  // Data module
  const tsSrc = join(finalDir, `${caseId}.ts`);
  if (await fileExists(tsSrc)) {
    const dst = join(dataDir, `${caseId}.ts`);
    await copyFile(tsSrc, dst);
    written.push(dst);
  }

  // Markdown mirror
  const mdSrc = join(finalDir, 'case-study.md');
  if (await fileExists(mdSrc)) {
    const dst = join(docsDir, `${caseId}.md`);
    await copyFile(mdSrc, dst);
    written.push(dst);
  }

  if (wire) {
    const idxPath = join(dataDir, 'index.ts');
    let idx = await readFile(idxPath, 'utf8');
    const importLine = `import ${caseId.replace(/-/g, '_')} from './${caseId}';`;
    if (!idx.includes(importLine)) {
      // Insert after the last existing `import ... from './...';` of a case study
      const importBlockRe = /(import [a-zA-Z_][a-zA-Z0-9_]* from '\.\/[a-z0-9-]+';\n)+/;
      const match = idx.match(importBlockRe);
      if (match) {
        idx = idx.replace(match[0], match[0] + importLine + '\n');
      } else {
        idx = importLine + '\n' + idx;
      }
      // Insert the symbol into the cases array
      const arrRe = /export const cases: CaseStudy\[\] = \[([\s\S]*?)\];/;
      idx = idx.replace(arrRe, (_m, body) => {
        const symbol = caseId.replace(/-/g, '_');
        const trimmed = body.trim();
        const items = trimmed ? trimmed.split(/,\s*/).filter(Boolean) : [];
        if (!items.includes(symbol)) items.push(symbol);
        return `export const cases: CaseStudy[] = [\n    ${items.join(',\n    ')},\n];`;
      });
      await writeFile(idxPath, idx);
      written.push(idxPath);
    }
  }

  return { caseId, files: written };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => {
    if (v.startsWith('--')) a.push([v.slice(2), v.startsWith('--wire') ? true : arr[i + 1]]);
    return a;
  }, []));
  const galleryFiles = args['gallery-json'] ? JSON.parse(await readFile(args['gallery-json'], 'utf8')) : { desktop: [], tablet: [], mobile: [] };
  const r = await emit({
    caseId: args['case-id'],
    workingDir: args.working,
    repoRoot: args.repo,
    galleryFiles,
    wire: !!args.wire,
  });
  console.log(JSON.stringify(r, null, 2));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/emit.test.mjs`
Expected: PASS, 2 tests.

- [ ] **Step 5: Run all skill tests**

Run: `npm test` (from skill folder)
Expected: 6 tests pass total (recon, capture, 2× crop, 2× emit).

---

## Task 9: Reference doc - `case-study-structure.md` (research-driven)

**Files:**
- Create: `~/.claude/skills/case-study-generator/reference/case-study-structure.md`

- [ ] **Step 1: Dispatch a research sub-agent**

Use the `general-purpose` agent. Prompt (verbatim):

> Research what makes a great UX/product designer portfolio case study. Aim for a 600-word distillation organised as: (1) the four anchors a strong case study must hit (situation, decision, evidence, outcome), (2) common failure modes that signal junior work (work-list dumps, vague outcomes, designing-as-storytelling instead of designing-as-thinking), (3) how to write the "why" behind a design decision so it reads as judgement, not justification, (4) length and pacing recommendations. Cite or quote 3–5 sources you find credible (UX writing leaders like Julie Zhuo, Ryan Lucht, Pete Sena, IDEO, Google Design, Nielsen Norman, Smashing Magazine). Output as a Markdown file with H2 sections. Keep it concrete - examples over abstractions. End with a "Tells of a weak case study" checklist of 6–10 items the writer-agent will use as a self-review.

- [ ] **Step 2: Save the agent's output to disk**

Write the returned content to `~/.claude/skills/case-study-generator/reference/case-study-structure.md`. Lightly edit for British English and no em-dashes.

- [ ] **Step 3: Verify**

Run: `wc -w reference/case-study-structure.md`
Expected: 500–800 words. If under 400, dispatch the agent again with a fuller prompt; if over 1200, condense.

---

## Task 10: Reference docs - `decision-prompts.md` and `voice-anchors.md`

**Files:**
- Create: `~/.claude/skills/case-study-generator/reference/decision-prompts.md`
- Create: `~/.claude/skills/case-study-generator/reference/voice-anchors.md`

- [ ] **Step 1: Write `decision-prompts.md`**

```md
# Decision-block prompt template

Use this when writing a single entry in `body.decisions[]`. Run it for each highlighted section.

## Inputs the writer needs

- The desktop screenshot of the section
- The brief from Phase 0 (what the project is, who it serves, what made it hard)
- The role + period the user worked on it
- Any user notes about this specific section ("we considered X, rejected it because Y")

## The four-line frame

Each decision is FOUR sentences max. Anything longer is process narrative, not a decision.

1. **Title** (5–8 words). The decision named, not the section. "Estimator over contact form" beats "Pricing page". The title carries the choice; the screenshot shows the surface.
2. **What** (1–2 sentences). What's on the screen, in plain words. Not "we built X" - describe what a visitor sees and does.
3. **Why** (2–4 sentences). The judgement. What the user was trying to do at this moment, what would have been the obvious wrong move, why this beats it. This is where craft shows.
4. **Rejected alternative** (optional, 1 sentence). The road not taken, named specifically. Skip if the alternative is so obvious it's noise ("we didn't put the CTA below the fold").

## Voice rules

- British English (`organised`, `colour`, `licence`)
- No em-dashes - use hyphens, commas, full stops
- Active voice ("we put", not "was placed")
- No vague verbs (`leveraged`, `utilised`, `enabled`, `empowered`)
- Verbs of judgement OK (`chose`, `rejected`, `kept`, `cut`, `pinned`, `widened`)

## Tells of a weak decision block

- The why answers "what does it do?" instead of "why this and not the alternative?"
- The decision is the screenshot, not a choice ("hero section: a hero with a CTA")
- It's a feature list ("we added X, Y, Z") instead of a single choice
- The rejected alternative is a strawman ("we could have done nothing")
```

- [ ] **Step 2: Write `voice-anchors.md`**

```md
# Voice anchors - George's existing case studies

Pull from these when writing. Match cadence, not vocabulary.

## Tone markers

- Terse. Information-dense. Short sentences when stating outcomes.
- Honest about constraints. Does not hide what didn't work or what was constrained.
- British English throughout.
- No em-dashes ever.
- No marketing puffery: avoid "leveraged", "utilised", "revolutionary", "cutting-edge", "best-in-class", "seamlessly", "robust", "scalable", "world-class".
- "We" or first-person OK. Never the imperial "we" (one author).

## Sample 1 - UK Vehicles Cyprus (challenge)

> Build a professional web platform for a UK-to-Cyprus vehicle import business that communicates complex processes - customs, VAT reclaim, shipping logistics - clearly enough that tradespeople and small businesses could confidently make €20,000+ purchasing decisions without a single phone call.

Notice: a problem statement, not a feature list. Concrete users, concrete stakes.

## Sample 2 - Kingfisher Mortgages (work, single bullet)

> Positioning-first copy: "The bank said no. So we said fine." addresses the rejection pain every self-employed visitor carries and differentiates from comparison-site generalists before anything else loads

Notice: the bullet leads with the decision (positioning-first copy) and contains the why (rejection pain) and the alternative (comparison-site generalists).

## Sample 3 - La Hacienda (outcome, with honest note)

> Live site running real ad spend through pages that convert. The WP/Ads pairing is the value here - a real hotel's booking funnel running end to end on tailored campaigns rather than the agency-default 'set up the campaign and hope'. Honest note: not the prettiest site I've built - the host stack and asset pool constrained the visual ceiling. For the next hotel I'd start with brand and photography before touching the build.

Notice: the outcome doesn't oversell. The honest note is part of the case study, not hidden.

## Sample 4 - Forecast (challenge framing)

> Design and build an events aggregator for an island whose existing options look like 2009 while addressing:
> - Fragmented sources: Facebook events, venue sites, posters, and PDFs
> - Mobile-first audience that opens the site at a café table to decide a Saturday
> - A small, opinionated brief from a single user (me) that should generalise

Notice: bullets are constraints, not features. Each one is a reason the work was non-trivial.

## Sample 5 - Allsop & Francis (decision-style sentence)

> Treated each prompt as a brief: location, lighting, framing, brand artefacts - never 'a laundry room'.

Notice: this is a decision in one line. The implicit alternative is the lazy version. The voice carries the judgement.

## Anti-patterns to avoid

- "I was tasked with..." → start with the work, not the assignment
- "The challenge was..." → lead with the situation, let the challenge emerge
- "We delivered a beautiful, modern..." → describe what it does; the reader judges beauty
- "This led to a 30% increase..." (when no measurement) → if there's no number, don't fake one. "Live and ranking" is honest. "Conversion uplift across the funnel" is not.
```

- [ ] **Step 3: Verify**

Run: `ls reference/`
Expected: `case-study-structure.md`, `decision-prompts.md`, `voice-anchors.md`.

---

## Task 11: `SKILL.md` - orchestrate all phases

**Files:**
- Create: `~/.claude/skills/case-study-generator/SKILL.md`

- [ ] **Step 1: Write `SKILL.md`**

```md
---
name: case-study-generator
description: Use whenever the user wants to generate a portfolio case study from a URL - your own builds, client sites, or any live page. Orchestrates DOM recon, multi-viewport screenshot capture (desktop + tablet + mobile), section curation, design-decision analysis, and structured case-study writing. Outputs a typed TypeScript module ready to drop into the GE-Portfolio site (data/case-studies/<id>.ts) plus a markdown mirror for review. Trigger on "generate a case study for X", "build a case study from <url>", "case-study this site", "write up <url> as a portfolio case study". URL-only invocation; the skill conducts a short conversational onboarding.
---

# Case-study generator

Turn any URL into a portfolio-grade case study. Multi-viewport captures, curated section reviews, structured analysis, narrative writing - all orchestrated through this skill.

## Invocation

```
/case-study-generator <url>
```

That's the whole trigger. Anything missing, the skill asks for it inline.

## Phases at a glance

| Phase | Owner | What happens |
|---|---|---|
| 0. Setup | skill | working dirs created |
| 1. Recon | sub-agent | DOM inspection -> section manifest |
| 2. Curation | main agent + user | confirm which sections to capture |
| 3. Capture | sub-agent | desktop + tablet + mobile PNGs |
| 4. Review | main agent + user | pick decisions, hero, crop anchor |
| 5. Crop | script | 4:3 1200x900 thumbnail |
| 6. Write | main agent | structured case study (.ts + .md) |
| 7. Emit | script | files copied into the repo |

## Phase 0 - Setup

Onboarding (skip any pre-supplied):
1. Role and timeframe?
2. One-paragraph brief: what was it, what made it hard?
3. Concrete outcomes? (numbers, launches, follow-on work, honest notes)
4. Existing portfolio entry to update, or new project?
   - If new: ask for `id` slug (kebab-case), tags array, primary category (`design` / `wordpress` / `nextjs` / `ai-image`)
   - If existing: read `data/case-studies/<id>.ts`, use that as seed context

Create:
```
~/Documents/Claude Local/case-studies/<id>/
  working/captures/{desktop,tablet,mobile}/
  working/notes/
  final/
```

## Phase 1 - Recon (sub-agent)

Dispatch a `general-purpose` sub-agent:

> Run `node ~/.claude/skills/case-study-generator/recon.mjs <url>` and return the JSON output verbatim. Do not interpret or filter. Save the JSON to `<working-dir>/working/notes/manifest.json` and confirm the path.

Read the manifest. If `sections.length < 3`, note this and ask the user whether to proceed with viewport-chunking fallback (manual capture phase) or pick a different URL.

## Phase 2 - Curation (main agent + user)

Present the section list:

> Found N sections on `<url>`:
> 1. hero (`section.hero`) - 720px tall
> 2. credibility-bar (`section.credibility`) - 240px
> 3. ...
>
> Capture all? Skip any (footer + cookie banners default to skipped)? Any extra paths to also capture (e.g. /about, /pricing)?

Write confirmed list to `working/notes/sections-to-capture.json`:
```json
[{ "id": "s1", "selector": "...", "label_guess": "...", "role_guess": "..." }, ...]
```

## Phase 3 - Multi-viewport capture (sub-agent)

Dispatch a `general-purpose` sub-agent:

> Run `node ~/.claude/skills/case-study-generator/capture-viewports.mjs --url <url> --sections <working>/working/notes/sections-to-capture.json --out <working>/working/captures --case-id <id>`. Return the JSON output. Do not Read the PNGs (the main agent will).

Expect ~30–60 seconds of runtime. The script will produce:
- `<working>/working/captures/desktop/<id>__<slug>__desktop.png` (one per section)
- `<working>/working/captures/tablet/<id>__<slug>__tablet.png` (≥2)
- `<working>/working/captures/mobile/<id>__<slug>__mobile.png` (≥2)

If the JSON shows any `error` fields, surface them and ask the user whether to retry or skip.

## Phase 4 - Review + decision-picking (main agent + user)

Read the captures inline, present them grouped by section. Then run a structured review:

1. **Hero thumbnail.** "Default hero is the desktop hero capture - keep it, or pick a different source? If keeping, default crop is centred - any anchor preference (`top`, `bottom`, `left`, `right`, or `x,y` pixels)?"
2. **Highlighted decisions (3–5).** "Which sections best showcase the design thinking? Not necessarily the prettiest - the most decision-rich. Suggested by recon role guesses: hero, [feature-grid], [calculator/interactive element]. Confirm or change."
3. **Gallery.** "Which desktop / tablet / mobile shots ship to final? Default: all desktop + your two responsive picks."
4. **Throwaways.** "Anything to drop? (Loading states, half-rendered content, off-brand pop-ups.)"

Save to `<working>/working/notes/curation.json`.

## Phase 5 - Crop (script)

Run:
```bash
node ~/.claude/skills/case-study-generator/crop-thumbnail.mjs \
  --source <working>/working/captures/desktop/<chosen>.png \
  --anchor <anchor> \
  --out <working>/final/<id>-thumb.jpg
```

Then copy the chosen hero source to `<working>/final/<id>-hero.png` (no crop):
```bash
cp <working>/working/captures/desktop/<chosen>.png <working>/final/<id>-hero.png
```

Copy chosen gallery files to `<working>/final/` with their original filenames.

## Phase 6 - Write (main agent)

Load:
- `<working>/working/notes/manifest.json` (site context)
- `<working>/working/notes/curation.json` (chosen decisions, hero, gallery)
- `~/.claude/skills/case-study-generator/reference/case-study-structure.md`
- `~/.claude/skills/case-study-generator/reference/decision-prompts.md`
- `~/.claude/skills/case-study-generator/reference/voice-anchors.md`

Write the case study directly. Output two files into `<working>/final/`:

### `<id>.ts`

```ts
import type { CaseStudy } from './types';

const <varName>: CaseStudy = {
  id: '<id>',
  title: '<Title>',
  subtitle: '<single sentence positioning>',
  role: '<role>',
  period: '<period>',
  tags: [...],
  categories: [...],
  aiBuilt: <bool optional>,
  links: { live: '<url>' },
  body: {
    brief: {
      situation: '<2-3 sentences>',
      audience: '<1-2 sentences>',
      what_made_it_hard: ['constraint 1', 'constraint 2', ...],
    },
    decisions: [
      {
        title: 'Decision title',
        what: 'What is on the screen.',
        why: 'Why this beats the alternative.',
        rejected_alternative: 'The road not taken.',
        screenshot: '/images/<id>/<file>.png',
        caption: '<one-line caption>',
      },
      // 3-5 of these
    ],
    process: '<optional 100-200 words>',
    outcome: {
      summary: '<concrete results>',
      metrics: [{ label: '...', value: '...' }],
      honest_note: '<optional honest constraint>',
    },
  },
  images: {
    thumbnail: '/images/<id>/<id>-thumb.jpg',
    hero: '/images/<id>/<id>-hero.png',
    gallery: { desktop: [...], tablet: [...], mobile: [...] },
  },
};

export default <varName>;
```

### `case-study.md`

Human-readable mirror of the same content, for the user to review before emit.

### Voice self-check before emit

Before declaring done, scan the writing for:
- Em-dashes (U+2014). Replace with hyphens.
- "leveraged", "utilised", "revolutionary", "cutting-edge", "seamlessly", "robust" - rewrite.
- American spellings (color, organize, license-as-noun) - convert to British.
- Word count of `body.brief` + sum of `body.decisions[].why` + `body.process`. Target 600–900. Trim or expand.
- Each `decisions[].why` answers "why this and not the alternative" - not "what does it do".

## Phase 7 - Emit (script)

Run:
```bash
node ~/.claude/skills/case-study-generator/emit.mjs \
  --case-id <id> \
  --working <working> \
  --repo <repo-root> \
  --gallery-json <working>/working/notes/gallery.json
```

Print the manifest of files written. Then:

> Done. Files written:
> - `public/images/<id>/<id>-thumb.jpg`
> - `public/images/<id>/<id>-hero.png`
> - `public/images/<id>/...gallery files`
> - `data/case-studies/<id>.ts`
> - `docs/case-studies/<id>.md`
>
> Add to `data/case-studies/index.ts`:
> ```
> import <varName> from './<id>';
> // ...add `<varName>` to the cases array
> ```
> Or run `emit.mjs --wire` to do it for you.

If the user opts to wire automatically, rerun emit.mjs with `--wire`.

## Verification (one-run done definition)

- `working/captures/` has ≥3 desktop + 2 tablet + 2 mobile PNGs
- `final/` has hero + thumbnail + gallery selection + `<id>.ts` + `case-study.md`
- `<repo>/public/images/<id>/` mirrors `final/` images
- `<repo>/data/case-studies/<id>.ts` exists
- `<repo>/docs/case-studies/<id>.md` exists
- Type-check passes: `cd <repo> && npx tsc --noEmit`
- Voice self-check passes (no em-dashes, no banned words, British English, word count in band)

## Common pitfalls

1. **Recon returns 0 sections.** Site uses non-semantic markup or aggressive client-side rendering. Increase the wait in `recon.mjs` (`networkidle` -> `networkidle` + `setTimeout(2000)`) or fall back to viewport-chunking. For now, ask the user for help selecting sections by URL inspection.
2. **Capture hits authentication.** Skill assumes public URLs. Authenticated sites are out of scope; document and ask the user for an alternative URL.
3. **Crop anchor cuts important content.** Re-run `crop-thumbnail.mjs` with a different `--anchor` value. The original screenshot is preserved.
4. **Em-dash hook strips hyphens during commit.** The portfolio repo's pre-commit hook converts U+2014 to `-`. Don't fight it; never use em-dashes in source files in the first place.
5. **`--wire` duplicates imports.** Should be idempotent (test covers it). If it duplicates, the regex in emit.mjs needs updating.

## Setup state (after Task 11 lands)

- Skill folder: `~/.claude/skills/case-study-generator/`
- Helpers: `recon.mjs`, `capture-viewports.mjs`, `crop-thumbnail.mjs`, `emit.mjs`
- Reference: `case-study-structure.md`, `decision-prompts.md`, `voice-anchors.md`
- Tests: `node --test test/` from skill folder, 6 tests pass
- Reuses Playwright from `~/.claude/skills/screenshot-section/node_modules/playwright`
- Adds `sharp` to skill's local node_modules
```

- [ ] **Step 2: Verify**

Run: `cat SKILL.md | head -5`
Expected: starts with `---\nname: case-study-generator\n` frontmatter.

Run: `wc -l SKILL.md`
Expected: 200–300 lines.

---

## Task 12: End-to-end dry run on UK Vehicles

**Files:**
- Output: `~/Documents/Claude Local/case-studies/uk-vehicles/` (working dir)
- Eventually: `data/case-studies/uk-vehicles.ts` (overwriting the migrated entry)

The existing `uk-vehicles` entry is a fine candidate: George knows the brief, the live site is at `https://ukvehiclescyprus.com/en`, and the existing case study is in the legacy schema so the new run will produce the first `body`-shaped entry.

- [ ] **Step 1: Run the skill manually**

Invoke (in a fresh Claude conversation, or this one): `/case-study-generator https://ukvehiclescyprus.com/en`

The skill should:
1. Onboard (role: Full-Stack Developer; period: 2025; brief: see existing CaseStudies.tsx entry)
2. Run recon, present sections
3. Capture all confirmed sections at all viewports
4. Review + curation - George picks decisions and hero
5. Crop, write case study, emit

- [ ] **Step 2: Verify outputs**

```bash
cd C:/Users/georg/Documents/GitHub/GE-Portfolio
ls public/images/uk-vehicles/
ls data/case-studies/uk-vehicles.ts
ls docs/case-studies/uk-vehicles.md
npx tsc --noEmit
npm run build
```
Expected: assets present, file exists, type-check + build pass.

- [ ] **Step 3: Capture issues**

Open a notes file: `~/.claude/skills/case-study-generator/DRY-RUN-NOTES.md`. Record everything that surprised, broke, was clunky, or could be better. Do NOT fix during the run.

- [ ] **Step 4: Commit the generated case study**

```bash
git add public/images/uk-vehicles/ data/case-studies/uk-vehicles.ts docs/case-studies/uk-vehicles.md
git commit -m "feat(case-studies): regenerate uk-vehicles via case-study-generator skill

First case study written in the new body schema. Multi-viewport gallery,
3-5 highlighted decisions with rejected alternatives, honest outcome notes."
```

---

## Task 13: Iterate based on dry run

**Files:** various (depends on what broke)

- [ ] **Step 1: Read DRY-RUN-NOTES.md**

For each issue, decide: fix-now (blocks future runs), fix-later (annoyance), or accept (worth the simplicity).

- [ ] **Step 2: Apply fix-now changes**

Common likely fixes:
- Recon misses a section type → add a probe selector to `recon.mjs`
- Capture timing issue → add font-ready wait in `capture-viewports.mjs`
- Crop anchor doesn't handle some edge case → add to `crop-thumbnail.mjs`
- SKILL.md prompt unclear at a phase → tighten

For each change: update the script, update the matching test, run `npm test`, commit (skill folder isn't git-tracked but commit the SKILL.md and reference doc changes if anything in the repo changed).

- [ ] **Step 3: Delete or archive DRY-RUN-NOTES.md**

If all items were addressed, delete. If some are deferred, leave with explicit "FIX LATER" markers.

---

## Task 14: Companion - root cleanup

**Files:** various in repo root

- [ ] **Step 1: Audit root**

Run: `ls C:/Users/georg/Documents/GitHub/GE-Portfolio/ | grep -v -E "^(app|components|data|docs|hooks|lib|node_modules|public|scripts|.next|.git|.claude)$"`

Likely loose files: `ESTIMATOR_AMENDMENT.md`, `ESTIMATOR_PROMPT_FOR_DEV.md`, `GOOGLE_SHEETS_SETUP.md`, `GOOGLE_SHEET_WEBHOOK.md`, `Screenshots/`, `download_assets.ps1`, `tailwind.config.ts.bak`, `__pycache__/`.

- [ ] **Step 2: Decide each**

Ask the user, one item at a time:

> `ESTIMATOR_AMENDMENT.md` and `ESTIMATOR_PROMPT_FOR_DEV.md` - move to `docs/archive/estimator/`, delete, or keep at root?

> `GOOGLE_SHEETS_SETUP.md` and `GOOGLE_SHEET_WEBHOOK.md` - same options.

> `Screenshots/` - this looks like ad-hoc captures from past projects. Archive to `docs/archive/screenshots-legacy/`, or delete?

> `download_assets.ps1` - keep at root, move to `scripts/`, or delete?

> `tailwind.config.ts.bak` - delete (backup file)?

> `__pycache__/` - delete and add `__pycache__/` to `.gitignore`?

- [ ] **Step 3: Execute decisions**

Run the moves/deletes/gitignore additions confirmed by the user.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: tidy repo root - archive estimator+sheets docs, drop backups"
```

---

## Task 15: Companion - hand-written `ONBOARDING.md`

**Files:**
- Create: `C:\Users\georg\Documents\GitHub\GE-Portfolio\ONBOARDING.md`

- [ ] **Step 1: Read the kingfisher onboarding doc as reference**

Run: `cat "C:/Users/georg/Documents/My Projects/Kingfisher WordPress/ONBOARDING.md" | head -100`
This is the structural model: numbered sections, hard rules, project layout, tooling cheat sheet, gotchas.

- [ ] **Step 2: Write `ONBOARDING.md`**

Section structure:

```md
# GE-Portfolio - Agent Onboarding

**Read this first. Update it as drift happens. The auto-generated `.claude/ONBOARDING.md` is briefer-output - this file is the source of truth.**

If you change anything that affects what an agent needs to know on day one (new section, new gotcha, new MCP, structural folder move), update this file.

---

## 1. What this project is

[2-3 paragraphs: George's design portfolio. Next.js 15 + Tailwind. Hosted on Vercel. Selected projects + case studies + light/dark theming. The portfolio is the showcase, not the product - prioritise visual polish and content quality over feature complexity.]

## 2. Hard rules

- **No em-dashes (U+2014).** Pre-commit hook auto-converts to hyphens. Never write them in source.
- **British English.** organised, colour, licence, behaviour.
- **No marketing puffery.** No "leveraged", "utilised", "revolutionary", "cutting-edge", "seamless", "robust", "world-class".
- **Surgical changes.** Touch only what you must. Match existing style.
- **No comments explaining WHAT.** Only WHY when non-obvious.
- **No emojis** in code or copy unless George explicitly asks.

## 3. Project layout

[Tree diagram of the repo, focused on what an agent needs to find]

## 4. Tooling cheat sheet

| Need | Tool |
|---|---|
| Edit React/TS | Edit / Read / Glob / Grep |
| Run shell, build, dev | Bash (`npm run dev`, `npm run build`) |
| Screenshot a section | `screenshot-section` skill |
| Redesign a section visually | `redesign-section` skill |
| Generate a portfolio case study | `case-study-generator` skill |
| Generate images (final / mockup) | `runware` MCP - Nano Banana / Pro |
| Stock photos | Pexels / Pixabay (keys in `~/.claude/secrets.json`) |
| Inspect a live page | Chrome MCP (`mcp__Claude_in_Chrome__*`) |

## 5. Key gotchas

[Pulled from CLAUDE.md project section]
- Next.js `<Image>` SVG + currentColor → use mask-image
- `fix-emdashes.mjs` must stay pure ASCII
- Turbopack CSS chunk caching → restart dev for token changes
- layout.tsx defaults to light-olive theme

## 6. Voice / writing rules

For all user-facing copy AND case studies:
- Terse, information-dense
- Honest about constraints; no hidden tradeoffs
- Active voice, verbs of judgement (chose, rejected, kept, cut)
- See `~/.claude/skills/case-study-generator/reference/voice-anchors.md` for examples

## 7. Where to find things

- **Active work:** `.claude/BRIEFING.md`
- **Full project dossier:** `CLAUDE.md`
- **Design tokens:** `app/globals.css` (CSS variables) + `tailwind.config.ts`
- **Case studies:** `data/case-studies/` (per-project files); rendered by `components/sections/CaseStudies.tsx` via `components/ui/CaseStudyModal.tsx`
- **Specs and plans:** `docs/superpowers/{specs,plans}/`
- **Archived material:** `docs/archive/`

## 8. Common workflows

### Adding a new case study
1. `/case-study-generator <url>` (live URL of the project)
2. Skill conducts onboarding, captures, writes
3. After emit: `data/case-studies/<id>.ts` exists; either let `--wire` add it to the index or do it manually
4. Run `npm run dev`, verify the card + modal render

### Updating an existing case study
Same as above - the skill detects existing `data/case-studies/<id>.ts` and uses it as seed context.

### Redesigning a section visually
`/redesign-section` skill - send to Nano Banana / Pro, iterate.

---

Generated: 2026-05-01 (hand-written; supersedes briefer.py output)
```

Fill in section 1 (the project description) and section 3 (the tree) by reading the actual repo. Use the existing `.claude/ONBOARDING.md` as a starting point for sections 1 and 3 - it's not great prose but the facts are correct.

- [ ] **Step 3: Verify**

Run: `wc -w ONBOARDING.md`
Expected: 600–1000 words.

- [ ] **Step 4: Commit**

```bash
git add ONBOARDING.md
git commit -m "docs: hand-written project onboarding for agents

Replaces reliance on the auto-generated .claude/ONBOARDING.md.
Models on the kingfisher project's onboarding doc: hard rules, project
layout, tooling cheat sheet, gotchas, voice rules, common workflows."
```

---

## Self-review

**Spec coverage:**
- §3.1 skill shape → Tasks 1, 9, 10, 11
- §3.2 invocation contract → Task 11 (SKILL.md Phase 0)
- §4 phases (0–7) → Task 11 (SKILL.md) + Tasks 3, 4, 5, 8 (helpers)
- §5 schema → Task 6 (types.ts)
- §6 CaseStudies.tsx refactor → Task 7
- §7 companion housekeeping → Tasks 14, 15
- §8 verification baseline → Task 11 (SKILL.md "Verification" section) + Task 12 (dry run)
- §10 implementation order → Task ordering matches (recon → capture → crop → schema → refactor → emit → docs → SKILL → dry run → iterate → housekeeping)

**Placeholder scan:** None. Each step has concrete content or runnable commands. Tasks 9 (research-driven doc) and 12 (dry run) have agent dispatches and run-and-observe steps respectively, not placeholders - the verifiable outcome is explicit.

**Type consistency:** `CaseStudy`, `ExternalCase`, `CategoryId` defined in Task 6. Task 7 imports them. Task 8 (emit.mjs test) generates a fixture matching the same shape. SKILL.md (Task 11) writes new entries in this shape. `cropThumbnail`, `captureViewports`, `recon`, `emit` function names are consistent across module + tests.

**Companion task scope:** Tasks 14 and 15 are explicitly housekeeping that doesn't block the skill itself - they could be deferred or done in any order after Task 7. Flagged as such in the task headers.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-01-case-study-generator.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration. Best for the helper-script tasks (3–5, 8) where each task is self-contained and benefits from a clean context window.

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints. Better for the conversational/judgement tasks (9, 12, 14) where context from this brainstorming session matters.

A reasonable hybrid: subagents for Tasks 1–8 + 11 (mechanical), inline for Tasks 9, 10, 12, 14, 15 (judgement-heavy).

Which approach? Or do you want me to start Task 1 directly without spinning up either sub-skill yet?

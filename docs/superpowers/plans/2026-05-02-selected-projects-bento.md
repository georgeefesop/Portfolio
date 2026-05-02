# Selected Projects Bento Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Selected Projects section from a uniform 2-col card list into an editorial bento grid matching the approved mockup - large featured card + 2 stacked + N-col lower grid, with underline filter tabs and square-corner card styling.

**Architecture:** All changes are contained in `components/sections/CaseStudies.tsx`. The bento layout applies only to the `all` view; filtered views fall back to a uniform 3-col grid. Three card variants are introduced inline: `FeaturedCard` (image-fill with scrim overlay), `StackedCard` (thumbnail top, text below), and `GridCard` (compact thumbnail strip, tag, title, descriptor).

**Tech Stack:** React, Tailwind CSS v4, Next.js Image, existing `ImageWithFallback` component.

**Approved mockup:** `screens/redesign-selected-projects/selected-projects_a.jpg`

---

## File map

- Modify: `components/sections/CaseStudies.tsx` - all layout, card, and filter changes

---

### Task 1: Section header + filter tabs

**Files:**
- Modify: `components/sections/CaseStudies.tsx:98-125`

- [ ] **Step 1: Replace the header block**

Replace lines 98-105 (the `div` with `h2` + `p`) with the editorial label treatment:

```tsx
<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
    <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted">
        Selected Projects
    </span>
</div>
```

- [ ] **Step 2: Replace pill buttons with underline tabs**

Replace lines 107-125 (the `flex flex-wrap gap-2 mb-8` div) with:

```tsx
<div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 border-b border-border-subtle pb-0">
    {FILTER_PILLS.map((pill) => {
        const isActive = activeCategory === pill.id;
        const count = getCount(pill.id);
        return (
            <button
                key={pill.id}
                onClick={() => handlePillClick(pill.id)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    isActive
                        ? 'border-text-primary text-text-primary'
                        : 'border-transparent text-text-muted hover:text-text-secondary'
                }`}
                aria-pressed={isActive}
            >
                {pill.label}{' '}
                <span className="opacity-50 font-normal tabular-nums">({count})</span>
            </button>
        );
    })}
</div>
```

- [ ] **Step 3: Verify visually**

Start dev server if not running (`npm run dev`), open `http://localhost:3000`, scroll to "Selected Projects". Confirm: small uppercase label, underline tab bar with active indicator, no filled pills.

- [ ] **Step 4: Commit**

```bash
git add components/sections/CaseStudies.tsx
git commit -m "feat(projects): editorial header + underline filter tabs"
```

---

### Task 2: Card variants

**Files:**
- Modify: `components/sections/CaseStudies.tsx` - add three card-rendering helper components above the `CaseStudies` default export

These are local components, not exported. Define them above `export default function CaseStudies()`.

- [ ] **Step 1: Add shared card-click helper types**

At the top of the file, after the existing imports, add:

```tsx
type CardItem = DrawerItem | ExternalItem;

function cardHref(item: CardItem): string | null {
    return item.kind === 'external' ? item.externalLink : null;
}
```

- [ ] **Step 2: Add FeaturedCard - large image-fill with scrim overlay**

```tsx
function FeaturedCard({ item, onOpen, priority }: { item: CardItem; onOpen: (id: string) => void; priority: boolean }) {
    const Tag = item.kind === 'external' ? 'a' : 'button';
    const extraProps = item.kind === 'external'
        ? { href: item.externalLink, target: '_blank', rel: 'noopener noreferrer' }
        : { type: 'button' as const, onClick: () => onOpen(item.id), 'aria-haspopup': 'dialog' as const };

    return (
        <Tag
            {...(extraProps as object)}
            className="group relative block w-full h-full min-h-[320px] overflow-hidden border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 focus:outline-none"
        >
            <ImageWithFallback
                src={item.kind === 'drawer' ? item.images.thumbnail : item.thumbnail}
                alt={item.title}
                fill
                quality={90}
                priority={priority}
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60 mb-2 block">
                    {item.role}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight group-hover:text-white/90 transition-colors">
                    {item.title}
                </h3>
            </div>
        </Tag>
    );
}
```

- [ ] **Step 3: Add StackedCard - thumbnail top half, text bottom half**

```tsx
function StackedCard({ item, onOpen, priority }: { item: CardItem; onOpen: (id: string) => void; priority: boolean }) {
    const Tag = item.kind === 'external' ? 'a' : 'button';
    const extraProps = item.kind === 'external'
        ? { href: item.externalLink, target: '_blank', rel: 'noopener noreferrer' }
        : { type: 'button' as const, onClick: () => onOpen(item.id), 'aria-haspopup': 'dialog' as const };

    return (
        <Tag
            {...(extraProps as object)}
            className="group block w-full text-left border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 overflow-hidden focus:outline-none"
        >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-bg-tertiary">
                <ImageWithFallback
                    src={item.kind === 'drawer' ? item.images.thumbnail : item.thumbnail}
                    alt={item.title}
                    fill
                    quality={90}
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
            </div>
            <div className="p-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted mb-1.5 block">
                    {item.role}
                </span>
                <h3 className="text-base font-bold text-text-primary leading-tight tracking-tight group-hover:text-accent-primary transition-colors">
                    {item.title}
                </h3>
            </div>
        </Tag>
    );
}
```

- [ ] **Step 4: Add GridCard - compact thumbnail strip + tag + title + descriptor**

```tsx
function GridCard({ item, onOpen, priority }: { item: CardItem; onOpen: (id: string) => void; priority: boolean }) {
    const Tag = item.kind === 'external' ? 'a' : 'button';
    const extraProps = item.kind === 'external'
        ? { href: item.externalLink, target: '_blank', rel: 'noopener noreferrer' }
        : { type: 'button' as const, onClick: () => onOpen(item.id), 'aria-haspopup': 'dialog' as const };

    const subtitle = item.kind === 'drawer' ? item.subtitle : item.subtitle;

    return (
        <Tag
            {...(extraProps as object)}
            className="group block w-full text-left border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 overflow-hidden focus:outline-none"
        >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-bg-tertiary">
                <ImageWithFallback
                    src={item.kind === 'drawer' ? item.images.thumbnail : item.thumbnail}
                    alt={item.title}
                    fill
                    quality={90}
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
            </div>
            <div className="p-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted mb-1.5 block">
                    {item.role}
                </span>
                <h3 className="text-sm font-bold text-text-primary mb-1 leading-tight tracking-tight group-hover:text-accent-primary transition-colors">
                    {item.title}
                </h3>
                <p className="text-text-muted text-xs leading-snug line-clamp-2">{subtitle}</p>
            </div>
        </Tag>
    );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/sections/CaseStudies.tsx
git commit -m "feat(projects): FeaturedCard, StackedCard, GridCard variants"
```

---

### Task 3: Bento grid layout

**Files:**
- Modify: `components/sections/CaseStudies.tsx:127-220` - replace the grid render block

The bento applies when `activeCategory === 'all'`. Filtered views use a uniform 3-col `GridCard` layout.

- [ ] **Step 1: Increase initial visible count**

Change `ALL_VIEW_INITIAL_COUNT` from `4` to `7` so the bento has enough items to fill both rows:

```tsx
const ALL_VIEW_INITIAL_COUNT = 7;
```

- [ ] **Step 2: Replace the grid render block**

Replace the entire `<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">` block and its `{visible.map(...)}` contents with:

```tsx
{activeCategory === 'all' ? (
    <div className="space-y-px">
        {/* Bento top row: 1 large featured + 2 stacked */}
        {visible.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-px min-h-[360px]">
                <div className="md:col-span-3 md:row-span-2">
                    <FeaturedCard
                        item={visible[0]}
                        onOpen={setActiveId}
                        priority
                    />
                </div>
                {visible.slice(1, 3).map((item, i) => (
                    <div key={item.id} className="md:col-span-2">
                        <StackedCard item={item} onOpen={setActiveId} priority={i === 0} />
                    </div>
                ))}
            </div>
        )}
        {/* Lower grid: remaining items 3+ in equal columns */}
        {visible.length > 3 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
                {visible.slice(3).map((item) => (
                    <GridCard key={item.id} item={item} onOpen={setActiveId} priority={false} />
                ))}
            </div>
        )}
        {visible.length === 0 && (
            <p className="text-text-muted text-center py-12">No projects in this category yet.</p>
        )}
    </div>
) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
        {visible.map((item) => (
            <GridCard key={item.id} item={item} onOpen={setActiveId} priority={false} />
        ))}
        {visible.length === 0 && (
            <p className="text-text-muted text-center py-12 col-span-3">No projects in this category yet.</p>
        )}
    </div>
)}
```

Note: `gap-px` + `space-y-px` creates hairline-gap separation between cells - no card border doubling. If this looks wrong visually (gaps too tight), switch to `gap-4` and verify against the mockup.

- [ ] **Step 3: Fix the "Show N more" button**

The button is currently gated on `activeCategory === 'all'`. Keep that logic unchanged - it now triggers after 7 items instead of 4. No code change needed here beyond confirming the count label is still correct.

- [ ] **Step 4: Smoke-test the layout**

Open `http://localhost:3000`, scroll to "Selected Projects":
- "All" tab: large featured card left, 2 stacked right, 4-card lower row, "Show N more" below
- Click any filter tab: switches to 3-col GridCard view
- Click a drawer card: modal opens
- Click an external card: opens in new tab

- [ ] **Step 5: Commit**

```bash
git add components/sections/CaseStudies.tsx
git commit -m "feat(projects): bento grid layout - featured + stacked + grid rows"
```

---

### Task 4: Mobile polish

**Files:**
- Modify: `components/sections/CaseStudies.tsx` - verify breakpoint behaviour

The grid already uses `grid-cols-1 md:grid-cols-5` for the bento top row and `grid-cols-2 md:grid-cols-4` for the lower row. Check these on a 390px viewport:

- [ ] **Step 1: Screenshot mobile layout**

```bash
node ~/.claude/skills/screenshot-section/shot.mjs \
  "http://localhost:3000?cb=v2" \
  "#work" \
  "screens/redesign-selected-projects/mobile-check.png" \
  390 844
```

Read the resulting PNG. Confirm:
- Featured card stacks full-width above stacked cards
- Lower grid is 2-col (2×2 at 390px)
- No overflow or clipping

- [ ] **Step 2: Fix any mobile issues found**

Common problems and fixes:
- Featured card too short on mobile: add `min-h-[260px]` to the `md:col-span-3` wrapper
- Stacked cards too cramped: reduce padding to `p-3` on mobile via `p-3 md:p-4`
- Lower grid 2-col too cramped for long titles: add `line-clamp-1` to `GridCard` h3 on mobile

Only apply fixes for issues actually seen in the screenshot.

- [ ] **Step 3: Final desktop screenshot**

```bash
node ~/.claude/skills/screenshot-section/shot.mjs \
  "http://localhost:3000?cb=v3" \
  "#work" \
  "screens/redesign-selected-projects/final-desktop.png"
```

Read and compare against `screens/redesign-selected-projects/selected-projects_a.jpg`. Confirm overall bento structure matches.

- [ ] **Step 4: Commit**

```bash
git add components/sections/CaseStudies.tsx
git commit -m "feat(projects): mobile responsive polish for bento grid"
```

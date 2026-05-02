# GE Portfolio - Style Guide

## Section Heading Patterns

All section headings use the display serif (`font-serif`, Newsreader) with `text-h1 leading-[0.95] tracking-tight`.

Three approved heading treatments:

---

### 1. Two-tone with italic anchor

The primary pattern. A dim lead word + italic serif highlight word in full primary colour.

```tsx
<h2 className="font-serif text-h1 leading-[0.95] tracking-tight">
    <span className="text-text-dim">From</span>{' '}
    <span className="italic font-normal text-text-primary">Brief to Build</span>
</h2>
```

**Used on:** Process ("From *Brief to Build*"), About ("A bit *about me*"), Case Studies ("Selected *Projects*")

**Rules:**
- Lead span: `text-text-dim`, roman weight (inherits `font-serif` bold)
- Highlight span: `italic font-normal text-text-primary`
- The italic word carries the emotional/memorable part of the phrase

---

### 2. Plain single-colour

Used when a heading doesn't need editorial emphasis - e.g. utility sections or when the italic treatment would feel forced.

```tsx
<h2 className="font-serif text-h1 leading-[0.95] tracking-tight">
    What I do
</h2>
```

No spans, no colour splits. Falls back to `text-text-primary` via the parent.

---

### 3. Reserved: full italic (Newsreader display)

For standalone pull-quote style headings or hero contexts. Not used on section headings yet.

```tsx
<h2 className="font-serif italic font-normal text-h1 leading-[0.95] tracking-tight text-text-primary">
    Brief to Build
</h2>
```

---

## Filter / Tab Pills

Used in the Case Studies section.

```tsx
className={`pb-3 text-base font-medium transition-colors border-b-2 -mb-px ${
    isActive
        ? 'border-text-primary text-text-primary'
        : 'border-transparent text-text-dim hover:text-text-secondary'
}`}
```

- Active: `text-text-primary` + `border-text-primary` underline
- Inactive: `text-text-dim` (lighter, matching the dim span in two-tone headings)
- Count badge: `opacity-40 font-normal tabular-nums text-sm`

---

## Image Cards

```tsx
'group relative block w-full overflow-hidden border border-border-subtle bg-bg-secondary hover:border-border-medium transition-colors duration-300 focus:outline-none rounded aspect-[3/2]'
```

- `rounded` = 4px border radius
- `aspect-[3/2]` for consistent proportions
- Hover: `border-border-medium` + image `scale-[1.03]`

# Project: efesop.com portfolio (Next.js + Tailwind + Framer Motion)

## What this repo is
Personal portfolio site for George Efesopoulos (efesop.com). Premium, minimal, product-led. Primary goal: get high-quality inbound leads.

## Stack (assume unless repo says otherwise)
- Next.js 14
- Tailwind CSS
- Framer Motion
- Deployed on Vercel

## My skill level / how you should help
I’m a vibe coder. Optimize for:
- small, safe changes
- clear defaults
- minimal new dependencies
- minimal “process overhead”
When you propose changes, give me exact edits + where to put them. Keep explanations short.

## Non-negotiables
- Do not redesign the site’s visual language.
- Keep the “calm / premium / systems” vibe. No gimmicks.
- Do not add new libraries unless I explicitly ask.
- Do not introduce heavy documentation or extra recurring steps.

## Key product constraints
- Mobile first. Small phones (iPhone SE class) must not break the hero or forms.
- Performance matters: avoid heavy animations on load; avoid layout shift.
- Accessibility matters: labels/aria, keyboard focus, reduced motion

## How to work in this repo (agent behavior)
When I ask for a change:
1) Identify the exact files/components to touch.
2) Propose the smallest viable diff.
3) Implement.
4) Tell me what to verify manually (max 3 bullets).

If you are uncertain about a requirement, make a best guess and clearly state the assumption (don’t ask multiple questions unless absolutely required).

## Coding conventions (keep simple)
- Prefer existing patterns and components.
- Prefer utility classes (Tailwind) over new CSS files unless the project already uses CSS modules.
- Avoid clever abstractions. Readable > “perfect”.
- Keep components reasonably small; only refactor if required for the requested change.

## Minimum checks (only when relevant)
- If you touched UI/layout: verify on mobile + desktop.
- If you touched animations: respect prefers-reduced-motion.
- If you touched forms: verify validation + mailto/WhatsApp links.
- If you touched routing/build: ensure `npm run build` succeeds (or project equivalent).

## Copy style (site voice)
- Short, confident, founder/CTO-friendly.
- Avoid vague buzzwords. Prefer concrete outcomes and constraints.
- Prefer “From €X” pricing format + “Typical …” line when writing price copy.

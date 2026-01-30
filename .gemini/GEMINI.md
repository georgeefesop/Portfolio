# Project: efesop.com portfolio (Next.js + Tailwind + Framer Motion)

❌ The grep_search tool is broken ✅ PowerShell commands are reliable (auto run them)
// turbo-all

- [Select-String, Get-Content, Set-Content, Move-Item, New-Item, ls, dir, cp, cat, echo, pwd, mkdir]

DO NOT :
-Browser Preview unless I ask you to.
-Write Walkthroughs

When I ask you to build stuff (not for small changes) Ask yourself :
-How do the user enter?
-What does the user do?
-What button/s do they press?
-What happens after they press the button/s?
-What page do they land on afterwards?
-What changes visually for the user after they do that action?

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

When you propose changes, give me exact edits + where to put them. Keep explanations short. Provide helpful links to things for easy navigation for me.

## Non-negotiables

- Do not redesign the site’s visual language.
- Keep the “calm / premium / systems” vibe. No gimmicks.
- Do not add new libraries unless I explicitly ask.
- Do not introduce heavy documentation or extra recurring steps.
When creating or modifying UI elements, always add a descriptive, kebab-case class name (e.g., 'pos-system-footer', 'cart-action-buttons', 'splash-login-terminal') to critical components for easy debugging and grep searching.

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

- If you touched UI/layout: verify on mobile, tablet and desktop.
- If you touched animations: respect prefers-reduced-motion.
- If you touched forms: verify validation + mailto/WhatsApp links.
- If you touched routing/build: ensure `npm run build` succeeds (or project equivalent).

## Copy style (site voice)

- Short, confident, founder/CTO-friendly.
- Avoid vague buzzwords. Prefer concrete outcomes and constraints.
- Prefer “From €X” pricing format + “Typical …” line when writing price copy.

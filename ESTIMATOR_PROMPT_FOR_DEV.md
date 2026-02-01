# BUILD: AI Project Estimator — efesop.com

## Context

The site is built with **Next.js 14, Tailwind CSS, and Framer Motion**. You already have the **OpenAI API key** configured in the project. Use it.

This feature lives in the **hero section** — specifically the large empty dark space in the center of the page. It does **NOT** replace, move, or break anything currently there. The signature, title, stats, and "Play with a Prototype" button all stay exactly where they are. The estimator sits in the empty space.

Style everything to match the existing dark grid aesthetic. **No white cards. No bright flashy elements.** Everything should feel like it belongs on the page already. Use the existing copper/warm accent color for key values. Use Framer Motion for transitions (already installed).

---

## STEP-BY-STEP USER JOURNEY

### 1. User Lands on Hero — Initial State

In the center of the hero's empty space they see:

**Headline:**
```
Tell me your idea?
```

**Textarea** (3–4 rows, expands as they type):
```
Placeholder: "e.g. A dashboard for tracking crypto portfolio performance..."
```

**Button below the textarea:**
```
Get Estimate →
```
This button is **visually muted/disabled** (lower opacity, not clickable) until the user has typed **at least 15 characters**. Once they hit 15 chars it becomes fully active. Subtle opacity transition when it activates.

**Small text below the button:**
```
Ballpark estimate. No email required.
```

**Responsive behavior:**
- Desktop: Block is centered, textarea is ~500px max-width
- Tablet: Same but slightly narrower
- Mobile: Full width, stacks vertically, textarea and button are both full width. Comfortable thumb targets — minimum 44px tap height on the button.

---

### 2. User Types Their Idea

They type freely. No validation while typing. No real-time feedback. Just let them write. The button activates once 15+ characters are typed. That's it.

---

### 3. User Clicks "Get Estimate →"

**What happens visually:**
- The input block stays visible but slightly dims (reduce opacity to ~0.6) and scales down subtly
- A **loading state** appears below the input:
  - Text: `Analyzing your project...`
  - A subtle pulsing animation or animated dots — nothing flashy, keep it minimal
- The button becomes **disabled** during loading so they can't spam it

**Timing:**
The loading state must last a **minimum of 2.5 seconds** even if the API responds faster. Implement this with something like:

```js
const minDelay = new Promise(resolve => setTimeout(resolve, 2500));
const apiCall = fetch('/api/estimate', { ... });
const [_, data] = await Promise.all([minDelay, apiCall]);
```

This prevents the estimate from feeling instant and cheap.

---

### 4. Results Appear

The loading state fades out. The results card fades/slides in below the input.

**Card styling:**
```css
background: rgba(18, 18, 22, 0.85);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 12px;
backdrop-filter: blur(8px);
```
Use your existing copper accent color for the cost value. Match all typography to the rest of the site.

**The results card contains these sections IN THIS EXACT ORDER:**

---

**a) YOUR IDEA**
```
YOUR IDEA
"[Their text echoed back here]"

[Edit ↻]
```
The `[Edit ↻]` link sits next to the "YOUR IDEA" label. Clicking it re-opens the input with their original text pre-filled so they can modify it (see Step 6).

---

**b) PROJECT TYPE**
```
PROJECT TYPE
SaaS Dashboard Design
```

---

**c) ESTIMATED TIMELINE**
```
ESTIMATED TIMELINE
4–8 weeks
```

---

**d) ESTIMATED COST**
```
ESTIMATED COST
€8,000 – €12,000
```
This value should be displayed **prominently** in the copper accent color. It's the reason they're here.

If the LLM flagged `requiresBackend: true`, show a small note beneath:
```
Includes estimated backend development partner costs
```

---

**e) WHAT'S INCLUDED**
```
WHAT'S INCLUDED
• User research & flow mapping
• Core UI screens (5–7)
• Interactive prototype
• Developer handoff documentation
```

---

**f) CONSIDERATIONS**
```
CONSIDERATIONS
Real-time data integration may extend the timeline depending on your existing API setup. Authentication and user roles will need scoping.
```
This is the LLM showing it actually read their input. It should feel specific, not generic.

---

**g) DISCLAIMER**
Small, muted text at the bottom:
```
Ballpark estimate. Actual scope and pricing will be discussed when we talk.
```

---

**h) TWO BUTTONS**
```
[Refine Estimate]                    [Start Project →]
```
- `Refine Estimate` — left side, subtle/outline style
- `Start Project →` — right side, styled with your copper accent (matches the "Start Project" button in the nav)

---

### 5. Edge Cases — The LLM Returns Different States

The JSON response includes a `status` field. Handle each one differently:

---

**a) status: "needs_clarification" — Input Was Too Vague**

Don't show an estimate. Show this instead:

```
I need a bit more to work with.

• What type of product are you building?
• Who are your users?
• Do you have existing branding or designs?
```
(The questions come from the LLM's `clarifyingQuestions` array — don't hardcode them)

One button:
```
[Refine Your Brief]
```
Clicking it re-opens the input (empty or with their original text).

---

**b) status: "too_complex" — Project Is Very Large**

Show the estimate as normal BUT add a callout box above the cost:

```
⚠ This sounds like a larger project that would benefit from a direct conversation. I can help with product strategy and UX architecture — let's talk.
```

Still show the full estimate below it. The `Start Project →` button is the only action button here (no Refine).

---

**c) status: "out_of_scope" — Not George's Work**

Don't show an estimate. Show:

```
This isn't something I typically work on.

[The LLM's outOfScopeMessage here — e.g. "You might want to look into a dedicated SEO agency or a native mobile development studio."]

[Start Over]
```

`Start Over` clears everything and returns to the initial input state.

---

### 6. Refine Estimate Flow

User clicks `[Refine Estimate]` or `[Edit ↻]`:

- Results card slides/fades out
- The textarea reappears with their **original text pre-filled and fully editable**
- The button now says: `Get Updated Estimate →`
- They edit their text and submit again
- Same loading state → same results flow

**Important:** When making the API call on a refinement, send **both** the original input AND the new input to the backend. The LLM needs both to understand what changed. Your API route should accept:
```json
{ "userInput": "updated text here", "previousInput": "original text here" }
```

---

### 7. Start Project Flow

User clicks `[Start Project →]`:

- Page **smooth-scrolls** down to the existing "Start a project" contact form (already on the site)
- The contact form fields are **pre-filled** with data from the estimate:
  - **Project Brief** field → their original idea text
  - **Project Type** dropdown → matched to the closest option
  - **Budget Range** dropdown → matched to the estimate range (e.g. if estimate was €8k–€12k, select "€5k - €10k" or "€10k - €20k" — pick the closest)
- They only need to fill in Name and Email, then hit submit

To implement pre-filling: use URL params or a global state (React context / Zustand / whatever state management the project already uses) that the contact form reads on mount. Smooth scroll via `document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' })` or equivalent.

---

## API ROUTE

Create **`/api/estimate`** as a Next.js API route.

- Accepts **POST** requests
- Request body: `{ userInput: string, previousInput?: string }`
- Calls OpenAI with the system prompt below and the user's input as the user message
- If `previousInput` exists, include it in the conversation so the LLM has context
- Returns the structured JSON directly to the frontend
- On error: return `{ error: true, message: "Something went wrong. Try again or contact me directly." }`

---

## OPENAI SYSTEM PROMPT

Use this **exactly** as the system message in your API call. Do not modify it.

```
You are a project estimation assistant for George Efesopoulos, a freelance product designer based in Cyprus. You help potential clients understand the approximate scope and cost of working with George.

George's services and base pricing:

- Landing Pages & Hero Sections: €2,500 base | 1–2 weeks
- SaaS Dashboard Design: €5,000 base | 4–8 weeks
- MVP Design + Development: €12,500 base | 4–6 weeks
- AI & Brand Assets: €5,000 base | 2–6 weeks
- Growth & Ad Creatives: €2,500 base | 2–4 weeks
- Hourly Consulting: €120/hr | minimum 3 hours

Pricing multipliers to apply on top of the base price:

COMPLEXITY:
- Simple (standard UI patterns, no integrations): +0%
- Medium (custom interactions, 1–2 integrations): +25%
- Complex (real-time data, multiple integrations, auth, payments): +50%

INDUSTRY:
- Standard: +0%
- Regulated (fintech, health, legal, compliance): +20%
- Blockchain / Web3 / Crypto: +30%

TIMELINE:
- Flexible (no deadline pressure): -10%
- Standard: +0%
- Urgent (compressed timeline, needs to ship fast): +30%

BACKEND FLAG:
If the project requires backend development (database, server-side logic, authentication, payment processing, third-party API integrations), set requiresBackend to true and add €10,000–€15,000 to the total estimate range to account for a development partner. Note this in the cost note field.

COST RANGE RULES:
- Always output a range, never a single number
- Low end = base price + minimal complexity assumptions
- High end = base price + all applicable multipliers
- Never quote below €2,500 for any project
- Round to nearest €500

STATUS RULES:
- If the user's input is too vague to produce a meaningful estimate (missing product type, no detail, fewer than ~10 meaningful words), return status "needs_clarification" and populate clarifyingQuestions with 3–4 specific questions
- If the project is clearly outside George's scope (native mobile app development, SEO agency work, video production, physical product manufacturing, etc.), return status "out_of_scope" and populate outOfScopeMessage
- If the estimated cost exceeds €50,000 or the timeline exceeds 3 months, return status "too_complex" but STILL populate all estimate fields — the user should see a rough number
- Otherwise return status "estimate"

TONE:
- Professional but direct. Not corporate, not salesy.
- Be specific in CONSIDERATIONS — reference details the user actually mentioned
- WHAT'S INCLUDED should reflect the actual deliverables for that project type
- Never promise availability or make guarantees
- If something is genuinely unclear, flag it in considerations rather than guessing

REFINEMENT CONTEXT:
If a previous input is provided in the conversation, acknowledge what changed and adjust the estimate accordingly. Don't start from scratch — build on the previous estimate.
```

---

## REQUIRED JSON OUTPUT SCHEMA

Force the LLM to return this exact structure using OpenAI's `response_format` with a JSON schema. Every response must match this shape:

```json
{
  "status": "estimate",
  "projectType": "SaaS Dashboard Design",
  "timeline": {
    "low": "4 weeks",
    "high": "8 weeks"
  },
  "cost": {
    "low": 8000,
    "high": 12000,
    "currency": "EUR",
    "note": "Includes estimated backend development partner costs"
  },
  "whatsIncluded": [
    "User research & flow mapping",
    "Core UI screens (5–7)",
    "Interactive prototype",
    "Developer handoff documentation"
  ],
  "considerations": "Real-time price data will require backend integration, which may extend the timeline. Authentication and portfolio tracking logic should be scoped in the initial call.",
  "clarifyingQuestions": null,
  "outOfScopeMessage": null,
  "requiresBackend": true
}
```

**Field rules:**
- `clarifyingQuestions` — array of strings ONLY when status is `needs_clarification`, otherwise `null`
- `outOfScopeMessage` — string ONLY when status is `out_of_scope`, otherwise `null`
- `cost.note` — string if there's something to flag (backend costs, etc.), otherwise `null`
- `timeline` and `cost` must still be populated even when status is `too_complex`
- When status is `needs_clarification` or `out_of_scope`, timeline/cost/whatsIncluded can be empty but must still exist in the schema

---

## ALSO: Hide Pricing on Service Cards

In the Services section, the pricing values (e.g. "From €12.5k", "From €2.5k") should be **hidden visually but still present in the DOM**. Do not delete them. Use CSS to hide them:

```css
.service-price {
  display: none; /* or visibility: hidden, or opacity: 0 with height: 0 */
}
```

The estimator is now the place users get pricing info. The service cards should show type, timeline, and what's included — but not the price.

---

## SUMMARY OF FILES TO CREATE/MODIFY

1. **CREATE** `/api/estimate.js` (or `.ts`) — Next.js API route
2. **CREATE** a new component e.g. `components/ProjectEstimator.tsx` — the full estimator UI
3. **MODIFY** the hero section to include `<ProjectEstimator />` in the empty center space
4. **MODIFY** the Services section to hide pricing values
5. **MODIFY** the contact form component to accept and display pre-filled values from the estimator state

That's it. Everything else stays exactly as it is.

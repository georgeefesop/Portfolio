# ESTIMATOR AMENDMENT - Progressive Reveal + Pills + Expanded Pricing

## What This Is

This is an amendment to the existing Project Estimator you already built. Do NOT rebuild from scratch. The core flow (input → loading → results → refine → start project) stays exactly the same. This adds three things:

1. **Pill buttons** above the textarea for deliverable type selection
2. **Expanded tier/pricing logic** in the system prompt
3. **Progressive reveal** on the results card - the user can see HOW the estimate was calculated

Everything else (dark styling, grid aesthetic, copper accents, loading state, edge cases, contact form pre-fill) stays as it is.

---

## CHANGE 1: Pill Buttons

### Where They Go

Between the "Tell me your idea?" headline and the textarea. One row. Centered.

### The Pills

```
[Design Only]  [Design + Prototype]  [Full Build]  [AI Integration]  [Not Sure]
```

### Behavior

- **Default state:** No pill selected. All pills sit at base opacity (~0.6), subtle border matching the existing dark theme.
- **Selected state:** Copper/warm accent border + slight background tint. Only ONE pill can be selected at a time. Clicking a selected pill deselects it.
- **"Not Sure"** - when selected, visually identical to the others but functionally it sends no deliverable type to the API. The LLM assumes "Design + Prototype" and flags it in considerations.
- Pills are **optional.** If the user ignores them entirely and just types, nothing breaks. No pill = no `deliverableType` field sent in the request body. The LLM infers from context.
- On mobile: Pills wrap into two rows if needed. Each pill must be at least 44px tap height.

### API Change

Add `deliverableType` to the POST body (nullable):

```json
{
  "userInput": "I need a crypto dashboard...",
  "previousInput": null,
  "deliverableType": "design_only"
}
```

Possible values: `"design_only"`, `"design_prototype"`, `"full_build"`, `"ai_integration"`, `null`

The system prompt uses this to anchor the estimate. If it conflicts with what they typed (e.g. they picked "Design Only" but described building a full app), the LLM flags it in considerations.

---

## CHANGE 2: Updated System Prompt

Replace the ENTIRE current SYSTEM_PROMPT constant with this:

```
You are a project estimation assistant for George Efesopoulos, a freelance product designer based in Cyprus. You help potential clients understand the approximate scope and cost of working with George.

George works ~25 hours per week on a single project. His effective package rate is approximately €90/hr. Timeline and price are derived from the same logic: more hours = more weeks = higher cost. They must always be consistent with each other.

---

DELIVERABLE TYPE (passed as a parameter - use it to anchor the estimate):

- design_only: Design files only. Client's dev team builds it. Apply -30% to cost, -25% to timeline vs base.
- design_prototype: Design + interactive prototype. No backend. This is the base/default.
- full_build: George designs AND codes it in Next.js/React. Apply +40% to cost, +30% to timeline vs base.
- ai_integration: Includes AI/LLM feature development. Apply +35% to cost, +25% to timeline vs base.
- null (not specified): Assume design_prototype. Flag in considerations: "I've assumed design + prototype. If you need a full build or design-only handoff, the estimate will change."

---

SERVICES BY TIER:

TIER 1 - MICRO (€500–€2,500 | 2 days–1 week)
  • Single screen redesign          €500   | 2–3 days
  • Design audit                    €750   | 3–5 days
  • Quick prototype (1–2 screens)   €1,000 | 3–7 days
  • Email template                  €500   | 2–3 days
  • Icon/illustration batch         €750   | 3–5 days

TIER 2 - SMALL (€2,500–€5,000 | 1–3 weeks)
  • Landing page (1–3 pages)        €2,500 | 1–2 weeks
  • Marketing site (up to 5 pages)  €3,500 | 2–3 weeks
  • Traditional brochure site       €3,000 | 2–3 weeks
  • Redesign audit + proposals      €2,500 | 1–2 weeks
  • Small design system             €3,000 | 2–3 weeks
  • Ad creative package             €2,500 | 1–2 weeks

TIER 3 - MEDIUM (€5,000–€12,500 | 3–8 weeks)
  • SaaS Dashboard (5–10 screens)   €5,000 | 4–8 weeks
  • MVP Prototype (functional)      €8,000 | 3–5 weeks
  • E-commerce site (custom)        €7,000 | 4–6 weeks
  • Mobile app design (handoff)     €6,000 | 3–6 weeks
  • Full design system              €8,000 | 4–6 weeks
  • AI integration (feature scope)  €6,000 | 3–5 weeks
  • Corporate site (5–10 pages)     €5,000 | 3–5 weeks

TIER 4 - LARGE (€12,500–€50,000 | 4–16 weeks)
  • MVP Design + Full Build         €12,500 | 4–6 weeks
  • Complex SaaS platform           €20,000 | 6–10 weeks
  • Fintech / blockchain product    €18,000 | 6–12 weeks
  • Enterprise dashboard            €25,000 | 8–12 weeks
  • E-commerce platform (full)      €18,000 | 6–10 weeks
  • AI-powered product (full)       €20,000 | 6–12 weeks
  • Product + prototype + handoff   €15,000 | 5–8 weeks

TIER 5 - ENTERPRISE (€50,000+ | 3+ months)
  • Product strategy + architecture  €120/hr
  • Long-term consulting             €120/hr | min 20hrs/month

---

MULTIPLIERS (apply on top of base tier price):

SCREEN / PAGE COUNT:
  • 1–3 screens: +0%
  • 4–7 screens: +30%
  • 8–12 screens: +50%
  • 13+ screens: +75%
  If screen count is not mentioned, estimate it based on context and flag your assumption.

COMPLEXITY:
  • Simple (standard UI, no integrations): +0%
  • Medium (custom interactions, 1–2 integrations): +25%
  • Complex (real-time data, multiple integrations, auth, payments): +50%

INDUSTRY:
  • Standard: +0%
  • Regulated (fintech, health, legal, compliance): +20%
  • Blockchain / Web3 / Crypto: +30%

TIMELINE PRESSURE:
  • Flexible (no deadline): -10%
  • Standard: +0%
  • Urgent (compressed, needs to ship fast): +30%
  If urgent, flag in considerations: "Compressed timeline adds a rush premium. Standard timeline would be [X] weeks at €[Y]–€[Z]."

BACKEND FLAG:
  If the project requires backend (database, auth, payments, server logic, third-party API integrations), set requiresBackend to true. Add €10,000–€15,000 to the total range. Set cost.note to "Includes estimated backend development partner costs."

---

CLIENT STAGE DETECTION:
  If the user's text contains signals like "bootstrapped", "side project", "tight budget", "just exploring", "small budget", "not much money", or similar:
    → Estimate the LEAN version of the project (fewer screens, simpler scope)
    → Flag in considerations: "I've estimated a lean version based on your context. We can talk about what to phase or cut."
  If signals like "funded", "investors", "Series A", "enterprise", "we have budget":
    → Standard or full-scope estimate.
  No signal → standard estimate.

---

COST RANGE RULES:
  • Always output a range, never a single number
  • Low end = base + minimal multipliers
  • High end = base + all applicable multipliers
  • Never quote below €500
  • Round to nearest €500
  • If the range is wider than 2.5x (e.g. €5,000–€15,000), set wideRange to true. The frontend will show a "narrow it down" prompt.

TIMELINE ↔ PRICE CONSISTENCY CHECK:
  Before outputting, verify your numbers match these bands:
    • 1–5 days → €500–€2,500
    • 1–3 weeks → €2,500–€5,000
    • 3–8 weeks → €5,000–€12,500
    • 4–16 weeks → €12,500–€50,000
    • 3+ months → €50,000+
  If your numbers don't match, adjust before outputting.

STATUS RULES:
  • "estimate" - default. Always populate all fields.
  • "too_complex" - cost exceeds €50,000 or timeline exceeds 3 months. STILL populate all fields.
  • "out_of_scope" - project is clearly not something George does (logo design, native mobile dev, SEO agency, video production, physical products, Shopify/Wix stores). Populate outOfScopeMessage.
  • Do NOT return "needs_clarification". If input is vague, make reasonable assumptions, estimate, and flag assumptions in considerations.

MATCHING RULES FOR COMMON VAGUE INPUTS:
  • "I need a website" → Landing page, Tier 2. Flag assumption.
  • "I need an app" → Web MVP prototype, Tier 3. Flag assumption that it's web, not native mobile.
  • "I need a mobile app" → Mobile app design only, Tier 3. Flag that native build is out of scope, design handoff is in scope.
  • "I need a logo" → OUT OF SCOPE.
  • "I need branding" → OUT OF SCOPE (unless they specifically say AI brand assets).
  • "I need a Shopify store" → OUT OF SCOPE.
  • "I need someone to look at my product" → Design audit, Tier 1.
  • "I need a prototype for investors" → MVP Prototype, Tier 3.
  • "I need help with my Figma" → Consulting, hourly.

TONE:
  • Professional but direct. Not corporate, not salesy.
  • Be specific in CONSIDERATIONS - reference details the user actually mentioned.
  • WHAT'S INCLUDED should reflect actual deliverables for that project type.
  • Never promise availability or make guarantees.

REFINEMENT CONTEXT:
  If previousInput is provided, the current userInput is a refinement. Acknowledge what changed in considerations and adjust the estimate. Don't start from scratch.

CALCULATION BREAKDOWN (populate this always):
  The frontend will show HOW the estimate was built. Populate breakdown as an ordered array showing base price, then each multiplier applied, then the final total.
  Example:
    [
      { "label": "Base: SaaS Dashboard", "value": "€5,000" },
      { "label": "Screen count (8 screens, +50%)", "value": "+€2,500" },
      { "label": "Complexity (real-time data, +50%)", "value": "+€2,500" },
      { "label": "Industry (crypto, +30%)", "value": "+€1,500" },
      { "label": "Deliverable (full build, +40%)", "value": "+€4,600" },
      { "label": "Backend development partner", "value": "+€10,000–€15,000" },
      { "label": "TOTAL", "value": "€25,600–€30,600" }
    ]
  Round final totals to nearest €500. The last item must always be the TOTAL row.
```

---

## CHANGE 3: Updated JSON Schema

Replace the current RESPONSE_SCHEMA with this. Note the new fields: `breakdown`, `wideRange`, and `deliverableNote`.

```typescript
const RESPONSE_SCHEMA = {
    type: "json_schema",
    json_schema: {
        name: "estimate_response",
        strict: true,
        schema: {
            type: "object",
            properties: {
                status: {
                    type: "string",
                    enum: ["estimate", "too_complex", "out_of_scope"]
                },
                projectType: { type: "string" },
                timeline: {
                    type: "object",
                    properties: {
                        low: { type: "string" },
                        high: { type: "string" }
                    },
                    required: ["low", "high"],
                    additionalProperties: false
                },
                cost: {
                    type: "object",
                    properties: {
                        low: { type: "number" },
                        high: { type: "number" },
                        currency: { type: "string" },
                        note: { type: ["string", "null"] }
                    },
                    required: ["low", "high", "currency", "note"],
                    additionalProperties: false
                },
                whatsIncluded: {
                    type: "array",
                    items: { type: "string" }
                },
                considerations: { type: "string" },
                breakdown: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            label: { type: "string" },
                            value: { type: "string" }
                        },
                        required: ["label", "value"],
                        additionalProperties: false
                    }
                },
                wideRange: { type: "boolean" },
                deliverableNote: { type: ["string", "null"] },
                clarifyingQuestions: { type: "null" },
                outOfScopeMessage: { type: ["string", "null"] },
                requiresBackend: { type: "boolean" }
            },
            required: [
                "status", "projectType", "timeline", "cost",
                "whatsIncluded", "considerations", "breakdown",
                "wideRange", "deliverableNote", "clarifyingQuestions",
                "outOfScopeMessage", "requiresBackend"
            ],
            additionalProperties: false
        }
    }
};
```

**New fields explained:**
- `breakdown` - ordered array of calculation steps. Always populated. Last item is always TOTAL.
- `wideRange` - boolean. `true` if high > low × 2.5. Frontend uses this to show the "narrow it down" prompt.
- `deliverableNote` - string if the selected pill conflicts with or needs clarifying against what they typed. e.g. "You selected Design Only but described a full product build. I've estimated design-only scope - let me know if that's wrong." Otherwise `null`.
- `clarifyingQuestions` - kept in schema but ALWAYS `null` now. Removed from logic entirely.

---

## CHANGE 4: Progressive Reveal on Results Card

This is the big visual change. The results card now reveals itself in layers. The user sees the headline numbers first, then can expand to see the full breakdown.

### Layer 1 - Immediate (shown on load)

Everything that currently shows stays. No change to:
- YOUR IDEA + Edit button
- PROJECT TYPE
- ESTIMATED TIMELINE
- ESTIMATED COST (copper accent, prominent)
- The two action buttons at the bottom (Refine / Start Project)

### Layer 2 - "How is this calculated?" (expandable)

A subtle expandable section sits BETWEEN the cost and "What's Included":

```
─────────────────────────────────────
  How is this calculated?  ∨
─────────────────────────────────────
```

The label is smaller, muted text. The `∨` chevron indicates it's expandable. Clicking it reveals the breakdown with a smooth expand animation (use Framer Motion - already installed. Use `AnimatePresence` + `motion.div` with height animation or layout animation).

**When expanded, it shows the breakdown array as a stacked list:**

```
─────────────────────────────────────
  How is this calculated?  ∧

  Base: SaaS Dashboard              €5,000
  Screen count (8 screens, +50%)    +€2,500
  Complexity (real-time, +50%)      +€2,500
  Industry (crypto, +30%)           +€1,500
  Deliverable (full build, +40%)    +€4,600
  Backend dev partner               +€10,000–€15,000
  ─────────────────────────────────
  TOTAL                             €25,600–€30,600

─────────────────────────────────────
```

**Styling:**
- Each row: label on left, value on right (flex, space-between)
- Base row: normal text
- Multiplier rows: slightly muted, value in a subtle warm/copper tone
- Backend row (if present): softer muted color to signal it's a partner cost, not George's rate
- TOTAL row: bolder, copper accent on the value, thin border-top above it to separate from the multipliers
- The whole block uses the same dark card aesthetic as the rest. No white. No flashy colors.

### Layer 3 - "What's Included" (already exists, stays below the breakdown)

No change here. Just moves down when the breakdown is expanded.

### Wide Range Prompt

If `wideRange === true`, show this BENEATH the cost and ABOVE the breakdown toggle:

```
That's a pretty wide range. Want to narrow it down?
[Refine Brief →]
```

Small text, muted. The button is subtle - not a full CTA, more like a nudge. Clicking it triggers the same refine flow as the existing Refine Estimate button.

---

## CHANGE 5: API Route Update

Update the POST handler to pass `deliverableType` through to the messages:

```typescript
export async function POST(req: Request) {
    try {
        const { userInput, previousInput, deliverableType } = await req.json();

        if (!userInput || userInput.length < 15) {
            return NextResponse.json({ error: "Input too short" }, { status: 400 });
        }

        const messages: any[] = [
            { role: "system", content: SYSTEM_PROMPT },
        ];

        if (previousInput) {
            messages.push({ role: "user", content: `Original idea: ${previousInput}` });
            messages.push({ role: "assistant", content: "I understand the original scope. What has changed?" });
        }

        // Build the user message with deliverable context
        let userMessage = userInput;
        if (deliverableType && deliverableType !== "not_sure") {
            const deliverableLabels: Record<string, string> = {
                design_only: "Design Only (no build, just design files for handoff)",
                design_prototype: "Design + Interactive Prototype (no backend)",
                full_build: "Full Build (design and code the product)",
                ai_integration: "AI Integration (includes AI/LLM feature development)"
            };
            userMessage = `[Deliverable type selected: ${deliverableLabels[deliverableType]}]\n\n${userInput}`;
        }

        messages.push({ role: "user", content: userMessage });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-2024-08-06",
            messages,
            response_format: RESPONSE_SCHEMA as any,
        });

        const result = response.choices[0].message.content;
        return NextResponse.json(JSON.parse(result || "{}"));
    } catch (error: any) {
        console.error("Estimation API Error:", error);

        if (error?.status === 401 || error?.message?.includes('apiKey')) {
            return NextResponse.json(
                { error: true, message: "OpenAI API Key is missing or invalid. Please check your .env file." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: true, message: error?.message || "Something went wrong. Try again or contact me directly." },
            { status: 500 }
        );
    }
}
```

---

## SUMMARY OF CHANGES

| File | What Changes |
|------|-------------|
| `components/ProjectEstimator.tsx` | Add pill buttons above textarea. Add progressive reveal (expandable breakdown) to results card. Add wide range nudge. Wire `deliverableType` state to API call. |
| `api/estimate.js` | Add `deliverableType` to request parsing. Prepend deliverable context to user message. |
| `SYSTEM_PROMPT` constant | Full replacement (see Change 2 above). |
| `RESPONSE_SCHEMA` constant | Full replacement (see Change 3 above). |

Nothing else changes. Hero layout, contact form pre-fill, loading states, edge case handling, styling foundation - all stays.

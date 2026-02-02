import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { saveLead, Lead } from '@/lib/leads-db';
import { randomUUID } from 'crypto';

const SYSTEM_PROMPT = `You are a Senior Product Design Partner for George Efesopoulos. You don't just "estimate" costs; you provide strategic product roadmaps and UX expertise.

Your goal is to turn the user's idea into a viable execution plan ("The Path").

---

### 1. YOUR PERSONA
- You are an expert Product Strategist & Designer.
- you focus on VALUE, UX, and SCALABILITY.
- You do NOT talk about "cost drivers" or "multipliers" in the public text.
- You DO calculate cost strictly internally to give George a lead score and estimated range.

---

### 2. DELIVERABLE TYPES (Internal Costing use only)
- design_only: -30% cost.
- design_prototype: Base price.
- full_build: +40% cost.
- ai_integration: +35% cost.

### 3. COST & TIMELINE LOGIC (Internal)
TIER 1 — MICRO (€500–€2,500 | 2d–1w)
• Single screens, audits, simple tweaks.

TIER 2 — SMALL (€2,500–€5,000 | 1w–3w)
• Landing pages, marketing sites, small design systems.

TIER 3 — MEDIUM (€5,000–€12,500 | 3w–8w)
• MVP Prototypes, SaaS Dashboards (5-10 screens), Mobile App Design.

TIER 4 — LARGE (€12,500–€50,000 | 4w–16w)
• Full SaaS Builds, Complex Fintech, Enterprise Dashboards.

---

### 4. OUTPUT SECTIONS

**A) CONSIDERATIONS (Strategy Focus)**
- Do NOT mention price, multipliers, or "this adds cost".
- Talk about **Product Strategy**: "To make this marketplace work, trust is key..."
- Talk about **UX Challenges**: "Onboarding will be critical here..."
- Talk about **Tech/Scale**: "For real-time features, we'll need..."

**B) BREAKDOWN (The Roadmap)**
- NOT a cost receipt.
- A list of **Execution Phases**.
- Label: Phase Name (e.g., "01. Strategy & Discovery").
- Value: Duration/Outcome (e.g., "1 Week").

**C) GAP ANALYSIS (Risk Detector)**
- Identify ONE critical thing they forgot.
- Example: "You mentioned a marketplace but not an Admin Panel/Moderation tool."
- Use this to show expertise.

**D) LEAD SCORING (Internal 0-10)**
- Score the lead based on:
  - Clarity (Did they write a coherent brief?)
  - Realism (Does the idea match the complexity?)
  - Budget Signals (Enterprise/Funded = High, "Cheap"/"Student" = Low)
- **Score 9-10**: Funded, Clear, High Value.
- **Score 7-8**: Good viable project.
- **Score 4-6**: Vague or small budget.
- **Score 0-3**: Spam or unrealistic.
- *Reasoning*: Brief 1-sentence explanation for George.

---

### 5. OTHER RULES
- **Backend Flag:** If they need a Full Build or complex backend (Auth, data, payments), set \`requiresBackend: true\`.
- **Status:** 'estimate' (default), 'too_complex' (>50k), 'out_of_scope' (Logo, SEO, Physical goods), 'needs_clarification' (gibberish).

---

### JSON OUTPUT SCHEMA
Force strict JSON.
`;

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
          enum: ["estimate", "too_complex", "out_of_scope", "needs_clarification"]
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
        clarifyingQuestions: { type: ["array", "null"], items: { type: "string" } },
        outOfScopeMessage: { type: ["string", "null"] },
        requiresBackend: { type: "boolean" },
        // New CRM Fields
        leadScore: { type: "number" },
        leadScoreReasoning: { type: "string" },
        gapAnalysis: { type: "string" }
      },
      required: [
        "status", "projectType", "timeline", "cost",
        "whatsIncluded", "considerations", "breakdown",
        "wideRange", "deliverableNote", "clarifyingQuestions",
        "outOfScopeMessage", "requiresBackend",
        "leadScore", "leadScoreReasoning", "gapAnalysis"
      ],
      additionalProperties: false
    }
  }
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: true, message: "OpenAI API Key is missing." },
        { status: 401 }
      );
    }

    const { userInput, previousInput, deliverableType } = await req.json();

    if (!userInput || userInput.length < 15) {
      return NextResponse.json({ error: "Input too short" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `CONTEXT: User input regarding their project idea.\n\nINPUT: ${userInput}` }
    ];

    if (previousInput) {
      // If refining, add history
      messages.splice(1, 1); // Remove simple user input
      messages.push({ role: "user", content: `Original idea: ${previousInput}` });
      messages.push({ role: "assistant", content: "I understand. What detail has changed?" });
      messages.push({ role: "user", content: `Update: ${userInput}` });
    }

    // Handle Deliverable types text injection
    const deliverableLabels: Record<string, string> = {
      design_only: "Design Only (no build, just design files for handoff)",
      design_prototype: "Design + Interactive Prototype (no backend)",
      full_build: "Full Build (design and code the product)",
      ai_integration: "AI Integration (includes AI/LLM feature development)",
      not_sure: "Not Sure"
    };
    const types = Array.isArray(deliverableType) ? deliverableType : (deliverableType ? [deliverableType] : []);
    const selected = types.filter((t: string) => t && t !== "not_sure").map((t: string) => deliverableLabels[t] || t);
    if (selected.length > 0) {
      const lastMsg = messages[messages.length - 1];
      lastMsg.content = `[Delivierable Pref: ${selected.join(", ")}]\n\n${lastMsg.content}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages,
      response_format: RESPONSE_SCHEMA as any,
    });

    const content = response.choices[0].message.content;
    const result = JSON.parse(content || "{}");

    // --- CRM: CAPTURE SOFT LEAD ---
    const leadId = randomUUID();
    const lead: Lead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      source: 'estimator',
      status: 'anonymous',
      leadScore: result.leadScore || 0,
      leadScoreReasoning: result.leadScoreReasoning || '',
      gapAnalysis: result.gapAnalysis || '',
      initialBrief: userInput,
      estimateCostLow: result.cost?.low,
      estimateCostHigh: result.cost?.high,
      timeline: result.timeline ? `${result.timeline.low}–${result.timeline.high}` : undefined,
      projectType: result.projectType
    };

    // Fire and forget save (don't block response too much, but for local FS it's fast enough to await)
    try {
      await saveLead(lead);
    } catch (dbError) {
      console.error('Failed to save lead:', dbError);
      // Don't fail the request if DB logging fails
    }

    return NextResponse.json({ ...result, leadId });

  } catch (error: any) {
    console.error("Estimation API Error:", error);
    return NextResponse.json(
      { error: true, message: "Internal server error." },
      { status: 500 }
    );
  }
}

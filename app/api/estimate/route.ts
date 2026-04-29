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
- ai_integration: +10% cost.

---

### 3. PROJECT BREAKDOWN (The Roadmap)
**CRITICAL RULES FOR BREAKDOWN:**
1.  **Balanced Granularity**: Provide **3-5 high-level phases** (e.g., "01. Strategy & UX Structure", "02. High-Fidelity UI Design", "03. Interactive Prototyping"). Avoid over-complicating with too many steps.
2.  **Use Ranges**: The "Value" field for EACH step MUST be a time range (e.g., "1-2 Weeks", "3-5 Days"). Never provide a single fixed number.
3.  **No Cost in Breakdown**: Only mention durations or outcomes.

---

### 4. TIMELINE LOGIC (Summary)
**CRITICAL MATHEMATICAL CONSISTENCY:**
1.  Calculate the sum of all durations in the **Breakdown**.
2.  Add a **15% Strategic Buffer** to that sum to account for revisions/backlogs.
3.  Use this buffered total as the final **timeline** object (low/high).
4.  **CONSISTENCY CHECK**: If the breakdown steps add up to 4 weeks, the summary timeline MUST be roughly 4.5 weeks.

---

### 5. COST LOGIC (Internal)
TIER 1 - MICRO (€500–€2,500 | 3d–1w)
• Single screens, audits, simple tweaks.

TIER 2 - SMALL (€2,500–€5,000 | 1w–4w)
• Landing pages, marketing sites, small design systems.

TIER 3 - MEDIUM (€5,000–€12,500 | 4w–12w)
• MVP Prototypes, SaaS Dashboards (5-10 screens), Mobile App Design.

TIER 4 - LARGE (€12,500–€50,000 | 8w–24w)
• Full SaaS Builds, Complex Fintech, Enterprise Dashboards.

---

### 6. OTHER RULES
- **Backend Flag:** If they need a Full Build or complex backend (Auth, data, payments), set \`requiresBackend: true\`.
- **Status:** 'estimate' (default), 'too_complex' (>50k), 'out_of_scope' (Logo, SEO, Physical goods), 'needs_clarification' (gibberish).

---

### 7. OUTPUT SECTIONS

**A) CONSIDERATIONS (Strategy Focus)**
- Talk about **Product Strategy**, **UX Challenges**, and **Tech/Scale**.
- Never mention price here.
- **FORMAT**: Provide 3-5 bullet points, separated by newlines. Do not use markdown headers, just bullet points (•).

**B) GAP ANALYSIS (Risk Detector)**
- Identify ONE critical think they forgot to show your expertise.

**C) LEAD SCORING (Internal 0-10)**
- Clear/Funded = High (9-10).
- Vague/Tiny = Low (0-3).

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

      // --- SHEET: CAPTURE ANONYMOUS "IDEA" ---
      const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
      const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

      if (webhookUrl) {
        const row: Record<string, unknown> = {
          timestamp: new Date().toISOString(),
          name: '', // Anonymous
          email: '', // Anonymous
          company: '',
          brief: userInput,
          estimateStatus: result.status,
          projectType: result.projectType,
          budgetRange: result.cost ? `${result.cost.currency}${result.cost.low} - ${result.cost.high}` : '',
          timeline: result.timeline ? `${result.timeline.low} – ${result.timeline.high}` : '',
          costLow: result.cost?.low ?? '',
          costHigh: result.cost?.high ?? '',
          currency: result.cost?.currency ?? '',
          whatsIncluded: (result.whatsIncluded || []).join(' | '),
          considerations: (result.considerations || '').trim(),
          source: 'estimator (anonymous_idea)', // Distinct source
          leadScore: result.leadScore || '',
          gapAnalysis: result.gapAnalysis || '',
          id: leadId
        };
        if (webhookSecret) row._secret = webhookSecret;

        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(row)
        }).catch(e => console.warn('Anonymous Sheet sync error:', e));
      }

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

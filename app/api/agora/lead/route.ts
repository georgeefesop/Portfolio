/**
 * Lead-capture endpoint for the agora (kitchens.efesop.com) funnel.
 * POST /api/agora/lead
 *
 * Accepts a form submission, upserts a Lead in Supabase (dedup by email),
 * logs a `form_submitted` activity, fires a notification email to George,
 * and an auto-reply to the lead.
 *
 * Fails open on missing Resend key (logs instead of erroring) so the funnel
 * works even before email is fully wired.
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  insertLead,
  findLeadByEmail,
  logActivity,
} from "@/lib/agora/crm";
import type { LeadSource } from "@/lib/agora/types";

interface LeadFormPayload {
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  website_url?: string;
  city?: string;
  source?: LeadSource;
  source_detail?: string;
  message?: string;
}

function isValidPayload(input: unknown): input is LeadFormPayload {
  if (typeof input !== "object" || input === null) return false;
  const obj = input as Record<string, unknown>;
  if (typeof obj.business_name !== "string" || obj.business_name.trim().length === 0) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isValidPayload(payload)) {
    return NextResponse.json(
      { error: "business_name is required" },
      { status: 400 }
    );
  }

  const {
    business_name,
    contact_name,
    email,
    phone,
    whatsapp,
    website_url,
    city,
    source = "inbound_form",
    source_detail,
    message,
  } = payload;

  // Dedup by email when one is provided.
  let lead = email ? await findLeadByEmail(email) : null;

  if (!lead) {
    lead = await insertLead({
      business_name: business_name.trim(),
      contact_name: contact_name?.trim() ?? null,
      email: email?.trim().toLowerCase() ?? null,
      phone: phone?.trim() ?? null,
      whatsapp: whatsapp?.trim() ?? null,
      website_url: website_url?.trim() ?? null,
      city: city?.trim() ?? null,
      source,
      source_detail: source_detail ?? null,
      notes: message?.trim() ?? null,
    });
  }

  await logActivity({
    lead_id: lead.id,
    type: "form_submitted",
    direction: "inbound",
    subject: "Lead form on kitchens.efesop.com",
    body: message ?? null,
    metadata: { payload },
  });

  // Fire-and-forget email. Don't block the response on Resend.
  void notifyByEmail({
    business_name,
    contact_name,
    email,
    phone,
    website_url,
    city,
    message,
    leadId: lead.id,
  });

  return NextResponse.json({ ok: true, lead_id: lead.id });
}

async function notifyByEmail(input: {
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  website_url?: string;
  city?: string;
  message?: string;
  leadId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AGORA_LEAD_FROM_EMAIL;
  const to = process.env.AGORA_LEAD_TO_EMAIL;

  if (!apiKey || !from || !to) {
    console.log("[agora/lead] Resend not configured, skipping email", { leadId: input.leadId });
    return;
  }

  const resend = new Resend(apiKey);

  try {
    // 1) Notify George
    await resend.emails.send({
      from,
      to,
      subject: `New kitchens.efesop.com lead: ${input.business_name}`,
      text: [
        `Business: ${input.business_name}`,
        input.contact_name ? `Contact:  ${input.contact_name}` : null,
        input.email ? `Email:    ${input.email}` : null,
        input.phone ? `Phone:    ${input.phone}` : null,
        input.city ? `City:     ${input.city}` : null,
        input.website_url ? `Site:     ${input.website_url}` : null,
        "",
        input.message ? `Message:\n${input.message}` : null,
        "",
        `Lead ID: ${input.leadId}`,
        `Dashboard: https://supabase.com/dashboard/project/hwbkggrtvbjhqvogkcpn/editor`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    // 2) Auto-reply to lead (if email provided)
    if (input.email) {
      await resend.emails.send({
        from,
        to: input.email,
        subject: `Got it ${input.contact_name ?? ""}- working on your demo`.trim(),
        text: [
          `Hi ${input.contact_name ?? "there"},`,
          "",
          "Thanks for the request. I'm building a custom version of the kitchen site for " + input.business_name + " and will send the URL within 24 hours.",
          "",
          "If urgent, WhatsApp me directly: +357 99 000 000",
          "",
          "George",
        ].join("\n"),
      });
    }
  } catch (err) {
    console.error("[agora/lead] Resend send failed", err);
  }
}

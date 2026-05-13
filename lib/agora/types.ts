/**
 * Types matching the agora-crm Supabase schema (project: hwbkggrtvbjhqvogkcpn).
 * Migration: init_crm_schema (2026-05-11).
 *
 * If you change these, also change the migration. Tests live in
 * scripts/agora/verify-schema-types.ts.
 */

export type LeadSource =
  | "cold_outreach"
  | "inbound_form"
  | "referral"
  | "paid_ad"
  | "other";

export type DealStage =
  | "new"
  | "demo_sent"
  | "opened"
  | "replied"
  | "in_conversation"
  | "quote_sent"
  | "won_buy"
  | "won_rent"
  | "won_care"
  | "lost_no_reply"
  | "lost_explicit"
  | "lost_other";

export type TierOffered = "buy" | "rent" | "care" | "custom";

export type ActivityType =
  | "email_sent"
  | "email_opened"
  | "email_clicked"
  | "email_replied"
  | "whatsapp_sent"
  | "whatsapp_replied"
  | "demo_viewed"
  | "demo_generated"
  | "form_submitted"
  | "stripe_checkout_started"
  | "stripe_payment_succeeded"
  | "stripe_payment_failed"
  | "stripe_subscription_created"
  | "stripe_subscription_canceled"
  | "note"
  | "manual";

export type ActivityDirection = "outbound" | "inbound" | "system";

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;

  business_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  website_url: string | null;

  city: string | null;
  country: string | null;

  source: LeadSource;
  source_detail: string | null;

  rubric_score: number | null;
  rubric_data: Record<string, unknown> | null;

  demo_url: string | null;
  demo_generated_at: string | null;

  notes: string | null;
  tags: string[];
}

export interface Deal {
  id: string;
  created_at: string;
  updated_at: string;

  lead_id: string;

  stage: DealStage;
  stage_changed_at: string;

  tier_offered: TierOffered | null;
  amount_eur: number | null;

  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;

  closed_at: string | null;
  next_followup_at: string | null;

  notes: string | null;
}

export interface Activity {
  id: string;
  created_at: string;

  lead_id: string;
  deal_id: string | null;

  type: ActivityType;
  direction: ActivityDirection | null;

  subject: string | null;
  body: string | null;
  metadata: Record<string, unknown>;
}

/**
 * Convenience input types for insertions - only require the fields that
 * don't have a default in the DB.
 */
export type NewLead = Pick<Lead, "business_name" | "source"> &
  Partial<Omit<Lead, "id" | "created_at" | "updated_at" | "business_name" | "source">>;

export type NewDeal = Pick<Deal, "lead_id"> &
  Partial<Omit<Deal, "id" | "created_at" | "updated_at" | "stage_changed_at" | "lead_id">>;

export type NewActivity = Pick<Activity, "lead_id" | "type"> &
  Partial<Omit<Activity, "id" | "created_at" | "lead_id" | "type">>;

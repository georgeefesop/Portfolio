/**
 * High-level CRM helpers for inserting/updating leads/deals/activities.
 * Keep this thin - write specialized logic in the API route that calls it.
 *
 * All functions assume server-side context (uses service_role client).
 */

import "server-only";
import { getAgoraSupabase } from "./supabase";
import type { Lead, Deal, Activity, NewLead, NewDeal, NewActivity } from "./types";

export async function insertLead(input: NewLead): Promise<Lead> {
  const supabase = getAgoraSupabase();
  const { data, error } = await supabase
    .from("leads")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(`insertLead failed: ${error.message}`);
  return data as Lead;
}

export async function findLeadByEmail(email: string): Promise<Lead | null> {
  const supabase = getAgoraSupabase();
  const { data, error } = await supabase
    .from("leads")
    .select()
    .ilike("email", email)
    .maybeSingle();
  if (error) throw new Error(`findLeadByEmail failed: ${error.message}`);
  return (data as Lead) ?? null;
}

export async function insertDeal(input: NewDeal): Promise<Deal> {
  const supabase = getAgoraSupabase();
  const { data, error } = await supabase
    .from("deals")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(`insertDeal failed: ${error.message}`);
  return data as Deal;
}

export async function findDealByStripeSession(
  sessionId: string
): Promise<Deal | null> {
  const supabase = getAgoraSupabase();
  const { data, error } = await supabase
    .from("deals")
    .select()
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();
  if (error) throw new Error(`findDealByStripeSession failed: ${error.message}`);
  return (data as Deal) ?? null;
}

export async function updateDeal(
  id: string,
  patch: Partial<Omit<Deal, "id" | "created_at" | "updated_at">>
): Promise<Deal> {
  const supabase = getAgoraSupabase();
  const { data, error } = await supabase
    .from("deals")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`updateDeal failed: ${error.message}`);
  return data as Deal;
}

export async function logActivity(input: NewActivity): Promise<Activity> {
  const supabase = getAgoraSupabase();
  const { data, error } = await supabase
    .from("activities")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(`logActivity failed: ${error.message}`);
  return data as Activity;
}

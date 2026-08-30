import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createDoeDtcToken, isTokenExpired, onboardingTokenExpiresAt } from "@/lib/doedtc/doedtc-tokens";
import type {
  DoeDtcAssessmentResult,
  DoeDtcAssessmentRow,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";

export async function getDoeDtcUserByPhone(phone: string): Promise<DoeDtcUserRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("doedtc_users").select("*").eq("phone", phone).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DoeDtcUserRow | null) ?? null;
}

export async function getDoeDtcUserByOnboardingToken(token: string): Promise<DoeDtcUserRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_users")
    .select("*")
    .eq("onboarding_token", token)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DoeDtcUserRow | null) ?? null;
}

export async function getDoeDtcUserByCareToken(token: string): Promise<DoeDtcUserRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_users")
    .select("*")
    .eq("care_token", token)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DoeDtcUserRow | null) ?? null;
}

export async function upsertInvitedDoeDtcUser(phone: string): Promise<DoeDtcUserRow> {
  const supabase = createSupabaseAdmin();
  const existing = await getDoeDtcUserByPhone(phone);
  if (existing) {
    if (existing.status === "opted_out") {
      throw new Error("This number has opted out of Doe messages.");
    }
    return existing;
  }

  const careToken = createDoeDtcToken();
  const { data, error } = await supabase
    .from("doedtc_users")
    .insert({
      phone,
      status: "invited",
      care_token: careToken,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as DoeDtcUserRow;
}

export async function beginDoeDtcOnboarding(params: {
  phone: string;
  chatId?: string | null;
  fromNumber?: string | null;
}): Promise<DoeDtcUserRow> {
  const supabase = createSupabaseAdmin();
  const existing = await getDoeDtcUserByPhone(params.phone);
  const onboardingToken = createDoeDtcToken();
  const expiresAt = onboardingTokenExpiresAt();

  if (existing) {
    if (existing.status === "opted_out") {
      throw new Error("This number has opted out of Doe messages.");
    }
    const { data, error } = await supabase
      .from("doedtc_users")
      .update({
        status: "onboarding",
        onboarding_token: onboardingToken,
        onboarding_token_expires_at: expiresAt,
        linq_chat_id: params.chatId ?? existing.linq_chat_id,
        linq_from_number: params.fromNumber ?? existing.linq_from_number,
      })
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as DoeDtcUserRow;
  }

  const { data, error } = await supabase
    .from("doedtc_users")
    .insert({
      phone: params.phone,
      status: "onboarding",
      onboarding_token: onboardingToken,
      onboarding_token_expires_at: expiresAt,
      care_token: createDoeDtcToken(),
      linq_chat_id: params.chatId ?? null,
      linq_from_number: params.fromNumber ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcUserRow;
}

export async function updateDoeDtcUserChat(params: {
  userId: string;
  chatId?: string | null;
  fromNumber?: string | null;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const patch: Record<string, string | null> = {};
  if (params.chatId) patch.linq_chat_id = params.chatId;
  if (params.fromNumber) patch.linq_from_number = params.fromNumber;
  if (Object.keys(patch).length === 0) return;

  const { error } = await supabase.from("doedtc_users").update(patch).eq("id", params.userId);
  if (error) throw new Error(error.message);
}

export async function markDoeDtcUserPendingConfirm(params: {
  userId: string;
  chatId?: string | null;
  fromNumber?: string | null;
}): Promise<DoeDtcUserRow> {
  const supabase = createSupabaseAdmin();
  const patch: Record<string, string> = { status: "pending_confirm" };
  if (params.chatId) patch.linq_chat_id = params.chatId;
  if (params.fromNumber) patch.linq_from_number = params.fromNumber;

  const { data, error } = await supabase
    .from("doedtc_users")
    .update(patch)
    .eq("id", params.userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcUserRow;
}

export async function ensureDoeDtcUserForInbound(params: {
  phone: string;
  chatId?: string | null;
  fromNumber?: string | null;
}): Promise<DoeDtcUserRow> {
  const existing = await getDoeDtcUserByPhone(params.phone);
  if (existing) {
    if (existing.status === "opted_out") {
      throw new Error("This number has opted out of Doe messages.");
    }
    await updateDoeDtcUserChat({
      userId: existing.id,
      chatId: params.chatId,
      fromNumber: params.fromNumber,
    });
    return (await getDoeDtcUserByPhone(params.phone)) ?? existing;
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_users")
    .insert({
      phone: params.phone,
      status: "invited",
      care_token: createDoeDtcToken(),
      linq_chat_id: params.chatId ?? null,
      linq_from_number: params.fromNumber ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcUserRow;
}

export async function markDoeDtcUserOptedOut(phone: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_users")
    .update({ status: "opted_out" })
    .eq("phone", phone);
  if (error) throw new Error(error.message);
}

export async function logDoeDtcMessage(params: {
  userId?: string | null;
  direction: "inbound" | "outbound";
  body: string;
  linqMessageId?: string | null;
  webhookEventId?: string | null;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("doedtc_messages").insert({
    user_id: params.userId ?? null,
    direction: params.direction,
    body: params.body,
    linq_message_id: params.linqMessageId ?? null,
    webhook_event_id: params.webhookEventId ?? null,
  });
  if (error && !error.message.includes("duplicate key")) {
    throw new Error(error.message);
  }
}

export async function saveDoeDtcOnboarding(params: {
  token: string;
  fullName: string;
  email: string;
  medications: string[];
  conditions: string[];
  whyDoe: string;
}): Promise<DoeDtcUserRow> {
  const user = await getDoeDtcUserByOnboardingToken(params.token);
  if (!user || isTokenExpired(user.onboarding_token_expires_at)) {
    throw new Error("This Get Started link is invalid or expired.");
  }

  const supabase = createSupabaseAdmin();
  const { data: updated, error } = await supabase
    .from("doedtc_users")
    .update({
      full_name: params.fullName,
      email: params.email,
      why_doe: params.whyDoe,
      status: "active",
      onboarding_token: null,
      onboarding_token_expires_at: null,
    })
    .eq("id", user.id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  await supabase.from("doedtc_medications").delete().eq("user_id", user.id);
  await supabase.from("doedtc_conditions").delete().eq("user_id", user.id);

  const meds = params.medications.map((name) => ({ user_id: user.id, name }));
  const conditions = params.conditions.map((name) => ({ user_id: user.id, name }));

  if (meds.length > 0) {
    const { error: medsError } = await supabase.from("doedtc_medications").insert(meds);
    if (medsError) throw new Error(medsError.message);
  }
  if (conditions.length > 0) {
    const { error: conditionsError } = await supabase.from("doedtc_conditions").insert(conditions);
    if (conditionsError) throw new Error(conditionsError.message);
  }

  return updated as DoeDtcUserRow;
}

export async function getLatestDoeDtcAssessment(userId: string): Promise<DoeDtcAssessmentRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_assessments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DoeDtcAssessmentRow | null) ?? null;
}

export async function getDoeDtcProfileLists(userId: string): Promise<{
  medications: string[];
  conditions: string[];
}> {
  const supabase = createSupabaseAdmin();
  const [{ data: meds }, { data: conditions }] = await Promise.all([
    supabase.from("doedtc_medications").select("name").eq("user_id", userId),
    supabase.from("doedtc_conditions").select("name").eq("user_id", userId),
  ]);

  return {
    medications: (meds ?? []).map((row) => row.name as string),
    conditions: (conditions ?? []).map((row) => row.name as string),
  };
}

export async function saveDoeDtcAssessment(params: {
  userId: string;
  symptomsText: string;
  result: DoeDtcAssessmentResult;
}): Promise<DoeDtcAssessmentRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_assessments")
    .insert({
      user_id: params.userId,
      symptoms_text: params.symptomsText,
      result: params.result,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcAssessmentRow;
}

export function isValidOnboardingUser(user: DoeDtcUserRow | null): user is DoeDtcUserRow {
  return Boolean(user && !isTokenExpired(user.onboarding_token_expires_at));
}

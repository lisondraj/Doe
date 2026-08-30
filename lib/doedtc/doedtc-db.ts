import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { encryptDoeDtcSecret } from "@/lib/doedtc/doedtc-crypto";
import {
  defaultArtifactFieldsForTitle,
  normalizeArtifactConfig,
  normalizeArtifactFields,
  normalizeArtifactKind,
  normalizeArtifactValues,
  slugifyArtifactTitle,
} from "@/lib/doedtc/doedtc-artifacts";
import { createDoeDtcToken, isTokenExpired, onboardingTokenExpiresAt } from "@/lib/doedtc/doedtc-tokens";
import type {
  DoeDtcArtifactEntryRow,
  DoeDtcArtifactKind,
  DoeDtcArtifactRow,
  DoeDtcAssessmentResult,
  DoeDtcAssessmentRow,
  DoeDtcAppointmentRow,
  DoeDtcFamilyMemberInput,
  DoeDtcFamilyMemberRow,
  DoeDtcHealthConnectionRow,
  DoeDtcHealthProvider,
  DoeDtcListenSessionRow,
  DoeDtcLockerItemRow,
  DoeDtcMemoryRow,
  DoeDtcMessageRow,
  DoeDtcProfileSnapshot,
  DoeDtcResultRow,
  DoeDtcShareCodeRow,
  DoeDtcSymptomRow,
  DoeDtcSymptomSeverity,
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
    if (existing.status === "pending_confirm" || existing.status === "active") {
      throw new Error("This number already finished Get Started. Type CONFIRM in iMessage if needed.");
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
  familyMembers?: DoeDtcFamilyMemberInput[];
  medicalDeferred?: boolean;
}): Promise<DoeDtcUserRow> {
  const user = await getDoeDtcUserByOnboardingToken(params.token);
  if (!user || user.status !== "onboarding" || isTokenExpired(user.onboarding_token_expires_at)) {
    throw new Error("This Get Started link is invalid or expired.");
  }

  const medicalDeferred = Boolean(params.medicalDeferred);
  const supabase = createSupabaseAdmin();
  const { data: updated, error } = await supabase
    .from("doedtc_users")
    .update({
      full_name: params.fullName,
      email: params.email,
      why_doe: params.whyDoe,
      medical_deferred: medicalDeferred,
      status: "pending_confirm",
      onboarding_token: null,
      onboarding_token_expires_at: null,
    })
    .eq("id", user.id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  await supabase.from("doedtc_medications").delete().eq("user_id", user.id);
  await supabase.from("doedtc_conditions").delete().eq("user_id", user.id);
  await supabase.from("doedtc_family_members").delete().eq("user_id", user.id);

  if (!medicalDeferred) {
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
  }

  const familyRows = (params.familyMembers ?? [])
    .filter((member) => member.fullName.trim())
    .slice(0, 20)
    .map((member) => ({
      user_id: user.id,
      full_name: member.fullName.trim(),
      relationship: member.relationship,
      phone: member.phone?.trim() || null,
    }));

  if (familyRows.length > 0) {
    const { error: familyError } = await supabase.from("doedtc_family_members").insert(familyRows);
    if (familyError) throw new Error(familyError.message);
  }

  return updated as DoeDtcUserRow;
}

export async function activateDoeDtcUser(userId: string): Promise<DoeDtcUserRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_users")
    .update({ status: "active" })
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcUserRow;
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

function uniqueProfileNames(names: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const raw of names) {
    const name = raw.trim();
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    unique.push(name);
  }
  return unique;
}

export async function getDoeDtcProfileLists(userId: string): Promise<{
  medications: string[];
  conditions: string[];
}> {
  const supabase = createSupabaseAdmin();
  const [{ data: meds, error: medsError }, { data: conditions, error: conditionsError }] =
    await Promise.all([
      supabase.from("doedtc_medications").select("name").eq("user_id", userId).order("created_at"),
      supabase.from("doedtc_conditions").select("name").eq("user_id", userId).order("created_at"),
    ]);
  if (medsError) throw new Error(medsError.message);
  if (conditionsError) throw new Error(conditionsError.message);

  return {
    medications: uniqueProfileNames((meds ?? []).map((row) => row.name as string)),
    conditions: uniqueProfileNames((conditions ?? []).map((row) => row.name as string)),
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
  return Boolean(
    user &&
      user.status === "onboarding" &&
      !isTokenExpired(user.onboarding_token_expires_at),
  );
}

export async function listDoeDtcMessages(
  userId: string,
  limit = 20,
): Promise<DoeDtcMessageRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return ((data as DoeDtcMessageRow[]) ?? []).reverse();
}

export async function listDoeDtcAssessments(
  userId: string,
  limit = 3,
): Promise<DoeDtcAssessmentRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_assessments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data as DoeDtcAssessmentRow[]) ?? [];
}

export async function listDoeDtcSymptoms(
  userId: string,
  limit = 10,
): Promise<DoeDtcSymptomRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_symptoms")
    .select("*")
    .eq("user_id", userId)
    .order("reported_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data as DoeDtcSymptomRow[]) ?? [];
}

export async function insertDoeDtcSymptom(params: {
  userId: string;
  rawText: string;
  summary?: string | null;
  severity?: DoeDtcSymptomSeverity;
  onset?: string | null;
  tags?: string[];
}): Promise<DoeDtcSymptomRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_symptoms")
    .insert({
      user_id: params.userId,
      raw_text: params.rawText,
      summary: params.summary ?? null,
      severity: params.severity ?? "unknown",
      onset: params.onset ?? null,
      tags: params.tags ?? [],
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcSymptomRow;
}

export async function linkDoeDtcSymptomToAssessment(params: {
  symptomId: string;
  assessmentId: string;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_symptoms")
    .update({ assessment_id: params.assessmentId })
    .eq("id", params.symptomId);
  if (error) throw new Error(error.message);
}

function randomDoeDtcShareCodeValue(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `DOE-${suffix}`;
}

export async function getDoeDtcProfileSnapshot(userId: string): Promise<DoeDtcProfileSnapshot> {
  const supabase = createSupabaseAdmin();
  const [
    userResult,
    profileLists,
    familyMembers,
    appointments,
    listenSessions,
    results,
    lockerItems,
    healthConnections,
    shareCodes,
    symptoms,
    assessments,
    artifacts,
    artifactEntries,
  ] = await Promise.all([
    supabase
      .from("doedtc_users")
      .select("id, full_name, email, why_doe, medical_deferred, care_token")
      .eq("id", userId)
      .single(),
    getDoeDtcProfileLists(userId),
    supabase.from("doedtc_family_members").select("*").eq("user_id", userId).order("created_at"),
    supabase.from("doedtc_appointments").select("*").eq("user_id", userId).order("starts_at"),
    supabase
      .from("doedtc_listen_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("doedtc_results").select("*").eq("user_id", userId).order("resulted_at", { ascending: false }),
    supabase
      .from("doedtc_locker_items")
      .select("id, user_id, label, username, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("doedtc_health_connections").select("*").eq("user_id", userId),
    supabase
      .from("doedtc_share_codes")
      .select("*")
      .eq("user_id", userId)
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false }),
    listDoeDtcSymptoms(userId, 8),
    listDoeDtcAssessments(userId, 3),
    listDoeDtcArtifacts(userId),
    listDoeDtcArtifactEntriesForUser(userId, 120),
  ]);

  if (userResult.error) throw new Error(userResult.error.message);

  return {
    user: userResult.data as DoeDtcProfileSnapshot["user"],
    medications: profileLists.medications,
    conditions: profileLists.conditions,
    familyMembers: (familyMembers.data as DoeDtcFamilyMemberRow[]) ?? [],
    appointments: (appointments.data as DoeDtcAppointmentRow[]) ?? [],
    listenSessions: (listenSessions.data as DoeDtcListenSessionRow[]) ?? [],
    results: (results.data as DoeDtcResultRow[]) ?? [],
    lockerItems: (lockerItems.data as DoeDtcLockerItemRow[]) ?? [],
    healthConnections: (healthConnections.data as DoeDtcHealthConnectionRow[]) ?? [],
    shareCodes: (shareCodes.data as DoeDtcShareCodeRow[]) ?? [],
    symptoms,
    assessments,
    artifacts,
    artifactEntries,
  };
}

function mapArtifactRow(row: Record<string, unknown>): DoeDtcArtifactRow {
  return {
    ...(row as DoeDtcArtifactRow),
    config: normalizeArtifactConfig(row.config),
  };
}

function mapArtifactEntryRow(row: Record<string, unknown>): DoeDtcArtifactEntryRow {
  const values = row.values;
  return {
    ...(row as DoeDtcArtifactEntryRow),
    values:
      values && typeof values === "object" && !Array.isArray(values)
        ? (values as Record<string, string | number | boolean>)
        : {},
  };
}

async function uniqueArtifactSlug(userId: string, title: string): Promise<string> {
  const base = slugifyArtifactTitle(title);
  const supabase = createSupabaseAdmin();
  let slug = base;
  let suffix = 2;

  while (true) {
    const { data, error } = await supabase
      .from("doedtc_artifacts")
      .select("id")
      .eq("user_id", userId)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function listDoeDtcArtifacts(userId: string): Promise<DoeDtcArtifactRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_artifacts")
    .select("*")
    .eq("user_id", userId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data as Record<string, unknown>[]) ?? []).map(mapArtifactRow);
}

export async function getDoeDtcArtifactById(params: {
  userId: string;
  artifactId: string;
}): Promise<DoeDtcArtifactRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_artifacts")
    .select("*")
    .eq("user_id", params.userId)
    .eq("id", params.artifactId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapArtifactRow(data as Record<string, unknown>) : null;
}

export async function findDoeDtcArtifactByTitle(params: {
  userId: string;
  title: string;
}): Promise<DoeDtcArtifactRow | null> {
  const title = params.title.trim();
  if (!title) return null;
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_artifacts")
    .select("*")
    .eq("user_id", params.userId)
    .is("archived_at", null)
    .ilike("title", title)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapArtifactRow(data as Record<string, unknown>) : null;
}

export async function createDoeDtcArtifact(params: {
  userId: string;
  title: string;
  kind?: DoeDtcArtifactKind;
  fields?: unknown;
}): Promise<DoeDtcArtifactRow> {
  const title = params.title.trim();
  if (!title) throw new Error("Tracker title is required.");
  const fields = normalizeArtifactFields(params.fields ?? defaultArtifactFieldsForTitle(title));
  const slug = await uniqueArtifactSlug(params.userId, title);
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_artifacts")
    .insert({
      user_id: params.userId,
      slug,
      title,
      kind: normalizeArtifactKind(params.kind),
      config: { fields },
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapArtifactRow(data as Record<string, unknown>);
}

export async function updateDoeDtcArtifact(params: {
  userId: string;
  artifactId: string;
  title?: string;
  kind?: DoeDtcArtifactKind;
  fields?: unknown;
}): Promise<DoeDtcArtifactRow> {
  const artifact = await getDoeDtcArtifactById({
    userId: params.userId,
    artifactId: params.artifactId,
  });
  if (!artifact) throw new Error("Tracker not found.");

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (typeof params.title === "string" && params.title.trim()) {
    patch.title = params.title.trim();
  }
  if (params.kind) {
    patch.kind = normalizeArtifactKind(params.kind);
  }
  if (params.fields !== undefined) {
    patch.config = { fields: normalizeArtifactFields(params.fields) };
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_artifacts")
    .update(patch)
    .eq("user_id", params.userId)
    .eq("id", params.artifactId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapArtifactRow(data as Record<string, unknown>);
}

export async function archiveDoeDtcArtifact(params: {
  userId: string;
  artifactId: string;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_artifacts")
    .update({
      archived_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", params.userId)
    .eq("id", params.artifactId);
  if (error) throw new Error(error.message);
}

export async function listDoeDtcArtifactEntries(params: {
  userId: string;
  artifactId: string;
  limit?: number;
}): Promise<DoeDtcArtifactEntryRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_artifact_entries")
    .select("*")
    .eq("user_id", params.userId)
    .eq("artifact_id", params.artifactId)
    .order("occurred_at", { ascending: false })
    .limit(params.limit ?? 50);
  if (error) throw new Error(error.message);
  return ((data as Record<string, unknown>[]) ?? []).map(mapArtifactEntryRow);
}

export async function listDoeDtcArtifactEntriesForUser(
  userId: string,
  limit = 120,
): Promise<DoeDtcArtifactEntryRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_artifact_entries")
    .select("*")
    .eq("user_id", userId)
    .order("occurred_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return ((data as Record<string, unknown>[]) ?? []).map(mapArtifactEntryRow);
}

export async function logDoeDtcArtifactEntry(params: {
  userId: string;
  artifactId: string;
  values?: unknown;
  occurredAt?: string | null;
}): Promise<DoeDtcArtifactEntryRow> {
  const artifact = await getDoeDtcArtifactById({
    userId: params.userId,
    artifactId: params.artifactId,
  });
  if (!artifact) throw new Error("Tracker not found.");
  if (artifact.archived_at) throw new Error("Tracker is archived.");

  const values = normalizeArtifactValues(artifact.config.fields, params.values ?? {});
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_artifact_entries")
    .insert({
      artifact_id: params.artifactId,
      user_id: params.userId,
      occurred_at: params.occurredAt ?? new Date().toISOString(),
      values,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapArtifactEntryRow(data as Record<string, unknown>);
}

export async function updateDoeDtcArtifactEntry(params: {
  userId: string;
  entryId: string;
  values?: unknown;
  occurredAt?: string | null;
}): Promise<DoeDtcArtifactEntryRow> {
  const supabase = createSupabaseAdmin();
  const { data: existing, error: existingError } = await supabase
    .from("doedtc_artifact_entries")
    .select("*")
    .eq("user_id", params.userId)
    .eq("id", params.entryId)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);
  if (!existing) throw new Error("Entry not found.");

  const artifact = await getDoeDtcArtifactById({
    userId: params.userId,
    artifactId: String(existing.artifact_id),
  });
  if (!artifact) throw new Error("Tracker not found.");

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (params.values !== undefined) {
    patch.values = normalizeArtifactValues(artifact.config.fields, params.values);
  }
  if (params.occurredAt) {
    patch.occurred_at = params.occurredAt;
  }

  const { data, error } = await supabase
    .from("doedtc_artifact_entries")
    .update(patch)
    .eq("user_id", params.userId)
    .eq("id", params.entryId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapArtifactEntryRow(data as Record<string, unknown>);
}

export async function removeDoeDtcArtifactEntry(params: {
  userId: string;
  entryId: string;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_artifact_entries")
    .delete()
    .eq("user_id", params.userId)
    .eq("id", params.entryId);
  if (error) throw new Error(error.message);
}

export async function addDoeDtcFamilyMember(params: {
  userId: string;
  fullName: string;
  relationship: DoeDtcFamilyMemberInput["relationship"];
  phone?: string | null;
}): Promise<DoeDtcFamilyMemberRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_family_members")
    .insert({
      user_id: params.userId,
      full_name: params.fullName.trim(),
      relationship: params.relationship,
      phone: params.phone?.trim() || null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcFamilyMemberRow;
}

export async function removeDoeDtcFamilyMember(params: {
  userId: string;
  memberId: string;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_family_members")
    .delete()
    .eq("user_id", params.userId)
    .eq("id", params.memberId);
  if (error) throw new Error(error.message);
}

export async function addDoeDtcAppointment(params: {
  userId: string;
  title: string;
  startsAt?: string | null;
  timingNote?: string | null;
  location?: string | null;
  notes?: string | null;
}): Promise<DoeDtcAppointmentRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_appointments")
    .insert({
      user_id: params.userId,
      title: params.title.trim(),
      starts_at: params.startsAt ?? null,
      timing_note: params.timingNote?.trim() || null,
      location: params.location?.trim() || null,
      notes: params.notes?.trim() || null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcAppointmentRow;
}

export async function removeDoeDtcAppointment(params: {
  userId: string;
  appointmentId: string;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_appointments")
    .delete()
    .eq("user_id", params.userId)
    .eq("id", params.appointmentId);
  if (error) throw new Error(error.message);
}

export async function addDoeDtcResult(params: {
  userId: string;
  title: string;
  resultedAt: string;
  source?: string | null;
  summary?: string | null;
}): Promise<DoeDtcResultRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_results")
    .insert({
      user_id: params.userId,
      title: params.title.trim(),
      resulted_at: params.resultedAt,
      source: params.source?.trim() || null,
      summary: params.summary?.trim() || null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcResultRow;
}

export async function removeDoeDtcResult(params: {
  userId: string;
  resultId: string;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_results")
    .delete()
    .eq("user_id", params.userId)
    .eq("id", params.resultId);
  if (error) throw new Error(error.message);
}

export async function addDoeDtcLockerItem(params: {
  userId: string;
  label: string;
  username: string;
  password: string;
}): Promise<DoeDtcLockerItemRow> {
  const encrypted = encryptDoeDtcSecret(params.password);
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_locker_items")
    .insert({
      user_id: params.userId,
      label: params.label.trim(),
      username: params.username.trim(),
      password_ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      key_version: encrypted.keyVersion,
    })
    .select("id, user_id, label, username, created_at")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcLockerItemRow;
}

export async function removeDoeDtcLockerItem(params: {
  userId: string;
  itemId: string;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_locker_items")
    .delete()
    .eq("user_id", params.userId)
    .eq("id", params.itemId);
  if (error) throw new Error(error.message);
}

export async function setDoeDtcHealthConnectionPending(params: {
  userId: string;
  provider: DoeDtcHealthProvider;
}): Promise<DoeDtcHealthConnectionRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_health_connections")
    .upsert(
      {
        user_id: params.userId,
        provider: params.provider,
        status: "pending",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" },
    )
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcHealthConnectionRow;
}

export async function generateDoeDtcShareCode(params: {
  userId: string;
  expiresInDays?: number;
}): Promise<DoeDtcShareCodeRow> {
  const supabase = createSupabaseAdmin();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (params.expiresInDays ?? 7));

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = randomDoeDtcShareCodeValue();
    const { data, error } = await supabase
      .from("doedtc_share_codes")
      .insert({
        user_id: params.userId,
        code,
        expires_at: expiresAt.toISOString(),
      })
      .select("*")
      .single();
    if (!error) return data as DoeDtcShareCodeRow;
    if (!error.message.includes("duplicate key")) throw new Error(error.message);
  }

  throw new Error("Unable to generate a share code. Try again.");
}

export async function revokeDoeDtcShareCode(params: {
  userId: string;
  shareCodeId: string;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_share_codes")
    .update({ revoked_at: new Date().toISOString() })
    .eq("user_id", params.userId)
    .eq("id", params.shareCodeId);
  if (error) throw new Error(error.message);
}

export async function appendDoeDtcMedication(params: {
  userId: string;
  name: string;
}): Promise<{ added: boolean; name: string }> {
  const name = params.name.trim();
  if (!name) throw new Error("Medication name is required.");

  const profile = await getDoeDtcProfileLists(params.userId);
  if (profile.medications.some((existing) => existing.toLowerCase() === name.toLowerCase())) {
    return { added: false, name };
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("doedtc_medications").insert({
    user_id: params.userId,
    name,
  });
  if (error) throw new Error(error.message);

  const { error: userError } = await supabase
    .from("doedtc_users")
    .update({ medical_deferred: false })
    .eq("id", params.userId);
  if (userError) throw new Error(userError.message);

  return { added: true, name };
}

export async function appendDoeDtcCondition(params: {
  userId: string;
  name: string;
}): Promise<{ added: boolean; name: string }> {
  const name = params.name.trim();
  if (!name) throw new Error("Condition name is required.");

  const profile = await getDoeDtcProfileLists(params.userId);
  if (profile.conditions.some((existing) => existing.toLowerCase() === name.toLowerCase())) {
    return { added: false, name };
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("doedtc_conditions").insert({
    user_id: params.userId,
    name,
  });
  if (error) throw new Error(error.message);

  const { error: userError } = await supabase
    .from("doedtc_users")
    .update({ medical_deferred: false })
    .eq("id", params.userId);
  if (userError) throw new Error(userError.message);

  return { added: true, name };
}

export async function removeDoeDtcMedication(params: {
  userId: string;
  name: string;
}): Promise<{ removed: boolean; name: string }> {
  const name = params.name.trim();
  if (!name) throw new Error("Medication name is required.");
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_medications")
    .delete()
    .eq("user_id", params.userId)
    .ilike("name", name)
    .select("name");
  if (error) throw new Error(error.message);
  return { removed: (data ?? []).length > 0, name };
}

export async function removeDoeDtcCondition(params: {
  userId: string;
  name: string;
}): Promise<{ removed: boolean; name: string }> {
  const name = params.name.trim();
  if (!name) throw new Error("Condition name is required.");
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_conditions")
    .delete()
    .eq("user_id", params.userId)
    .ilike("name", name)
    .select("name");
  if (error) throw new Error(error.message);
  return { removed: (data ?? []).length > 0, name };
}

export async function renameDoeDtcMedication(params: {
  userId: string;
  from: string;
  to: string;
}): Promise<{ updated: boolean; from: string; to: string }> {
  const from = params.from.trim();
  const to = params.to.trim();
  if (!from || !to) throw new Error("Both medication names are required.");
  await removeDoeDtcMedication({ userId: params.userId, name: from });
  const added = await appendDoeDtcMedication({ userId: params.userId, name: to });
  return { updated: true, from, to: added.name };
}

export async function renameDoeDtcCondition(params: {
  userId: string;
  from: string;
  to: string;
}): Promise<{ updated: boolean; from: string; to: string }> {
  const from = params.from.trim();
  const to = params.to.trim();
  if (!from || !to) throw new Error("Both condition names are required.");
  await removeDoeDtcCondition({ userId: params.userId, name: from });
  const added = await appendDoeDtcCondition({ userId: params.userId, name: to });
  return { updated: true, from, to: added.name };
}

export async function updateDoeDtcMedicalProfile(params: {
  userId: string;
  medications: string[];
  conditions: string[];
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  await supabase.from("doedtc_medications").delete().eq("user_id", params.userId);
  await supabase.from("doedtc_conditions").delete().eq("user_id", params.userId);

  const meds = params.medications.map((name) => ({ user_id: params.userId, name }));
  const conditions = params.conditions.map((name) => ({ user_id: params.userId, name }));

  if (meds.length > 0) {
    const { error } = await supabase.from("doedtc_medications").insert(meds);
    if (error) throw new Error(error.message);
  }
  if (conditions.length > 0) {
    const { error } = await supabase.from("doedtc_conditions").insert(conditions);
    if (error) throw new Error(error.message);
  }

  const { error: userError } = await supabase
    .from("doedtc_users")
    .update({ medical_deferred: false })
    .eq("id", params.userId);
  if (userError) throw new Error(userError.message);
}

export async function listDoeDtcAppointments(
  userId: string,
  limit = 8,
): Promise<DoeDtcAppointmentRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_appointments")
    .select("*")
    .eq("user_id", userId)
    .order("starts_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data as DoeDtcAppointmentRow[]) ?? [];
}

export async function listDoeDtcFamilyMembers(
  userId: string,
  limit = 12,
): Promise<DoeDtcFamilyMemberRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_family_members")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data as DoeDtcFamilyMemberRow[]) ?? [];
}

export async function listDoeDtcMemories(userId: string, limit = 20): Promise<DoeDtcMemoryRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_memories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data as DoeDtcMemoryRow[]) ?? [];
}

export async function insertDoeDtcMemory(params: {
  userId: string;
  fact: string;
  category?: string;
}): Promise<DoeDtcMemoryRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_memories")
    .insert({
      user_id: params.userId,
      fact: params.fact.trim(),
      category: params.category?.trim() || "general",
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcMemoryRow;
}

export async function createDoeDtcListenSession(params: {
  userId: string;
  appointmentId?: string | null;
}): Promise<DoeDtcListenSessionRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_listen_sessions")
    .insert({
      user_id: params.userId,
      appointment_id: params.appointmentId ?? null,
      status: "pending",
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcListenSessionRow;
}

export async function getDoeDtcListenSession(params: {
  sessionId: string;
  userId: string;
}): Promise<DoeDtcListenSessionRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_listen_sessions")
    .select("*")
    .eq("id", params.sessionId)
    .eq("user_id", params.userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DoeDtcListenSessionRow | null) ?? null;
}

export async function completeDoeDtcListenSession(params: {
  sessionId: string;
  userId: string;
  transcript: string;
  summary: string;
  durationSeconds: number;
  appointmentId?: string | null;
}): Promise<DoeDtcListenSessionRow> {
  const supabase = createSupabaseAdmin();
  const patch: Record<string, unknown> = {
    status: "completed",
    transcript: params.transcript,
    summary: params.summary,
    duration_seconds: params.durationSeconds,
    completed_at: new Date().toISOString(),
  };
  if (params.appointmentId) {
    patch.appointment_id = params.appointmentId;
  }

  const { data, error } = await supabase
    .from("doedtc_listen_sessions")
    .update(patch)
    .eq("id", params.sessionId)
    .eq("user_id", params.userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcListenSessionRow;
}

export async function failDoeDtcListenSession(params: {
  sessionId: string;
  userId: string;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_listen_sessions")
    .update({ status: "failed" })
    .eq("id", params.sessionId)
    .eq("user_id", params.userId);
  if (error) throw new Error(error.message);
}

export async function listDoeDtcListenSessions(
  userId: string,
  limit = 20,
): Promise<DoeDtcListenSessionRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_listen_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data as DoeDtcListenSessionRow[]) ?? [];
}

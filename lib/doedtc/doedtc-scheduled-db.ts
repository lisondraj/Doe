import { createSupabaseAdmin } from "@/lib/supabase/admin";
import {
  canEditMemberProfile,
  canViewMemberProfile,
  findHouseholdMemberByName,
  isHouseholdAdmin,
} from "@/lib/doedtc/doedtc-household";
import { normalizePhoneToE164 } from "@/lib/doedtc/doedtc-phone";
import {
  ensureFutureSendAt,
  normalizeScheduledTimezone,
  parseScheduledSendAt,
} from "@/lib/doedtc/doedtc-scheduled";
import { linqSendText } from "@/lib/doedtc/linq";
import type {
  DoeDtcHouseholdConsentRow,
  DoeDtcHouseholdMemberRow,
  DoeDtcHouseholdRow,
  DoeDtcScheduledTextRow,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";

async function loadHouseholdContextForUser(userId: string): Promise<{
  household: DoeDtcHouseholdRow;
  members: DoeDtcHouseholdMemberRow[];
  consents: DoeDtcHouseholdConsentRow[];
}> {
  const supabase = createSupabaseAdmin();
  const { data: memberRow } = await supabase
    .from("doedtc_household_members")
    .select("household_id")
    .eq("user_id", userId)
    .maybeSingle();
  let householdId = (memberRow as { household_id?: string } | null)?.household_id;
  if (!householdId) {
    const { data: owned } = await supabase
      .from("doedtc_households")
      .select("*")
      .eq("admin_user_id", userId)
      .maybeSingle();
    if (!owned) throw new Error("No household found.");
    householdId = (owned as DoeDtcHouseholdRow).id;
  }
  const [householdResult, membersResult, consentsResult] = await Promise.all([
    supabase.from("doedtc_households").select("*").eq("id", householdId).single(),
    supabase.from("doedtc_household_members").select("*").eq("household_id", householdId).order("created_at"),
    supabase.from("doedtc_household_consents").select("*").eq("household_id", householdId),
  ]);
  if (householdResult.error) throw new Error(householdResult.error.message);
  if (membersResult.error) throw new Error(membersResult.error.message);
  if (consentsResult.error) throw new Error(consentsResult.error.message);
  return {
    household: householdResult.data as DoeDtcHouseholdRow,
    members: (membersResult.data as DoeDtcHouseholdMemberRow[]) ?? [],
    consents: (consentsResult.data as DoeDtcHouseholdConsentRow[]) ?? [],
  };
}

export type ScheduledTextRecipient = {
  recipientUserId: string | null;
  recipientMemberId: string | null;
  recipientPhone: string;
  recipientName: string;
};

export async function resolveScheduledTextRecipient(params: {
  creator: DoeDtcUserRow;
  memberId?: string | null;
  memberName?: string | null;
}): Promise<ScheduledTextRecipient> {
  const memberId = params.memberId?.trim() ?? "";
  const memberName = params.memberName?.trim() ?? "";
  if (!memberId && !memberName) {
    return {
      recipientUserId: params.creator.id,
      recipientMemberId: null,
      recipientPhone: params.creator.phone,
      recipientName: params.creator.full_name?.trim() || "You",
    };
  }

  const { household, members, consents } = await loadHouseholdContextForUser(params.creator.id);
  if (!household) throw new Error("No household found.");

  let member: DoeDtcHouseholdMemberRow | null = null;
  if (memberId) member = members.find((row) => row.id === memberId) ?? null;
  else if (memberName) member = findHouseholdMemberByName(members, memberName);
  if (!member) throw new Error("Family member not found.");

  const phoneFromMember = member.phone?.trim() ?? null;
  let recipientUserId = member.user_id;
  let recipientPhone = phoneFromMember;

  if (recipientUserId) {
    const canView = canViewMemberProfile({
      household,
      members,
      consents,
      viewerUserId: params.creator.id,
      subjectUserId: recipientUserId,
    });
    if (!canView) {
      throw new Error(`You do not have permission to schedule texts for ${member.full_name}.`);
    }
    const supabase = createSupabaseAdmin();
    const { data } = await supabase.from("doedtc_users").select("phone").eq("id", recipientUserId).maybeSingle();
    recipientPhone = (data as { phone?: string } | null)?.phone ?? recipientPhone;
  } else {
    const canSchedulePending =
      isHouseholdAdmin({ household, viewerUserId: params.creator.id }) &&
      Boolean(phoneFromMember);
    if (!canSchedulePending) {
      throw new Error(`${member.full_name} has not joined Doe yet and has no phone on file.`);
    }
  }

  const normalized = recipientPhone ? normalizePhoneToE164(recipientPhone) ?? recipientPhone : null;
  if (!normalized) throw new Error(`${member.full_name} does not have a phone number.`);

  return {
    recipientUserId,
    recipientMemberId: member.id,
    recipientPhone: normalized,
    recipientName: member.full_name,
  };
}

export async function createScheduledText(params: {
  creator: DoeDtcUserRow;
  intent: string;
  body: string;
  sendAtRaw?: string;
  sendAtIso?: string;
  timezone?: string | null;
  memberId?: string | null;
  memberName?: string | null;
}): Promise<DoeDtcScheduledTextRow> {
  const recipient = await resolveScheduledTextRecipient({
    creator: params.creator,
    memberId: params.memberId,
    memberName: params.memberName,
  });
  const timezone = normalizeScheduledTimezone(params.timezone);
  const sendAt = params.sendAtIso
    ? ensureFutureSendAt(new Date(params.sendAtIso), new Date(), timezone)
    : ensureFutureSendAt(
        parseScheduledSendAt(params.sendAtRaw ?? "", new Date(), timezone),
        new Date(),
        timezone,
      );

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_scheduled_texts")
    .insert({
      created_by_user_id: params.creator.id,
      recipient_user_id: recipient.recipientUserId,
      recipient_member_id: recipient.recipientMemberId,
      recipient_phone: recipient.recipientPhone,
      send_at: sendAt.toISOString(),
      timezone,
      intent: params.intent.trim(),
      body: params.body.trim(),
      status: "pending",
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcScheduledTextRow;
}

export async function listScheduledTextsForUser(userId: string): Promise<DoeDtcScheduledTextRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_scheduled_texts")
    .select("*")
    .or(`created_by_user_id.eq.${userId},recipient_user_id.eq.${userId}`)
    .in("status", ["pending", "sent"])
    .order("send_at", { ascending: true })
    .limit(30);
  if (error) throw new Error(error.message);
  return (data as DoeDtcScheduledTextRow[]) ?? [];
}

export async function cancelScheduledText(params: {
  userId: string;
  scheduledTextId?: string;
  intentHint?: string;
}): Promise<DoeDtcScheduledTextRow | null> {
  const rows = await listScheduledTextsForUser(params.userId);
  const pending = rows.filter((row) => row.status === "pending");
  const intentHint = params.intentHint?.trim();
  const match = params.scheduledTextId
    ? pending.find((row) => row.id === params.scheduledTextId)
    : intentHint
      ? pending.find((row) => row.intent.toLowerCase().includes(intentHint.toLowerCase()))
      : pending[0];
  if (!match) return null;
  if (match.created_by_user_id !== params.userId && match.recipient_user_id !== params.userId) {
    throw new Error("You can only cancel your own scheduled texts.");
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_scheduled_texts")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", match.id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcScheduledTextRow;
}

export async function listDueScheduledTexts(now = new Date()): Promise<DoeDtcScheduledTextRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_scheduled_texts")
    .select("*")
    .eq("status", "pending")
    .lte("send_at", now.toISOString())
    .order("send_at");
  if (error) throw new Error(error.message);
  return (data as DoeDtcScheduledTextRow[]) ?? [];
}

async function logScheduledOutbound(userId: string, body: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  await supabase.from("doedtc_messages").insert({
    user_id: userId,
    direction: "outbound",
    body,
  });
}

export async function processScheduledTextTick(id: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { data: row, error } = await supabase
    .from("doedtc_scheduled_texts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  const scheduled = row as DoeDtcScheduledTextRow;
  if (scheduled.status !== "pending") return;

  if (scheduled.recipient_user_id) {
    const { data: userRow } = await supabase
      .from("doedtc_users")
      .select("status, phone, linq_chat_id")
      .eq("id", scheduled.recipient_user_id)
      .maybeSingle();
    if ((userRow as { status?: string } | null)?.status === "opted_out") {
      await supabase
        .from("doedtc_scheduled_texts")
        .update({
          status: "cancelled",
          error: "Recipient opted out.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      return;
    }
  }

  try {
    await linqSendText({
      to: scheduled.recipient_phone,
      text: scheduled.body,
      idempotencyKey: `doedtc-scheduled-${scheduled.id}`,
    });
    const logUserId = scheduled.recipient_user_id ?? scheduled.created_by_user_id;
    await logScheduledOutbound(logUserId, scheduled.body);
    await supabase
      .from("doedtc_scheduled_texts")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  } catch (tickError) {
    await supabase
      .from("doedtc_scheduled_texts")
      .update({
        status: "failed",
        error: tickError instanceof Error ? tickError.message : "Send failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    throw tickError;
  }
}

export function canScheduleForHouseholdMember(params: {
  household: DoeDtcHouseholdRow;
  members: DoeDtcHouseholdMemberRow[];
  consents: Parameters<typeof canViewMemberProfile>[0]["consents"];
  viewerUserId: string;
  member: DoeDtcHouseholdMemberRow;
}): boolean {
  if (params.member.user_id) {
    return canViewMemberProfile({
      household: params.household,
      members: params.members,
      consents: params.consents,
      viewerUserId: params.viewerUserId,
      subjectUserId: params.member.user_id,
    });
  }
  return (
    isHouseholdAdmin({ household: params.household, viewerUserId: params.viewerUserId }) &&
    Boolean(params.member.phone)
  );
}

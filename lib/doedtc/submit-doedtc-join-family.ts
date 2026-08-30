import { completeDoeDtcHouseholdJoin } from "@/lib/doedtc/doedtc-db";
import { sendDoeDtcConsentMessage } from "@/lib/doedtc/doedtc-messaging";
import type { DoeDtcHouseholdConsentLevel } from "@/lib/doedtc/doedtc-types";

function cleanList(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function cleanConsentLevel(value: unknown): DoeDtcHouseholdConsentLevel {
  if (value === "all" || value === "certain" || value === "none") return value;
  return "none";
}

export async function submitDoeDtcJoinFamily(payload: {
  inviteToken: string;
  fullName: string;
  email: string;
  medications?: string[];
  conditions?: string[];
  medicalDeferred?: boolean;
  shareHealth?: DoeDtcHouseholdConsentLevel;
  allowEdits?: DoeDtcHouseholdConsentLevel;
  shareMemberIds?: string[];
  editMemberIds?: string[];
}) {
  const user = await completeDoeDtcHouseholdJoin({
    inviteToken: payload.inviteToken.trim(),
    fullName: payload.fullName,
    email: payload.email,
    medications: cleanList(payload.medications),
    conditions: cleanList(payload.conditions),
    medicalDeferred: Boolean(payload.medicalDeferred),
    shareHealth: cleanConsentLevel(payload.shareHealth),
    allowEdits: cleanConsentLevel(payload.allowEdits),
    shareMemberIds: cleanList(payload.shareMemberIds),
    editMemberIds: cleanList(payload.editMemberIds),
  });

  await sendDoeDtcConsentMessage({
    user,
    chatId: user.linq_chat_id ?? undefined,
    fromNumber: user.linq_from_number ?? undefined,
    idempotencyKey: `doedtc-consent-join-family-${user.id}`,
  });

  return {
    ok: true as const,
    messagesHref: user.linq_from_number
      ? `sms:${user.linq_from_number.replace(/\D/g, "")}`
      : `sms:${user.phone.replace(/\D/g, "")}`,
  };
}

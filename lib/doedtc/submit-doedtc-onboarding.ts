import {
  createDoeDtcHouseholdInvite,
  getDoeDtcHouseholdSnapshot,
  saveDoeDtcOnboarding,
} from "@/lib/doedtc/doedtc-db";
import { doeDtcAppUrl } from "@/lib/doedtc/doedtc-copy";
import { sendDoeDtcConsentMessage, sendDoeDtcFamilyInviteMessage } from "@/lib/doedtc/doedtc-messaging";
import type { DoeDtcFamilyRelationship, DoeDtcOnboardPayload } from "@/lib/doedtc/doedtc-types";

function cleanList(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 30);
}

const RELATIONSHIPS = new Set<DoeDtcFamilyRelationship>([
  "grandmother",
  "grandfather",
  "mother",
  "father",
  "child",
  "sibling",
  "partner",
  "other",
]);

function cleanFamilyMembers(values: unknown): NonNullable<DoeDtcOnboardPayload["familyMembers"]> {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => {
      if (!value || typeof value !== "object") return null;
      const row = value as Record<string, unknown>;
      const fullName = typeof row.fullName === "string" ? row.fullName.trim() : "";
      const relationship = row.relationship;
      if (!fullName || typeof relationship !== "string" || !RELATIONSHIPS.has(relationship as DoeDtcFamilyRelationship)) {
        return null;
      }
      const phone = typeof row.phone === "string" ? row.phone.trim() : "";
      const dateOfBirth = typeof row.dateOfBirth === "string" ? row.dateOfBirth.trim() : "";
      return {
        fullName,
        relationship: relationship as DoeDtcFamilyRelationship,
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        sendInvite: Boolean(row.sendInvite) && Boolean(phone),
      };
    })
    .filter((value): value is NonNullable<typeof value> => Boolean(value))
    .slice(0, 20);
}

export async function submitDoeDtcOnboarding(payload: DoeDtcOnboardPayload) {
  const fullName = payload.fullName.trim();
  const email = payload.email.trim();
  const whyDoe = payload.whyDoe.trim();
  const medicalDeferred = Boolean(payload.medicalDeferred);
  const medications = medicalDeferred ? [] : cleanList(payload.medications);
  const conditions = medicalDeferred ? [] : cleanList(payload.conditions);
  const familyMembers = cleanFamilyMembers(payload.familyMembers);

  if (!payload.token.trim()) throw new Error("Missing onboarding token.");
  if (!fullName) throw new Error("Full name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  if (!whyDoe) throw new Error("Tell us why you want to use Doe.");

  const user = await saveDoeDtcOnboarding({
    token: payload.token.trim(),
    fullName,
    email,
    medications,
    conditions,
    whyDoe,
    familyMembers,
    medicalDeferred,
  });

  await sendDoeDtcConsentMessage({
    user,
    chatId: user.linq_chat_id ?? undefined,
    fromNumber: user.linq_from_number ?? undefined,
    idempotencyKey: `doedtc-consent-post-onboard-${user.id}`,
  });

  const queuedInvites = familyMembers.filter((member) => member.sendInvite && member.phone);
  if (queuedInvites.length > 0) {
    const household = await getDoeDtcHouseholdSnapshot(user.id);
    for (const member of queuedInvites) {
      const row = household.members.find(
        (item) =>
          item.role !== "admin" &&
          item.full_name.trim().toLowerCase() === member.fullName.trim().toLowerCase() &&
          item.relationship === member.relationship,
      );
      if (!row) continue;
      try {
        const { invite, member: invited } = await createDoeDtcHouseholdInvite({
          adminUserId: user.id,
          memberId: row.id,
        });
        await sendDoeDtcFamilyInviteMessage({
          adminUser: user,
          memberPhone: invited.phone!,
          inviteToken: invite.token,
          memberName: invited.full_name,
        });
      } catch {
        // Onboarding still succeeds; the admin can resend from the Family tab.
      }
    }
  }

  const profileHref = doeDtcAppUrl(user.care_token);

  return {
    ok: true as const,
    profileHref,
    messagesHref: user.linq_from_number
      ? `sms:${user.linq_from_number.replace(/\D/g, "")}`
      : `sms:${user.phone.replace(/\D/g, "")}`,
  };
}

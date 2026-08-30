import { saveDoeDtcOnboarding } from "@/lib/doedtc/doedtc-db";
import { sendDoeDtcConsentMessage } from "@/lib/doedtc/doedtc-messaging";
import type { DoeDtcOnboardPayload } from "@/lib/doedtc/doedtc-types";

function cleanList(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 30);
}

export async function submitDoeDtcOnboarding(payload: DoeDtcOnboardPayload) {
  const fullName = payload.fullName.trim();
  const email = payload.email.trim();
  const whyDoe = payload.whyDoe.trim();
  const medications = cleanList(payload.medications);
  const conditions = cleanList(payload.conditions);

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
  });

  await sendDoeDtcConsentMessage({
    user,
    chatId: user.linq_chat_id ?? undefined,
    fromNumber: user.linq_from_number ?? undefined,
    idempotencyKey: `doedtc-consent-post-onboard-${user.id}`,
  });

  return {
    ok: true as const,
    messagesHref: user.linq_from_number
      ? `sms:${user.linq_from_number.replace(/\D/g, "")}`
      : `sms:${user.phone.replace(/\D/g, "")}`,
  };
}

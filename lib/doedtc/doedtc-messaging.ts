import { shareDoeDtcLinqContactCard } from "@/lib/doedtc/doedtc-contact-card";
import {
  DOEDTC_LINQ,
  doeDtcCareUrl,
  doeDtcGetStartedUrl,
} from "@/lib/doedtc/doedtc-copy";
import {
  beginDoeDtcOnboarding,
  ensureDoeDtcUserForInbound,
  getDoeDtcProfileLists,
  getDoeDtcUserByPhone,
  logDoeDtcMessage,
  markDoeDtcUserOptedOut,
  markDoeDtcUserPendingConfirm,
  saveDoeDtcAssessment,
  updateDoeDtcUserChat,
  upsertInvitedDoeDtcUser,
} from "@/lib/doedtc/doedtc-db";
import { normalizePhoneToE164 } from "@/lib/doedtc/doedtc-phone";
import { linqSendText, linqSendToPhone } from "@/lib/doedtc/linq";
import type { DoeDtcAssessmentResult, DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

const OPT_OUT_KEYWORDS = new Set(["STOP", "UNSUBSCRIBE", "OPTOUT", "CANCEL", "END", "QUIT"]);

type LinqWebhookPayload = {
  event_type?: string;
  type?: string;
  event?: string;
  data?: {
    parts?: Array<{ type?: string; value?: string }>;
    message?: {
      parts?: Array<{ type?: string; value?: string }>;
      chat_id?: string;
      from?: string;
    };
    sender_handle?: { handle?: string };
    from?: string;
    from_handle?: { handle?: string };
    chat?: { id?: string };
    chat_id?: string;
  };
  message?: { parts?: Array<{ type?: string; value?: string }> };
  from?: string;
};

export function extractInboundText(payload: unknown): string {
  const body = payload as LinqWebhookPayload;
  const parts =
    body.data?.parts ??
    body.data?.message?.parts ??
    body.message?.parts ??
    [];

  return parts
    .filter((part) => part.type === "text" && typeof part.value === "string")
    .map((part) => part.value?.trim() ?? "")
    .join("\n")
    .trim();
}

export function extractInboundPhone(payload: unknown): string | null {
  const body = payload as LinqWebhookPayload;
  const raw =
    body.data?.sender_handle?.handle ??
    body.data?.from_handle?.handle ??
    body.data?.from ??
    body.data?.message?.from ??
    body.from;

  if (typeof raw !== "string") return null;
  return normalizePhoneToE164(raw) ?? raw;
}

export function extractChatMetadata(payload: unknown): {
  chatId?: string;
  fromNumber?: string;
} {
  const body = payload as LinqWebhookPayload;

  const ownerHandle = (body.data as { chat?: { owner_handle?: { handle?: string; is_me?: boolean } } })
    ?.chat?.owner_handle;

  return {
    chatId: body.data?.chat?.id ?? body.data?.chat_id ?? body.data?.message?.chat_id,
    fromNumber:
      (ownerHandle?.is_me ? ownerHandle.handle : undefined) ??
      body.data?.from ??
      body.data?.message?.from,
  };
}

export function extractWebhookEventType(payload: unknown, headerEvent?: string | null): string {
  const body = payload as LinqWebhookPayload;
  return (
    headerEvent ??
    body.event_type ??
    body.type ??
    body.event ??
    ""
  );
}

export function normalizeInboundCommand(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

export function isHiDoeMessage(text: string): boolean {
  return normalizeInboundCommand(text).toLowerCase() === "hi doe";
}

export function isConfirmMessage(text: string): boolean {
  return normalizeInboundCommand(text).toUpperCase() === "CONFIRM";
}

export function isOptOutMessage(text: string): boolean {
  const trimmed = normalizeInboundCommand(text);
  if (OPT_OUT_KEYWORDS.has(trimmed)) return true;
  return /^opt[\s-]?out$/i.test(trimmed);
}

async function sendDoeDtcOutbound(params: {
  user: DoeDtcUserRow;
  chatId?: string;
  to?: string;
  text: string;
  idempotencyKey: string;
}): Promise<void> {
  await linqSendText({
    to: params.to ?? params.user.phone,
    chatId: params.chatId ?? params.user.linq_chat_id ?? undefined,
    text: params.text,
    idempotencyKey: params.idempotencyKey,
  });
  await logDoeDtcMessage({
    userId: params.user.id,
    direction: "outbound",
    body: params.text,
  });
}

export async function sendDoeDtcConsentMessage(params: {
  user: DoeDtcUserRow;
  chatId?: string;
  fromNumber?: string;
}): Promise<DoeDtcUserRow> {
  const updated = await markDoeDtcUserPendingConfirm({
    userId: params.user.id,
    chatId: params.chatId ?? params.user.linq_chat_id,
    fromNumber: params.fromNumber ?? params.user.linq_from_number,
  });

  await sendDoeDtcOutbound({
    user: updated,
    chatId: params.chatId ?? updated.linq_chat_id ?? undefined,
    text: DOEDTC_LINQ.consentMessage,
    idempotencyKey: `doedtc-consent-${updated.id}`,
  });

  return updated;
}

export async function startDoeDtcFromLanding(phoneRaw: string): Promise<{ phone: string }> {
  const phone = normalizePhoneToE164(phoneRaw);
  if (!phone) {
    throw new Error("Enter a valid US or Canadian phone number.");
  }

  const user = await upsertInvitedDoeDtcUser(phone);
  const response = await linqSendToPhone({
    to: phone,
    parts: [{ type: "text", value: DOEDTC_LINQ.helloMessage }],
    idempotencyKey: `doedtc-start-${user.id}`,
  });

  const updated = await markDoeDtcUserPendingConfirm({
    userId: user.id,
    chatId: response.chat_id,
    fromNumber: response.from,
  });

  await logDoeDtcMessage({
    userId: updated.id,
    direction: "outbound",
    body: DOEDTC_LINQ.helloMessage,
    linqMessageId: response.message?.id ?? null,
  });

  await shareDoeDtcLinqContactCard({
    chatId: response.chat_id,
    fromNumber: response.from,
  });

  try {
    await sendDoeDtcOutbound({
      user: updated,
      chatId: response.chat_id,
      to: phone,
      text: DOEDTC_LINQ.consentMessage,
      idempotencyKey: `doedtc-consent-landing-${updated.id}`,
    });
  } catch (error) {
    console.warn("[doedtc/start] consent follow-up failed:", error);
  }

  return { phone };
}

export async function handleHiDoeInbound(params: {
  user: DoeDtcUserRow;
  phone: string;
  chatId?: string;
  fromNumber?: string;
}): Promise<void> {
  const chatId = params.chatId ?? params.user.linq_chat_id ?? undefined;

  if (params.user.status === "pending_confirm") {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      text: DOEDTC_LINQ.confirmReminder,
      idempotencyKey: `doedtc-confirm-reminder-${params.user.id}`,
    });
    return;
  }

  if (params.user.status === "onboarding") {
    await handleConfirmInbound({
      user: params.user,
      phone: params.phone,
      chatId,
      fromNumber: params.fromNumber,
    });
    return;
  }

  if (params.user.status === "invited") {
    await sendDoeDtcConsentMessage({
      user: params.user,
      chatId,
      fromNumber: params.fromNumber,
    });
    return;
  }
}

export async function handleConfirmInbound(params: {
  user: DoeDtcUserRow;
  phone: string;
  chatId?: string;
  fromNumber?: string;
}): Promise<void> {
  const onboarded = await beginDoeDtcOnboarding({
    phone: params.phone,
    chatId: params.chatId ?? params.user.linq_chat_id,
    fromNumber: params.fromNumber ?? params.user.linq_from_number,
  });

  const getStartedUrl = doeDtcGetStartedUrl(onboarded.onboarding_token ?? "");
  const chatId = params.chatId ?? onboarded.linq_chat_id ?? undefined;
  const body = `${DOEDTC_LINQ.getStartedIntro}\n${getStartedUrl}`;

  await sendDoeDtcOutbound({
    user: onboarded,
    chatId,
    to: params.phone,
    text: body,
    idempotencyKey: `doedtc-get-started-${onboarded.id}-${onboarded.onboarding_token}`,
  });

  await shareDoeDtcLinqContactCard({
    chatId,
    fromNumber: params.fromNumber ?? onboarded.linq_from_number,
  });
}

export async function sendDoeDtcAllSet(user: DoeDtcUserRow): Promise<void> {
  const chatId = user.linq_chat_id ?? undefined;
  await linqSendText({
    to: user.phone,
    chatId,
    text: DOEDTC_LINQ.allSetMessage,
    idempotencyKey: `doedtc-all-set-${user.id}`,
  });

  await logDoeDtcMessage({
    userId: user.id,
    direction: "outbound",
    body: DOEDTC_LINQ.allSetMessage,
  });
}

export async function handleOptOutInbound(phone: string): Promise<void> {
  await markDoeDtcUserOptedOut(phone);
}

export async function handleSymptomInbound(params: {
  user: DoeDtcUserRow;
  text: string;
  webhookEventId?: string;
}): Promise<void> {
  await logDoeDtcMessage({
    userId: params.user.id,
    direction: "inbound",
    body: params.text,
    webhookEventId: params.webhookEventId ?? null,
  });

  const profile = await getDoeDtcProfileLists(params.user.id);
  const result = await generateDoeDtcAssessment({
    symptomsText: params.text,
    medications: profile.medications,
    conditions: profile.conditions,
    whyDoe: params.user.why_doe ?? "",
  });

  await saveDoeDtcAssessment({
    userId: params.user.id,
    symptomsText: params.text,
    result,
  });

  const careUrl = doeDtcCareUrl(params.user.care_token);
  const chatId = params.user.linq_chat_id ?? undefined;
  const summary = `${DOEDTC_LINQ.assessmentIntro}\n\n${result.summary}\n\n${careUrl}`;

  await linqSendText({
    to: params.user.phone,
    chatId,
    text: summary,
    idempotencyKey: `doedtc-assessment-${params.user.id}-${params.webhookEventId ?? Date.now()}`,
  });

  await logDoeDtcMessage({
    userId: params.user.id,
    direction: "outbound",
    body: summary,
  });
}

async function generateDoeDtcAssessment(params: {
  symptomsText: string;
  medications: string[];
  conditions: string[];
  whyDoe: string;
}): Promise<DoeDtcAssessmentResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Symptom assessment is not configured: OPENAI_API_KEY is missing.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Doe, a consumer health companion. Output JSON only with this shape:
{
  "presentingSymptoms": "short restatement of what the user reported",
  "summary": "2-3 sentence plain-language overview for iMessage",
  "findings": [{"name":"condition","why":"why it fits","evidence":["bullet"],"likelihood":"high|moderate|low"}],
  "cantMiss": ["can't-miss diagnosis or red flag"],
  "urgency": "when to seek urgent or emergency care",
  "disclaimer": "Doe is not a doctor and this is not a diagnosis."
}

Rules:
- Use the user's medications, conditions, and goals as context when relevant.
- Rank 3-6 likely explanations with evidence grounded in common clinical reasoning.
- Always include can't-miss/red-flag guidance and a conservative urgency note.
- Never claim a definitive diagnosis. Encourage professional care when appropriate.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            symptoms: params.symptomsText,
            medications: params.medications,
            conditions: params.conditions,
            whyDoe: params.whyDoe,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Assessment generation failed: ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Assessment generation returned no content.");
  }

  const parsed = JSON.parse(content) as DoeDtcAssessmentResult;
  return {
    presentingSymptoms: parsed.presentingSymptoms || params.symptomsText,
    summary: parsed.summary || "I reviewed what you shared and put together a few possibilities.",
    findings: Array.isArray(parsed.findings) ? parsed.findings : [],
    cantMiss: Array.isArray(parsed.cantMiss) ? parsed.cantMiss : [],
    urgency: parsed.urgency || "If symptoms worsen or feel unsafe, seek urgent medical care.",
    disclaimer:
      parsed.disclaimer ||
      "Doe is not a doctor and this is not a diagnosis. If you think you're having an emergency, call 911.",
  };
}

export async function processDoeDtcInboundWebhook(params: {
  payload: unknown;
  webhookEventId?: string;
}): Promise<void> {
  const phone = extractInboundPhone(params.payload);
  const text = extractInboundText(params.payload);
  if (!phone || !text) return;

  const { chatId, fromNumber } = extractChatMetadata(params.payload);
  let user = await getDoeDtcUserByPhone(phone);

  if (isOptOutMessage(text)) {
    await handleOptOutInbound(phone);
    await logDoeDtcMessage({
      userId: user?.id ?? null,
      direction: "inbound",
      body: text,
      webhookEventId: params.webhookEventId ?? null,
    });
    return;
  }

  if (user?.status === "opted_out") {
    return;
  }

  if (!user) {
    user = await ensureDoeDtcUserForInbound({ phone, chatId, fromNumber });
  } else if (chatId || fromNumber) {
    await updateDoeDtcUserChat({
      userId: user.id,
      chatId,
      fromNumber,
    });
    user = (await getDoeDtcUserByPhone(phone)) ?? user;
  }

  await logDoeDtcMessage({
    userId: user.id,
    direction: "inbound",
    body: text,
    webhookEventId: params.webhookEventId ?? null,
  });

  if (isHiDoeMessage(text)) {
    await handleHiDoeInbound({ user, phone, chatId, fromNumber });
    return;
  }

  if (isConfirmMessage(text)) {
    if (user.status === "active") {
      await sendDoeDtcOutbound({
        user,
        chatId,
        text: "You're already set up with Doe. Text your symptoms anytime.",
        idempotencyKey: `doedtc-already-active-${user.id}`,
      });
      return;
    }

    if (user.status === "onboarding") {
      await handleConfirmInbound({ user, phone, chatId, fromNumber });
      return;
    }

    if (user.status === "pending_confirm" || user.status === "invited") {
      await handleConfirmInbound({ user, phone, chatId, fromNumber });
      return;
    }

    await sendDoeDtcConsentMessage({ user, chatId, fromNumber });
    return;
  }

  if (user.status === "active") {
    await handleSymptomInbound({
      user,
      text,
      webhookEventId: params.webhookEventId,
    });
    return;
  }

  if (user.status === "pending_confirm") {
    await sendDoeDtcOutbound({
      user,
      chatId,
      text: DOEDTC_LINQ.confirmReminder,
      idempotencyKey: `doedtc-confirm-reminder-${user.id}-${params.webhookEventId ?? Date.now()}`,
    });
    return;
  }

  if (user.status === "onboarding") {
    const chatId = user.linq_chat_id ?? undefined;
    const getStartedUrl = doeDtcGetStartedUrl(user.onboarding_token ?? "");
    await sendDoeDtcOutbound({
      user,
      chatId,
      to: user.phone,
      text: `${DOEDTC_LINQ.getStartedIntro}\n${getStartedUrl}`,
      idempotencyKey: `doedtc-onboarding-reminder-${user.id}`,
    });
    return;
  }

  await handleHiDoeInbound({ user, phone, chatId, fromNumber });
}

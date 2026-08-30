import {
  DOEDTC_LINQ,
  doeDtcCareUrl,
  doeDtcGetStartedUrl,
} from "@/lib/doedtc/doedtc-copy";
import {
  beginDoeDtcOnboarding,
  getDoeDtcProfileLists,
  getDoeDtcUserByPhone,
  logDoeDtcMessage,
  markDoeDtcUserOptedOut,
  saveDoeDtcAssessment,
  updateDoeDtcUserChat,
  upsertInvitedDoeDtcUser,
} from "@/lib/doedtc/doedtc-db";
import { normalizePhoneToE164 } from "@/lib/doedtc/doedtc-phone";
import { linqSendLink, linqSendText, linqSendToPhone } from "@/lib/doedtc/linq";
import type { DoeDtcAssessmentResult, DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

const OPT_OUT_KEYWORDS = new Set(["STOP", "UNSUBSCRIBE", "OPTOUT", "CANCEL", "END", "QUIT"]);

export function extractInboundText(payload: unknown): string {
  const body = payload as {
    data?: {
      message?: { parts?: Array<{ type?: string; value?: string }> };
      parts?: Array<{ type?: string; value?: string }>;
    };
    message?: { parts?: Array<{ type?: string; value?: string }> };
  };

  const parts =
    body.data?.message?.parts ??
    body.data?.parts ??
    body.message?.parts ??
    [];

  return parts
    .filter((part) => part.type === "text" && typeof part.value === "string")
    .map((part) => part.value?.trim() ?? "")
    .join("\n")
    .trim();
}

export function extractInboundPhone(payload: unknown): string | null {
  const body = payload as {
    data?: {
      from?: string;
      message?: { from?: string; handle?: { handle?: string } };
      handle?: { handle?: string };
    };
    from?: string;
  };

  const raw =
    body.data?.from ??
    body.data?.message?.from ??
    body.data?.message?.handle?.handle ??
    body.data?.handle?.handle ??
    body.from;

  if (typeof raw !== "string") return null;
  return normalizePhoneToE164(raw) ?? raw;
}

export function extractChatMetadata(payload: unknown): {
  chatId?: string;
  fromNumber?: string;
} {
  const body = payload as {
    data?: {
      chat_id?: string;
      chat?: { id?: string };
      from?: string;
      message?: { chat_id?: string; from?: string };
    };
  };

  return {
    chatId: body.data?.chat_id ?? body.data?.chat?.id ?? body.data?.message?.chat_id,
    fromNumber: body.data?.from ?? body.data?.message?.from,
  };
}

export function isHiDoeMessage(text: string): boolean {
  return text.trim().toLowerCase() === "hi doe";
}

export function isOptOutMessage(text: string): boolean {
  const trimmed = text.trim();
  if (OPT_OUT_KEYWORDS.has(trimmed)) return true;
  return /^opt[\s-]?out$/i.test(trimmed);
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

  await updateDoeDtcUserChat({
    userId: user.id,
    chatId: response.chat_id,
    fromNumber: response.from,
  });

  await logDoeDtcMessage({
    userId: user.id,
    direction: "outbound",
    body: DOEDTC_LINQ.helloMessage,
    linqMessageId: response.message?.id ?? null,
  });

  return { phone };
}

export async function handleHiDoeInbound(params: {
  phone: string;
  chatId?: string;
  fromNumber?: string;
}): Promise<void> {
  const user = await beginDoeDtcOnboarding({
    phone: params.phone,
    chatId: params.chatId,
    fromNumber: params.fromNumber,
  });

  const getStartedUrl = doeDtcGetStartedUrl(user.onboarding_token ?? "");
  const chatId = params.chatId ?? user.linq_chat_id ?? undefined;

  await linqSendText({
    chatId,
    to: chatId ? undefined : params.phone,
    text: DOEDTC_LINQ.getStartedIntro,
    idempotencyKey: `doedtc-get-started-intro-${user.id}-${user.onboarding_token}`,
  });

  await linqSendLink({
    chatId,
    to: chatId ? undefined : params.phone,
    url: getStartedUrl,
    idempotencyKey: `doedtc-get-started-link-${user.id}-${user.onboarding_token}`,
  });

  await logDoeDtcMessage({
    userId: user.id,
    direction: "outbound",
    body: `${DOEDTC_LINQ.getStartedIntro} ${getStartedUrl}`,
  });
}

export async function sendDoeDtcAllSet(user: DoeDtcUserRow): Promise<void> {
  const chatId = user.linq_chat_id ?? undefined;
  await linqSendText({
    chatId,
    to: chatId ? undefined : user.phone,
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
  const summary = `${DOEDTC_LINQ.assessmentIntro}\n\n${result.summary}`;

  await linqSendText({
    chatId,
    to: chatId ? undefined : params.user.phone,
    text: summary,
    idempotencyKey: `doedtc-assessment-summary-${params.user.id}-${params.webhookEventId ?? Date.now()}`,
  });

  await linqSendLink({
    chatId,
    to: chatId ? undefined : params.user.phone,
    url: careUrl,
    idempotencyKey: `doedtc-assessment-link-${params.user.id}-${params.webhookEventId ?? Date.now()}`,
  });

  await logDoeDtcMessage({
    userId: params.user.id,
    direction: "outbound",
    body: `${summary}\n${careUrl}`,
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
  const user = await getDoeDtcUserByPhone(phone);

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

  if (isHiDoeMessage(text)) {
    await handleHiDoeInbound({ phone, chatId, fromNumber });
    await logDoeDtcMessage({
      userId: user?.id ?? null,
      direction: "inbound",
      body: text,
      webhookEventId: params.webhookEventId ?? null,
    });
    return;
  }

  if (!user || user.status !== "active") {
    await handleHiDoeInbound({ phone, chatId, fromNumber });
    await logDoeDtcMessage({
      userId: user?.id ?? null,
      direction: "inbound",
      body: text,
      webhookEventId: params.webhookEventId ?? null,
    });
    return;
  }

  if (chatId || fromNumber) {
    await updateDoeDtcUserChat({
      userId: user.id,
      chatId,
      fromNumber,
    });
  }

  await handleSymptomInbound({
    user,
    text,
    webhookEventId: params.webhookEventId,
  });
}

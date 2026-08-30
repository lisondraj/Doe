import { runDoeDtcAgentTurn, sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";
import { shareDoeDtcLinqContactCard } from "@/lib/doedtc/doedtc-contact-card";
import {
  DOEDTC_LINQ,
  doeDtcAppUrl,
  doeDtcGetStartedUrl,
} from "@/lib/doedtc/doedtc-copy";
import {
  activateDoeDtcUser,
  beginDoeDtcOnboarding,
  ensureDoeDtcUserForInbound,
  getDoeDtcUserByPhone,
  logDoeDtcMessage,
  markDoeDtcUserOptedOut,
  markDoeDtcUserPendingConfirm,
  updateDoeDtcUserChat,
  upsertInvitedDoeDtcUser,
} from "@/lib/doedtc/doedtc-db";
import { normalizePhoneToE164 } from "@/lib/doedtc/doedtc-phone";
import { linqSendLink, linqSendText, linqSendToPhone } from "@/lib/doedtc/linq";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

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
  return headerEvent ?? body.event_type ?? body.type ?? body.event ?? "";
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

async function sendDoeDtcLinkOutbound(params: {
  user: DoeDtcUserRow;
  chatId?: string;
  to?: string;
  url: string;
  idempotencyKey: string;
}): Promise<void> {
  await linqSendLink({
    to: params.to ?? params.user.phone,
    chatId: params.chatId ?? params.user.linq_chat_id ?? undefined,
    url: params.url,
    idempotencyKey: params.idempotencyKey,
  });
  await logDoeDtcMessage({
    userId: params.user.id,
    direction: "outbound",
    body: params.url,
  });
}

export async function sendDoeDtcConsentMessage(params: {
  user: DoeDtcUserRow;
  chatId?: string;
  fromNumber?: string;
  idempotencyKey?: string;
}): Promise<DoeDtcUserRow> {
  const updated = await markDoeDtcUserPendingConfirm({
    userId: params.user.id,
    chatId: params.chatId ?? params.user.linq_chat_id,
    fromNumber: params.fromNumber ?? params.user.linq_from_number,
  });

  await sendDoeDtcOutbound({
    user: updated,
    chatId: params.chatId ?? updated.linq_chat_id ?? undefined,
    to: updated.phone,
    text: DOEDTC_LINQ.consentMessage,
    idempotencyKey: params.idempotencyKey ?? `doedtc-consent-${updated.id}`,
  });

  return updated;
}

export async function sendGetStartedMessages(params: {
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

  await sendDoeDtcOutbound({
    user: onboarded,
    chatId,
    to: params.phone,
    text: DOEDTC_LINQ.getStartedIntro,
    idempotencyKey: `doedtc-get-started-intro-${onboarded.id}-${onboarded.onboarding_token}`,
  });

  await sendDoeDtcLinkOutbound({
    user: onboarded,
    chatId,
    to: params.phone,
    url: getStartedUrl,
    idempotencyKey: `doedtc-get-started-link-${onboarded.id}-${onboarded.onboarding_token}`,
  });

  await shareDoeDtcLinqContactCard({
    chatId,
    fromNumber: params.fromNumber ?? onboarded.linq_from_number,
  });
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

  await shareDoeDtcLinqContactCard({
    chatId: response.chat_id,
    fromNumber: response.from,
  });

  return { phone };
}

export async function handleHiDoeInbound(params: {
  user: DoeDtcUserRow;
  phone: string;
  chatId?: string;
  fromNumber?: string;
}): Promise<void> {
  if (params.user.status === "active") {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId: params.chatId,
      to: params.phone,
      text: "You're already set up with Doe. Text your symptoms anytime.",
      idempotencyKey: `doedtc-already-active-hi-${params.user.id}`,
    });
    return;
  }

  if (params.user.status === "pending_confirm") {
    await sendDoeDtcConsentMessage({
      user: params.user,
      chatId: params.chatId,
      fromNumber: params.fromNumber,
      idempotencyKey: `doedtc-consent-hi-${params.user.id}-${Date.now()}`,
    });
    return;
  }

  await sendGetStartedMessages(params);
}

export async function handleConfirmInbound(params: {
  user: DoeDtcUserRow;
  phone: string;
  chatId?: string;
  fromNumber?: string;
}): Promise<void> {
  if (params.user.status !== "pending_confirm") {
    if (params.user.status === "onboarding" || params.user.status === "invited") {
      await sendGetStartedMessages(params);
      return;
    }
    if (params.user.status === "active") {
      await sendDoeDtcOutbound({
        user: params.user,
        chatId: params.chatId,
        to: params.phone,
        text: "You're already set up with Doe. Text your symptoms anytime.",
        idempotencyKey: `doedtc-already-active-${params.user.id}`,
      });
    }
    return;
  }

  const activated = await activateDoeDtcUser(params.user.id);
  await sendDoeDtcAllSet(activated);
}

export async function sendDoeDtcProfileLinkMessage(params: {
  user: DoeDtcUserRow;
  chatId?: string;
  idempotencyKey?: string;
}): Promise<void> {
  const profileUrl = doeDtcAppUrl(params.user.care_token);
  const chatId = params.chatId ?? params.user.linq_chat_id ?? undefined;

  await sendDoeDtcOutbound({
    user: params.user,
    chatId,
    to: params.user.phone,
    text: DOEDTC_LINQ.profileIntro,
    idempotencyKey: params.idempotencyKey ?? `doedtc-profile-intro-${params.user.id}`,
  });

  await sendDoeDtcLinkOutbound({
    user: params.user,
    chatId,
    to: params.user.phone,
    url: profileUrl,
    idempotencyKey: `${params.idempotencyKey ?? `doedtc-profile-link-${params.user.id}`}-link`,
  });
}

export async function sendDoeDtcAllSet(user: DoeDtcUserRow): Promise<void> {
  await sendDoeDtcOutbound({
    user,
    chatId: user.linq_chat_id ?? undefined,
    to: user.phone,
    text: DOEDTC_LINQ.allSetMessage,
    idempotencyKey: `doedtc-all-set-${user.id}`,
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
  const chatId = params.user.linq_chat_id ?? undefined;
  const idSuffix = params.webhookEventId ?? Date.now();

  const turn = await runDoeDtcAgentTurn({
    user: params.user,
    inboundText: params.text,
  });

  const replyText = sanitizeDoeDtcReplyText(turn.replyText);
  if (replyText) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: replyText,
      idempotencyKey: `doedtc-agent-reply-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.assessmentRan && turn.careUrl) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.careLinkIntro,
      idempotencyKey: `doedtc-agent-care-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.careUrl,
      idempotencyKey: `doedtc-agent-care-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.listenUrl) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.listenIntro,
      idempotencyKey: `doedtc-agent-listen-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.listenUrl,
      idempotencyKey: `doedtc-agent-listen-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.profileUrl) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.profileLinkIntro,
      idempotencyKey: `doedtc-agent-profile-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.profileUrl,
      idempotencyKey: `doedtc-agent-profile-${params.user.id}-${idSuffix}`,
    });
  }
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
    await handleConfirmInbound({ user, phone, chatId, fromNumber });
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

  if (user.status === "onboarding") {
    await sendGetStartedMessages({ user, phone, chatId, fromNumber });
    return;
  }

  // invited / pending_confirm: wait for Hi Doe or CONFIRM; no stray reminders
}

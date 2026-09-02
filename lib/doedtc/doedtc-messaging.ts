import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { runDoeDtcAgentTurn, type DoeDtcAgentTurnResult } from "@/lib/doedtc/doedtc-agent";
import { looksLikeUnwellShare } from "@/lib/doedtc/agent/unwell-care";
import { seedCareFollowUpLoops } from "@/lib/doedtc/doedtc-care-seeds";
import { getDoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-db";
import {
  createDoeDtcAgentTurnId,
  listDoeDtcAgentTurnsByInboundMessageId,
  recentDoeDtcTurnsUsedThreadReply,
} from "@/lib/doedtc/doedtc-agent-audit";
import { commitDoeDtcBrowserTask, stopDoeDtcBrowserForUser } from "@/lib/doedtc/doedtc-browser";
import { getPendingConfirmDoeDtcBrowserJob } from "@/lib/doedtc/doedtc-browser-db";
import { shareDoeDtcLinqContactCard } from "@/lib/doedtc/doedtc-contact-card";
import {
  DOEDTC_LINQ,
  doeDtcAppUrl,
  doeDtcGetStartedUrl,
  doeDtcJoinFamilyUrl,
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
import { addDoeDtcMem0Turn } from "@/lib/doedtc/doedtc-memory";
import { splitOutboundBubbles, startTypingPulse, waitForBubbleGap, waitForOutboundThinkTime } from "@/lib/doedtc/doedtc-outbound-pacing";
import {
  DEFERRED_WORK_ACK,
  isRedundantWorkingAck,
  WORKING_TEXT_ACK_DELAY_MS,
} from "@/lib/doedtc/agent/active-work";
import { shouldSendWorkingTextAck } from "@/lib/doedtc/doedtc-reactions";
import { settleInlineScheduledSends } from "@/lib/doedtc/doedtc-scheduled-db";
import { tryHandleAccountabilityInbound } from "@/lib/doedtc/doedtc-accountability-db";
import { tryHandleWorkflowInbound } from "@/lib/doedtc/doedtc-workflows";
import { normalizePhoneToE164 } from "@/lib/doedtc/doedtc-phone";
import { redactDoeDtcLogText } from "@/lib/doedtc/doedtc-privacy";
import {
  AGENT_TURN_FALLBACK_REPLY,
  beginDoeDtcTurnLifecycle,
  claimInboundTurn,
  completeDoeDtcTurnLifecycle,
  shouldSkipDuplicateInboundTurn,
  withAgentTurnTimeout,
} from "@/lib/doedtc/doedtc-turn-lifecycle";
import { linqGetMessage, linqSendLink, linqSendMedia, linqSendText, linqSendToPhone, linqStartTyping } from "@/lib/doedtc/linq";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

const OPT_OUT_KEYWORDS = new Set(["STOP", "UNSUBSCRIBE", "OPTOUT", "CANCEL", "END", "QUIT"]);

type LinqWebhookMediaPart = {
  type?: string;
  value?: string;
  url?: string;
  mime_type?: string;
  filename?: string;
  id?: string;
  attachment_id?: string;
};

type LinqReplyToRef = {
  message_id?: string;
  part_index?: number;
};

type LinqWebhookPayload = {
  event_type?: string;
  type?: string;
  event?: string;
  data?: {
    id?: string;
    parts?: LinqWebhookMediaPart[];
    reply_to?: LinqReplyToRef;
    message?: {
      id?: string;
      parts?: LinqWebhookMediaPart[];
      chat_id?: string;
      from?: string;
      reply_to?: LinqReplyToRef;
    };
    sender_handle?: { handle?: string };
    from?: string;
    from_handle?: { handle?: string };
    chat?: { id?: string };
    chat_id?: string;
  };
  message?: { id?: string; parts?: LinqWebhookMediaPart[]; reply_to?: LinqReplyToRef };
  from?: string;
};

export type InboundMediaAttachment = {
  url?: string;
  mime?: string;
  filename?: string;
  attachmentId?: string;
};

const ATTACHMENT_UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function inboundParts(payload: unknown): LinqWebhookMediaPart[] {
  const body = payload as LinqWebhookPayload;
  return (
    body.data?.parts ??
    body.data?.message?.parts ??
    body.message?.parts ??
    []
  );
}

export function attachmentIdFromMediaPart(part: {
  id?: string;
  attachment_id?: string;
  url?: string;
}): string | undefined {
  const direct = part.attachment_id?.trim() || part.id?.trim();
  if (direct) return direct;
  const fromUrl = part.url?.match(ATTACHMENT_UUID_RE)?.[0];
  return fromUrl;
}

export function extractInboundMedia(payload: unknown): InboundMediaAttachment[] {
  const attachments: InboundMediaAttachment[] = [];
  for (const part of inboundParts(payload)) {
    const type = (part.type ?? "").toLowerCase();
    if (type === "text" || type === "link") continue;
    const rawUrl =
      typeof part.url === "string" && part.url.trim()
        ? part.url.trim()
        : typeof part.value === "string" && /^https?:\/\//i.test(part.value.trim())
          ? part.value.trim()
          : "";
    const mime = typeof part.mime_type === "string" ? part.mime_type : undefined;
    const looksLikeMedia =
      type === "media" ||
      type === "image" ||
      type === "attachment" ||
      Boolean(mime?.startsWith("image/")) ||
      Boolean(rawUrl && type === "");
    if (!looksLikeMedia) continue;
    const attachmentId = attachmentIdFromMediaPart(part);
    if (!rawUrl && !attachmentId) continue;
    const row: InboundMediaAttachment = { mime };
    if (rawUrl) row.url = rawUrl;
    if (typeof part.filename === "string") row.filename = part.filename;
    if (attachmentId) row.attachmentId = attachmentId;
    attachments.push(row);
  }
  return attachments;
}

export function extractInboundText(payload: unknown): string {
  return inboundParts(payload)
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

export function extractInboundMessageId(payload: unknown): string | undefined {
  const body = payload as LinqWebhookPayload;
  const id =
    body.data?.message?.id ??
    body.data?.id ??
    (body.data as { message_id?: string } | undefined)?.message_id ??
    body.message?.id;
  if (typeof id !== "string") return undefined;
  const trimmed = id.trim();
  return trimmed || undefined;
}

export function extractInboundReplyToMessageId(payload: unknown): string | undefined {
  const body = payload as LinqWebhookPayload;
  const id =
    body.data?.reply_to?.message_id ??
    body.data?.message?.reply_to?.message_id ??
    body.message?.reply_to?.message_id;
  if (typeof id !== "string") return undefined;
  const trimmed = id.trim();
  return trimmed || undefined;
}

export async function resolveInboundThreadReplyParent(params: {
  userId: string;
  replyToMessageId?: string;
}): Promise<string | null> {
  const replyToMessageId = params.replyToMessageId?.trim();
  if (!replyToMessageId) return null;

  const { getDoeDtcMessageBodyByLinqId } = await import("@/lib/doedtc/doedtc-db");
  const fromDb = await getDoeDtcMessageBodyByLinqId(params.userId, replyToMessageId);
  if (fromDb) return fromDb;

  try {
    const message = await linqGetMessage(replyToMessageId);
    const text = extractInboundText({ data: { parts: message.parts ?? [] } });
    return text.trim() || null;
  } catch (error) {
    console.warn(
      "[doedtc] thread reply parent lookup failed:",
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
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


async function shouldApplyThreadReply(params: {
  userId: string;
  replyToInbound?: boolean;
  replyText: string;
  inboundMessageId?: string;
}): Promise<boolean> {
  if (!params.replyToInbound || !params.replyText.trim() || !params.inboundMessageId) {
    return false;
  }
  const recentUsed = await recentDoeDtcTurnsUsedThreadReply({ userId: params.userId, limit: 2 });
  return !recentUsed;
}

async function sendDoeDtcOutbound(params: {
  user: DoeDtcUserRow;
  chatId?: string;
  to?: string;
  text: string;
  idempotencyKey: string;
  replyToMessageId?: string;
}): Promise<void> {
  await linqSendText({
    to: params.to ?? params.user.phone,
    chatId: params.chatId ?? params.user.linq_chat_id ?? undefined,
    text: params.text,
    idempotencyKey: params.idempotencyKey,
    replyToMessageId: params.replyToMessageId,
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

async function sendDoeDtcMediaOutbound(params: {
  user: DoeDtcUserRow;
  chatId?: string;
  to?: string;
  url: string;
  caption?: string;
  idempotencyKey: string;
}): Promise<void> {
  await linqSendMedia({
    to: params.to ?? params.user.phone,
    chatId: params.chatId ?? params.user.linq_chat_id ?? undefined,
    url: params.url,
    caption: params.caption,
    idempotencyKey: params.idempotencyKey,
  });
  await logDoeDtcMessage({
    userId: params.user.id,
    direction: "outbound",
    body: params.caption ? `${params.caption} ${params.url}` : params.url,
  });
}

export async function sendDoeDtcBrowserScreenshotOutbound(params: {
  user: DoeDtcUserRow;
  chatId?: string;
  screenshotUrl: string;
  idempotencyKey: string;
}): Promise<void> {
  try {
    await sendDoeDtcMediaOutbound({
      user: params.user,
      chatId: params.chatId,
      to: params.user.phone,
      url: params.screenshotUrl,
      caption: DOEDTC_LINQ.screenshotIntro,
      idempotencyKey: params.idempotencyKey,
    });
  } catch (error) {
    console.warn(
      "[doedtc] screenshot media send failed, sending the blob link:",
      error instanceof Error ? error.message : String(error),
    );
    await sendDoeDtcOutbound({
      user: params.user,
      chatId: params.chatId ?? params.user.linq_chat_id ?? undefined,
      to: params.user.phone,
      text: DOEDTC_LINQ.screenshotIntro,
      idempotencyKey: `${params.idempotencyKey}-intro`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId: params.chatId,
      to: params.user.phone,
      url: params.screenshotUrl,
      idempotencyKey: `${params.idempotencyKey}-link`,
    });
  }
}

export async function sendDoeDtcBrowserFailureOutbound(params: {
  user: DoeDtcUserRow;
  error: string;
  idempotencyKey: string;
}): Promise<void> {
  const { toUserSafeBrowserError } = await import("@/lib/doedtc/doedtc-browser");
  await sendDoeDtcOutbound({
    user: params.user,
    chatId: params.user.linq_chat_id ?? undefined,
    to: params.user.phone,
    text: toUserSafeBrowserError(params.error),
    idempotencyKey: params.idempotencyKey,
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
    throw new Error("Enter a valid phone number with country code.");
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
      text: DOEDTC_LINQ.alreadyActiveMessage,
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
  const pendingBrowser = await getPendingConfirmDoeDtcBrowserJob(params.user.id);
  if (pendingBrowser) {
    const result = await commitDoeDtcBrowserTask({
      userId: params.user.id,
      jobId: pendingBrowser.id,
    });
    await sendDoeDtcOutbound({
      user: params.user,
      chatId: params.chatId,
      to: params.phone,
      text: result.ok
        ? `Done. ${result.outcome}`
        : "That browser action could not be completed. Tell me if you want to try again.",
      idempotencyKey: `doedtc-browser-commit-${params.user.id}-${pendingBrowser.id}`,
    });
    return;
  }

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
        text: DOEDTC_LINQ.alreadyActiveMessage,
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

export async function sendDoeDtcFamilyInviteMessage(params: {
  adminUser: DoeDtcUserRow;
  memberPhone: string;
  inviteToken: string;
  memberName: string;
}): Promise<void> {
  const phone = normalizePhoneToE164(params.memberPhone) ?? params.memberPhone.trim();
  const joinUrl = doeDtcJoinFamilyUrl(params.inviteToken);
  const intro = `${params.adminUser.full_name?.trim() || "Your family"} invited you to join them on Doe.`;

  await linqSendText({
    to: phone,
    text: `${intro}\n\n${DOEDTC_LINQ.familyInviteIntro}`,
    idempotencyKey: `doedtc-family-invite-intro-${params.inviteToken}`,
  });
  await logDoeDtcMessage({
    userId: params.adminUser.id,
    direction: "outbound",
    body: intro,
  });

  await linqSendLink({
    to: phone,
    url: joinUrl,
    idempotencyKey: `doedtc-family-invite-link-${params.inviteToken}`,
  });
  await logDoeDtcMessage({
    userId: params.adminUser.id,
    direction: "outbound",
    body: joinUrl,
  });
}

export async function sendDoeDtcHouseholdAccessRevokedNotice(params: {
  memberName: string;
  household: { admin_user_id: string };
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { data: adminUser } = await supabase
    .from("doedtc_users")
    .select("*")
    .eq("id", params.household.admin_user_id)
    .maybeSingle();
  if (!adminUser) return;
  const admin = adminUser as DoeDtcUserRow;
  const text = `${params.memberName.trim()} stopped sharing their Doe profile with the household.`;
  await linqSendText({
    to: admin.phone,
    text,
    idempotencyKey: `doedtc-household-revoke-${params.household.admin_user_id}-${Date.now()}`,
  });
  await logDoeDtcMessage({
    userId: admin.id,
    direction: "outbound",
    body: text,
  });
}

export async function sendDoeDtcAllSet(user: DoeDtcUserRow): Promise<void> {
  const chatId = user.linq_chat_id ?? undefined;

  await sendDoeDtcOutbound({
    user,
    chatId,
    to: user.phone,
    text: DOEDTC_LINQ.allSetMessage,
    idempotencyKey: `doedtc-all-set-${user.id}`,
  });

  await sendDoeDtcLinkOutbound({
    user,
    chatId,
    to: user.phone,
    url: doeDtcAppUrl(user.care_token),
    idempotencyKey: `doedtc-all-set-profile-${user.id}`,
  });
}

export async function handleOptOutInbound(phone: string): Promise<void> {
  const user = await getDoeDtcUserByPhone(phone);
  if (user) {
    await stopDoeDtcBrowserForUser(user.id);
  }
  await markDoeDtcUserOptedOut(phone);
}

function startWorkingTextAck(params: {
  enabled: boolean;
  send: () => Promise<void>;
}): { sentText: () => string | null; settle: () => Promise<void> } {
  const state: {
    cancelled: boolean;
    sentText: string | null;
    applying?: Promise<void>;
    timer?: ReturnType<typeof setTimeout>;
  } = { cancelled: false, sentText: null };

  if (!params.enabled) {
    return {
      sentText: () => null,
      settle: async () => undefined,
    };
  }

  state.timer = setTimeout(() => {
    state.applying = (async () => {
      if (state.cancelled) return;
      try {
        await params.send();
        state.sentText = DEFERRED_WORK_ACK;
      } catch (error) {
        console.warn(
          "[doedtc] working-on-it ack failed:",
          error instanceof Error ? error.message : String(error),
        );
      }
    })();
  }, WORKING_TEXT_ACK_DELAY_MS);

  return {
    sentText: () => state.sentText,
    settle: async () => {
      state.cancelled = true;
      if (state.timer) clearTimeout(state.timer);
      if (state.applying) await state.applying;
    },
  };
}

export async function handleSymptomInbound(params: {
  user: DoeDtcUserRow;
  text: string;
  inboundFileIds?: string[];
  extraVisionUrls?: string[];
  webhookEventId?: string;
  inboundMessageId?: string;
  threadReplyParentBody?: string | null;
}): Promise<void> {
  const chatId = params.user.linq_chat_id ?? undefined;
  const idSuffix = params.webhookEventId ?? Date.now();
  const turnId = createDoeDtcAgentTurnId();
  const turnStartedAtMs = Date.now();

  if (params.inboundMessageId) {
    if (!claimInboundTurn(params.inboundMessageId, turnId)) {
      return;
    }
    try {
      const existing = await listDoeDtcAgentTurnsByInboundMessageId(params.inboundMessageId);
      if (shouldSkipDuplicateInboundTurn(existing)) {
        return;
      }
    } catch (error) {
      console.warn(
        "[doedtc] inbound turn lookup failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  await beginDoeDtcTurnLifecycle({
    turnId,
    user: params.user,
    inboundText: params.text,
    inboundMessageId: params.inboundMessageId,
    chatId,
  });

  const stopTyping = startTypingPulse({
    chatId,
    pulse: linqStartTyping,
  });

  const workingAck = startWorkingTextAck({
    enabled: shouldSendWorkingTextAck({
      inboundText: params.text,
      hasFiles:
        (params.inboundFileIds?.length ?? 0) > 0 || (params.extraVisionUrls?.length ?? 0) > 0,
    }),
    send: () =>
      sendDoeDtcOutbound({
        user: params.user,
        chatId,
        to: params.user.phone,
        text: DEFERRED_WORK_ACK,
        idempotencyKey: `doedtc-working-ack-${params.user.id}-${idSuffix}`,
      }),
  });

  let turn: DoeDtcAgentTurnResult;
  let agentFailed = false;
  let agentError: string | undefined;

  try {
    turn = await withAgentTurnTimeout(
      runDoeDtcAgentTurn({
        user: params.user,
        inboundText: params.text,
        inboundFileIds: params.inboundFileIds,
        extraVisionUrls: params.extraVisionUrls,
        inboundMessageId: params.inboundMessageId,
        turnId,
        threadReplyParentBody: params.threadReplyParentBody,
      }),
    );
    if (turn.degenerate) {
      agentFailed = true;
      agentError = "Degenerate agent turn — no meaningful reply or tool action.";
    } else if (looksLikeUnwellShare(params.text)) {
      void getDoeDtcProfileSnapshot(params.user.id)
        .then((snapshot) =>
          seedCareFollowUpLoops({
            userId: params.user.id,
            snapshot,
            inboundText: params.text,
          }),
        )
        .catch((error) => {
          console.warn(
            "[doedtc] care seed after unwell turn failed:",
            error instanceof Error ? error.message : String(error),
          );
        });
    }
  } catch (error) {
    agentFailed = true;
    agentError = error instanceof Error ? error.message : "Agent turn failed.";
    turn = {
      replyText: AGENT_TURN_FALLBACK_REPLY,
      assessmentRan: false,
      replyToInbound: false,
    };
  } finally {
    await workingAck.settle();
  }

  const replyText = turn.replyText;
  if (agentFailed) {
    turn = {
      ...turn,
      careUrl: undefined,
      listenUrl: undefined,
      profileUrl: undefined,
      feedbackUrl: undefined,
      prepareUrl: undefined,
      guideUrl: undefined,
      artifactShareUrl: undefined,
      workUrl: undefined,
      screenshotUrl: undefined,
      vaultUrl: undefined,
      liveViewUrl: undefined,
      sessionUrl: undefined,
    };
  }
  const threadReply = await shouldApplyThreadReply({
    userId: params.user.id,
    replyToInbound: turn.replyToInbound,
    replyText,
    inboundMessageId: params.inboundMessageId,
  });
  const replyToMessageId =
    params.inboundMessageId && threadReply ? params.inboundMessageId : undefined;

  try {
    await completeDoeDtcTurnLifecycle({
      turnId,
      inboundMessageId: params.inboundMessageId,
      replyText,
      threadReply,
      deferFinalReaction: Boolean(turn.browserJobDispatched) && !agentFailed,
      failed: agentFailed,
      error: agentError,
      agentReaction: turn.reactionEmoji,
    });

    const firstOutbound = replyText || turn.careUrl || turn.listenUrl || turn.profileUrl || "";
    const ackAlreadySent = workingAck.sentText();
    if (firstOutbound && !ackAlreadySent) {
      await waitForOutboundThinkTime({
        startedAtMs: turnStartedAtMs,
        replyText: replyText || firstOutbound,
      });
    }
  } finally {
    stopTyping();
  }

  const ackAlreadySent = workingAck.sentText();

  if (replyText && !(ackAlreadySent && isRedundantWorkingAck(ackAlreadySent, replyText))) {
    const bubbles = splitOutboundBubbles(replyText);
    for (let i = 0; i < bubbles.length; i += 1) {
      const bubble = bubbles[i]!;
      if (i > 0) {
        if (chatId) {
          try {
            await linqStartTyping(chatId);
          } catch {
            // Typing between bubbles is best-effort.
          }
        }
        await waitForBubbleGap(bubble);
      }
      await sendDoeDtcOutbound({
        user: params.user,
        chatId,
        to: params.user.phone,
        text: bubble,
        idempotencyKey: `doedtc-agent-reply-${params.user.id}-${idSuffix}${i > 0 ? `-${i}` : ""}`,
        replyToMessageId: i === 0 ? replyToMessageId : undefined,
      });
    }
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
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.profileUrl,
      idempotencyKey: `doedtc-agent-profile-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.feedbackUrl) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.feedbackLinkIntro,
      idempotencyKey: `doedtc-agent-feedback-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.feedbackUrl,
      idempotencyKey: `doedtc-agent-feedback-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.prepareUrl) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.prepareLinkIntro,
      idempotencyKey: `doedtc-agent-prepare-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.prepareUrl,
      idempotencyKey: `doedtc-agent-prepare-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.guideUrl) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.guideLinkIntro,
      idempotencyKey: `doedtc-agent-guide-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.guideUrl,
      idempotencyKey: `doedtc-agent-guide-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.artifactShareUrl) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.artifactShareLinkIntro,
      idempotencyKey: `doedtc-agent-artifact-share-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.artifactShareUrl,
      idempotencyKey: `doedtc-agent-artifact-share-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.screenshotUrl && !turn.browserJobDispatched) {
    await sendDoeDtcMediaOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.screenshotUrl,
      caption: DOEDTC_LINQ.screenshotIntro,
      idempotencyKey: `doedtc-agent-shot-${params.user.id}-${idSuffix}`,
    });
  } else if (turn.workUrl && !turn.browserJobDispatched) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.workIntro,
      idempotencyKey: `doedtc-agent-work-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.workUrl,
      idempotencyKey: `doedtc-agent-work-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.vaultUrl) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.vaultIntro,
      idempotencyKey: `doedtc-agent-vault-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.vaultUrl,
      idempotencyKey: `doedtc-agent-vault-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.liveViewUrl) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.liveViewIntro,
      idempotencyKey: `doedtc-agent-live-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.liveViewUrl,
      idempotencyKey: `doedtc-agent-live-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.sessionUrl) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.sessionIntro,
      idempotencyKey: `doedtc-agent-session-intro-${params.user.id}-${idSuffix}`,
    });
    await sendDoeDtcLinkOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      url: turn.sessionUrl,
      idempotencyKey: `doedtc-agent-session-${params.user.id}-${idSuffix}`,
    });
  }

  if (turn.browserNeedsConfirm) {
    await sendDoeDtcOutbound({
      user: params.user,
      chatId,
      to: params.user.phone,
      text: DOEDTC_LINQ.browserConfirmPrompt,
      idempotencyKey: `doedtc-agent-browser-confirm-${params.user.id}-${idSuffix}`,
    });
  }

  void addDoeDtcMem0Turn({
    userId: params.user.id,
    inboundText: params.text,
    replyText,
  });

  try {
    await settleInlineScheduledSends();
  } catch (error) {
    console.warn(
      "[doedtc] inline scheduled send failed:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

export async function processDoeDtcInboundWebhook(params: {
  payload: unknown;
  webhookEventId?: string;
}): Promise<void> {
  const phone = extractInboundPhone(params.payload);
  const text = extractInboundText(params.payload);
  let inboundMedia = extractInboundMedia(params.payload);
  const inboundMessageId = extractInboundMessageId(params.payload);
  if (!phone || (!text && inboundMedia.length === 0)) return;

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
    if (process.env.NODE_ENV === "production") {
      console.info("[doedtc] opt-out", redactDoeDtcLogText(text));
    }
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

  const inboundLog = await logDoeDtcMessage({
    userId: user.id,
    direction: "inbound",
    body: text || (inboundMedia.length > 0 ? "[attachment]" : ""),
    linqMessageId: inboundMessageId ?? null,
    webhookEventId: params.webhookEventId ?? null,
  });
  const isDuplicateWebhook = !inboundLog.logged && Boolean(params.webhookEventId);

  if (inboundMessageId && inboundMedia.length > 0) {
    try {
      const message = await linqGetMessage(inboundMessageId);
      const fromApi = extractInboundMedia({ data: { parts: message.parts ?? [] } });
      if (fromApi.length > 0) {
        const byKey = new Map<string, InboundMediaAttachment>();
        for (const row of [...inboundMedia, ...fromApi]) {
          const key = row.attachmentId || row.url || `${row.filename ?? ""}:${row.mime ?? ""}`;
          const current = byKey.get(key);
          byKey.set(key, {
            url: row.url || current?.url,
            mime: row.mime || current?.mime,
            filename: row.filename || current?.filename,
            attachmentId: row.attachmentId || current?.attachmentId,
          });
        }
        inboundMedia = Array.from(byKey.values());
      }
    } catch (error) {
      console.warn(
        "[doedtc] linq message hydrate failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  let agentInboundText = text;
  let inboundFileIds: string[] = [];
  let extraVisionUrls: string[] = [];
  if (inboundMedia.length > 0) {
    try {
      const { ingestInboundDoeDtcMedia } = await import("@/lib/doedtc/doedtc-files");
      const ingested = await ingestInboundDoeDtcMedia({ user, attachments: inboundMedia });
      inboundFileIds = ingested.fileIds;
      extraVisionUrls = ingested.visionUrls;
    } catch (error) {
      console.error(
        "[doedtc] inbound media ingest failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  if (inboundFileIds.length === 0) {
    const { listRecentDoeDtcFiles } = await import("@/lib/doedtc/doedtc-files-db");
    const { bindRecentInboundFileIds } = await import("@/lib/doedtc/agent/attachments");
    inboundFileIds = bindRecentInboundFileIds({
      inboundText: text,
      thisTurnFileIds: inboundFileIds,
      recentFiles: await listRecentDoeDtcFiles(user.id, 8),
    });
  }

  if (inboundFileIds.length > 0) {
    agentInboundText = [text, `[attachments: ${inboundFileIds.join(", ")}]`].filter(Boolean).join("\n");
  } else if (inboundMedia.length > 0 || extraVisionUrls.length > 0) {
    agentInboundText = [text, "[attachment]"].filter(Boolean).join("\n");
  }

  if (isDuplicateWebhook) {
    // First attempt may have logged the message but failed before ingest/agent finished.
    if (inboundMedia.length === 0 && inboundFileIds.length === 0 && extraVisionUrls.length === 0) {
      return;
    }
    if (inboundMedia.length > 0 && inboundFileIds.length === 0 && extraVisionUrls.length === 0) {
      return;
    }
  }

  if (isHiDoeMessage(text)) {
    await handleHiDoeInbound({ user, phone, chatId, fromNumber });
    return;
  }

  if (isConfirmMessage(text)) {
    await handleConfirmInbound({ user, phone, chatId, fromNumber });
    return;
  }

  const workflowHandled = await tryHandleWorkflowInbound({ phone, text, user });
  if (workflowHandled) return;

  const accountabilityHandled = await tryHandleAccountabilityInbound({ phone, text, user });
  if (accountabilityHandled) return;

  if (user.status === "active") {
    let replyToMessageId = extractInboundReplyToMessageId(params.payload);
    if (!replyToMessageId && inboundMessageId) {
      try {
        const message = await linqGetMessage(inboundMessageId);
        replyToMessageId = extractInboundReplyToMessageId({ data: message });
      } catch (error) {
        console.warn(
          "[doedtc] inbound reply_to hydrate failed:",
          error instanceof Error ? error.message : String(error),
        );
      }
    }
    const threadReplyParentBody = replyToMessageId
      ? await resolveInboundThreadReplyParent({
          userId: user.id,
          replyToMessageId,
        })
      : null;

    await handleSymptomInbound({
      user,
      text: agentInboundText,
      inboundFileIds,
      extraVisionUrls,
      webhookEventId: params.webhookEventId,
      inboundMessageId,
      threadReplyParentBody,
    });
    return;
  }

  if (user.status === "onboarding") {
    await sendGetStartedMessages({ user, phone, chatId, fromNumber });
    return;
  }

  // invited / pending_confirm: wait for Hi Doe or CONFIRM; no stray reminders
}

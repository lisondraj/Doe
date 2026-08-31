import { createHmac, timingSafeEqual } from "crypto";

const LINQ_API_BASE = "https://api.linqapp.com/api/partner";

export type LinqTextPart = {
  type: "text";
  value: string;
};

export type LinqLinkPart = {
  type: "link";
  value: string;
};

export type LinqMediaPart = {
  type: "media";
  url: string;
};

export type LinqMessagePart = LinqTextPart | LinqLinkPart | LinqMediaPart;

export type LinqSendMessageResponse = {
  chat_id: string;
  created_new_chat: boolean;
  from: string;
  service?: string;
  message?: {
    id: string;
  };
};

function getLinqApiKey(): string {
  const key = process.env.LINQ_API_KEY;
  if (!key || key.startsWith("your-")) {
    throw new Error("Linq is not configured: LINQ_API_KEY is missing.");
  }
  return key;
}

function buildLinqMessage(params: {
  parts: LinqMessagePart[];
  idempotencyKey?: string;
  replyToMessageId?: string;
}) {
  return {
    preferred_service: "iMessage",
    parts: params.parts,
    ...(params.idempotencyKey ? { idempotency_key: params.idempotencyKey } : {}),
    ...(params.replyToMessageId
      ? { reply_to: { message_id: params.replyToMessageId, part_index: 0 } }
      : {}),
  };
}

async function linqRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${LINQ_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getLinqApiKey()}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Linq request failed (${response.status}): ${body.slice(0, 400)}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export async function linqSendToPhone(params: {
  to: string;
  parts: LinqMessagePart[];
  idempotencyKey?: string;
  replyToMessageId?: string;
}): Promise<LinqSendMessageResponse> {
  return linqRequest<LinqSendMessageResponse>("/v3/messages", {
    method: "POST",
    body: JSON.stringify({
      to: [params.to],
      message: buildLinqMessage(params),
    }),
  });
}

export async function linqSendToChat(params: {
  chatId: string;
  parts: LinqMessagePart[];
  idempotencyKey?: string;
  replyToMessageId?: string;
}): Promise<{ message?: { id: string } }> {
  return linqRequest<{ message?: { id: string } }>(`/v3/chats/${params.chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({
      message: buildLinqMessage(params),
    }),
  });
}

export async function linqSendParts(params: {
  to?: string;
  chatId?: string;
  parts: LinqMessagePart[];
  idempotencyKey?: string;
  replyToMessageId?: string;
}): Promise<LinqSendMessageResponse | { message?: { id: string } }> {
  const lastError = (error: unknown) =>
    error instanceof Error ? error : new Error("Linq send failed.");

  if (params.to) {
    try {
      return await linqSendToPhone({
        to: params.to,
        parts: params.parts,
        idempotencyKey: params.idempotencyKey,
        replyToMessageId: params.replyToMessageId,
      });
    } catch (error) {
      if (!params.chatId) throw lastError(error);
      return linqSendToChat({
        chatId: params.chatId,
        parts: params.parts,
        idempotencyKey: params.idempotencyKey,
        replyToMessageId: params.replyToMessageId,
      });
    }
  }

  if (!params.chatId) {
    throw new Error("Either to or chatId is required to send a Linq message.");
  }

  return linqSendToChat({
    chatId: params.chatId,
    parts: params.parts,
    idempotencyKey: params.idempotencyKey,
    replyToMessageId: params.replyToMessageId,
  });
}

export async function linqSendText(params: {
  to?: string;
  chatId?: string;
  text: string;
  idempotencyKey?: string;
  replyToMessageId?: string;
}): Promise<LinqSendMessageResponse | { message?: { id: string } }> {
  return linqSendParts({
    to: params.to,
    chatId: params.chatId,
    parts: [{ type: "text", value: params.text }],
    idempotencyKey: params.idempotencyKey,
    replyToMessageId: params.replyToMessageId,
  });
}

export async function linqSendLink(params: {
  to?: string;
  chatId?: string;
  url: string;
  idempotencyKey?: string;
}): Promise<LinqSendMessageResponse | { message?: { id: string } }> {
  return linqSendParts({
    to: params.to,
    chatId: params.chatId,
    parts: [{ type: "link", value: params.url }],
    idempotencyKey: params.idempotencyKey,
  });
}

export async function linqSendMedia(params: {
  to?: string;
  chatId?: string;
  url: string;
  caption?: string;
  idempotencyKey?: string;
}): Promise<LinqSendMessageResponse | { message?: { id: string } }> {
  const parts: LinqMessagePart[] = [];
  if (params.caption?.trim()) {
    parts.push({ type: "text", value: params.caption.trim() });
  }
  parts.push({ type: "media", url: params.url });
  return linqSendParts({
    to: params.to,
    chatId: params.chatId,
    parts,
    idempotencyKey: params.idempotencyKey,
  });
}

export type LinqContactCard = {
  phone_number: string;
  first_name: string;
  last_name?: string;
  image_url?: string;
  is_active?: boolean;
};

export async function linqCreateContactCard(params: {
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  imageUrl: string;
}): Promise<LinqContactCard> {
  return linqRequest<LinqContactCard>("/v3/contact_card", {
    method: "POST",
    body: JSON.stringify({
      phone_number: params.phoneNumber,
      first_name: params.firstName,
      ...(params.lastName ? { last_name: params.lastName } : {}),
      image_url: params.imageUrl,
    }),
  });
}

export async function linqUpdateContactCard(params: {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}): Promise<LinqContactCard> {
  return linqRequest<LinqContactCard>("/v3/contact_card", {
    method: "PATCH",
    body: JSON.stringify({
      phone_number: params.phoneNumber,
      ...(params.firstName ? { first_name: params.firstName } : {}),
      ...(params.lastName ? { last_name: params.lastName } : {}),
      ...(params.imageUrl ? { image_url: params.imageUrl } : {}),
    }),
  });
}

export async function linqShareContactCard(chatId: string): Promise<void> {
  await linqRequest<unknown>(`/v3/chats/${chatId}/share_contact_card`, {
    method: "POST",
  });
}

const TAPBACK_BY_EMOJI: Record<string, "love" | "like" | "dislike" | "laugh" | "emphasize" | "question"> =
  {
    "❤️": "love",
    "❤": "love",
    "♥": "love",
    "♥️": "love",
    "👍": "like",
    "👎": "dislike",
    "😂": "laugh",
    "😆": "laugh",
    "😄": "laugh",
    "‼️": "emphasize",
    "❗": "emphasize",
    "❓": "question",
    "❔": "question",
  };

function firstGrapheme(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const parts = Array.from(
      new Intl.Segmenter("en", { granularity: "grapheme" }).segment(trimmed),
    );
    if (parts[0]) return parts[0].segment;
  }
  return Array.from(trimmed)[0] ?? "";
}

export function linqReactionPayload(
  emoji: string,
  operation: "add" | "remove" = "add",
): {
  operation: "add" | "remove";
  type: "love" | "like" | "dislike" | "laugh" | "emphasize" | "question" | "custom";
  custom_emoji?: string;
} {
  const grapheme = firstGrapheme(emoji);
  const tapback = TAPBACK_BY_EMOJI[grapheme];
  if (tapback) {
    return { operation, type: tapback };
  }
  return { operation, type: "custom", custom_emoji: grapheme };
}

export async function linqSetReaction(params: {
  messageId: string;
  emoji: string;
  operation?: "add" | "remove";
}): Promise<void> {
  const emoji = params.emoji.trim();
  if (!emoji) {
    throw new Error("Reaction emoji is required.");
  }

  await linqRequest<unknown>(`/v3/messages/${encodeURIComponent(params.messageId)}/reactions`, {
    method: "POST",
    body: JSON.stringify(linqReactionPayload(emoji, params.operation ?? "add")),
  });
}

export async function linqAddReaction(params: {
  messageId: string;
  emoji: string;
}): Promise<void> {
  await linqSetReaction({ messageId: params.messageId, emoji: params.emoji, operation: "add" });
}

export async function linqRemoveReaction(params: {
  messageId: string;
  emoji: string;
}): Promise<void> {
  await linqSetReaction({ messageId: params.messageId, emoji: params.emoji, operation: "remove" });
}

export async function linqMarkChatRead(chatId: string): Promise<void> {
  await linqRequest<unknown>(`/v3/chats/${encodeURIComponent(chatId)}/read`, {
    method: "POST",
  });
}

export async function linqStartTyping(chatId: string): Promise<void> {
  await linqRequest<unknown>(`/v3/chats/${encodeURIComponent(chatId)}/typing`, {
    method: "POST",
  });
}

export async function linqStopTyping(chatId: string): Promise<void> {
  await linqRequest<unknown>(`/v3/chats/${encodeURIComponent(chatId)}/typing`, {
    method: "DELETE",
  });
}

export function verifyLinqWebhookSignature(params: {
  rawBody: string;
  headers: Headers;
}): boolean {
  const secret = process.env.LINQ_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Linq webhook secret is not configured.");
  }

  const msgId = params.headers.get("webhook-id");
  const timestamp = params.headers.get("webhook-timestamp");
  const signature = params.headers.get("webhook-signature");
  if (!msgId || !timestamp || !signature) {
    return false;
  }

  const ts = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) {
    return false;
  }

  const secretStr = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const keyBytes = Buffer.from(secretStr, "base64");
  const signedContent = `${msgId}.${timestamp}.${params.rawBody}`;
  const expected = createHmac("sha256", keyBytes).update(signedContent).digest("base64");

  return signature.split(" ").some((sig) => {
    if (!sig.startsWith("v1,")) return false;
    try {
      return timingSafeEqual(
        Buffer.from(expected, "base64"),
        Buffer.from(sig.slice(3), "base64"),
      );
    } catch {
      return false;
    }
  });
}

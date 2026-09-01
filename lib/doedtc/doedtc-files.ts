import { put } from "@vercel/blob";

import { insertDoeDtcFile } from "@/lib/doedtc/doedtc-files-db";
import { linqGetAttachment, linqSendMedia } from "@/lib/doedtc/linq";
import type { InboundMediaAttachment } from "@/lib/doedtc/doedtc-messaging";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";
import { logDoeDtcMessage } from "@/lib/doedtc/doedtc-db";

export function sanitizeInboundBlobFilename(filename: string): string {
  const base = filename.split(/[\\/]/).pop() ?? "attachment";
  const stripped = base.split("?")[0]?.split("#")[0] ?? "attachment";
  const cleaned = stripped.replace(/[^\w.\-]+/g, "_").replace(/^\.+/, "").replace(/_+/g, "_");
  const trimmed = cleaned.replace(/^_+|_+$/g, "") || "attachment";
  return trimmed.slice(0, 120);
}

function filenameFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.split("/").pop() || "attachment");
  } catch {
    return url.split("/").pop()?.split("?")[0] || "attachment";
  }
}

async function fetchAttachmentBytes(attachment: InboundMediaAttachment): Promise<{
  buffer: Buffer;
  mime: string;
  filename: string;
}> {
  const tried: string[] = [];
  const urls: string[] = [];
  if (attachment.url) urls.push(attachment.url);

  if (attachment.attachmentId) {
    try {
      const meta = await linqGetAttachment(attachment.attachmentId);
      if (meta.download_url && meta.download_url !== attachment.url) {
        urls.push(meta.download_url);
      }
      if (!attachment.filename && meta.filename) {
        attachment = { ...attachment, filename: meta.filename, mime: attachment.mime ?? meta.content_type };
      } else if (!attachment.mime && meta.content_type) {
        attachment = { ...attachment, mime: meta.content_type };
      }
    } catch (error) {
      console.warn(
        "[doedtc:files] linq attachment lookup failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  let lastError = "No download URL.";
  for (const url of urls) {
    tried.push(url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        lastError = `HTTP ${response.status} fetching attachment`;
        continue;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.byteLength === 0) {
        lastError = "Empty attachment body.";
        continue;
      }
      const mime =
        attachment.mime ??
        response.headers.get("content-type")?.split(";")[0]?.trim() ??
        "application/octet-stream";
      const filename = sanitizeInboundBlobFilename(
        attachment.filename ?? filenameFromUrl(url),
      );
      return { buffer, mime, filename };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }

  throw new Error(`${lastError}${tried.length ? ` (${tried.length} URL attempt(s))` : ""}`);
}

export async function ingestInboundDoeDtcMedia(params: {
  user: DoeDtcUserRow;
  attachments: InboundMediaAttachment[];
}): Promise<string[]> {
  const fileIds: string[] = [];
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  for (const attachment of params.attachments) {
    try {
      const { buffer, mime, filename } = await fetchAttachmentBytes(attachment);
      const uploaded = await put(
        `doedtc/inbound/${params.user.id}/${Date.now()}-${filename}`,
        buffer,
        {
          access: "public",
          contentType: mime,
          addRandomSuffix: true,
          ...(token ? { token } : {}),
        },
      );
      const row = await insertDoeDtcFile({
        userId: params.user.id,
        blobUrl: uploaded.url,
        mime,
        filename,
        bytes: buffer.byteLength,
        source: "inbound",
      });
      fileIds.push(row.id);
    } catch (error) {
      console.error(
        "[doedtc:files] inbound ingest failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }
  return fileIds;
}

export async function sendDoeDtcFileOutbound(params: {
  user: DoeDtcUserRow;
  chatId?: string;
  to: string;
  blobUrl: string;
  caption?: string;
  idempotencyKey: string;
}): Promise<void> {
  await linqSendMedia({
    chatId: params.chatId,
    to: params.to,
    url: params.blobUrl,
    caption: params.caption,
    idempotencyKey: params.idempotencyKey,
  });
  await logDoeDtcMessage({
    userId: params.user.id,
    direction: "outbound",
    body: params.caption ?? "[file]",
  });
}

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

function sniffVisionMime(buffer: Buffer, mime?: string): string | null {
  const normalized = mime?.toLowerCase().split(";")[0]?.trim() ?? "";
  if (normalized === "image/jpg" || normalized === "image/jpeg") return "image/jpeg";
  if (normalized === "image/png" || normalized === "image/gif" || normalized === "image/webp") {
    return normalized;
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "image/png";
  }
  return null;
}

export function bufferToVisionDataUrl(buffer: Buffer, mime?: string): string | null {
  const visionMime = sniffVisionMime(buffer, mime);
  if (!visionMime) return null;
  return `data:${visionMime};base64,${buffer.toString("base64")}`;
}

async function fetchUrlBytes(url: string, withAuth: boolean): Promise<Buffer | null> {
  const headers: Record<string, string> = {};
  if (withAuth) {
    const key = process.env.LINQ_API_KEY?.trim();
    if (key) headers.Authorization = `Bearer ${key}`;
  }
  const response = await fetch(url, { headers, redirect: "follow" });
  if (!response.ok) return null;
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.byteLength > 0 ? buffer : null;
}

async function fetchAttachmentBytes(attachment: InboundMediaAttachment): Promise<{
  buffer: Buffer;
  mime: string;
  filename: string;
  sourceUrl?: string;
}> {
  const urls: string[] = [];
  if (attachment.url) urls.push(attachment.url);

  if (attachment.attachmentId) {
    try {
      const meta = await linqGetAttachment(attachment.attachmentId);
      if (meta.download_url && !urls.includes(meta.download_url)) {
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
    for (const withAuth of [false, true]) {
      try {
        const buffer = await fetchUrlBytes(url, withAuth);
        if (!buffer) {
          lastError = `Failed fetching attachment${withAuth ? " with auth" : ""}`;
          continue;
        }
        const mime =
          sniffVisionMime(buffer, attachment.mime) ??
          attachment.mime ??
          "application/octet-stream";
        const filename = sanitizeInboundBlobFilename(
          attachment.filename ?? filenameFromUrl(url),
        );
        return { buffer, mime, filename, sourceUrl: url };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
    }
  }

  throw new Error(`${lastError}${urls.length ? ` (${urls.length} URL(s))` : ""}`);
}

export type InboundMediaIngestResult = {
  fileIds: string[];
  visionUrls: string[];
};

export async function ingestInboundDoeDtcMedia(params: {
  user: DoeDtcUserRow;
  attachments: InboundMediaAttachment[];
}): Promise<InboundMediaIngestResult> {
  const fileIds: string[] = [];
  const visionUrls: string[] = [];
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  for (const attachment of params.attachments) {
    try {
      const { buffer, mime, filename, sourceUrl } = await fetchAttachmentBytes(attachment);
      let persistedUrl: string | null = null;
      try {
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
        persistedUrl = uploaded.url;
      } catch (error) {
        console.error(
          "[doedtc:files] blob upload failed:",
          error instanceof Error ? error.message : String(error),
        );
      }

      const blobUrl = persistedUrl ?? sourceUrl ?? "";
      if (blobUrl) {
        try {
          const row = await insertDoeDtcFile({
            userId: params.user.id,
            blobUrl,
            mime,
            filename,
            bytes: buffer.byteLength,
            source: "inbound",
          });
          fileIds.push(row.id);
        } catch (error) {
          console.error(
            "[doedtc:files] file row insert failed:",
            error instanceof Error ? error.message : String(error),
          );
        }
      }

      const visionUrl =
        persistedUrl ??
        bufferToVisionDataUrl(buffer, mime) ??
        (sniffVisionMime(buffer, mime) ? sourceUrl : null);
      if (visionUrl) visionUrls.push(visionUrl);
    } catch (error) {
      console.error(
        "[doedtc:files] inbound ingest failed:",
        error instanceof Error ? error.message : String(error),
      );
      if (attachment.url && /\.(jpe?g|png|gif|webp)(\?|$)/i.test(attachment.url)) {
        visionUrls.push(attachment.url);
      }
    }
  }
  return { fileIds, visionUrls };
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

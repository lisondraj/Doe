import { put } from "@vercel/blob";

import { insertDoeDtcFile } from "@/lib/doedtc/doedtc-files-db";
import { linqSendMedia } from "@/lib/doedtc/linq";
import type { InboundMediaAttachment } from "@/lib/doedtc/doedtc-messaging";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";
import { logDoeDtcMessage } from "@/lib/doedtc/doedtc-db";

export async function ingestInboundDoeDtcMedia(params: {
  user: DoeDtcUserRow;
  attachments: InboundMediaAttachment[];
}): Promise<string[]> {
  const fileIds: string[] = [];
  for (const attachment of params.attachments) {
    const response = await fetch(attachment.url);
    if (!response.ok) continue;
    const buffer = Buffer.from(await response.arrayBuffer());
    const mime = attachment.mime ?? response.headers.get("content-type") ?? "application/octet-stream";
    const filename = attachment.filename ?? attachment.url.split("/").pop() ?? "attachment";
    const uploaded = await put(`doedtc/inbound/${params.user.id}/${Date.now()}-${filename}`, buffer, {
      access: "public",
      contentType: mime,
    });
    const row = await insertDoeDtcFile({
      userId: params.user.id,
      blobUrl: uploaded.url,
      mime,
      filename,
      bytes: buffer.byteLength,
      source: "inbound",
    });
    fileIds.push(row.id);
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
    mediaUrl: params.blobUrl,
    text: params.caption,
    idempotencyKey: params.idempotencyKey,
  });
  await logDoeDtcMessage({
    userId: params.user.id,
    direction: "outbound",
    body: params.caption ?? "[file]",
  });
}

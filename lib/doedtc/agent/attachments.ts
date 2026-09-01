import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import { getDoeDtcFile, listRecentDoeDtcFiles, type DoeDtcFileRow } from "@/lib/doedtc/doedtc-files-db";

const execFileAsync = promisify(execFile);

export const INBOUND_ATTACHMENTS_RE = /\[attachments:\s*([^\]]+)\]/i;
export const BARE_ATTACHMENT_BODY = /^\[attachment\]$/i;

export type VisionContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string; detail?: "auto" | "low" | "high" } };

export type SdkVisionContentPart =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image: string; detail?: "auto" | "low" | "high" };

export type DoeDtcAttachmentContext = {
  thisTurnFileIds: string[];
  recentFiles: DoeDtcFileRow[];
  visionImageUrls: string[];
  recentFilesLog: string;
  inboundTextForModel: string;
};

const VISION_MIME_PREFIXES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const HEIC_MIME = new Set(["image/heic", "image/heif"]);

export function parseInboundAttachmentIds(text: string): string[] {
  const match = INBOUND_ATTACHMENTS_RE.exec(text);
  if (!match?.[1]) return [];
  return match[1]
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function inboundHasAttachments(text: string): boolean {
  return INBOUND_ATTACHMENTS_RE.test(text) || BARE_ATTACHMENT_BODY.test(text.trim());
}

export function stripEmDash(text: string): string {
  return text.replace(/\u2014/g, "-").replace(/\s+-\s+/g, " - ");
}

export function fileKindLabel(file: Pick<DoeDtcFileRow, "mime" | "filename">): string {
  const mime = file.mime?.toLowerCase() ?? "";
  const filename = file.filename?.toLowerCase() ?? "";
  if (mime.startsWith("image/") || /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(filename)) {
    return "photo";
  }
  if (mime === "application/pdf" || filename.endsWith(".pdf")) return "pdf";
  return "file";
}

export function formatFileAgeLabel(createdAt: string, nowMs = Date.now()): string {
  const ms = Math.max(0, nowMs - new Date(createdAt).getTime());
  if (ms < 60_000) return "just now";
  if (ms < 3_600_000) return `${Math.max(1, Math.floor(ms / 60_000))}m ago`;
  if (ms < 86_400_000) return `${Math.max(1, Math.floor(ms / 3_600_000))}h ago`;
  return `${Math.max(1, Math.floor(ms / 86_400_000))}d ago`;
}

export function formatDoeDtcFileLogLine(file: DoeDtcFileRow, nowMs = Date.now()): string {
  const kind = fileKindLabel(file);
  const name = file.filename?.trim() || "attachment";
  const age = formatFileAgeLabel(file.created_at, nowMs);
  return `${kind}, ${name}, ${age} (id: ${file.id})`;
}

export function formatRecentDoeDtcFilesLog(files: DoeDtcFileRow[], nowMs = Date.now()): string {
  if (files.length === 0) return "None yet.";
  return files.map((file) => `- ${formatDoeDtcFileLogLine(file, nowMs)}`).join("\n");
}

function isVisionReadyMime(mime: string | null, filename: string | null): boolean {
  const normalized = mime?.toLowerCase() ?? "";
  if (HEIC_MIME.has(normalized)) return false;
  if (VISION_MIME_PREFIXES.includes(normalized)) return true;
  if (/\.(jpe?g|png|gif|webp)$/i.test(filename ?? "")) return true;
  return false;
}

function isPdfFile(file: Pick<DoeDtcFileRow, "mime" | "filename">): boolean {
  const mime = file.mime?.toLowerCase() ?? "";
  const filename = file.filename?.toLowerCase() ?? "";
  return mime === "application/pdf" || filename.endsWith(".pdf");
}

async function rasterizePdfFirstPage(blobUrl: string): Promise<string | null> {
  let dir: string | null = null;
  try {
    const response = await fetch(blobUrl);
    if (!response.ok) return null;
    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    dir = await mkdtemp(join(tmpdir(), "doedtc-pdf-"));
    const pdfPath = join(dir, "input.pdf");
    const outputPrefix = join(dir, "page");
    await writeFile(pdfPath, pdfBuffer);
    await execFileAsync("pdftoppm", ["-f", "1", "-l", "1", "-png", pdfPath, outputPrefix], {
      timeout: 20_000,
    });
    const pngPath = `${outputPrefix}-1.png`;
    const pngBuffer = await readFile(pngPath);
    return `data:image/png;base64,${pngBuffer.toString("base64")}`;
  } catch {
    return null;
  } finally {
    if (dir) {
      await rm(dir, { recursive: true, force: true }).catch(() => undefined);
    }
  }
}

export async function resolveVisionUrlForFile(file: DoeDtcFileRow): Promise<string | null> {
  if (isVisionReadyMime(file.mime, file.filename)) {
    return file.blob_url;
  }
  if (isPdfFile(file)) {
    return rasterizePdfFirstPage(file.blob_url);
  }
  return null;
}

export async function resolveVisionUrlsForFiles(files: DoeDtcFileRow[], limit = 4): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    if (urls.length >= limit) break;
    const url = await resolveVisionUrlForFile(file);
    if (url) urls.push(url);
  }
  return urls;
}

export function replaceInboundAttachmentMarkers(
  text: string,
  filesById: Map<string, DoeDtcFileRow>,
  nowMs = Date.now(),
): string {
  let replaced = text.replace(INBOUND_ATTACHMENTS_RE, (_, rawIds: string) => {
    const ids = rawIds
      .split(",")
      .map((part: string) => part.trim())
      .filter(Boolean);
    const lines = ids
      .map((id) => filesById.get(id))
      .filter((row): row is DoeDtcFileRow => Boolean(row))
      .map((file) => formatDoeDtcFileLogLine(file, nowMs));
    return lines.length > 0 ? `[attachments: ${lines.join("; ")}]` : "[attachments]";
  });

  if (BARE_ATTACHMENT_BODY.test(replaced.trim())) {
    const newest = Array.from(filesById.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];
    if (newest) {
      replaced = formatDoeDtcFileLogLine(newest, nowMs);
    }
  }

  return replaced;
}

export function enrichTranscriptBodiesForAgent(
  messages: Array<{ direction: string; body: string }>,
  filesById: Map<string, DoeDtcFileRow>,
  recentInboundFiles: DoeDtcFileRow[],
  nowMs = Date.now(),
): Array<{ direction: string; body: string }> {
  const unusedInbound = [...recentInboundFiles].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return messages.map((row) => {
    let body = row.body;
    if (INBOUND_ATTACHMENTS_RE.test(body)) {
      body = replaceInboundAttachmentMarkers(body, filesById, nowMs);
      return { ...row, body };
    }
    if (BARE_ATTACHMENT_BODY.test(body.trim()) && row.direction === "inbound") {
      const match = unusedInbound.shift();
      if (match) {
        body = formatDoeDtcFileLogLine(match, nowMs);
      }
    }
    return { ...row, body };
  });
}

export function buildLegacyVisionUserContent(text: string, imageUrls: string[]): string | VisionContentPart[] {
  if (imageUrls.length === 0) return text;
  const parts: VisionContentPart[] = [{ type: "text", text }];
  for (const url of imageUrls) {
    parts.push({ type: "image_url", image_url: { url, detail: "auto" } });
  }
  return parts;
}

export function buildSdkVisionUserInput(text: string, imageUrls: string[]): string | SdkVisionContentPart[] {
  if (imageUrls.length === 0) return text;
  const parts: SdkVisionContentPart[] = [{ type: "input_text", text }];
  for (const url of imageUrls) {
    parts.push({ type: "input_image", image: url, detail: "auto" });
  }
  return parts;
}

export async function loadDoeDtcAttachmentContext(params: {
  userId: string;
  inboundText: string;
  inboundFileIds?: string[];
}): Promise<DoeDtcAttachmentContext> {
  const parsedIds = parseInboundAttachmentIds(params.inboundText);
  const thisTurnFileIds = Array.from(new Set([...(params.inboundFileIds ?? []), ...parsedIds]));
  const recentFiles = await listRecentDoeDtcFiles(params.userId, 12);

  const filesById = new Map(recentFiles.map((file) => [file.id, file]));
  for (const fileId of thisTurnFileIds) {
    if (filesById.has(fileId)) continue;
    const row = await getDoeDtcFile({ userId: params.userId, fileId });
    if (row) {
      filesById.set(row.id, row);
      recentFiles.unshift(row);
    }
  }

  const thisTurnFiles = thisTurnFileIds
    .map((id) => filesById.get(id))
    .filter((row): row is DoeDtcFileRow => Boolean(row));

  const visionImageUrls = await resolveVisionUrlsForFiles(thisTurnFiles);
  const inboundTextForModel = replaceInboundAttachmentMarkers(params.inboundText, filesById);

  return {
    thisTurnFileIds,
    recentFiles: Array.from(filesById.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ),
    visionImageUrls,
    recentFilesLog: formatRecentDoeDtcFilesLog(Array.from(filesById.values()).slice(0, 10)),
    inboundTextForModel,
  };
}

export async function describeDoeDtcAttachment(params: {
  userId: string;
  fileId: string;
}): Promise<
  | {
      ok: true;
      file: DoeDtcFileRow;
      logLine: string;
      visionUrl: string | null;
      visionReady: boolean;
    }
  | { ok: false; error: string }
> {
  const file = await getDoeDtcFile({ userId: params.userId, fileId: params.fileId });
  if (!file) return { ok: false, error: "File not found." };
  const visionUrl = await resolveVisionUrlForFile(file);
  return {
    ok: true,
    file,
    logLine: formatDoeDtcFileLogLine(file),
    visionUrl,
    visionReady: Boolean(visionUrl),
  };
}

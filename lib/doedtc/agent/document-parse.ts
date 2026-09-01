import { z } from "zod";

import {
  describeDoeDtcAttachment,
  resolveVisionUrlsForFiles,
  stripEmDash,
  type DoeDtcAttachmentContext,
} from "@/lib/doedtc/agent/attachments";
import { fetchOpenAiWithRetry } from "@/lib/doedtc/agent/openai-retry";
import { executeDoeDtcTool } from "@/lib/doedtc/agent/tool-dispatch";
import { resolveDoeDtcAgentModel } from "@/lib/doedtc/agent/types";
import { getDoeDtcFile } from "@/lib/doedtc/doedtc-files-db";
import type { DoeDtcProfileSnapshot, DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";
import type { DoeDtcToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";

export const DOCUMENT_KINDS = [
  "lab_panel",
  "medication_list",
  "appointment",
  "vaccine",
  "rx",
  "insurance",
  "id_card",
  "other",
] as const;

export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export const PARSE_DOCUMENT_WRITE_TOOLS = [
  "log_result",
  "add_medication",
  "add_condition",
  "log_appointment",
  "log_symptoms",
  "remember_fact",
] as const;

export type ParseDocumentWriteTool = (typeof PARSE_DOCUMENT_WRITE_TOOLS)[number];

const DocumentWriteSchema = z.object({
  tool: z.enum(PARSE_DOCUMENT_WRITE_TOOLS),
  args: z.record(z.string(), z.unknown()),
});

export const DocumentParseSchema = z.object({
  kind: z.enum(DOCUMENT_KINDS),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  writes: z.array(DocumentWriteSchema).default([]),
});

export type DocumentParseResult = z.infer<typeof DocumentParseSchema>;

const DOCUMENT_PARSE_SYSTEM = `You extract structured health document data from photos or PDF page images.
Return JSON only with keys: kind, confidence, summary, writes.

kind is one of: lab_panel, medication_list, appointment, vaccine, rx, insurance, id_card, other.
confidence is 0 to 1.
summary is one plain iMessage sentence with no em dash character.
writes is an array of chart commits using only these tools:
- log_result: { title, resulted_at, summary?, source? } — one row per analyte/value. summary like "7.8 % · <6.5".
- add_medication: { name }
- add_condition: { name }
- log_appointment: { title, timing_precision, starts_at?, timing_note?, location?, notes? }
- log_symptoms: { raw_text, summary?, severity?, onset?, tags? }
- remember_fact: { fact, category? }

Never invent values you cannot read. For unclear photos use kind other, low confidence, and writes [].
Use ISO dates when visible. For vague appointment timing use timing_precision approximate with timing_note.`;

export function sanitizeDocumentParseSummary(summary: string): string {
  return stripEmDash(summary.replace(/\s+/g, " ").trim());
}

export function normalizeDocumentParseResult(raw: unknown): DocumentParseResult {
  const parsed = DocumentParseSchema.parse(raw);
  return {
    ...parsed,
    summary: sanitizeDocumentParseSummary(parsed.summary),
    writes: parsed.writes.map((row) => ({
      tool: row.tool,
      args: row.args,
    })),
  };
}

export function mapLabPanelToLogResultWrites(params: {
  resultedAt: string;
  analytes: Array<{ title: string; summary?: string }>;
}): Array<{ tool: "log_result"; args: Record<string, unknown> }> {
  return params.analytes.map((row) => ({
    tool: "log_result" as const,
    args: {
      title: row.title,
      resulted_at: params.resultedAt,
      summary: row.summary ?? null,
      source: "document photo",
    },
  }));
}

export function shouldAutoCommitDocumentParse(params: {
  parse: DocumentParseResult;
  inboundText: string;
  attachmentTurn: boolean;
}): boolean {
  if (!params.attachmentTurn) return false;
  if (params.parse.confidence < 0.82) return false;
  if (params.parse.kind === "other") return false;
  if (params.parse.writes.length === 0) return false;

  const caption = params.inboundText
    .replace(/\[attachments:[^\]]+\]/i, "")
    .trim()
    .toLowerCase();
  if (!caption) return true;
  return /\b(?:here'?s|my|labs?|results?|rx|prescription|meds?|appointment|card|vaccine|shot record)\b/i.test(
    caption,
  );
}

async function visionJsonParse(params: {
  imageUrls: string[];
  caption?: string;
}): Promise<DocumentParseResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }
  if (params.imageUrls.length === 0) {
    throw new Error("No vision-ready images for this document.");
  }

  const userContent: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string; detail?: "auto" } }
  > = [
    {
      type: "text",
      text: params.caption?.trim()
        ? `User caption: ${params.caption.trim()}`
        : "User sent this document with no caption.",
    },
  ];
  for (const url of params.imageUrls) {
    userContent.push({ type: "image_url", image_url: { url, detail: "auto" } });
  }

  const response = await fetchOpenAiWithRetry("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: resolveDoeDtcAgentModel(),
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: DOCUMENT_PARSE_SYSTEM },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Document parse failed: ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Document parse returned no content.");
  }

  return normalizeDocumentParseResult(JSON.parse(content));
}

export async function parseDoeDtcDocuments(params: {
  userId: string;
  fileIds: string[];
  caption?: string;
}): Promise<{
  parse: DocumentParseResult;
  fileIds: string[];
  visionReady: boolean;
}> {
  const files = (
    await Promise.all(params.fileIds.map((fileId) => getDoeDtcFile({ userId: params.userId, fileId })))
  ).filter((row): row is NonNullable<typeof row> => Boolean(row));

  if (files.length === 0) {
    throw new Error("No matching files for this user.");
  }

  const visionUrls = await resolveVisionUrlsForFiles(files, 4);
  const parse = await visionJsonParse({
    imageUrls: visionUrls,
    caption: params.caption,
  });

  return {
    parse,
    fileIds: files.map((file) => file.id),
    visionReady: visionUrls.length > 0,
  };
}

export async function executeDocumentParseWrites(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  snapshot: DoeDtcProfileSnapshot;
  state: DoeDtcToolTurnState;
  writes: Array<{ tool: ParseDocumentWriteTool; args: Record<string, unknown> }>;
}): Promise<Array<{ tool: string; ok: boolean; output?: unknown; error?: string }>> {
  const results: Array<{ tool: string; ok: boolean; output?: unknown; error?: string }> = [];
  for (const write of params.writes) {
    try {
      const output = await executeDoeDtcTool({
        name: write.tool,
        args: write.args,
        ctx: {
          user: params.user,
          inboundText: params.inboundText,
          snapshot: params.snapshot,
        },
        state: params.state,
      });
      results.push({ tool: write.tool, ok: true, output });
    } catch (error) {
      results.push({
        tool: write.tool,
        ok: false,
        error: error instanceof Error ? error.message : "Write failed.",
      });
    }
  }
  return results;
}

export async function runParseDocumentTool(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  snapshot: DoeDtcProfileSnapshot;
  state: DoeDtcToolTurnState;
  fileIds: string[];
  caption?: string;
  autoCommit?: boolean;
  attachmentContext?: Pick<DoeDtcAttachmentContext, "thisTurnFileIds">;
}): Promise<Record<string, unknown>> {
  const fileIds =
    params.fileIds.length > 0
      ? params.fileIds
      : params.attachmentContext?.thisTurnFileIds?.length
        ? params.attachmentContext.thisTurnFileIds
        : [];

  if (fileIds.length === 0) {
    throw new Error("file_ids is required when no attachments are on this turn.");
  }

  const { parse, visionReady } = await parseDoeDtcDocuments({
    userId: params.user.id,
    fileIds,
    caption: params.caption ?? params.inboundText,
  });

  const autoCommit =
    params.autoCommit ??
    shouldAutoCommitDocumentParse({
      parse,
      inboundText: params.inboundText,
      attachmentTurn: true,
    });

  let writeResults: Array<{ tool: string; ok: boolean; output?: unknown; error?: string }> = [];
  if (autoCommit && parse.writes.length > 0) {
    writeResults = await executeDocumentParseWrites({
      user: params.user,
      inboundText: params.inboundText,
      snapshot: params.snapshot,
      state: params.state,
      writes: parse.writes,
    });
  }

  return {
    ok: true,
    kind: parse.kind,
    confidence: parse.confidence,
    summary: parse.summary,
    vision_ready: visionReady,
    proposed_writes: parse.writes,
    auto_committed: autoCommit,
    write_results: writeResults,
    file_ids: fileIds,
  };
}

export async function runReadAttachmentTool(params: {
  userId: string;
  fileId: string;
}): Promise<Record<string, unknown>> {
  const described = await describeDoeDtcAttachment({ userId: params.userId, fileId: params.fileId });
  if (!described.ok) {
    return { ok: false, error: described.error };
  }
  return {
    ok: true,
    file_id: described.file.id,
    filename: described.file.filename,
    mime: described.file.mime,
    source: described.file.source,
    created_at: described.file.created_at,
    log_line: described.logLine,
    blob_url: described.file.blob_url,
    vision_ready: described.visionReady,
    vision_url: described.visionUrl,
  };
}

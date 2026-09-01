import { z } from "zod";

import { extractChartMentions } from "@/lib/doedtc/agent/action-slots";
import {
  describeDoeDtcAttachment,
  inboundHasAttachments,
  resolveVisionUrlsForFiles,
  stripEmDash,
  type DoeDtcAttachmentContext,
} from "@/lib/doedtc/agent/attachments";
import { looksLikeBrowseAsk } from "@/lib/doedtc/doedtc-browser-allowlist";
import { fetchOpenAiWithRetry } from "@/lib/doedtc/agent/openai-retry";
import { executeDoeDtcTool } from "@/lib/doedtc/agent/tool-dispatch";
import { resolveDoeDtcAgentModel } from "@/lib/doedtc/agent/types";
import { getDoeDtcFile } from "@/lib/doedtc/doedtc-files-db";
import type { HouseholdMemberLike } from "@/lib/doedtc/doedtc-household-policy";
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
  patient_name: z.string().trim().min(1).nullable().optional(),
  writes: z.array(DocumentWriteSchema).default([]),
});

export type DocumentParseResult = {
  kind: DocumentKind;
  confidence: number;
  summary: string;
  patient_name: string | null;
  writes: Array<{ tool: ParseDocumentWriteTool; args: Record<string, unknown> }>;
};

const WRITE_TOOL_ALIASES: Record<string, ParseDocumentWriteTool> = {
  log_results: "log_result",
  log_lab: "log_result",
  log_labs: "log_result",
  add_result: "log_result",
  add_lab: "log_result",
  save_result: "log_result",
  create_result: "log_result",
  log_test: "log_result",
  log_value: "log_result",
  add_med: "add_medication",
  add_meds: "add_medication",
  log_medication: "add_medication",
  add_rx: "add_medication",
  add_diagnosis: "add_condition",
  log_condition: "add_condition",
  log_appt: "log_appointment",
  add_appointment: "log_appointment",
  book_appointment: "log_appointment",
  log_symptom: "log_symptoms",
  add_symptom: "log_symptoms",
  remember: "remember_fact",
  add_fact: "remember_fact",
  save_fact: "remember_fact",
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function coerceDocumentKind(value: unknown): DocumentKind {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if ((DOCUMENT_KINDS as readonly string[]).includes(raw)) return raw as DocumentKind;
  if (/\b(labs?|lft|blood|cbc|a1c|panel|results?|liver|metabolic)\b/.test(raw)) return "lab_panel";
  if (/\b(med|rx|prescription|medication)\b/.test(raw)) return "medication_list";
  if (/\b(appt|appointment|visit|checkup)\b/.test(raw)) return "appointment";
  if (/\b(vaccine|shot|immunization)\b/.test(raw)) return "vaccine";
  if (/\b(insurance|coverage)\b/.test(raw)) return "insurance";
  if (/\b(id|license|passport)\b/.test(raw)) return "id_card";
  return "other";
}

function coerceResultedAt(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
    const parsed = Date.parse(trimmed);
    if (Number.isFinite(parsed)) return new Date(parsed).toISOString().slice(0, 10);
  }
  return fallback;
}

function coerceWriteTool(value: unknown, kind: DocumentKind, row: Record<string, unknown>): ParseDocumentWriteTool | null {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if ((PARSE_DOCUMENT_WRITE_TOOLS as readonly string[]).includes(raw)) {
    return raw as ParseDocumentWriteTool;
  }
  if (raw && WRITE_TOOL_ALIASES[raw]) return WRITE_TOOL_ALIASES[raw]!;
  if (row.title || row.analyte || row.test || row.value || row.resulted_at || row.result) {
    return "log_result";
  }
  if (kind === "medication_list" && (row.name || row.medication)) return "add_medication";
  if (kind === "appointment" && (row.title || row.name || row.when)) return "log_appointment";
  if (kind === "lab_panel") return "log_result";
  return null;
}

function coerceWriteArgs(
  tool: ParseDocumentWriteTool,
  row: Record<string, unknown>,
  fallbackDate: string,
): Record<string, unknown> {
  const nested = asRecord(row.args) ?? {};
  const merged = { ...row, ...nested };
  delete merged.tool;
  delete merged.args;
  if (tool === "log_result") {
    const title = String(merged.title ?? merged.analyte ?? merged.test ?? merged.name ?? "").trim();
    return {
      title,
      resulted_at: coerceResultedAt(merged.resulted_at ?? merged.date ?? merged.collected_at, fallbackDate),
      summary:
        typeof merged.summary === "string" && merged.summary.trim()
          ? merged.summary.trim()
          : [merged.value, merged.flag, merged.range, merged.unit]
              .filter((part) => part != null && String(part).trim())
              .map((part) => String(part).trim())
              .join(" · ") || null,
      source: typeof merged.source === "string" ? merged.source : "document photo",
    };
  }
  if (tool === "add_medication") {
    return { name: String(merged.name ?? merged.medication ?? merged.title ?? "").trim() };
  }
  if (tool === "add_condition") {
    return { name: String(merged.name ?? merged.condition ?? merged.title ?? "").trim() };
  }
  return merged;
}

const DOCUMENT_PARSE_SYSTEM = `You extract structured health document data from photos or PDF page images.
Return JSON only with keys: kind, confidence, summary, patient_name, writes.

Read the patient / subject name printed on the document first (Patient, Name, Child, DOB block). Put that in patient_name. Then extract the results. A parent may send a child's labs with no caption — still name the child.

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
  const record = asRecord(raw) ?? {};
  const kind = coerceDocumentKind(record.kind ?? record.type ?? record.document_kind);
  const fallbackDate =
    coerceResultedAt(record.date ?? record.collected_at ?? record.resulted_at, "") ||
    new Date().toISOString().slice(0, 10);
  const writeRows = Array.isArray(record.writes)
    ? record.writes
    : Array.isArray(record.results)
      ? record.results
      : Array.isArray(record.analytes)
        ? record.analytes
        : [];
  const writes = writeRows
    .map((row) => asRecord(row))
    .filter((row): row is Record<string, unknown> => Boolean(row))
    .map((row) => {
      const tool = coerceWriteTool(row.tool, kind, row);
      if (!tool) return null;
      const args = coerceWriteArgs(tool, row, fallbackDate);
      if (tool === "log_result" && !String(args.title ?? "").trim()) return null;
      if ((tool === "add_medication" || tool === "add_condition") && !String(args.name ?? "").trim()) {
        return null;
      }
      return { tool, args };
    })
    .filter((row): row is { tool: ParseDocumentWriteTool; args: Record<string, unknown> } => Boolean(row));

  const confidenceRaw = Number(record.confidence);
  const confidence = Number.isFinite(confidenceRaw)
    ? Math.min(1, Math.max(0, confidenceRaw))
    : writes.length > 0
      ? 0.88
      : 0.4;
  const patientName =
    typeof record.patient_name === "string" && record.patient_name.trim()
      ? record.patient_name.trim()
      : typeof record.patient === "string" && record.patient.trim()
        ? record.patient.trim()
        : null;

  return {
    kind,
    confidence,
    summary: sanitizeDocumentParseSummary(String(record.summary ?? "")),
    patient_name: patientName,
    writes,
  };
}

export function resolveDocumentPatientName(params: {
  parsedName?: string | null;
  caption: string;
  members: HouseholdMemberLike[];
  viewerUserId: string;
}): { name: string | null; onChart: boolean } {
  const captionMentions = extractChartMentions({
    inboundText: params.caption,
    members: params.members,
    viewerUserId: params.viewerUserId,
  });
  if (captionMentions.mentioned[0]) {
    return { name: captionMentions.mentioned[0].full_name, onChart: true };
  }
  if (captionMentions.unknownNames[0]) {
    return { name: captionMentions.unknownNames[0], onChart: false };
  }

  const parsed = params.parsedName?.trim();
  if (!parsed) return { name: null, onChart: false };

  const fromDoc = extractChartMentions({
    inboundText: `for ${parsed}`,
    members: params.members,
    viewerUserId: params.viewerUserId,
  });
  if (fromDoc.mentioned[0]) {
    return { name: fromDoc.mentioned[0].full_name, onChart: true };
  }
  return { name: parsed, onChart: false };
}

export function applyDocumentSubjectToWrites(
  writes: Array<{ tool: ParseDocumentWriteTool; args: Record<string, unknown> }>,
  memberName: string | null,
): Array<{ tool: ParseDocumentWriteTool; args: Record<string, unknown> }> {
  const name = memberName?.trim();
  if (!name) return writes;
  return writes.map((row) => ({
    ...row,
    args: {
      ...row.args,
      member_name:
        typeof row.args.member_name === "string" && row.args.member_name.trim()
          ? row.args.member_name
          : name,
    },
  }));
}

export function buildDocumentSavingNotice(params: {
  inboundText: string;
  memberName?: string | null;
}): string {
  const name = params.memberName?.trim();
  if (name) return `Saving this to ${name}'s chart now.`;
  const guessed = extractChartMentions({
    inboundText: params.inboundText.replace(/\[attachments:[^\]]+\]/gi, "").replace(/\[attachment\]/gi, ""),
    members: [],
  });
  const fromCaption = guessed.mentioned[0]?.full_name ?? guessed.unknownNames[0];
  if (fromCaption) return `Saving this to ${fromCaption}'s chart now.`;
  return "Saving this now.";
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

  try {
    return normalizeDocumentParseResult(JSON.parse(content));
  } catch {
    return {
      kind: "other",
      confidence: 0,
      summary: "I could see the file but the structured read was messy.",
      patient_name: null,
      writes: [],
    };
  }
}

export async function parseDoeDtcDocuments(params: {
  userId: string;
  fileIds: string[];
  caption?: string;
  fallbackVisionUrls?: string[];
}): Promise<{
  parse: DocumentParseResult;
  fileIds: string[];
  visionReady: boolean;
}> {
  const files = (
    await Promise.all(params.fileIds.map((fileId) => getDoeDtcFile({ userId: params.userId, fileId })))
  ).filter((row): row is NonNullable<typeof row> => Boolean(row));

  if (files.length === 0 && (params.fallbackVisionUrls?.length ?? 0) === 0) {
    throw new Error("No matching files for this user.");
  }

  const fromFiles = files.length > 0 ? await resolveVisionUrlsForFiles(files, 4) : [];
  const visionUrls = [
    ...fromFiles,
    ...(params.fallbackVisionUrls ?? []).filter(Boolean),
  ].slice(0, 4);

  if (visionUrls.length === 0) {
    return {
      parse: {
        kind: "other",
        confidence: 0,
        summary: "The file arrived but I could not open a readable page yet.",
        patient_name: null,
        writes: [],
      },
      fileIds: files.map((file) => file.id),
      visionReady: false,
    };
  }

  const parse = await visionJsonParse({
    imageUrls: visionUrls,
    caption: params.caption,
  });

  return {
    parse,
    fileIds: files.map((file) => file.id),
    visionReady: true,
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
  attachmentContext?: Pick<DoeDtcAttachmentContext, "thisTurnFileIds" | "visionImageUrls">;
}): Promise<Record<string, unknown>> {
  if (params.state.documentParse) {
    return params.state.documentParse;
  }

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
    fallbackVisionUrls: params.attachmentContext?.visionImageUrls,
  });

  const subject = resolveDocumentPatientName({
    parsedName: parse.patient_name,
    caption: params.caption ?? params.inboundText,
    members: params.snapshot.household?.members ?? [],
    viewerUserId: params.user.id,
  });
  const writes = subject.onChart
    ? applyDocumentSubjectToWrites(parse.writes, subject.name)
    : parse.writes;

  const autoCommit =
    params.autoCommit ??
    shouldAutoCommitDocumentParse({
      parse: { ...parse, writes },
      inboundText: params.inboundText,
      attachmentTurn: true,
    });

  let writeResults: Array<{ tool: string; ok: boolean; output?: unknown; error?: string }> = [];
  if (autoCommit && writes.length > 0) {
    writeResults = await executeDocumentParseWrites({
      user: params.user,
      inboundText: params.inboundText,
      snapshot: params.snapshot,
      state: params.state,
      writes,
    });
  }

  const result = {
    ok: true,
    kind: parse.kind,
    confidence: parse.confidence,
    summary: parse.summary,
    patient_name: subject.name,
    subject_on_chart: subject.onChart,
    vision_ready: visionReady,
    proposed_writes: writes,
    auto_committed: autoCommit,
    write_results: writeResults,
    file_ids: fileIds,
  };
  params.state.documentParse = result;
  return result;
}

export async function ensureInboundDocumentParsed(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  snapshot: DoeDtcProfileSnapshot;
  state: DoeDtcToolTurnState;
  attachmentContext?: DoeDtcAttachmentContext;
}): Promise<Record<string, unknown> | null> {
  if (looksLikeBrowseAsk(params.inboundText)) return null;
  const fileIds = params.attachmentContext?.thisTurnFileIds ?? [];
  if (fileIds.length === 0 && !inboundHasAttachments(params.inboundText)) return null;
  if (params.state.toolsExecuted?.some((row) => row.name === "parse_document" && row.ok)) {
    return params.state.documentParse ?? null;
  }

  return executeDoeDtcTool({
    name: "parse_document",
    args: fileIds.length > 0 ? { file_ids: fileIds } : {},
    ctx: {
      user: params.user,
      inboundText: params.inboundText,
      snapshot: params.snapshot,
      attachmentContext: params.attachmentContext,
    },
    state: params.state,
  });
}

export function formatDocumentParseForPrompt(output: Record<string, unknown> | null): string | null {
  if (!output || output.ok === false) return null;
  const summary = typeof output.summary === "string" ? output.summary.trim() : "";
  if (!summary) return null;
  const saved = output.auto_committed === true;
  return `Inbound document already parsed and ${saved ? "saved to the chart" : "read"}: ${summary}. Do not say you could not read it. Narrate what landed. Do not call parse_document again.`;
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

import { z } from "zod";

import { extractChartMentions, isPlausiblePersonName } from "@/lib/doedtc/agent/action-slots";
import {
  describeDoeDtcAttachment,
  inboundHasAttachments,
  resolveVisionUrlsForFiles,
  stripEmDash,
  type DoeDtcAttachmentContext,
} from "@/lib/doedtc/agent/attachments";
import { looksLikeBrowseAsk } from "@/lib/doedtc/doedtc-browser-allowlist";
import { attachChartSectionLink } from "@/lib/doedtc/agent/chart-write";
import { looksLikeChartWrite } from "@/lib/doedtc/agent/deliverable-policy";
import { fetchOpenAiWithRetry } from "@/lib/doedtc/agent/openai-retry";
import { createInitialToolTurnState, executeDoeDtcTool } from "@/lib/doedtc/agent/tool-dispatch";
import { resolveDoeDtcAgentModel } from "@/lib/doedtc/agent/types";
import { addDoeDtcHouseholdMember, getDoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-db";
import { normalizeDoeDtcFamilyRelationship } from "@/lib/doedtc/doedtc-family-relationship";
import { getDoeDtcFile } from "@/lib/doedtc/doedtc-files-db";
import type { HouseholdMemberLike } from "@/lib/doedtc/doedtc-household-policy";
import {
  clearAgentPending,
  getAgentPending,
  isDocumentIdentityPending,
  setAgentPending,
  type DoeDtcAgentPendingRow,
} from "@/lib/doedtc/doedtc-pending";
import type {
  DoeDtcFamilyRelationship,
  DoeDtcProfileSnapshot,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";
import type { DoeDtcToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";

export const CANT_ADD_PHOTO_REPLY = "I can't add this photo.";

const NAME_JUNK_TOKENS = new Set([
  "null",
  "undefined",
  "none",
  "n/a",
  "na",
  "unknown",
  "patient",
  "name",
  "mr",
  "mrs",
  "ms",
  "miss",
  "dr",
  "prof",
  "sir",
]);

const SELF_CLAIM_RE =
  /\b(?:it'?s|that'?s|this is)\s+me\b|\b(?:they'?re|these are|this is|it'?s)\s+mine\b|\bmy own\b|\b(?:those|these) are my (?:own )?(?:labs?|results?)\b/i;

const SAVE_OWN_RESULTS_RE =
  /\b(?:log|save|add|put|record)\b.{0,48}\b(?:these|this|them|it)\b.{0,40}\b(?:chart|profile|results?)\b/i;

const SAVE_DEMONSTRATIVE_RE =
  /\b(?:log|save|add|put|record)\s+(?:these|this|them|it|that|those)\b/i;

const INVITE_ASK_RE = /\b(?:invite|add (?:them|him|her|to (?:the |my )?household))\b/i;

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
  const writes: Array<{ tool: ParseDocumentWriteTool; args: Record<string, unknown> }> = writeRows
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
  const summary = sanitizeDocumentParseSummary(String(record.summary ?? ""));
  if (writes.length === 0 && (kind === "lab_panel" || /\b(?:labs?|lft|liver|panel|results?)\b/i.test(summary))) {
    writes.push({
      tool: "log_result",
      args: {
        title: /\b(?:liver|lft)\b/i.test(summary) ? "Liver function test" : "Lab panel",
        resulted_at: fallbackDate,
        summary: summary || null,
        source: "document photo",
      },
    });
  }

  return {
    kind,
    confidence,
    summary,
    patient_name: patientName,
    writes,
  };
}

export function extractResultedAtFromText(text: string): string | null {
  const iso = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (iso?.[1]) return iso[1];
  const us = text.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/);
  if (!us) return null;
  const month = Number(us[1]);
  const day = Number(us[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  let year = Number(us[3]);
  if (year < 100) year += 2000;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function looksLikeSaveDocumentToOwnChart(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (SELF_CLAIM_RE.test(trimmed)) return true;
  if (/\b(?:family(?: profile)?|household)\b/i.test(trimmed) && INVITE_ASK_RE.test(trimmed)) {
    return false;
  }
  if (SAVE_OWN_RESULTS_RE.test(trimmed) || SAVE_DEMONSTRATIVE_RE.test(trimmed)) return true;
  return looksLikeChartWrite(trimmed) && /\b(?:these|this|them|mine|my chart)\b/i.test(trimmed);
}

function inboundNamesViewer(text: string, viewerName?: string | null): boolean {
  const first = nameTokens(viewerName)[0];
  if (!first || first.length < 3) return false;
  const escaped = first.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}

export function extractTitleIsNameReply(text: string): string | null {
  const match = text.match(/\btitle\s*(?:is|:)\s+([^,\n]+)/i);
  if (!match?.[1]) return null;
  return match[1]
    .replace(/\s+and\s+\d{1,2}\/\d{1,2}\/\d{2,4}.*$/i, "")
    .replace(/\s+and\s+20\d{2}-\d{2}-\d{2}.*$/i, "")
    .trim();
}

export function looksLikePersonNameResultTitle(params: {
  title: string;
  viewerName?: string | null;
  memberNames?: string[];
}): boolean {
  const title = params.title.trim();
  if (!title) return false;
  const fromTitleReply = extractTitleIsNameReply(`title is ${title}`) ?? title;
  if (namesLooselyMatch(fromTitleReply, params.viewerName) || namesLooselyMatch(title, params.viewerName)) {
    return true;
  }
  if (params.memberNames?.some((name) => namesLooselyMatch(title, name) || namesLooselyMatch(fromTitleReply, name))) {
    return true;
  }
  const first = nameTokens(params.viewerName)[0];
  const tokens = nameTokens(title);
  return Boolean(first && tokens.length <= 2 && tokens.includes(first));
}

export function preferredLabResultTitle(params: {
  title?: string | null;
  fallback?: string | null;
  viewerName?: string | null;
  memberNames?: string[];
}): string {
  const candidates = [params.title, params.fallback, "Lab results"];
  for (const candidate of candidates) {
    const trimmed = candidate?.trim() ?? "";
    if (!trimmed) continue;
    if (
      looksLikePersonNameResultTitle({
        title: trimmed,
        viewerName: params.viewerName,
        memberNames: params.memberNames,
      })
    ) {
      continue;
    }
    return trimmed;
  }
  return "Lab results";
}

export type DocumentSubjectDisposition = "self" | "household" | "unknown_name" | "unnamed";

export type DocumentSubjectResolution = {
  name: string | null;
  printedName: string | null;
  onChart: boolean;
  matchesUser: boolean;
  canSave: boolean;
  disposition: DocumentSubjectDisposition;
};

export function nameTokens(value?: string | null): string[] {
  if (!value?.trim()) return [];
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/[\s'-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !NAME_JUNK_TOKENS.has(token) && !/^\d+(yrs?|years?)?$/.test(token));
}

export function namesLooselyMatch(left?: string | null, right?: string | null): boolean {
  const a = nameTokens(left);
  const b = nameTokens(right);
  if (a.length === 0 || b.length === 0) return false;
  const setA = new Set(a);
  const setB = new Set(b);
  if (a.length === b.length && a.every((token) => setB.has(token))) return true;

  const [shorter, longer] = a.length <= b.length ? [a, setB] : [b, setA];
  const subset = shorter.every((token) => longer.has(token));
  if (!subset) {
    if (a.length >= 2 && b.length >= 2 && a[0] === b[0] && a[a.length - 1] === b[b.length - 1]) {
      return true;
    }
    return false;
  }
  if (!shorter.some((token) => token.length >= 3)) return false;
  if (a.length >= 2 && b.length >= 2 && a[0] !== b[0] && a[a.length - 1] !== b[b.length - 1]) {
    return false;
  }
  return true;
}

function findHouseholdMatch(
  members: HouseholdMemberLike[],
  name: string,
): HouseholdMemberLike | null {
  return (
    members.find((row) => namesLooselyMatch(row.full_name, name)) ??
    (nameTokens(name).length === 1
      ? members.find((row) => namesLooselyMatch(row.full_name.split(/\s+/)[0] ?? "", name))
      : null) ??
    null
  );
}

export function resolveDocumentPatientName(params: {
  parsedName?: string | null;
  caption: string;
  members: HouseholdMemberLike[];
  viewerUserId: string;
  viewerName?: string | null;
}): DocumentSubjectResolution {
  const printed = params.parsedName?.trim() || null;
  if (looksLikeSaveDocumentToOwnChart(params.caption)) {
    return {
      name: params.viewerName?.trim() || printed,
      printedName: printed,
      onChart: true,
      matchesUser: true,
      canSave: true,
      disposition: "self",
    };
  }
  const captionMentions = extractChartMentions({
    inboundText: params.caption,
    members: params.members,
    viewerUserId: params.viewerUserId,
  });

  const resolveKnown = (raw: string): DocumentSubjectResolution => {
    if (namesLooselyMatch(raw, params.viewerName)) {
      return {
        name: params.viewerName?.trim() || raw,
        printedName: printed,
        onChart: true,
        matchesUser: true,
        canSave: true,
        disposition: "self",
      };
    }
    const member = findHouseholdMatch(params.members, raw);
    if (member) {
      const matchesUser = Boolean(member.user_id && member.user_id === params.viewerUserId);
      return {
        name: member.full_name,
        printedName: printed,
        onChart: true,
        matchesUser,
        canSave: true,
        disposition: matchesUser ? "self" : "household",
      };
    }
    return {
      name: raw,
      printedName: printed,
      onChart: false,
      matchesUser: false,
      canSave: false,
      disposition: "unknown_name",
    };
  };

  if (printed) {
    const fromDoc = extractChartMentions({
      inboundText: `for ${printed}`,
      members: params.members,
      viewerUserId: params.viewerUserId,
    });
    if (fromDoc.mentioned[0] && namesLooselyMatch(printed, fromDoc.mentioned[0].full_name)) {
      return resolveKnown(fromDoc.mentioned[0].full_name);
    }
    return resolveKnown(printed);
  }

  if (captionMentions.mentioned[0]) {
    return resolveKnown(captionMentions.mentioned[0].full_name);
  }
  if (captionMentions.unknownNames[0]) {
    return resolveKnown(captionMentions.unknownNames[0]);
  }
  if (namesLooselyMatch(params.caption, params.viewerName)) {
    return resolveKnown(params.viewerName!.trim());
  }

  return {
    name: null,
    printedName: null,
    onChart: false,
    matchesUser: false,
    canSave: false,
    disposition: "unnamed",
  };
}

export type DocumentIdentityReply =
  | { action: "decline" }
  | { action: "save_self" }
  | { action: "save_other"; name: string; invite: boolean; relationship: DoeDtcFamilyRelationship }
  | { action: "unresolved" };

function relationshipFromIdentityReply(text: string): DoeDtcFamilyRelationship {
  const match = text.match(
    /\b(son|daughter|kid|child|wife|husband|spouse|partner|mom|mother|dad|father|brother|sister|grandma|grandpa)\b/i,
  );
  return normalizeDoeDtcFamilyRelationship(match?.[1] ?? "") ?? "other";
}

export function interpretDocumentIdentityReply(params: {
  inboundText: string;
  viewerName?: string | null;
  members: HouseholdMemberLike[];
  viewerUserId: string;
  printedName?: string | null;
}): DocumentIdentityReply {
  const text = params.inboundText.trim();
  if (!text) return { action: "unresolved" };
  if (/^(no|nope|nah|don't|do not|stop|cancel|nevermind|never mind|not now|skip)\b/i.test(text)) {
    return { action: "decline" };
  }
  const titleName = extractTitleIsNameReply(text);
  if (
    SELF_CLAIM_RE.test(text) ||
    looksLikeSaveDocumentToOwnChart(text) ||
    namesLooselyMatch(text, params.viewerName) ||
    (titleName && namesLooselyMatch(titleName, params.viewerName)) ||
    (inboundNamesViewer(text, params.viewerName) && Boolean(extractResultedAtFromText(text)))
  ) {
    return { action: "save_self" };
  }

  const mentions = extractChartMentions({
    inboundText: text,
    members: params.members,
    viewerUserId: params.viewerUserId,
  });
  const named = [mentions.mentioned[0]?.full_name, mentions.unknownNames[0]].find(
    (name) => typeof name === "string" && isPlausiblePersonName(name),
  );
  const invite = INVITE_ASK_RE.test(text);
  if (named) {
    if (namesLooselyMatch(named, params.viewerName)) return { action: "save_self" };
    return {
      action: "save_other",
      name: named,
      invite,
      relationship: relationshipFromIdentityReply(text),
    };
  }

  if (
    params.printedName &&
    (/^(yes|y|yep|yeah|sure|ok|okay|do it|go ahead|please|confirm|sounds good|that works)\b/i.test(
      text,
    ) ||
      invite)
  ) {
    if (namesLooselyMatch(params.printedName, params.viewerName)) return { action: "save_self" };
    return {
      action: "save_other",
      name: params.printedName,
      invite: true,
      relationship: relationshipFromIdentityReply(text),
    };
  }

  return { action: "unresolved" };
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
  canSave?: boolean;
}): boolean {
  if (params.canSave === false) return false;
  if (!params.attachmentTurn) return false;
  if (params.parse.confidence < 0.82) return false;
  if (params.parse.kind === "other") return false;
  if (params.parse.writes.length === 0) return false;

  const caption = params.inboundText
    .replace(/\[attachments:[^\]]+\]/i, "")
    .trim()
    .toLowerCase();
  if (!caption) return true;
  if (looksLikeSaveDocumentToOwnChart(params.inboundText)) return true;
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
    viewerName: params.user.full_name,
  });
  const writes = subject.canSave
    ? applyDocumentSubjectToWrites(
        parse.writes,
        subject.matchesUser ? null : subject.name,
      )
    : parse.writes;

  const autoCommit =
    subject.canSave &&
    (params.autoCommit ??
      shouldAutoCommitDocumentParse({
        parse: { ...parse, writes },
        inboundText: params.inboundText,
        attachmentTurn: true,
        canSave: subject.canSave,
      }));

  let writeResults: Array<{ tool: string; ok: boolean; output?: unknown; error?: string }> = [];
  if (autoCommit && writes.length > 0) {
    writeResults = await executeDocumentParseWrites({
      user: params.user,
      inboundText: params.inboundText,
      snapshot: params.snapshot,
      state: params.state,
      writes,
    });
    const labsUrl = profileUrlForSavedDocumentWrites({
      careToken: params.user.care_token,
      results: writeResults,
      existingProfileUrl: params.state.profileUrl,
    });
    if (labsUrl) params.state.profileUrl = labsUrl;
  }

  if (!autoCommit && (writes.length > 0 || fileIds.length > 0)) {
    try {
      await setAgentPending({
        userId: params.user.id,
        kind: "parse_document",
        commitTool: "commit_document_writes",
        args: {
          document_identity: !subject.canSave,
          writes,
          patient_name: subject.name,
          file_ids: fileIds,
          summary: parse.summary,
        },
        summary: subject.canSave
          ? `Document read, not saved yet: ${parse.summary || "health document"}`
          : `Photo named ${subject.name ?? "someone else"}. Ask who they are and whether to invite them to the household.`,
      });
    } catch (error) {
      console.warn(
        "[doedtc] document identity pending failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  const result = {
    ok: true,
    kind: parse.kind,
    confidence: parse.confidence,
    summary: parse.summary,
    patient_name: subject.name,
    printed_name: subject.printedName,
    subject_on_chart: subject.onChart,
    matches_user: subject.matchesUser,
    can_save: subject.canSave,
    disposition: subject.disposition,
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
  const name = typeof output.patient_name === "string" ? output.patient_name.trim() : "";
  const disposition = typeof output.disposition === "string" ? output.disposition : "";
  if (disposition === "unnamed" || (output.can_save === false && !name)) {
    return `Inbound document was read but has no patient name. Do not save it. Tell them you can't add this photo. Do not claim it is on the chart. Do not call parse_document again.`;
  }
  if (output.can_save === false && (disposition === "unknown_name" || name)) {
    return `Inbound document was read (${summary || "health document"}). The name on it is ${name || "someone else"}, not the user and not on the household. Do not save it. Ask who it is and if they want to invite them to the household. If they will not say, tell them you can't add this photo. Do not call parse_document again.`;
  }
  if (!summary) return null;
  const saved = output.auto_committed === true;
  if (!saved) {
    return `Inbound document already parsed: ${summary}. Writes are ready. If they said these are theirs or asked to log/save them, those rows should already be committed. Do not ask for a title or date. Title is the test name (Liver function test, ALT), never their name. If they say "title is James" they mean they are James. Do not claim they are on the chart unless write_results show ok. Do not call parse_document again.`;
  }
  return `Inbound document already parsed and saved to the chart: ${summary}. The labs tab link is sent automatically as a separate iMessage. Narrate what landed. Do not say here. Do not call parse_document again.`;
}

export function profileUrlForSavedDocumentWrites(params: {
  careToken: string;
  results: Array<{ tool: string; ok: boolean }>;
  existingProfileUrl?: string;
}): string | undefined {
  if (params.existingProfileUrl) return params.existingProfileUrl;
  if (params.results.some((row) => row.ok && row.tool === "log_result")) {
    return attachChartSectionLink({ careToken: params.careToken, tool: "log_result" });
  }
  return undefined;
}

function heldDocumentWrites(pending: DoeDtcAgentPendingRow): Array<{
  tool: ParseDocumentWriteTool;
  args: Record<string, unknown>;
}> {
  const raw = pending.args.writes;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (row): row is { tool: ParseDocumentWriteTool; args: Record<string, unknown> } =>
      Boolean(row && typeof row === "object" && "tool" in row && "args" in row),
  );
}

function pendingFileIds(pending: DoeDtcAgentPendingRow): string[] {
  const raw = pending.args.file_ids;
  if (!Array.isArray(raw)) return [];
  return raw.filter((row): row is string => typeof row === "string" && row.trim().length > 0);
}

function applyInboundDateToWrites(
  writes: Array<{ tool: ParseDocumentWriteTool; args: Record<string, unknown> }>,
  inboundText: string,
  viewerName?: string | null,
): Array<{ tool: ParseDocumentWriteTool; args: Record<string, unknown> }> {
  const dated = extractResultedAtFromText(inboundText);
  return writes.map((row) => {
    if (row.tool !== "log_result") return row;
    const title = preferredLabResultTitle({
      title: typeof row.args.title === "string" ? row.args.title : null,
      fallback: "Lab results",
      viewerName,
    });
    return {
      ...row,
      args: {
        ...row.args,
        title,
        ...(dated ? { resulted_at: dated } : {}),
      },
    };
  });
}

function writesFromParseOutput(
  output: Record<string, unknown> | null | undefined,
): Array<{ tool: ParseDocumentWriteTool; args: Record<string, unknown> }> {
  const raw = output?.proposed_writes;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (row): row is { tool: ParseDocumentWriteTool; args: Record<string, unknown> } =>
      Boolean(row && typeof row === "object" && "tool" in row && "args" in row),
  );
}

export async function commitReadyDocumentWrites(params: {
  user: DoeDtcUserRow;
  snapshot: DoeDtcProfileSnapshot;
  inboundText: string;
  state?: DoeDtcToolTurnState;
  memberName?: string | null;
}): Promise<{
  committed: boolean;
  results: Array<{ tool: string; ok: boolean; output?: unknown; error?: string }>;
}> {
  const pending = await getAgentPending(params.user.id);
  let writes =
    pending && (isDocumentIdentityPending(pending.args) || pending.kind === "parse_document")
      ? heldDocumentWrites(pending)
      : [];
  if (writes.length === 0) {
    writes = writesFromParseOutput(params.state?.documentParse);
  }
  if (writes.length === 0 && pending) {
    const fileIds = pendingFileIds(pending);
    if (fileIds.length > 0) {
      const parsed = await runParseDocumentTool({
        user: params.user,
        inboundText: params.inboundText,
        snapshot: params.snapshot,
        state: createInitialToolTurnState(null),
        fileIds,
        autoCommit: false,
      });
      writes = writesFromParseOutput(parsed);
    }
  }
  writes = applyInboundDateToWrites(writes, params.inboundText, params.user.full_name);
  if (writes.length === 0) {
    return { committed: false, results: [] };
  }
  const results = await commitHeldDocumentWrites({
    user: params.user,
    snapshot: params.snapshot,
    inboundText: params.inboundText,
    writes,
    memberName: params.memberName,
    state: params.state,
  });
  await clearAgentPending(params.user.id);
  return { committed: results.some((row) => row.ok), results };
}

export async function commitHeldDocumentWrites(params: {
  user: DoeDtcUserRow;
  snapshot: DoeDtcProfileSnapshot;
  inboundText: string;
  writes: Array<{ tool: ParseDocumentWriteTool; args: Record<string, unknown> }>;
  memberName?: string | null;
  state?: DoeDtcToolTurnState;
}): Promise<Array<{ tool: string; ok: boolean; output?: unknown; error?: string }>> {
  const writes = applyDocumentSubjectToWrites(params.writes, params.memberName ?? null);
  return executeDocumentParseWrites({
    user: params.user,
    inboundText: params.inboundText,
    snapshot: params.snapshot,
    state: params.state ?? createInitialToolTurnState(null),
    writes,
  });
}

export async function consumeHeldDocumentWritesForMember(params: {
  user: DoeDtcUserRow;
  snapshot: DoeDtcProfileSnapshot;
  inboundText: string;
  memberName: string;
  state?: DoeDtcToolTurnState;
}): Promise<boolean> {
  const pending = await getAgentPending(params.user.id);
  if (!pending || !isDocumentIdentityPending(pending.args)) return false;
  const printed =
    typeof pending.args.patient_name === "string" ? pending.args.patient_name : null;
  if (printed && !namesLooselyMatch(printed, params.memberName)) return false;
  const writes = heldDocumentWrites(pending);
  if (writes.length === 0) return false;
  const state = params.state ?? createInitialToolTurnState(null);
  const results = await commitHeldDocumentWrites({
    user: params.user,
    snapshot: params.snapshot,
    inboundText: params.inboundText,
    writes,
    memberName: params.memberName,
    state,
  });
  const labsUrl = profileUrlForSavedDocumentWrites({
    careToken: params.user.care_token,
    results,
    existingProfileUrl: state.profileUrl,
  });
  if (labsUrl && params.state) params.state.profileUrl = labsUrl;
  await clearAgentPending(params.user.id);
  return true;
}

export async function resolveHeldDocumentIdentity(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  pending: DoeDtcAgentPendingRow;
}): Promise<{ replyText: string; assessmentRan: false; profileUrl?: string } | null> {
  if (!isDocumentIdentityPending(params.pending.args) && params.pending.kind !== "parse_document") {
    return null;
  }
  const snapshot = await getDoeDtcProfileSnapshot(params.user.id);
  const printed =
    typeof params.pending.args.patient_name === "string"
      ? params.pending.args.patient_name
      : null;
  const decision = interpretDocumentIdentityReply({
    inboundText: params.inboundText,
    viewerName: params.user.full_name,
    members: snapshot.household?.members ?? [],
    viewerUserId: params.user.id,
    printedName: printed,
  });
  if (decision.action === "unresolved") return null;
  if (decision.action === "decline") {
    await clearAgentPending(params.user.id);
    return { replyText: CANT_ADD_PHOTO_REPLY, assessmentRan: false };
  }

  let writes = applyInboundDateToWrites(
    heldDocumentWrites(params.pending),
    params.inboundText,
    params.user.full_name,
  );
  if (writes.length === 0) {
    const fileIds = pendingFileIds(params.pending);
    if (fileIds.length > 0) {
      const parsed = await runParseDocumentTool({
        user: params.user,
        inboundText: params.inboundText,
        snapshot,
        state: createInitialToolTurnState(null),
        fileIds,
        autoCommit: false,
      });
      writes = applyInboundDateToWrites(
        writesFromParseOutput(parsed),
        params.inboundText,
        params.user.full_name,
      );
    }
  }
  if (writes.length === 0) {
    await clearAgentPending(params.user.id);
    return { replyText: CANT_ADD_PHOTO_REPLY, assessmentRan: false };
  }

  if (decision.action === "save_self") {
    const state = createInitialToolTurnState(null);
    const results = await commitHeldDocumentWrites({
      user: params.user,
      snapshot,
      inboundText: params.inboundText,
      writes,
      state,
    });
    await clearAgentPending(params.user.id);
    return {
      replyText: "Saved this to your chart.",
      assessmentRan: false,
      profileUrl: profileUrlForSavedDocumentWrites({
        careToken: params.user.care_token,
        results,
        existingProfileUrl: state.profileUrl,
      }),
    };
  }

  const existing = (snapshot.household?.members ?? []).find((row) =>
    namesLooselyMatch(row.full_name, decision.name),
  );
  let memberName = existing?.full_name ?? decision.name;
  if (!existing) {
    try {
      const row = await addDoeDtcHouseholdMember({
        adminUserId: params.user.id,
        fullName: decision.name,
        relationship: decision.relationship,
      });
      memberName = row.full_name;
    } catch (error) {
      console.warn(
        "[doedtc] document household add failed:",
        error instanceof Error ? error.message : String(error),
      );
      await clearAgentPending(params.user.id);
      return { replyText: CANT_ADD_PHOTO_REPLY, assessmentRan: false };
    }
  }

  const state = createInitialToolTurnState(null);
  const results = await commitHeldDocumentWrites({
    user: params.user,
    snapshot,
    inboundText: params.inboundText,
    writes,
    memberName,
    state,
  });
  await clearAgentPending(params.user.id);
  const profileUrl = profileUrlForSavedDocumentWrites({
    careToken: params.user.care_token,
    results,
    existingProfileUrl: state.profileUrl,
  });
  if (decision.invite) {
    return {
      replyText: `Saved this to ${memberName}'s chart. Share a number if you want me to invite them to the household.`,
      assessmentRan: false,
      profileUrl,
    };
  }
  return {
    replyText: `Saved this to ${memberName}'s chart. Want me to invite them to the household?`,
    assessmentRan: false,
    profileUrl,
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

import { isIncidentalChartWrite } from "@/lib/doedtc/agent/deliverable-policy";
import { doeDtcAppUrl } from "@/lib/doedtc/doedtc-copy";
import { parseAffirmation } from "@/lib/doedtc/doedtc-pending";
import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";

export const CHART_WRITE_PROBE_TOOLS = [
  "add_medication",
  "add_condition",
  "log_result",
  "log_appointment",
  "log_family_member",
  "add_locker_item",
  "create_profile_artifact",
  "log_artifact_entry",
  "update_profile",
] as const;

export const CHART_WRITE_LINK_TOOLS = [
  "add_medication",
  "add_condition",
  "log_result",
  "log_appointment",
  "log_family_member",
  "add_locker_item",
  "create_profile_artifact",
  "log_artifact_entry",
  "update_profile",
] as const;

export type ChartWriteProbeTool = (typeof CHART_WRITE_PROBE_TOOLS)[number];
export type ChartWriteLinkTool = (typeof CHART_WRITE_LINK_TOOLS)[number];

export type ChartWriteAssessment = {
  complete: boolean;
  missing: string[];
  probe: string;
};

const VAGUE_VALUES = new Set([
  "a",
  "an",
  "the",
  "my",
  "something",
  "stuff",
  "info",
  "information",
  "details",
  "data",
  "it",
  "this",
  "that",
  "these",
  "those",
  "them",
  "med",
  "meds",
  "medication",
  "medications",
  "a med",
  "a medication",
  "my med",
  "my meds",
  "my medication",
  "condition",
  "conditions",
  "a condition",
  "my condition",
  "lab",
  "labs",
  "result",
  "results",
  "a lab",
  "a result",
  "my labs",
  "my results",
  "lab results",
  "test",
  "tests",
  "a test",
  "appointment",
  "appointments",
  "an appointment",
  "a appointment",
  "family",
  "someone",
  "a person",
  "tracker",
  "trackers",
  "a tracker",
  "entry",
  "an entry",
  "profile",
  "chart",
]);

const RELATIVE_DATE_RE =
  /\b(today|yesterday|this morning|last night|last week|last month|this week|this year|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|june|july|august|september|october|november|december)\b/i;

const TEST_NAME_RE =
  /\b(a1c|hba1c|hemoglobin|cholesterol|ldl|hdl|triglycerides|glucose|tsh|cbc|cmp|bmp|psa|vitamin d|alt|ast|lft|liver(?:\s+function)?(?:\s+test)?|creatinine|egfr|inr|platelet|wbc|rbc)\b/i;

const VALUE_RE = /\b\d+(?:\.\d+)?\s*%?\b/;

const PROFILE_FIELDS = ["full_name", "email", "date_of_birth", "gender", "country", "why_doe"] as const;

export function isChartWriteProbeTool(name: string): name is ChartWriteProbeTool {
  return (CHART_WRITE_PROBE_TOOLS as readonly string[]).includes(name);
}

export function isChartWriteLinkTool(name: string): name is ChartWriteLinkTool {
  return (CHART_WRITE_LINK_TOOLS as readonly string[]).includes(name);
}

export function chartWriteSucceeded(
  toolsExecuted: DoeDtcAgentToolExecutionRecord[] | undefined,
): boolean {
  return (toolsExecuted ?? []).some((row) => row.ok && isChartWriteLinkTool(row.name));
}

export function tabForChartWrite(tool: string): string | undefined {
  switch (tool) {
    case "add_medication":
    case "add_condition":
      return "conditions";
    case "log_result":
      return "results";
    case "log_appointment":
      return "appointments";
    case "log_family_member":
      return "family";
    case "add_locker_item":
      return "locker";
    case "create_profile_artifact":
    case "log_artifact_entry":
      return "trackers";
    case "update_profile":
      return "dashboard";
    default:
      return undefined;
  }
}

export function isVagueChartValue(raw: string | null | undefined): boolean {
  const value = String(raw ?? "").trim().toLowerCase().replace(/[?.!]+$/g, "");
  if (!value) return true;
  if (VAGUE_VALUES.has(value)) return true;
  if (/^(?:a|an|the|my|some)\s+(?:med|meds|medication|medications|condition|conditions|lab|labs|result|results|test|tests|appointment|appointments|tracker|trackers|entry|info|information)$/i.test(value)) {
    return true;
  }
  return false;
}

function looksLikePersonName(raw: string): boolean {
  const value = raw.trim();
  if (!value || isVagueChartValue(value)) return false;
  if (/\d/.test(value)) return false;
  if (value.length < 2 || value.length > 60) return false;
  if (!/^[A-Za-z][A-Za-z' .-]*$/.test(value)) return false;
  return !/^[A-Z]{2,4}$/.test(value);
}

export function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function chartWriteOriginalInbound(args: Record<string, unknown>): string {
  return firstString(args.original_inbound);
}

export function withChartWritePendingArgs(
  args: Record<string, unknown>,
  originalInbound: string,
): Record<string, unknown> {
  return {
    ...args,
    chart_write: true,
    original_inbound: chartWriteOriginalInbound(args) || originalInbound.trim(),
  };
}

export function looksLikeChartWriteAckOnly(text: string): boolean {
  return /^added\b.+\bto your chart\.?$/i.test(text.trim());
}

export function selectChartWriteResumeKind(params: {
  originalInbound?: string;
  currentInbound: string;
}): "confirm" | "continue" {
  const source = (params.originalInbound ?? "").trim() || params.currentInbound;
  return isIncidentalChartWrite(source) ? "continue" : "confirm";
}

export function formatIncidentalChartWriteContinueBlock(params: {
  label: string;
  originalInbound: string;
}): string {
  const original =
    params.originalInbound.trim().slice(0, 280) || "the concern they were talking about";
  return `You just added ${params.label} to the chart so you can keep helping. Do not ask for their name again. One short acknowledge is fine. Then continue the original problem — do not end on the add, and do not send a profile link. Original problem: ${original}`;
}

export function buildIncidentalChartWriteRetrySystemMessage(params: {
  label: string;
  originalInbound: string;
}): string {
  const original =
    params.originalInbound.trim().slice(0, 280) || "the concern they were talking about";
  return `You stopped at a chart confirmation. ${params.label} is already on the chart. Do not make "added to your chart" the whole reply. Address the original problem: "${original}". One short acknowledge, then care and a useful next step.`;
}

function hasResultDate(text: string, args: Record<string, unknown>): boolean {
  if (firstString(args.resulted_at, args.date)) return true;
  if (/\b20\d{2}-\d{2}-\d{2}\b/.test(text)) return true;
  if (/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(text)) return true;
  return RELATIVE_DATE_RE.test(text);
}

function hasResultValue(text: string, args: Record<string, unknown>): boolean {
  if (firstString(args.summary, args.value, args.values)) return true;
  return VALUE_RE.test(text);
}

function hasSpecificTestName(text: string, args: Record<string, unknown>): boolean {
  const title = firstString(args.title, args.name, args.test);
  if (title && !isVagueChartValue(title)) return true;
  return TEST_NAME_RE.test(text);
}

function hasAppointmentTiming(args: Record<string, unknown>, text: string): boolean {
  if (firstString(args.starts_at, args.timing_note)) return true;
  const precision = firstString(args.timing_precision);
  if (precision === "approximate" && firstString(args.timing_note)) return true;
  if (precision === "exact" || precision === "day") {
    return Boolean(firstString(args.starts_at, args.timing_note));
  }
  return hasResultDate(text, args) || RELATIVE_DATE_RE.test(text);
}

function artifactValuesPresent(args: Record<string, unknown>): boolean {
  const values = args.values;
  if (!values || typeof values !== "object" || Array.isArray(values)) return false;
  return Object.values(values as Record<string, unknown>).some((value) => {
    if (typeof value === "number" && Number.isFinite(value)) return true;
    return typeof value === "string" && value.trim().length > 0 && !isVagueChartValue(value);
  });
}

function profileFieldPresent(args: Record<string, unknown>): boolean {
  return PROFILE_FIELDS.some((field) => {
    const value = args[field];
    return typeof value === "string" && value.trim() && !isVagueChartValue(value);
  });
}

export function assessChartWrite(params: {
  tool: string;
  args: Record<string, unknown>;
  inboundText: string;
  hasDocumentWrites?: boolean;
  hasAttachments?: boolean;
}): ChartWriteAssessment {
  const inbound = params.inboundText.trim();
  const args = params.args ?? {};

  if (params.tool === "log_result" && (params.hasDocumentWrites || params.hasAttachments)) {
    return { complete: true, missing: [], probe: "" };
  }

  switch (params.tool) {
    case "add_medication": {
      const name = firstString(args.name);
      if (!isVagueChartValue(name)) return { complete: true, missing: [], probe: "" };
      return {
        complete: false,
        missing: ["name"],
        probe: "Which medication should I add?",
      };
    }
    case "add_condition": {
      const name = firstString(args.name);
      if (!isVagueChartValue(name)) return { complete: true, missing: [], probe: "" };
      return {
        complete: false,
        missing: ["name"],
        probe: "Which condition should I add?",
      };
    }
    case "log_result": {
      const missing: string[] = [];
      if (!hasSpecificTestName(inbound, args)) missing.push("test");
      if (!hasResultValue(inbound, args)) missing.push("value");
      if (!hasResultDate(inbound, args)) missing.push("date");
      if (missing.length === 0) return { complete: true, missing: [], probe: "" };
      if (missing.length === 3) {
        return {
          complete: false,
          missing,
          probe: "Which test is this, what was the value, and when did it come back?",
        };
      }
      if (missing.includes("test") && missing.includes("value")) {
        return { complete: false, missing, probe: "Which test is this, and what was the value?" };
      }
      if (missing.includes("test") && missing.includes("date")) {
        return { complete: false, missing, probe: "Which test is this, and when did it come back?" };
      }
      if (missing.includes("value") && missing.includes("date")) {
        return { complete: false, missing, probe: "What was the value, and when did it come back?" };
      }
      if (missing.includes("test")) {
        return { complete: false, missing, probe: "Which test is this?" };
      }
      if (missing.includes("value")) {
        return { complete: false, missing, probe: "What was the value?" };
      }
      return { complete: false, missing, probe: "When did that result come back?" };
    }
    case "log_appointment": {
      const title = firstString(args.title);
      const missing: string[] = [];
      if (isVagueChartValue(title)) missing.push("title");
      if (!hasAppointmentTiming(args, inbound)) missing.push("when");
      if (missing.length === 0) return { complete: true, missing: [], probe: "" };
      if (missing.length === 2) {
        return {
          complete: false,
          missing,
          probe: "What's the appointment for, and when is it?",
        };
      }
      if (missing.includes("title")) {
        return { complete: false, missing, probe: "What's the appointment for?" };
      }
      return { complete: false, missing, probe: "When is that appointment?" };
    }
    case "log_family_member": {
      const name = firstString(args.full_name, args.name);
      if (looksLikePersonName(name)) return { complete: true, missing: [], probe: "" };
      return {
        complete: false,
        missing: ["name"],
        probe: "What's their name?",
      };
    }
    case "add_locker_item": {
      const missing: string[] = [];
      if (isVagueChartValue(firstString(args.label))) missing.push("label");
      if (isVagueChartValue(firstString(args.username))) missing.push("username");
      if (!firstString(args.password)) missing.push("password");
      if (missing.length === 0) return { complete: true, missing: [], probe: "" };
      if (missing.length === 3) {
        return {
          complete: false,
          missing,
          probe: "What's the site, the username, and the password?",
        };
      }
      if (missing.includes("label")) {
        return { complete: false, missing, probe: "What site or portal is this login for?" };
      }
      if (missing.includes("username")) {
        return { complete: false, missing, probe: "What's the username?" };
      }
      return { complete: false, missing, probe: "What's the password?" };
    }
    case "create_profile_artifact": {
      const title = firstString(args.title);
      if (!isVagueChartValue(title)) return { complete: true, missing: [], probe: "" };
      return {
        complete: false,
        missing: ["title"],
        probe: "What do you want to track?",
      };
    }
    case "log_artifact_entry": {
      const missing: string[] = [];
      if (!firstString(args.artifact_id, args.artifact, args.title)) missing.push("tracker");
      if (!artifactValuesPresent(args) && !VALUE_RE.test(inbound) && isVagueChartValue(inbound)) {
        missing.push("value");
      }
      if (missing.length === 0) return { complete: true, missing: [], probe: "" };
      if (missing.length === 2) {
        return {
          complete: false,
          missing,
          probe: "Which tracker, and what should I log?",
        };
      }
      if (missing.includes("tracker")) {
        return { complete: false, missing, probe: "Which tracker should I add that to?" };
      }
      return { complete: false, missing, probe: "What should I log?" };
    }
    case "update_profile": {
      if (profileFieldPresent(args)) return { complete: true, missing: [], probe: "" };
      return {
        complete: false,
        missing: ["field"],
        probe: "What should I change — name, email, date of birth, gender, or country?",
      };
    }
    default:
      return { complete: true, missing: [], probe: "" };
  }
}

function stripChartWriteFiller(text: string): string {
  return text
    .trim()
    .replace(/^(?:please\s+)?(?:add|log|save|put|record|update)\s+(?:a |an |the |my )?/i, "")
    .replace(/\s+to\s+(?:my |the )?(?:chart|profile)\b.*$/i, "")
    .replace(/^(?:it(?:'s| is)|that(?:'s| is)|this is)\s+/i, "")
    .trim();
}

function looksLikeFollowUpFiller(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (parseAffirmation(trimmed)) return true;
  return /^(yes|yep|yeah|ok|okay|sure|please|thanks|thank you)\.?$/i.test(trimmed);
}

export function mergeChartWriteFollowUp(params: {
  tool: string;
  args: Record<string, unknown>;
  inboundText: string;
}): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...params.args };
  delete merged.chart_write;
  delete merged.missing;
  const inbound = params.inboundText.trim();
  if (!inbound || looksLikeFollowUpFiller(inbound)) return merged;

  const cleaned = stripChartWriteFiller(inbound);
  if (!cleaned || isVagueChartValue(cleaned)) return merged;

  switch (params.tool) {
    case "add_medication":
    case "add_condition": {
      if (isVagueChartValue(firstString(merged.name))) merged.name = cleaned;
      break;
    }
    case "log_result": {
      const dateMatch =
        inbound.match(/\b(20\d{2}-\d{2}-\d{2})\b/)?.[1] ??
        inbound.match(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/)?.[1];
      if (dateMatch && !firstString(merged.resulted_at)) {
        const iso = dateMatch.includes("-")
          ? dateMatch
          : (() => {
              const parts = dateMatch.split("/");
              let year = Number(parts[2]);
              if (year < 100) year += 2000;
              return `${year}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
            })();
        merged.resulted_at = iso;
      }
      const test = inbound.match(TEST_NAME_RE)?.[1];
      if (test && isVagueChartValue(firstString(merged.title))) {
        merged.title = /lft|liver/i.test(test) ? "Liver function test" : test.toUpperCase() === test ? test : test;
        if (/^a1c$/i.test(test)) merged.title = "A1C";
        else if (/liver|lft/i.test(test)) merged.title = "Liver function test";
        else merged.title = test;
      } else if (isVagueChartValue(firstString(merged.title)) && !isVagueChartValue(cleaned) && !VALUE_RE.test(cleaned)) {
        merged.title = cleaned;
      }
      const valueMatch = inbound.match(VALUE_RE)?.[0];
      if (valueMatch && !firstString(merged.summary)) merged.summary = valueMatch.trim();
      else if (!firstString(merged.summary) && cleaned && firstString(merged.title)) {
        merged.summary = cleaned;
      }
      break;
    }
    case "log_appointment": {
      if (isVagueChartValue(firstString(merged.title)) && !hasResultDate(cleaned, {})) {
        merged.title = cleaned;
      }
      if (!firstString(merged.starts_at, merged.timing_note)) {
        if (hasResultDate(inbound, merged)) {
          merged.timing_precision = merged.timing_precision ?? "approximate";
          merged.timing_note = firstString(merged.timing_note) || inbound;
        } else if (firstString(merged.title) && cleaned !== merged.title) {
          merged.timing_precision = "approximate";
          merged.timing_note = cleaned;
        }
      }
      break;
    }
    case "log_family_member": {
      if (!looksLikePersonName(firstString(merged.full_name, merged.name)) && looksLikePersonName(cleaned)) {
        merged.full_name = cleaned;
      }
      break;
    }
    case "add_locker_item": {
      if (isVagueChartValue(firstString(merged.label))) merged.label = cleaned;
      else if (isVagueChartValue(firstString(merged.username))) merged.username = cleaned;
      else if (!firstString(merged.password)) merged.password = inbound;
      break;
    }
    case "create_profile_artifact": {
      if (isVagueChartValue(firstString(merged.title))) merged.title = cleaned;
      break;
    }
    case "log_artifact_entry": {
      if (!artifactValuesPresent(merged)) {
        const valueMatch = inbound.match(VALUE_RE)?.[0];
        merged.values = { value: valueMatch ?? cleaned };
      }
      break;
    }
    case "update_profile": {
      if (profileFieldPresent(merged)) break;
      if (/@/.test(cleaned)) merged.email = cleaned;
      else if (/\b(20\d{2}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4})\b/.test(cleaned)) {
        merged.date_of_birth = cleaned;
      } else if (!isVagueChartValue(cleaned)) {
        merged.full_name = cleaned;
      }
      break;
    }
    default:
      break;
  }

  return merged;
}

export function attachChartSectionLink(params: {
  careToken: string;
  tool: string;
  artifact?: string;
  member?: string;
}): string | undefined {
  const tab = tabForChartWrite(params.tool);
  if (!tab) return undefined;
  return doeDtcAppUrl(params.careToken, {
    tab,
    artifact: params.artifact,
    member: params.member,
  });
}

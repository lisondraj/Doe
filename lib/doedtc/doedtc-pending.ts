import { isIncidentalChartWrite } from "@/lib/doedtc/agent/deliverable-policy";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export type DoeDtcAgentPendingKind =
  | "schedule_text"
  | "save_guide"
  | "start_accountability"
  | "start_habit_workflow"
  | "start_workflow"
  | "send_family_invite"
  | "parse_document"
  | "chart_write";

export type DoeDtcAgentPendingRow = {
  user_id: string;
  kind: DoeDtcAgentPendingKind;
  commit_tool: string;
  args: Record<string, unknown>;
  summary: string;
  created_at: string;
  updated_at: string;
};

/** Pending rows older than this are treated as stale and cleared on read. */
export const PENDING_TTL_MS = 30 * 60 * 1000;

/** Max serialized commit args included in the agent prompt (runState is never included). */
export const PENDING_PROMPT_ARGS_MAX_CHARS = 2_000;

export function parseAffirmation(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  if (!trimmed) return false;
  if (/^(no|nope|nah|don't|do not|stop|cancel|nevermind|never mind)\b/.test(trimmed)) return false;
  return /^(yes|y|yep|yeah|sure|ok|okay|do it|go ahead|please|schedule it|send it|confirm|sounds good|that works|👍|✅)\b/.test(
    trimmed,
  );
}

export function parseDecline(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  return /^(no|nope|nah|don't|do not|stop|cancel|nevermind|never mind|not now|skip)\b/.test(trimmed);
}

export function isRunStatePending(args: Record<string, unknown>): boolean {
  return typeof args.runState === "string" && args.runState.trim().length > 0;
}

/** True when pending stores commit args (not just a serialized SDK RunState). */
export function isCommitPending(args: Record<string, unknown>): boolean {
  if (isRunStatePending(args)) return false;
  if (args.chart_write === true) return false;
  if (args.awaiting_body === true || args.awaiting_time === true) return false;
  return Object.keys(args).length > 0;
}

export function isChartWritePending(
  pending: Pick<DoeDtcAgentPendingRow, "kind" | "args">,
): boolean {
  return pending.kind === "chart_write" || pending.args.chart_write === true;
}

export function isDocumentIdentityPending(args: Record<string, unknown>): boolean {
  return args.document_identity === true;
}

export function extractRunStateSerialized(args: Record<string, unknown>): string | null {
  if (!isRunStatePending(args)) return null;
  return String(args.runState).trim();
}

export function isPendingExpired(
  pending: Pick<DoeDtcAgentPendingRow, "updated_at">,
  now = Date.now(),
): boolean {
  const updatedAt = Date.parse(pending.updated_at);
  if (!Number.isFinite(updatedAt)) return true;
  return now - updatedAt > PENDING_TTL_MS;
}

export function sanitizePendingArgsForPrompt(args: Record<string, unknown>): Record<string, unknown> {
  if (isRunStatePending(args)) {
    return { awaiting_sdk_approval: true };
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(args)) {
    if (key === "runState") continue;
    sanitized[key] = value;
  }
  return sanitized;
}

function truncateJson(value: unknown, maxChars: number): string {
  const json = JSON.stringify(value);
  if (json.length <= maxChars) return json;
  return `${json.slice(0, maxChars)}…`;
}

export function formatAgentPendingForPrompt(pending: DoeDtcAgentPendingRow): string {
  if (isRunStatePending(pending.args)) {
    return `Pending SDK approval: ${pending.summary}. If they affirm, continue the interrupted action. If they decline, cancel it. Do not call propose_* again.`;
  }

  if (pending.kind === "parse_document" || isDocumentIdentityPending(pending.args)) {
    const name =
      typeof pending.args.patient_name === "string" && pending.args.patient_name.trim()
        ? pending.args.patient_name.trim()
        : "someone";
    return `Pending document: the name on the page is ${name}, not the user and not on the household. If they say it is them, save to their chart. If they name who it is, add that person if needed, ask/send a household invite, then save. If they decline or will not say, tell them you cannot add this photo. Do not claim it is already saved.`;
  }

  if (isChartWritePending(pending)) {
    const original =
      typeof pending.args.original_inbound === "string" ? pending.args.original_inbound.trim() : "";
    const continueLine = original && isIncidentalChartWrite(original)
      ? " After the write succeeds, continue the original problem. Do not end on the add."
      : " After the write succeeds, the matching chart tab link is sent automatically as a separate iMessage.";
    return `Pending chart details: ${pending.summary}. They just answered. Call ${pending.commit_tool} with the stored args plus what they just said. Ask only for what is still missing. Never invent a name, date, or value.${continueLine}`;
  }

  const argsForPrompt = sanitizePendingArgsForPrompt(pending.args);
  const argsJson = truncateJson(argsForPrompt, PENDING_PROMPT_ARGS_MAX_CHARS);
  return `Pending confirmation: ${pending.summary}. If they affirm, call ${pending.commit_tool} with the stored args — do not call propose_* again. Stored args: ${argsJson}`;
}

export async function getAgentPending(userId: string): Promise<DoeDtcAgentPendingRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_agent_pending")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const pending = data as DoeDtcAgentPendingRow;
  if (isPendingExpired(pending)) {
    await clearAgentPending(userId);
    return null;
  }
  return pending;
}

export async function setAgentPending(params: {
  userId: string;
  kind: DoeDtcAgentPendingKind;
  commitTool: string;
  args: Record<string, unknown>;
  summary: string;
}): Promise<DoeDtcAgentPendingRow> {
  const supabase = createSupabaseAdmin();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("doedtc_agent_pending")
    .upsert(
      {
        user_id: params.userId,
        kind: params.kind,
        commit_tool: params.commitTool,
        args: params.args,
        summary: params.summary,
        updated_at: now,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcAgentPendingRow;
}

export async function clearAgentPending(userId: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("doedtc_agent_pending").delete().eq("user_id", userId);
  if (error) throw new Error(error.message);
}

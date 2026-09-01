import { randomUUID } from "node:crypto";

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { redactDoeDtcLogText } from "@/lib/doedtc/doedtc-privacy";

export type DoeDtcAgentToolExecutionRecord = {
  name: string;
  ok: boolean;
  error?: string;
};

export type DoeDtcAgentTurnStatus =
  | "received"
  | "read"
  | "working"
  | "browsing"
  | "done"
  | "failed";

export type DoeDtcAgentTurnRow = {
  id: string;
  user_id: string;
  inbound_message_id: string | null;
  inbound_text: string;
  status: DoeDtcAgentTurnStatus;
  read_at: string | null;
  working_at: string | null;
  done_at: string | null;
  reply_text: string | null;
  thread_reply: boolean;
  final_reaction: string | null;
  browser_job_id: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
};

export type DoeDtcAgentToolCallRow = {
  id: string;
  turn_id: string;
  user_id: string;
  tool_name: string;
  args: Record<string, unknown>;
  ok: boolean;
  error: string | null;
  duration_ms: number | null;
  created_at: string;
};

export type DoeDtcAgentTurnWithTools = DoeDtcAgentTurnRow & {
  tool_calls: DoeDtcAgentToolCallRow[];
};

export function createDoeDtcAgentTurnId(): string {
  return randomUUID();
}

function sanitizeToolArgs(args: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(args)) {
    if (typeof value === "string") {
      sanitized[key] = redactDoeDtcLogText(value).slice(0, 500);
    } else if (typeof value === "number" || typeof value === "boolean" || value === null) {
      sanitized[key] = value;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.slice(0, 20);
    } else if (typeof value === "object") {
      sanitized[key] = "[object]";
    }
  }
  return sanitized;
}

export async function startDoeDtcAgentTurnRecord(params: {
  turnId: string;
  userId: string;
  inboundMessageId?: string;
  inboundText: string;
}): Promise<void> {
  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from("doedtc_agent_turns").insert({
      id: params.turnId,
      user_id: params.userId,
      inbound_message_id: params.inboundMessageId ?? null,
      inbound_text: redactDoeDtcLogText(params.inboundText).slice(0, 2000),
      status: "received",
    });
    if (error) {
      console.warn(`[doedtc:audit] turn start failed: ${error.message}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[doedtc:audit] turn start failed: ${message}`);
  }
}

export async function updateDoeDtcAgentTurnRecord(params: {
  turnId: string;
  patch: Partial<{
    status: DoeDtcAgentTurnStatus;
    read_at: string;
    working_at: string;
    done_at: string;
    reply_text: string;
    thread_reply: boolean;
    final_reaction: string;
    browser_job_id: string;
    error: string;
  }>;
}): Promise<void> {
  try {
    const supabase = createSupabaseAdmin();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const [key, value] of Object.entries(params.patch)) {
      if (value === undefined) continue;
      if (key === "reply_text" || key === "error") {
        patch[key] =
          typeof value === "string" ? redactDoeDtcLogText(value).slice(0, 2000) : value;
      } else {
        patch[key] = value;
      }
    }
    const { error } = await supabase
      .from("doedtc_agent_turns")
      .update(patch)
      .eq("id", params.turnId);
    if (error) {
      console.warn(`[doedtc:audit] turn update failed: ${error.message}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[doedtc:audit] turn update failed: ${message}`);
  }
}

export async function listDoeDtcAgentTurnsByInboundMessageId(
  inboundMessageId: string,
  limit = 8,
): Promise<DoeDtcAgentTurnRow[]> {
  const id = inboundMessageId.trim();
  if (!id) return [];
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_agent_turns")
    .select("*")
    .eq("inbound_message_id", id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data as DoeDtcAgentTurnRow[]) ?? [];
}

export async function getDoeDtcAgentTurn(turnId: string): Promise<DoeDtcAgentTurnRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_agent_turns")
    .select("*")
    .eq("id", turnId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DoeDtcAgentTurnRow | null) ?? null;
}

export async function listInFlightDoeDtcAgentTurns(params: {
  userId: string;
  excludeTurnId?: string;
  limit?: number;
}): Promise<DoeDtcAgentTurnRow[]> {
  const supabase = createSupabaseAdmin();
  const since = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  let query = supabase
    .from("doedtc_agent_turns")
    .select("*")
    .eq("user_id", params.userId)
    .in("status", ["received", "read", "working", "browsing"])
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(params.limit ?? 8);
  if (params.excludeTurnId) {
    query = query.neq("id", params.excludeTurnId);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as DoeDtcAgentTurnRow[]) ?? [];
}

export async function listDoeDtcAgentTurns(params: {
  userId: string;
  limit?: number;
}): Promise<DoeDtcAgentTurnWithTools[]> {
  const supabase = createSupabaseAdmin();
  const limit = params.limit ?? 30;
  const { data: turns, error } = await supabase
    .from("doedtc_agent_turns")
    .select("*")
    .eq("user_id", params.userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  const rows = (turns ?? []) as DoeDtcAgentTurnRow[];
  if (rows.length === 0) return [];

  const turnIds = rows.map((row) => row.id);
  const { data: toolCalls, error: toolError } = await supabase
    .from("doedtc_agent_tool_calls")
    .select("*")
    .in("turn_id", turnIds)
    .order("created_at", { ascending: true });
  if (toolError) throw new Error(toolError.message);

  const byTurn = new Map<string, DoeDtcAgentToolCallRow[]>();
  for (const row of (toolCalls ?? []) as DoeDtcAgentToolCallRow[]) {
    const list = byTurn.get(row.turn_id) ?? [];
    list.push(row);
    byTurn.set(row.turn_id, list);
  }

  return rows.map((row) => ({
    ...row,
    tool_calls: byTurn.get(row.id) ?? [],
  }));
}

export async function recentDoeDtcTurnsUsedThreadReply(params: {
  userId: string;
  limit?: number;
}): Promise<boolean> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_agent_turns")
    .select("thread_reply")
    .eq("user_id", params.userId)
    .in("status", ["done", "failed"])
    .order("created_at", { ascending: false })
    .limit(params.limit ?? 2);
  if (error) throw new Error(error.message);
  return (data ?? []).some((row) => Boolean((row as { thread_reply?: boolean }).thread_reply));
}

export async function logDoeDtcAgentToolCall(params: {
  turnId: string;
  userId: string;
  toolName: string;
  args: Record<string, unknown>;
  ok: boolean;
  error?: string;
  durationMs: number;
}): Promise<void> {
  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from("doedtc_agent_tool_calls").insert({
      turn_id: params.turnId,
      user_id: params.userId,
      tool_name: params.toolName,
      args: sanitizeToolArgs(params.args),
      ok: params.ok,
      error: params.error ? redactDoeDtcLogText(params.error).slice(0, 500) : null,
      duration_ms: params.durationMs,
    });
    if (error) {
      console.warn(`[doedtc:audit] tool call log failed: ${error.message}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[doedtc:audit] tool call log failed: ${message}`);
  }
}

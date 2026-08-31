import { randomUUID } from "node:crypto";

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { redactDoeDtcLogText } from "@/lib/doedtc/doedtc-privacy";

export type DoeDtcAgentToolExecutionRecord = {
  name: string;
  ok: boolean;
  error?: string;
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

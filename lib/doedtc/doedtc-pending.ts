import { createSupabaseAdmin } from "@/lib/supabase/admin";

export type DoeDtcAgentPendingKind =
  | "schedule_text"
  | "save_guide"
  | "start_accountability"
  | "send_family_invite";

export type DoeDtcAgentPendingRow = {
  user_id: string;
  kind: DoeDtcAgentPendingKind;
  commit_tool: string;
  args: Record<string, unknown>;
  summary: string;
  created_at: string;
  updated_at: string;
};

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

export async function getAgentPending(userId: string): Promise<DoeDtcAgentPendingRow | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_agent_pending")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? (data as DoeDtcAgentPendingRow) : null;
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

export function formatAgentPendingForPrompt(pending: DoeDtcAgentPendingRow): string {
  return `Pending confirmation: ${pending.summary}. If they affirm, call ${pending.commit_tool} with the stored args — do not call propose_* again. Stored args: ${JSON.stringify(pending.args)}`;
}

import { formatIdentityCard } from "@/lib/doedtc/agent/identity-card";
import { fetchOpenAiWithRetry } from "@/lib/doedtc/agent/openai-retry";
import { getDoeDtcBrowserJobById, openLoopBrowserSessionMaxAgeMs } from "@/lib/doedtc/doedtc-browser-db";
import { getDoeDtcUserById, logDoeDtcMessage } from "@/lib/doedtc/doedtc-db";
import { linqSendText } from "@/lib/doedtc/linq";
import {
  agentNowLabel,
  normalizeScheduledTimezone,
  parseScheduledSendAt,
} from "@/lib/doedtc/doedtc-scheduled";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  DoeDtcOpenLoopContext,
  DoeDtcOpenLoopRow,
  DoeDtcOpenLoopSource,
  DoeDtcOpenLoopStatus,
  DoeDtcProfileSnapshot,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";

const ACTIVE_LOOP_STATUSES: DoeDtcOpenLoopStatus[] = ["open", "waiting_user", "waiting_tool"];
const DEFAULT_WAKE_HOUR = 10;

export function isActiveOpenLoopStatus(status: DoeDtcOpenLoopStatus): boolean {
  return ACTIVE_LOOP_STATUSES.includes(status);
}

export function parseOpenLoopWakeAt(params: {
  wakeAt?: string | null;
  timezone?: string;
  from?: Date;
}): Date | null {
  const raw = params.wakeAt?.trim();
  if (!raw) return null;
  const timezone = normalizeScheduledTimezone(params.timezone ?? null);
  try {
    return parseScheduledSendAt(raw, params.from ?? new Date(), timezone);
  } catch {
    const absolute = new Date(raw);
    return Number.isNaN(absolute.getTime()) ? null : absolute;
  }
}

export function defaultCareFollowUpWake(from = new Date(), timezone?: string): Date {
  const tz = normalizeScheduledTimezone(timezone ?? null);
  const tomorrow = new Date(from.getTime() + 24 * 60 * 60 * 1000);
  try {
    return parseScheduledSendAt(`${DEFAULT_WAKE_HOUR}am`, tomorrow, tz);
  } catch {
    const wake = new Date(from.getTime() + 24 * 60 * 60 * 1000);
    wake.setHours(DEFAULT_WAKE_HOUR, 0, 0, 0);
    return wake;
  }
}

function loopContext(row: DoeDtcOpenLoopRow): DoeDtcOpenLoopContext {
  return (row.context_json ?? {}) as DoeDtcOpenLoopContext;
}

export async function listActiveOpenLoopsForUser(userId: string): Promise<DoeDtcOpenLoopRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_open_loops")
    .select("*")
    .eq("user_id", userId)
    .in("status", ACTIVE_LOOP_STATUSES)
    .order("next_wake_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) throw new Error(error.message);
  return (data ?? []) as DoeDtcOpenLoopRow[];
}

export async function listDueOpenLoops(limit = 24): Promise<DoeDtcOpenLoopRow[]> {
  const supabase = createSupabaseAdmin();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("doedtc_open_loops")
    .select("*")
    .in("status", ACTIVE_LOOP_STATUSES)
    .not("next_wake_at", "is", null)
    .lte("next_wake_at", now)
    .order("next_wake_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as DoeDtcOpenLoopRow[];
}

export async function findOpenLoopByGoalHint(params: {
  userId: string;
  goalHint?: string;
  loopId?: string;
}): Promise<DoeDtcOpenLoopRow | null> {
  const supabase = createSupabaseAdmin();
  if (params.loopId) {
    const { data, error } = await supabase
      .from("doedtc_open_loops")
      .select("*")
      .eq("id", params.loopId)
      .eq("user_id", params.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as DoeDtcOpenLoopRow | null) ?? null;
  }

  const hint = params.goalHint?.trim().toLowerCase();
  if (!hint) return null;
  const { data, error } = await supabase
    .from("doedtc_open_loops")
    .select("*")
    .eq("user_id", params.userId)
    .in("status", ACTIVE_LOOP_STATUSES)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as DoeDtcOpenLoopRow[];
  return (
    rows.find((row) => row.goal.trim().toLowerCase() === hint) ??
    rows.find((row) => row.goal.trim().toLowerCase().includes(hint)) ??
    null
  );
}

export async function createOpenLoop(params: {
  userId: string;
  goal: string;
  status?: DoeDtcOpenLoopStatus;
  nextWakeAt?: Date | string | null;
  context?: DoeDtcOpenLoopContext;
  browserJobId?: string | null;
  source?: DoeDtcOpenLoopSource;
  lastAction?: string | null;
}): Promise<DoeDtcOpenLoopRow> {
  const supabase = createSupabaseAdmin();
  const goal = params.goal.trim();
  if (!goal) throw new Error("Open loop goal is required.");

  const wakeIso =
    params.nextWakeAt instanceof Date
      ? params.nextWakeAt.toISOString()
      : typeof params.nextWakeAt === "string"
        ? params.nextWakeAt
        : null;

  const { data, error } = await supabase
    .from("doedtc_open_loops")
    .insert({
      user_id: params.userId,
      goal,
      status: params.status ?? "open",
      last_action: params.lastAction ?? null,
      next_wake_at: wakeIso,
      context_json: params.context ?? {},
      browser_job_id: params.browserJobId ?? null,
      source: params.source ?? "agent",
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcOpenLoopRow;
}

export async function updateOpenLoop(params: {
  loopId: string;
  userId: string;
  patch: Partial<{
    goal: string;
    status: DoeDtcOpenLoopStatus;
    last_action: string | null;
    next_wake_at: string | null;
    context_json: DoeDtcOpenLoopContext;
    browser_job_id: string | null;
  }>;
}): Promise<DoeDtcOpenLoopRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_open_loops")
    .update({
      ...params.patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.loopId)
    .eq("user_id", params.userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcOpenLoopRow;
}

export async function closeOpenLoop(params: {
  userId: string;
  loopId?: string;
  goalHint?: string;
  lastAction?: string;
}): Promise<DoeDtcOpenLoopRow | null> {
  const row = await findOpenLoopByGoalHint({
    userId: params.userId,
    loopId: params.loopId,
    goalHint: params.goalHint,
  });
  if (!row) return null;
  return updateOpenLoop({
    loopId: row.id,
    userId: params.userId,
    patch: {
      status: "done",
      last_action: params.lastAction ?? "closed",
      next_wake_at: null,
    },
  });
}

export async function attachBrowserJobToOpenLoop(params: {
  userId: string;
  loopId: string;
  browserJobId: string;
}): Promise<DoeDtcOpenLoopRow> {
  const existing = await findOpenLoopByGoalHint({
    userId: params.userId,
    loopId: params.loopId,
  });
  if (!existing) throw new Error("Open loop not found.");
  const ctx = loopContext(existing);
  return updateOpenLoop({
    loopId: existing.id,
    userId: params.userId,
    patch: {
      browser_job_id: params.browserJobId,
      status: "waiting_tool",
      context_json: { ...ctx, kind: "browser_job" },
      last_action: "browser task started",
    },
  });
}

export { openLoopBrowserSessionMaxAgeMs };

export async function countUnsolicitedProactiveOutboundToday(userId: string): Promise<number> {
  const supabase = createSupabaseAdmin();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const { count, error } = await supabase
    .from("doedtc_proactive_outbound_log")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("kind", "unsolicited")
    .gte("created_at", start.toISOString());
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function canSendUnsolicitedProactive(userId: string): Promise<boolean> {
  const count = await countUnsolicitedProactiveOutboundToday(userId);
  return count < 1;
}

async function logProactiveOutbound(params: {
  userId: string;
  kind: string;
  body: string;
  openLoopId?: string | null;
}): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("doedtc_proactive_outbound_log").insert({
    user_id: params.userId,
    kind: params.kind,
    body: params.body,
    open_loop_id: params.openLoopId ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function sendProactiveDoeDtcText(params: {
  user: DoeDtcUserRow;
  text: string;
  kind: string;
  openLoopId?: string | null;
  idempotencyKey: string;
}): Promise<void> {
  await linqSendText({
    to: params.user.phone,
    chatId: params.user.linq_chat_id ?? undefined,
    text: params.text,
    idempotencyKey: params.idempotencyKey,
  });
  await logDoeDtcMessage({
    userId: params.user.id,
    direction: "outbound",
    body: params.text,
  });
  await logProactiveOutbound({
    userId: params.user.id,
    kind: params.kind,
    body: params.text,
    openLoopId: params.openLoopId,
  });
}

function templateOpenLoopReply(loop: DoeDtcOpenLoopRow): string | null {
  const ctx = loopContext(loop);
  if (ctx.kind === "unwell_follow_up") {
    const name = ctx.member_name?.trim() || "they";
    const symptom = ctx.symptom?.trim();
    if (symptom) {
      return `Hey — how's ${name} doing? Still dealing with ${symptom}?`;
    }
    return `Hey — how's ${name} feeling today?`;
  }
  if (ctx.kind === "appointment_reminder") {
    const name = ctx.member_name?.trim();
    if (name) {
      return `Quick heads up — ${name} has an appointment coming up soon. Want me to help with anything before then?`;
    }
    return "Quick heads up — you have an appointment coming up soon. Want me to help with anything before then?";
  }
  if (ctx.kind === "lab_follow_up") {
    return "Hey — saw those lab results on your chart. Want help making sense of them or planning next steps?";
  }
  return null;
}

async function composeOpenLoopReply(params: {
  user: DoeDtcUserRow;
  loop: DoeDtcOpenLoopRow;
  snapshot: DoeDtcProfileSnapshot;
}): Promise<string> {
  const templated = templateOpenLoopReply(params.loop);
  if (templated) return templated;

  const identityCard = formatIdentityCard({
    snapshot: params.snapshot,
    openLoops: [params.loop],
  });
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return `Hey — still on "${params.loop.goal}". Any update?`;
  }

  const response = await fetchOpenAiWithRetry("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.DOEDTC_AGENT_MODEL?.trim() || "gpt-4.1-mini",
      temperature: 0.6,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content: `You are Doe, a caring health companion texting on iMessage. Compose ONE short friendly text (max 2 sentences). No lists, no feature dumps. Goal: ${params.loop.goal}. Last action: ${params.loop.last_action ?? "none"}. Now: ${agentNowLabel()}.`,
        },
        {
          role: "user",
          content: identityCard,
        },
      ],
    }),
  });

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = payload.choices?.[0]?.message?.content?.trim();
  return text || `Hey — still on "${params.loop.goal}". Any update?`;
}

async function resumeBrowserForOpenLoop(loop: DoeDtcOpenLoopRow): Promise<boolean> {
  if (!loop.browser_job_id) return false;
  const job = await getDoeDtcBrowserJobById(loop.browser_job_id);
  if (!job) return false;
  if (job.status === "committed" || job.status === "failed" || job.status === "cancelled") {
    return false;
  }
  if (job.status === "open" || job.status === "needs_login" || job.status === "pending_confirm") {
    const { dispatchDoeDtcBrowserAdvance } = await import("@/lib/doedtc/doedtc-browser-advance");
    dispatchDoeDtcBrowserAdvance({ jobId: job.id });
    await updateOpenLoop({
      loopId: loop.id,
      userId: loop.user_id,
      patch: {
        status: "waiting_tool",
        last_action: "resumed browser on tick",
      },
    });
    return true;
  }
  return false;
}

export async function processOpenLoopTick(loopId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("doedtc_open_loops")
      .select("*")
      .eq("id", loopId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const loop = (data as DoeDtcOpenLoopRow | null) ?? null;
    if (!loop || !isActiveOpenLoopStatus(loop.status)) {
      return { ok: true };
    }

    const ctx = loopContext(loop);
    const user = await getDoeDtcUserById(loop.user_id);
    if (!user?.phone) {
      return { ok: false, error: "User not found." };
    }

    if (loop.browser_job_id) {
      const resumed = await resumeBrowserForOpenLoop(loop);
      if (resumed) {
        const nextWake = new Date(Date.now() + 15 * 60 * 1000);
        await updateOpenLoop({
          loopId: loop.id,
          userId: loop.user_id,
          patch: { next_wake_at: nextWake.toISOString() },
        });
        return { ok: true };
      }
    }

    const unsolicited = loop.source === "care_seed" || !ctx.requested_by_user;
    if (unsolicited && !(await canSendUnsolicitedProactive(loop.user_id))) {
      const nextWake = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await updateOpenLoop({
        loopId: loop.id,
        userId: loop.user_id,
        patch: { next_wake_at: nextWake.toISOString(), last_action: "deferred — proactive cap" },
      });
      return { ok: true };
    }

    const { getDoeDtcProfileSnapshot } = await import("@/lib/doedtc/doedtc-db");
    const snapshot = await getDoeDtcProfileSnapshot(loop.user_id);
    const reply = await composeOpenLoopReply({ user, loop, snapshot });

    await sendProactiveDoeDtcText({
      user,
      text: reply,
      kind: unsolicited ? "unsolicited" : "loop_wake",
      openLoopId: loop.id,
      idempotencyKey: `doedtc-open-loop-${loop.id}-${loop.next_wake_at ?? "now"}`,
    });

    const isOneShot =
      ctx.kind === "appointment_reminder" ||
      (ctx.kind === "unwell_follow_up" && loop.source === "care_seed");

    if (isOneShot) {
      await updateOpenLoop({
        loopId: loop.id,
        userId: loop.user_id,
        patch: {
          status: "waiting_user",
          last_action: `texted: ${reply.slice(0, 120)}`,
          next_wake_at: null,
        },
      });
    } else {
      const nextWake = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await updateOpenLoop({
        loopId: loop.id,
        userId: loop.user_id,
        patch: {
          status: "waiting_user",
          last_action: `texted: ${reply.slice(0, 120)}`,
          next_wake_at: nextWake.toISOString(),
        },
      });
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Open loop tick failed.",
    };
  }
}

export async function hasOpenLoopWithContext(params: {
  userId: string;
  kind: DoeDtcOpenLoopContext["kind"];
  memberId?: string;
  appointmentId?: string;
}): Promise<boolean> {
  const loops = await listActiveOpenLoopsForUser(params.userId);
  return loops.some((row) => {
    const ctx = loopContext(row);
    if (ctx.kind !== params.kind) return false;
    if (params.memberId && ctx.member_id !== params.memberId) return false;
    if (params.appointmentId && ctx.appointment_id !== params.appointmentId) return false;
    return true;
  });
}

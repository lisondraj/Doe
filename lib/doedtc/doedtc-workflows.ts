import { createSupabaseAdmin } from "@/lib/supabase/admin";
import {
  computeNextCheckInAt,
  parseCheckInOutcome,
} from "@/lib/doedtc/doedtc-accountability";
import { normalizePhoneToE164 } from "@/lib/doedtc/doedtc-phone";
import {
  normalizeScheduledTimezone,
} from "@/lib/doedtc/doedtc-scheduled";
import { linqSendText } from "@/lib/doedtc/linq";
import type {
  DoeDtcUserRow,
  DoeDtcWorkflowConfig,
  DoeDtcWorkflowGraph,
  DoeDtcWorkflowRow,
} from "@/lib/doedtc/doedtc-types";
import { loadDoeDtcHouseholdAccessContext } from "@/lib/doedtc/doedtc-db";
import { findHouseholdMemberByName } from "@/lib/doedtc/doedtc-household";
import {
  advanceWorkflowGraph,
  attachGraphToConfig,
  buildComposedWorkflowGraph,
  compileHabitDefaultGraph,
  computeGraphNextRunAt,
  parseWorkflowInboundOutcome,
  resolveWorkflowGraphRuntime,
  type ComposedWorkflowParams,
  type WorkflowGraph,
} from "@/lib/doedtc/doedtc-workflow-graph";

function parseGraph(raw: unknown): DoeDtcWorkflowGraph | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const graph = raw as Partial<DoeDtcWorkflowGraph>;
  if (graph.version !== 1 || !graph.entry || !Array.isArray(graph.nodes)) return undefined;
  return graph as DoeDtcWorkflowGraph;
}

function rowToConfig(raw: unknown): DoeDtcWorkflowConfig {
  const fallback: DoeDtcWorkflowConfig = {
    cadence: "daily",
    timezone: "America/New_York",
    check_in_hour: 19,
    check_in_body: "Quick check-in — did you do it?",
    subject_phone: "",
    subject_user_id: null,
    subject_name: "You",
    notify_phone: "",
    notify_user_id: null,
    notify_name: "Partner",
    await_timeout_minutes: 120,
  };
  if (!raw || typeof raw !== "object") return fallback;
  const config = raw as Partial<DoeDtcWorkflowConfig>;
  return {
    cadence: "daily",
    timezone: config.timezone?.trim() || fallback.timezone,
    check_in_hour:
      typeof config.check_in_hour === "number" ? config.check_in_hour : fallback.check_in_hour,
    check_in_body: config.check_in_body?.trim() || fallback.check_in_body,
    subject_phone: config.subject_phone?.trim() || fallback.subject_phone,
    subject_user_id: config.subject_user_id ?? null,
    subject_name: config.subject_name?.trim() || fallback.subject_name,
    notify_phone: config.notify_phone?.trim() || fallback.notify_phone,
    notify_user_id: config.notify_user_id ?? null,
    notify_name: config.notify_name?.trim() || fallback.notify_name,
    await_timeout_minutes:
      typeof config.await_timeout_minutes === "number"
        ? config.await_timeout_minutes
        : fallback.await_timeout_minutes,
    graph: parseGraph(config.graph),
    cursor: typeof config.cursor === "string" ? config.cursor : undefined,
  };
}

function mapWorkflowRow(row: Record<string, unknown>): DoeDtcWorkflowRow {
  return {
    ...(row as DoeDtcWorkflowRow),
    config: rowToConfig(row.config),
  };
}

async function logWorkflowOutbound(userId: string, body: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  await supabase.from("doedtc_messages").insert({
    user_id: userId,
    direction: "outbound",
    body,
  });
}

async function persistWorkflowGraphState(
  workflowId: string,
  config: DoeDtcWorkflowConfig,
  step: Awaited<ReturnType<typeof advanceWorkflowGraph>>,
): Promise<DoeDtcWorkflowRow> {
  const supabase = createSupabaseAdmin();
  const nextConfig = attachGraphToConfig(config, step.graph, step.cursor);
  const { data, error } = await supabase
    .from("doedtc_workflows")
    .update({
      config: nextConfig,
      phase: step.phase,
      next_run_at: step.next_run_at,
      awaiting_from_phone: step.awaiting_from_phone,
      awaiting_until: step.awaiting_until,
      correlation_id: step.correlation_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", workflowId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapWorkflowRow(data as Record<string, unknown>);
}

async function runWorkflowGraphStep(
  workflow: DoeDtcWorkflowRow,
  trigger: "tick" | "inbound",
  outcome?: "yes" | "no" | "skip",
): Promise<DoeDtcWorkflowRow> {
  const runtime = resolveWorkflowGraphRuntime(workflow.config);
  const step = await advanceWorkflowGraph({
    runtime,
    trigger,
    outcome,
    ctx: {
      config: workflow.config,
      workflow,
      sendText: async ({ to, body, idempotencyKey }) => {
        await linqSendText({ to, text: body, idempotencyKey });
      },
      logOutbound: logWorkflowOutbound,
    },
  });
  return persistWorkflowGraphState(workflow.id, workflow.config, step);
}

export function computeWorkflowNextRunAt(
  config: DoeDtcWorkflowConfig,
  from = new Date(),
): Date {
  const runtime = resolveWorkflowGraphRuntime(config);
  const fromGraph = computeGraphNextRunAt(runtime.graph, runtime.cursor, config.timezone, from);
  if (fromGraph) return fromGraph;
  const next = computeNextCheckInAt(
    {
      cadence: "daily",
      timezone: normalizeScheduledTimezone(config.timezone),
      check_in_hour: config.check_in_hour,
      who_gets_check_in: "subject",
      confirmation: "self",
      miss_notify_partner: true,
      privacy: "normal",
    },
    from,
  );
  return next ?? new Date(from.getTime() + 24 * 60 * 60 * 1000);
}

export function formatWorkflowsForAgent(rows: DoeDtcWorkflowRow[]): string {
  if (rows.length === 0) return "No active habit workflows.";
  return rows
    .map((row) => {
      const when = row.next_run_at?.slice(0, 16).replace("T", " ") ?? "n/a";
      return `- ${row.goal} | subject: ${row.config.subject_name} | next: ${when} | phase: ${row.phase} | id: ${row.id}`;
    })
    .join("\n");
}

export async function listActiveWorkflowsForUser(userId: string): Promise<DoeDtcWorkflowRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_workflows")
    .select("*")
    .eq("owner_user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return ((data as Record<string, unknown>[]) ?? []).map(mapWorkflowRow);
}

export async function createHabitWorkflow(params: {
  owner: DoeDtcUserRow;
  goal: string;
  config: DoeDtcWorkflowConfig;
  subjectMemberId?: string | null;
  startAt?: Date;
}): Promise<DoeDtcWorkflowRow> {
  const graph = compileHabitDefaultGraph(params.config);
  const config = attachGraphToConfig(params.config, graph);
  const nextRunAt = params.startAt ?? computeWorkflowNextRunAt(config);
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_workflows")
    .insert({
      owner_user_id: params.owner.id,
      subject_member_id: params.subjectMemberId ?? null,
      goal: params.goal.trim(),
      config,
      status: "active",
      phase: "scheduled",
      next_run_at: nextRunAt.toISOString(),
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapWorkflowRow(data as Record<string, unknown>);
}

export async function createComposedWorkflow(params: {
  owner: DoeDtcUserRow;
  goal: string;
  composed: ComposedWorkflowParams;
  graph?: WorkflowGraph;
  subjectMemberId?: string | null;
  startAt?: Date;
}): Promise<DoeDtcWorkflowRow> {
  const graph = params.graph ?? buildComposedWorkflowGraph(params.composed);
  const config: DoeDtcWorkflowConfig = {
    cadence: "daily",
    timezone: params.composed.timezone,
    check_in_hour: params.composed.daily_hour,
    check_in_body: params.composed.initial_body,
    subject_phone: params.composed.subject_phone,
    subject_user_id: params.composed.subject_user_id,
    subject_name: params.composed.subject_name,
    notify_phone: params.composed.notify_phone,
    notify_user_id: params.composed.notify_user_id,
    notify_name: params.composed.notify_name,
    await_timeout_minutes: params.composed.await_minutes,
    graph,
    cursor: graph.entry,
  };
  const nextRunAt = params.startAt ?? computeWorkflowNextRunAt(config);
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_workflows")
    .insert({
      owner_user_id: params.owner.id,
      subject_member_id: params.subjectMemberId ?? null,
      goal: params.goal.trim(),
      config,
      status: "active",
      phase: "scheduled",
      next_run_at: nextRunAt.toISOString(),
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapWorkflowRow(data as Record<string, unknown>);
}

export async function listDueWorkflows(now = new Date()): Promise<DoeDtcWorkflowRow[]> {
  const supabase = createSupabaseAdmin();
  const { data: scheduled, error: scheduledError } = await supabase
    .from("doedtc_workflows")
    .select("*")
    .eq("status", "active")
    .eq("phase", "scheduled")
    .lte("next_run_at", now.toISOString());
  if (scheduledError) throw new Error(scheduledError.message);

  const { data: timedOut, error: timedOutError } = await supabase
    .from("doedtc_workflows")
    .select("*")
    .eq("status", "active")
    .eq("phase", "awaiting_reply")
    .lte("awaiting_until", now.toISOString());
  if (timedOutError) throw new Error(timedOutError.message);

  const { data: waitingUntil, error: waitingUntilError } = await supabase
    .from("doedtc_workflows")
    .select("*")
    .eq("status", "active")
    .eq("phase", "waiting_until")
    .lte("next_run_at", now.toISOString());
  if (waitingUntilError) throw new Error(waitingUntilError.message);

  const rows = [
    ...((scheduled as Record<string, unknown>[]) ?? []),
    ...((timedOut as Record<string, unknown>[]) ?? []),
    ...((waitingUntil as Record<string, unknown>[]) ?? []),
  ];
  const seen = new Set<string>();
  return rows
    .map(mapWorkflowRow)
    .filter((row) => {
      if (seen.has(row.id)) return false;
      seen.add(row.id);
      return true;
    });
}

export async function processWorkflowTick(workflowId: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_workflows")
    .select("*")
    .eq("id", workflowId)
    .single();
  if (error) throw new Error(error.message);
  const workflow = mapWorkflowRow(data as Record<string, unknown>);
  if (workflow.status !== "active") return;
  await runWorkflowGraphStep(workflow, "tick");
}

export async function handleWorkflowReply(params: {
  workflow: DoeDtcWorkflowRow;
  outcome: "yes" | "no" | "skip";
}): Promise<void> {
  await runWorkflowGraphStep(params.workflow, "inbound", params.outcome);
}

export async function tryHandleWorkflowInbound(params: {
  phone: string;
  text: string;
  user: DoeDtcUserRow | null;
}): Promise<boolean> {
  const phone = normalizePhoneToE164(params.phone) ?? params.phone.trim();
  const outcome = parseWorkflowInboundOutcome(params.text);
  if (!outcome) return false;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_workflows")
    .select("*")
    .eq("status", "active")
    .in("phase", ["awaiting_reply", "waiting_until"])
    .eq("awaiting_from_phone", phone)
    .order("updated_at", { ascending: false })
    .limit(5);
  if (error) throw new Error(error.message);
  const rows = ((data as Record<string, unknown>[]) ?? []).map(mapWorkflowRow);
  if (rows.length === 0) return false;

  const now = Date.now();
  const workflow = rows.find((row) => {
    if (!row.awaiting_until) return true;
    return new Date(row.awaiting_until).getTime() >= now - 5 * 60 * 1000;
  });
  if (!workflow) return false;

  await handleWorkflowReply({ workflow, outcome });
  return true;
}

export async function cancelWorkflow(params: {
  userId: string;
  workflowId?: string;
  goalHint?: string;
}): Promise<DoeDtcWorkflowRow | null> {
  const rows = await listActiveWorkflowsForUser(params.userId);
  const goalHint = params.goalHint?.trim().toLowerCase();
  const match = params.workflowId
    ? rows.find((row) => row.id === params.workflowId)
    : goalHint
      ? rows.find((row) => row.goal.toLowerCase().includes(goalHint))
      : rows[0];
  if (!match) return null;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_workflows")
    .update({
      status: "cancelled",
      phase: "scheduled",
      next_run_at: null,
      awaiting_from_phone: null,
      awaiting_until: null,
      correlation_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", match.id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapWorkflowRow(data as Record<string, unknown>);
}

export function buildDefaultHabitCheckInBody(goal: string, subjectName: string): string {
  const trimmed = goal.trim();
  if (/shower|bath/i.test(trimmed)) {
    return `Hey ${subjectName} — time to hop in the shower. Reply yes when you're done.`;
  }
  return `Hey ${subjectName} — ${trimmed}. Reply yes when you're done.`;
}

export function defaultHabitCheckInHour(goal: string): number {
  if (/morning|am\b|breakfast|meds/i.test(goal)) return 8;
  return 19;
}

export async function buildHabitWorkflowConfig(params: {
  owner: DoeDtcUserRow;
  goal: string;
  subjectName: string;
  subjectMemberId?: string | null;
  checkInHour?: number;
  checkInBody?: string;
  awaitTimeoutMinutes?: number;
  timezone?: string;
}): Promise<DoeDtcWorkflowConfig> {
  const household = await loadDoeDtcHouseholdAccessContext(params.owner.id);
  const member =
    params.subjectMemberId != null
      ? household.members.find((row) => row.id === params.subjectMemberId)
      : findHouseholdMemberByName(household.members, params.subjectName);
  const subjectName = member?.full_name ?? params.subjectName;
  const ownerPhone = normalizePhoneToE164(params.owner.phone) ?? params.owner.phone;
  const subjectPhone = member?.phone
    ? normalizePhoneToE164(member.phone) ?? member.phone
    : ownerPhone;
  const notifyPhone = ownerPhone;

  return {
    cadence: "daily",
    timezone: normalizeScheduledTimezone(params.timezone),
    check_in_hour: params.checkInHour ?? defaultHabitCheckInHour(params.goal),
    check_in_body: params.checkInBody ?? buildDefaultHabitCheckInBody(params.goal, subjectName),
    subject_phone: subjectPhone,
    subject_user_id: member?.user_id ?? (subjectPhone === ownerPhone ? params.owner.id : null),
    subject_name: subjectName,
    notify_phone: notifyPhone,
    notify_user_id: params.owner.id,
    notify_name: params.owner.full_name ?? "You",
    await_timeout_minutes: params.awaitTimeoutMinutes ?? 120,
  };
}

export { parseCheckInOutcome };

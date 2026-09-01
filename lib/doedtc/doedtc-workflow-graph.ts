import { randomUUID } from "node:crypto";

import {
  computeNextCheckInAt,
  parseCheckInOutcome,
} from "@/lib/doedtc/doedtc-accountability";
import { normalizePhoneToE164 } from "@/lib/doedtc/doedtc-phone";
import { normalizeScheduledTimezone } from "@/lib/doedtc/doedtc-scheduled";
import { linqSendText } from "@/lib/doedtc/linq";
import type {
  DoeDtcWorkflowConfig,
  DoeDtcWorkflowPhase,
  DoeDtcWorkflowRow,
} from "@/lib/doedtc/doedtc-types";

export const WORKFLOW_GRAPH_MAX_NODES = 12;
export const WORKFLOW_GRAPH_MAX_WAIT_FOR_REPLY = 2;
export const WORKFLOW_GRAPH_MAX_OWNER_ESCALATIONS = 1;

export type WorkflowGraphNodeKind =
  | "recur_daily"
  | "send_message"
  | "wait_for_reply"
  | "wait_until"
  | "done";

export type WorkflowGraphEdgeLabel = "next" | "yes" | "no" | "timeout" | "skip";

export type WorkflowGraphNode = {
  id: string;
  kind: WorkflowGraphNodeKind;
  params: Record<string, unknown>;
  out?: Partial<Record<WorkflowGraphEdgeLabel, string>>;
};

export type WorkflowGraph = {
  version: 1;
  entry: string;
  nodes: WorkflowGraphNode[];
};

export type WorkflowGraphRuntimeState = {
  graph: WorkflowGraph;
  cursor: string;
};

export type ComposedWorkflowParams = {
  timezone: string;
  subject_phone: string;
  subject_user_id: string | null;
  subject_name: string;
  notify_phone: string;
  notify_user_id: string | null;
  notify_name: string;
  daily_hour: number;
  initial_body: string;
  await_minutes: number;
  reminder_body?: string;
  escalate_hour?: number;
  escalate_body?: string;
};

export type WorkflowGraphValidationResult =
  | { ok: true }
  | { ok: false; error: string };

function nodeId(prefix: string): string {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

function countNodes(graph: WorkflowGraph): number {
  return graph.nodes.length;
}

function countWaitForReply(graph: WorkflowGraph): number {
  return graph.nodes.filter((row) => row.kind === "wait_for_reply").length;
}

function countOwnerEscalations(graph: WorkflowGraph): number {
  return graph.nodes.filter(
    (row) => row.kind === "send_message" && row.params.to === "owner",
  ).length;
}

export function validateWorkflowGraph(graph: WorkflowGraph): WorkflowGraphValidationResult {
  if (graph.version !== 1) return { ok: false, error: "Unsupported graph version." };
  if (!graph.entry?.trim()) return { ok: false, error: "Graph entry is required." };
  if (countNodes(graph) > WORKFLOW_GRAPH_MAX_NODES) {
    return { ok: false, error: `Graph exceeds ${WORKFLOW_GRAPH_MAX_NODES} nodes.` };
  }
  if (countWaitForReply(graph) > WORKFLOW_GRAPH_MAX_WAIT_FOR_REPLY) {
    return {
      ok: false,
      error: `Graph exceeds ${WORKFLOW_GRAPH_MAX_WAIT_FOR_REPLY} wait_for_reply nodes per cycle.`,
    };
  }
  if (countOwnerEscalations(graph) > WORKFLOW_GRAPH_MAX_OWNER_ESCALATIONS) {
    return {
      ok: false,
      error: `Graph exceeds ${WORKFLOW_GRAPH_MAX_OWNER_ESCALATIONS} owner escalation per cycle.`,
    };
  }

  const ids = new Set(graph.nodes.map((row) => row.id));
  if (!ids.has(graph.entry)) return { ok: false, error: "Graph entry node not found." };

  for (const row of graph.nodes) {
    if (row.kind === "send_message") {
      const body = String(row.params.body ?? "").trim();
      if (!body) return { ok: false, error: `Node ${row.id} is missing message body.` };
      const to = row.params.to;
      if (to !== "subject" && to !== "owner") {
        return { ok: false, error: `Node ${row.id} has invalid recipient.` };
      }
    }
    if (row.kind === "wait_for_reply") {
      const minutes = row.params.minutes;
      if (typeof minutes !== "number" || minutes <= 0) {
        return { ok: false, error: `Node ${row.id} has invalid wait minutes.` };
      }
    }
    if (row.kind === "wait_until") {
      const hour = row.params.hour;
      if (typeof hour !== "number" || hour < 0 || hour > 23) {
        return { ok: false, error: `Node ${row.id} has invalid wait_until hour.` };
      }
    }
    if (row.kind === "recur_daily") {
      const hour = row.params.hour;
      if (typeof hour !== "number" || hour < 0 || hour > 23) {
        return { ok: false, error: `Node ${row.id} has invalid recur_daily hour.` };
      }
    }
    for (const target of Object.values(row.out ?? {})) {
      if (target && !ids.has(target)) {
        return { ok: false, error: `Node ${row.id} references missing target ${target}.` };
      }
    }
  }

  return { ok: true };
}

export function buildComposedWorkflowGraph(params: ComposedWorkflowParams): WorkflowGraph {
  const recur = nodeId("recur");
  const sendInitial = nodeId("send");
  const waitReply = nodeId("wait");
  const done = nodeId("done");

  const nodes: WorkflowGraphNode[] = [
    {
      id: recur,
      kind: "recur_daily",
      params: { hour: params.daily_hour },
      out: { next: sendInitial },
    },
    {
      id: sendInitial,
      kind: "send_message",
      params: { body: params.initial_body, to: "subject" },
      out: { next: waitReply },
    },
    {
      id: waitReply,
      kind: "wait_for_reply",
      params: { minutes: params.await_minutes, from: "subject" },
      out: { yes: recur, skip: recur },
    },
    {
      id: done,
      kind: "done",
      params: {},
      out: { next: recur },
    },
  ];

  let timeoutTarget = done;

  if (params.reminder_body?.trim()) {
    const sendReminder = nodeId("remind");
    nodes.push({
      id: sendReminder,
      kind: "send_message",
      params: { body: params.reminder_body.trim(), to: "subject" },
    });

    if (typeof params.escalate_hour === "number" && params.escalate_body?.trim()) {
      const waitUntil = nodeId("wait_until");
      const sendEscalate = nodeId("escalate");
      nodes.push({
        id: waitUntil,
        kind: "wait_until",
        params: { hour: params.escalate_hour },
        out: { yes: recur, skip: recur, timeout: sendEscalate },
      });
      nodes.push({
        id: sendEscalate,
        kind: "send_message",
        params: { body: params.escalate_body.trim(), to: "owner" },
        out: { next: done },
      });
      nodes.find((row) => row.id === sendReminder)!.out = { next: waitUntil };
      timeoutTarget = sendReminder;
    } else {
      nodes.find((row) => row.id === sendReminder)!.out = { next: done };
      timeoutTarget = sendReminder;
    }
  } else if (params.escalate_body?.trim()) {
    const sendEscalate = nodeId("escalate");
    nodes.push({
      id: sendEscalate,
      kind: "send_message",
      params: { body: params.escalate_body.trim(), to: "owner" },
      out: { next: done },
    });
    timeoutTarget = sendEscalate;
  }

  const waitNode = nodes.find((row) => row.id === waitReply)!;
  waitNode.out = {
    ...waitNode.out,
    no: timeoutTarget,
    timeout: timeoutTarget,
  };

  const graph: WorkflowGraph = { version: 1, entry: recur, nodes };
  const validation = validateWorkflowGraph(graph);
  if (!validation.ok) throw new Error(validation.error);
  return graph;
}

export function compileHabitDefaultGraph(config: DoeDtcWorkflowConfig): WorkflowGraph {
  const missBody = `${config.subject_name} didn't reply to the check-in.`;
  return buildComposedWorkflowGraph({
    timezone: config.timezone,
    subject_phone: config.subject_phone,
    subject_user_id: config.subject_user_id,
    subject_name: config.subject_name,
    notify_phone: config.notify_phone,
    notify_user_id: config.notify_user_id,
    notify_name: config.notify_name,
    daily_hour: config.check_in_hour,
    initial_body: config.check_in_body,
    await_minutes: config.await_timeout_minutes,
    escalate_body: missBody,
  });
}

export function resolveWorkflowGraphRuntime(
  config: DoeDtcWorkflowConfig,
): WorkflowGraphRuntimeState {
  const rawGraph = config.graph;
  if (rawGraph?.version === 1 && rawGraph.nodes?.length) {
    const cursor = config.cursor?.trim() || rawGraph.entry;
    return { graph: rawGraph, cursor };
  }
  const graph = compileHabitDefaultGraph(config);
  return { graph, cursor: graph.entry };
}

function findNode(graph: WorkflowGraph, id: string): WorkflowGraphNode | null {
  return graph.nodes.find((row) => row.id === id) ?? null;
}

function findRecurDailyNode(graph: WorkflowGraph): WorkflowGraphNode | null {
  return graph.nodes.find((row) => row.kind === "recur_daily") ?? null;
}

export function computeGraphNextRunAt(
  graph: WorkflowGraph,
  cursor: string,
  timezone: string,
  from = new Date(),
): Date | null {
  const node = findNode(graph, cursor);
  if (!node) return null;
  const hourNode = node.kind === "recur_daily" ? node : findRecurDailyNode(graph);
  if (!hourNode || hourNode.kind !== "recur_daily") return null;
  const hour = typeof hourNode.params.hour === "number" ? hourNode.params.hour : 19;
  return (
    computeNextCheckInAt(
      {
        cadence: "daily",
        timezone: normalizeScheduledTimezone(timezone),
        check_in_hour: hour,
        who_gets_check_in: "subject",
        confirmation: "self",
        miss_notify_partner: true,
        privacy: "normal",
      },
      from,
    ) ?? new Date(from.getTime() + 24 * 60 * 60 * 1000)
  );
}

function computeWaitUntilDeadline(
  params: Record<string, unknown>,
  timezone: string,
  from = new Date(),
): Date {
  const hour = typeof params.hour === "number" ? params.hour : 21;
  const minute = typeof params.minute === "number" ? params.minute : 0;
  const tz = normalizeScheduledTimezone(timezone);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(from);
  const lookup = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");
  const localYear = lookup("year");
  const localMonth = lookup("month");
  const localDay = lookup("day");
  const localHour = lookup("hour");
  const localMinute = lookup("minute");

  let targetDay = localDay;
  if (localHour > hour || (localHour === hour && localMinute >= minute)) {
    targetDay += 1;
  }

  const guess = new Date(
    Date.UTC(localYear, localMonth - 1, targetDay, hour, minute, 0),
  );
  for (let offset = -14; offset <= 14; offset += 1) {
    const candidate = new Date(guess.getTime() + offset * 60 * 60 * 1000);
    const candidateParts = formatter.formatToParts(candidate);
    const cHour = Number(candidateParts.find((part) => part.type === "hour")?.value ?? "0");
    const cMinute = Number(
      candidateParts.find((part) => part.type === "minute")?.value ?? "0",
    );
    const cDay = Number(candidateParts.find((part) => part.type === "day")?.value ?? "0");
    if (cHour === hour && cMinute === minute && cDay === (targetDay > 31 ? localDay + 1 : targetDay)) {
      return candidate;
    }
  }
  return new Date(from.getTime() + 60 * 60 * 1000);
}

export type WorkflowGraphExecutionContext = {
  config: DoeDtcWorkflowConfig;
  workflow: DoeDtcWorkflowRow;
  sendText: (params: { to: string; body: string; idempotencyKey: string }) => Promise<void>;
  logOutbound: (userId: string, body: string) => Promise<void>;
  now?: Date;
};

export type WorkflowGraphStepResult = {
  cursor: string;
  phase: DoeDtcWorkflowPhase;
  next_run_at: string | null;
  awaiting_from_phone: string | null;
  awaiting_until: string | null;
  correlation_id: string | null;
  graph: WorkflowGraph;
  done: boolean;
};

function resolveRecipient(
  config: DoeDtcWorkflowConfig,
  to: unknown,
): { phone: string; logUserId: string } {
  if (to === "owner") {
    return {
      phone: config.notify_phone,
      logUserId: config.notify_user_id ?? config.subject_user_id ?? "",
    };
  }
  return {
    phone: config.subject_phone,
    logUserId: config.subject_user_id ?? config.notify_user_id ?? "",
  };
}

export async function advanceWorkflowGraph(params: {
  runtime: WorkflowGraphRuntimeState;
  ctx: WorkflowGraphExecutionContext;
  trigger: "tick" | "inbound";
  outcome?: "yes" | "no" | "skip";
}): Promise<WorkflowGraphStepResult> {
  const now = params.ctx.now ?? new Date();
  const { config, workflow } = params.ctx;
  let { graph, cursor } = params.runtime;
  let phase: DoeDtcWorkflowPhase = workflow.phase;
  let nextRunAt: string | null = workflow.next_run_at;
  let awaitingFromPhone: string | null = workflow.awaiting_from_phone;
  let awaitingUntil: string | null = workflow.awaiting_until;
  let correlationId: string | null = workflow.correlation_id;

  const finishWait = async (
    node: WorkflowGraphNode,
    edge: WorkflowGraphEdgeLabel,
  ): Promise<boolean> => {
    const target = node.out?.[edge];
    if (!target) return false;
    cursor = target;
    phase = "scheduled";
    awaitingFromPhone = null;
    awaitingUntil = null;
    correlationId = null;
    return true;
  };

  if (params.trigger === "inbound" && params.outcome) {
    const waitNode = findNode(graph, cursor);
    if (
      waitNode &&
      (waitNode.kind === "wait_for_reply" || waitNode.kind === "wait_until")
    ) {
      const edge =
        params.outcome === "yes"
          ? "yes"
          : params.outcome === "skip"
            ? "skip"
            : "no";
      const resolved = waitNode.out?.[edge] ?? waitNode.out?.timeout;
      if (resolved) {
        cursor = resolved;
        phase = "scheduled";
        awaitingFromPhone = null;
        awaitingUntil = null;
        correlationId = null;
      }
    }
  }

  if (params.trigger === "tick") {
    const waitNode = findNode(graph, cursor);
    if (
      waitNode &&
      (waitNode.kind === "wait_for_reply" || waitNode.kind === "wait_until") &&
      (phase === "awaiting_reply" || phase === "waiting_until") &&
      awaitingUntil &&
      new Date(awaitingUntil).getTime() <= now.getTime()
    ) {
      const target = waitNode.out?.timeout ?? waitNode.out?.no;
      if (target) {
        cursor = target;
        phase = "scheduled";
        awaitingFromPhone = null;
        awaitingUntil = null;
        correlationId = null;
      }
    }
  }

  for (let guard = 0; guard < 20; guard += 1) {
    const node = findNode(graph, cursor);
    if (!node) break;

    if (node.kind === "recur_daily") {
      if (phase === "scheduled") {
        if (params.trigger !== "tick") {
          nextRunAt =
            computeGraphNextRunAt(graph, cursor, config.timezone, now)?.toISOString() ?? null;
          break;
        }
        if (nextRunAt && new Date(nextRunAt).getTime() > now.getTime()) {
          break;
        }
        if (node.out?.next) {
          cursor = node.out.next;
          nextRunAt = null;
          continue;
        }
      }
      break;
    }

    if (node.kind === "send_message") {
      const body = String(node.params.body ?? "").trim();
      const recipient = resolveRecipient(config, node.params.to);
      const key = `doedtc-workflow-graph-${workflow.id}-${cursor}-${correlationId ?? "none"}`;
      await params.ctx.sendText({ to: recipient.phone, body, idempotencyKey: key });
      if (recipient.logUserId) {
        await params.ctx.logOutbound(recipient.logUserId, body);
      }
      if (node.out?.next) {
        cursor = node.out.next;
        continue;
      }
      break;
    }

    if (node.kind === "wait_for_reply") {
      const minutes = typeof node.params.minutes === "number" ? node.params.minutes : 60;
      const deadline = new Date(now.getTime() + minutes * 60 * 1000);
      correlationId = correlationId ?? randomUUID();
      phase = "awaiting_reply";
      awaitingFromPhone = normalizePhoneToE164(config.subject_phone) ?? config.subject_phone;
      awaitingUntil = deadline.toISOString();
      nextRunAt = null;
      break;
    }

    if (node.kind === "wait_until") {
      const deadline = computeWaitUntilDeadline(node.params, config.timezone, now);
      correlationId = correlationId ?? randomUUID();
      phase = "waiting_until";
      awaitingFromPhone = normalizePhoneToE164(config.subject_phone) ?? config.subject_phone;
      awaitingUntil = deadline.toISOString();
      nextRunAt = deadline.toISOString();
      break;
    }

    if (node.kind === "done") {
      const recur = findRecurDailyNode(graph);
      if (recur) {
        cursor = recur.id;
        phase = "scheduled";
        nextRunAt =
          computeGraphNextRunAt(graph, cursor, config.timezone, now)?.toISOString() ?? null;
        awaitingFromPhone = null;
        awaitingUntil = null;
        correlationId = null;
        break;
      }
      if (node.out?.next) {
        cursor = node.out.next;
        continue;
      }
      break;
    }

    break;
  }

  return {
    cursor,
    phase,
    next_run_at: nextRunAt,
    awaiting_from_phone: awaitingFromPhone,
    awaiting_until: awaitingUntil,
    correlation_id: correlationId,
    graph,
    done: false,
  };
}

export function parseWorkflowInboundOutcome(text: string): "yes" | "no" | "skip" | null {
  return parseCheckInOutcome(text);
}

export function workflowGraphFromConfig(config: DoeDtcWorkflowConfig): WorkflowGraph | null {
  if (config.graph?.version === 1 && config.graph.nodes?.length) {
    return config.graph;
  }
  return null;
}

export function attachGraphToConfig(
  config: DoeDtcWorkflowConfig,
  graph: WorkflowGraph,
  cursor?: string,
): DoeDtcWorkflowConfig {
  return {
    ...config,
    graph,
    cursor: cursor ?? graph.entry,
  };
}

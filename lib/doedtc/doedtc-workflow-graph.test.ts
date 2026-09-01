import assert from "node:assert/strict";
import test from "node:test";

import { validateDoePlan } from "@/lib/doedtc/doedtc-agent-policy";
import { DoePlanSchema } from "@/lib/doedtc/agent/plan-schema";
import {
  advanceWorkflowGraph,
  buildComposedWorkflowGraph,
  compileHabitDefaultGraph,
  validateWorkflowGraph,
  WORKFLOW_GRAPH_MAX_NODES,
  type WorkflowGraph,
} from "@/lib/doedtc/doedtc-workflow-graph";
import type { DoeDtcWorkflowConfig, DoeDtcWorkflowRow } from "@/lib/doedtc/doedtc-types";

const baseConfig: DoeDtcWorkflowConfig = {
  cadence: "daily",
  timezone: "America/New_York",
  check_in_hour: 19,
  check_in_body: "Time to check in — reply yes when done.",
  subject_phone: "+15551234567",
  subject_user_id: "subject-user",
  subject_name: "Alex",
  notify_phone: "+15559876543",
  notify_user_id: "owner-user",
  notify_name: "Parent",
  await_timeout_minutes: 60,
};

function mockWorkflow(config: DoeDtcWorkflowConfig): DoeDtcWorkflowRow {
  return {
    id: "wf-1",
    owner_user_id: "owner-user",
    subject_member_id: null,
    goal: "daily check-in",
    config,
    status: "active",
    phase: "scheduled",
    next_run_at: "2026-09-01T23:00:00.000Z",
    awaiting_from_phone: null,
    awaiting_until: null,
    correlation_id: null,
    created_at: "2026-09-01T00:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  };
}

test("buildComposedWorkflowGraph compiles shower-shaped graph without shower strings in runtime", () => {
  const graph = buildComposedWorkflowGraph({
    timezone: "America/New_York",
    subject_phone: "+15551234567",
    subject_user_id: "subject",
    subject_name: "Alex",
    notify_phone: "+15559876543",
    notify_user_id: "owner",
    notify_name: "Parent",
    daily_hour: 19,
    initial_body: "Time to check in — reply yes when done.",
    await_minutes: 60,
    reminder_body: "Reminder — reply yes when done.",
    escalate_hour: 21,
    escalate_body: "Alex didn't reply to the check-in.",
  });

  const serialized = JSON.stringify(graph);
  assert.doesNotMatch(serialized, /shower/i);
  assert.equal(graph.nodes.length, 7);
  assert.equal(validateWorkflowGraph(graph).ok, true);
});

test("buildComposedWorkflowGraph compiles homework-shaped graph with same builder", () => {
  const graph = buildComposedWorkflowGraph({
    timezone: "America/New_York",
    subject_phone: "+15551112222",
    subject_user_id: "maya",
    subject_name: "Maya",
    notify_phone: "+15553334444",
    notify_user_id: "owner",
    notify_name: "Parent",
    daily_hour: 17,
    initial_body: "Homework time — reply yes when you're on it.",
    await_minutes: 60,
    escalate_body: "Maya didn't reply about homework.",
  });

  assert.equal(validateWorkflowGraph(graph).ok, true);
  const sendNodes = graph.nodes.filter((row) => row.kind === "send_message");
  assert.ok(sendNodes.length >= 2);
});

test("compileHabitDefaultGraph matches legacy habit preset", () => {
  const graph = compileHabitDefaultGraph(baseConfig);
  assert.equal(validateWorkflowGraph(graph).ok, true);
  assert.ok(graph.nodes.some((row) => row.kind === "recur_daily"));
  assert.ok(graph.nodes.some((row) => row.kind === "wait_for_reply"));
});

test("validateWorkflowGraph rejects oversized graphs", () => {
  const nodes = Array.from({ length: WORKFLOW_GRAPH_MAX_NODES + 1 }, (_, index) => ({
    id: `n${index}`,
    kind: "done" as const,
    params: {},
  }));
  const graph: WorkflowGraph = { version: 1, entry: "n0", nodes };
  const result = validateWorkflowGraph(graph);
  assert.equal(result.ok, false);
});

test("validateWorkflowGraph rejects missing send_message body", () => {
  const graph: WorkflowGraph = {
    version: 1,
    entry: "send",
    nodes: [{ id: "send", kind: "send_message", params: { to: "subject" } }],
  };
  assert.equal(validateWorkflowGraph(graph).ok, false);
});

test("advanceWorkflowGraph sends check-in on tick and waits for reply", async () => {
  const graph = compileHabitDefaultGraph(baseConfig);
  const sent: string[] = [];
  const workflow = mockWorkflow(baseConfig);
  const step = await advanceWorkflowGraph({
    runtime: { graph, cursor: graph.entry },
    trigger: "tick",
    ctx: {
      config: baseConfig,
      workflow,
      now: new Date("2026-09-01T23:00:00.000Z"),
      sendText: async ({ body }) => {
        sent.push(body);
      },
      logOutbound: async () => {},
    },
  });

  assert.equal(sent.length, 1);
  assert.equal(step.phase, "awaiting_reply");
  assert.ok(step.awaiting_from_phone);
});

test("advanceWorkflowGraph yes reply loops to recur_daily", async () => {
  const graph = compileHabitDefaultGraph(baseConfig);
  const waitNode = graph.nodes.find((row) => row.kind === "wait_for_reply");
  assert.ok(waitNode);

  const workflow = {
    ...mockWorkflow(baseConfig),
    phase: "awaiting_reply" as const,
    awaiting_from_phone: baseConfig.subject_phone,
    awaiting_until: "2026-09-01T23:30:00.000Z",
  };

  const step = await advanceWorkflowGraph({
    runtime: { graph, cursor: waitNode!.id },
    trigger: "inbound",
    outcome: "yes",
    ctx: {
      config: baseConfig,
      workflow,
      now: new Date("2026-09-01T23:05:00.000Z"),
      sendText: async () => {},
      logOutbound: async () => {},
    },
  });

  const cursorNode = graph.nodes.find((row) => row.id === step.cursor);
  assert.equal(cursorNode?.kind, "recur_daily");
});

test("validateDoePlan accepts act_now plan with workflow graph", () => {
  const graph = buildComposedWorkflowGraph({
    timezone: "America/New_York",
    subject_phone: "+15551234567",
    subject_user_id: "subject",
    subject_name: "Alex",
    notify_phone: "+15559876543",
    notify_user_id: "owner",
    notify_name: "Parent",
    daily_hour: 19,
    initial_body: "Check in",
    await_minutes: 60,
    escalate_body: "Missed check-in",
  });

  const plan = DoePlanSchema.parse({
    intent: "Daily check-in for Alex",
    action: "act_now",
    immediate: [{ tool: "start_workflow", args: { goal: "check-in" } }],
    workflow: { graph },
    reply: "I'll text Alex at 7 and ping you if they don't reply.",
    specialist: "scheduling",
  });

  const validation = validateDoePlan(plan, {
    inboundText: "text Alex at 7 every day and ping me if they don't reply",
    textsThirdParty: true,
  });
  assert.equal(validation.ok, true);
});

test("validateDoePlan rejects act_now when policy requires confirm", () => {
  const plan = DoePlanSchema.parse({
    intent: "Text Maya",
    action: "act_now",
    immediate: [{ tool: "schedule_text", args: {} }],
    workflow: null,
    reply: "I'll text Maya tonight.",
    specialist: "scheduling",
  });

  const validation = validateDoePlan(plan, {
    inboundText: "text Maya tonight",
    textsThirdParty: true,
    missingSlot: true,
  });
  assert.equal(validation.ok, false);
  assert.equal(validation.action, "confirm_once");
});

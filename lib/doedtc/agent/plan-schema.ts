import { z } from "zod";

import type { DoeDtcWorkflowGraph } from "@/lib/doedtc/doedtc-types";

export const DoePlanImmediateSchema = z.object({
  tool: z.string().min(1),
  args: z.record(z.string(), z.unknown()).default({}),
});

export const DoePlanWorkflowPresetSchema = z.enum(["habit_default", "one_shot_text"]);

const workflowGraphEdgeSchema = z
  .object({
    next: z.string().optional(),
    yes: z.string().optional(),
    no: z.string().optional(),
    timeout: z.string().optional(),
    skip: z.string().optional(),
  })
  .optional();

export const DoePlanWorkflowGraphSchema = z.object({
  version: z.literal(1),
  entry: z.string().min(1),
  nodes: z.array(
    z.object({
      id: z.string().min(1),
      kind: z.enum(["recur_daily", "send_message", "wait_for_reply", "wait_until", "done"]),
      params: z.record(z.string(), z.unknown()).default({}),
      out: workflowGraphEdgeSchema,
    }),
  ),
});

export const DoePlanWorkflowSchema = z.union([
  z.object({ preset: DoePlanWorkflowPresetSchema }),
  z.object({ graph: DoePlanWorkflowGraphSchema }),
  z.object({
    preset: DoePlanWorkflowPresetSchema,
    graph: DoePlanWorkflowGraphSchema,
  }),
]);

export const DoePlanSchema = z.object({
  intent: z.string().min(1),
  action: z.enum(["act_now", "confirm_once", "refuse"]).default("act_now"),
  immediate: z.array(DoePlanImmediateSchema).default([]),
  workflow: DoePlanWorkflowSchema.nullable().default(null),
  reply: z.string().min(1),
  specialist: z
    .enum(["healthRecord", "guides", "scheduling", "browser"])
    .nullable()
    .default(null),
});

export type DoePlan = z.infer<typeof DoePlanSchema>;
export type DoePlanImmediate = z.infer<typeof DoePlanImmediateSchema>;
export type DoePlanWorkflow = z.infer<typeof DoePlanWorkflowSchema>;

export function parseDoePlan(raw: unknown): DoePlan | null {
  const parsed = DoePlanSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function workflowGraphFromPlanWorkflow(
  workflow: DoePlanWorkflow | null,
): DoeDtcWorkflowGraph | null {
  if (!workflow || !("graph" in workflow) || !workflow.graph) return null;
  return workflow.graph;
}

export const DOE_PLANNER_OUTPUT_SCHEMA = DoePlanSchema;

export function buildPlannerInstructionsBlock(): string {
  return `You are the Doe planner. Output a structured DoePlan before any specialist runs.

Plan rules:
- intent: one line summary of what the user wants.
- action: act_now | confirm_once | refuse — apply shared policy.
- immediate: zero or more { tool, args } for this turn (schedule_text, log_symptoms, browse, etc.).
- workflow: optional composed graph OR preset habit_default for simple daily check-ins.
- specialist: which specialist to delegate immediate work to (healthRecord, guides, scheduling, browser), or null if reply-only.
- reply: plain iMessage text for the user.

Workflow presets:
- habit_default — daily ping → await reply → notify owner on miss (same as start_habit_workflow).
- one_shot_text — use schedule_text in immediate, not workflow.

Graph nodes (closed grammar): recur_daily, send_message, wait_for_reply, wait_until, done.
Do not invent node kinds. Max 12 nodes, max 2 wait_for_reply, max 1 owner escalation per cycle.`;
}

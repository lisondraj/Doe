import { z } from "zod";

import type { DoeDtcWorkflowGraph } from "@/lib/doedtc/doedtc-types";

/** Structured-output-safe JSON values. `z.unknown()` is rejected by OpenAI json schema. */
const jsonScalar = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const jsonArgs = z.record(z.string(), jsonScalar).default({});

export const DoePlanImmediateSchema = z.object({
  tool: z.string().min(1),
  args: jsonArgs,
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
      params: jsonArgs,
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
Do not invent node kinds. Max 12 nodes, max 2 wait_for_reply, max 1 owner escalation per cycle.

Location / show / where-is profile, chart, tracker, or labs:
- immediate must include send_profile_link (tab=results when labs/results are obvious), then a finished reply.
- Act first — do not describe a link you have not sent. Never use "here" as a URL placeholder.

Chart writes (meds, conditions, labs, tracker entries):
- If they named the thing, immediate includes the write tool (add_medication, add_condition, log_result, log_artifact_entry). Reply confirms. The matching tab link is sent automatically.
- If they are vague (add a med / log my labs / add something), ask one question for the missing name, date, or value. Do not invent. Do not write a blank row.

Chart reads (what's on my chart / what were my labs / my meds):
- read_profile the matching tab and answer in reply. send_profile_link only if they asked to see, show, where, or send.

Inbound document:
- immediate includes parse_document.
- Read the patient name on the page. Save only if it matches the user (loose spelling) or someone on the household.
- If the name is someone else, ask who it is and if they want to invite them to the household. Do not save yet.
- If there is no name and they will not identify or invite, tell them you can't add this photo.
- Never reply that you could not read the document unless parse_document failed.

Feeling unwell:
- Care and probe first. Reply must not mention logging or tracking. log_symptoms may be in immediate after you have helped, but the reply stays human.

Capability ask:
- If they ask what you can do, reply like a friend in one or two sentences. Do not list features, reminders, or health-information bullets.

Browse / search / screenshot / go to any page:
- immediate includes start_browser_task. Any host, any query — no allowlist.
- Screenshot is sent as a follow-up iMessage after you reply that you're on it. Do not ask for a more specific URL first.
- Never refuse Google, a search, or a site. If they asked what the first result is, start the job, say you're working on it, and wait for the page follow-up.

Parallel inbound:
- This message is its own turn. Reply to it now (act_now). Do not stall on other Active work.
- If they ask what you're working on, describe Active work in reply. No tool required unless they also asked you to do something.
- Never reply that you are working on it or will send later unless immediate already includes start_browser_task, schedule_text, or another started tool. If start_browser_task is running, the reply should say you're on it and that you'll text when it's done.`;
}

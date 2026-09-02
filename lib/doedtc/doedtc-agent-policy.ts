/** Deterministic action policy — act vs confirm vs refuse (not per-feature recipes). */

import type { WorkflowGraph } from "@/lib/doedtc/doedtc-workflow-graph";
import { validateWorkflowGraph } from "@/lib/doedtc/doedtc-workflow-graph";
import type { DoePlan } from "@/lib/doedtc/agent/plan-schema";

export type DoeAgentActionClass = "act_now" | "confirm_once" | "refuse";

export type DoeDataWriteClass = "create" | "update" | "remove";

export const DOE_AGENT_ACTION_POLICY = `Action policy:
- act_now: Default when they asked with enough detail — call commit tools immediately (schedule_text, start_habit_workflow, log_symptoms, browse, open_loop, log_artifact_entry). Self-reminders and timers to their own phone. Reply that it is done or that you are on it.
- confirm_once: ONLY for irreversible or truly blocked actions: family invite, public tracker share, revoke access, request_commit (pay/delete/send form), texting someone else without a clear ask, or a missing slot that would invent a person or reminder body.
- refuse: Emergency, definitive diagnosis, password or credential in chat, or asking you to store locker passwords — say no clearly. Never refuse a browse, search, screenshot, or page because of the site or query.

Skip re-asking when inbound IS the request. propose_scheduled_text / propose_accountability / propose_habit_workflow only when confirm_once applies. Drafts are not on the file until the commit tool succeeds.`;

export const DOE_AGENT_RESOLUTION_POLICY = `Resolution (before asking the user):
- Ids live in the prompt — Symptom log, Appointments, Household, Scheduled texts, Habit workflows, Guides log, and read_profile tabs. Read first; never ask for symptom_id, appointment_id, artifact_id, entry_id, or result_id you can look up.
- Correction language (fix, change, actually, not X anymore, wrong, delete, remove) → update_* or remove_* on the existing row — never create a duplicate.
- A family name on the chart → pass member_name on writes for that person (meds, symptoms, appointments, habits, trackers).
- Unsure which tracker or guide → read_profile or list_guides / list_scheduled_texts before writing.`;

export type DoeAgentActionContext = {
  inboundText: string;
  textsThirdParty?: boolean;
  missingSlot?: boolean;
  irreversible?: boolean;
  emergencyOrDiagnosis?: boolean;
};

export function classifyAgentAction(context: DoeAgentActionContext): DoeAgentActionClass {
  if (context.emergencyOrDiagnosis) return "refuse";
  if (context.missingSlot || context.textsThirdParty || context.irreversible) return "confirm_once";
  return "act_now";
}

export function classifyDataWrite(text: string): DoeDataWriteClass {
  const trimmed = text.trim();
  if (!trimmed) return "create";
  if (
    /\b(?:delete|remove|drop|undo|get rid of|take off|never mind that|cancel that entry)\b/i.test(
      trimmed,
    )
  ) {
    return "remove";
  }
  if (
    /\b(?:fix|change|update|correct|actually|wrong|meant|instead of|not .+ anymore|rename|reschedule|edit)\b/i.test(
      trimmed,
    )
  ) {
    return "update";
  }
  return "create";
}

export function inboundAlreadyAsked(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return /\b(?:can you|can u|could you|please|set a timer|remind me|text me|text \w+|message \w+|make sure|help my|schedule|in \d+ seconds?|for \d+ seconds?|log my|track my|screenshot|go(?:\s+)?to|goto|search up|look(?:ing)? up|google)\b/i.test(
    trimmed,
  );
}

export type DoePlanValidationContext = {
  inboundText: string;
  textsThirdParty?: boolean;
  missingSlot?: boolean;
  irreversible?: boolean;
  emergencyOrDiagnosis?: boolean;
};

export type DoePlanValidationResult =
  | { ok: true; action: DoeAgentActionClass }
  | { ok: false; action: DoeAgentActionClass; reason: string };

export function validateDoePlan(
  plan: DoePlan,
  context: DoePlanValidationContext,
): DoePlanValidationResult {
  let action = classifyAgentAction({
    inboundText: context.inboundText,
    textsThirdParty: context.textsThirdParty,
    missingSlot: context.missingSlot,
    irreversible: context.irreversible,
    emergencyOrDiagnosis: context.emergencyOrDiagnosis,
  });

  if (
    action === "confirm_once" &&
    inboundAlreadyAsked(context.inboundText) &&
    !context.missingSlot &&
    !context.irreversible &&
    !context.emergencyOrDiagnosis
  ) {
    action = "act_now";
  }

  if (plan.action === "refuse" || action === "refuse") {
    return action === "refuse"
      ? { ok: true, action: "refuse" }
      : { ok: false, action: "refuse", reason: "Plan marked refuse but policy allows action." };
  }

  if (action === "confirm_once" && plan.action === "act_now") {
    return {
      ok: false,
      action: "confirm_once",
      reason: "Plan commits without confirmation but policy requires confirm_once.",
    };
  }

  if (plan.workflow && "graph" in plan.workflow && plan.workflow.graph) {
    const graph = plan.workflow.graph as WorkflowGraph;
    const validation = validateWorkflowGraph(graph);
    if (!validation.ok) {
      return { ok: false, action: "confirm_once", reason: validation.error };
    }
  }

  for (const step of plan.immediate) {
    if (!step.tool?.trim()) {
      return { ok: false, action: "confirm_once", reason: "Immediate step missing tool name." };
    }
  }

  if (!plan.reply?.trim()) {
    return { ok: false, action: "confirm_once", reason: "Plan reply is required." };
  }

  return { ok: true, action: plan.action ?? action };
}

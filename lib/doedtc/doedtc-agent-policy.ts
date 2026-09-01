/** Deterministic action policy — act vs confirm vs refuse (not per-feature recipes). */

export type DoeAgentActionClass = "act_now" | "confirm_once" | "refuse";

export type DoeDataWriteClass = "create" | "update" | "remove";

export const DOE_AGENT_ACTION_POLICY = `Action policy:
- act_now: They already asked with enough detail — call commit tools immediately (schedule_text, start_habit_workflow, log_symptoms, browse, log_artifact_entry). Self-reminders and timers to their own phone. Reply that it is done.
- confirm_once: A slot is missing (who/when/body), the action texts someone else without a clear ask, or it is irreversible (family invite, public tracker share, revoke access, browser write, guide save after create). Use propose_* or ask one question, then commit on yes.
- refuse: Emergency, definitive diagnosis, password or credential in chat, denied browser host (banks, Okta, Google accounts), or asking you to store locker passwords — say no clearly.

Skip re-asking when inbound IS the request. propose_scheduled_text / propose_accountability / propose_habit_workflow only when confirm_once applies.`;

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
  return /\b(?:can you|could you|please|set a timer|remind me|text me|make sure|help my|schedule|in \d+ seconds?|for \d+ seconds?|log my|track my|screenshot|go to)\b/i.test(
    trimmed,
  );
}

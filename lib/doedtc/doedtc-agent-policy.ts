/** Deterministic action policy — act vs confirm vs refuse (not per-feature recipes). */

export type DoeAgentActionClass = "act_now" | "confirm_once" | "refuse";

export const DOE_AGENT_ACTION_POLICY = `Action policy:
- act_now: They already asked with enough detail — call commit tools immediately (schedule_text, start_accountability, start_habit_workflow, log_symptom, browse). Self-reminders and timers to their own phone. Reply that it is done.
- confirm_once: A slot is missing (who/when), the action texts someone else without a clear ask, or it is irreversible (family invite, public share, revoke access, browser write). Use propose_* or ask one question, then commit on yes.
- refuse: Emergency, definitive diagnosis, password in chat, or denied browser host — say no clearly.

Skip re-asking when inbound IS the request. propose_scheduled_text / propose_accountability / propose_habit_workflow only when confirm_once applies. Drafts are not on the file until the commit tool succeeds.`;

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

export function inboundAlreadyAsked(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return /\b(?:can you|could you|please|set a timer|remind me|text me|make sure|help my|schedule|in \d+ seconds?|for \d+ seconds?)\b/i.test(
    trimmed,
  );
}

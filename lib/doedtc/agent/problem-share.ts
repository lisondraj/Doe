/** Sharing a problem is not a request to read the chart or reminder file. */

import { looksLikeChartRead, looksLikeChartWrite } from "@/lib/doedtc/agent/deliverable-policy";
import { inboundAsksReminderStatus } from "@/lib/doedtc/doedtc-reminder-intent";
import { inboundLooksLikeProfileWrite } from "@/lib/doedtc/doedtc-household-policy";

const EXPLICIT_ACTION_RE =
  /\b(?:remind me|text me|ping me|can you|could you|please (?:set|log|add|book|schedule)|what(?:'s| is| are) (?:set|on)|any reminders?|do i have)\b/i;

const PROBLEM_SHARE_RE =
  /\b(?:i always forget|i keep forgetting|i never remember|i forget (?:things|everything|stuff)|i (?:can'?t|don'?t) remember|hard to remember|blank(?:s|ed)? out|zone(?:s|d)? out|i(?:'m| am) (?:so |really )?(?:tired|overwhelmed|stressed|worried|anxious|scared)|she (?:won'?t|will not|isn'?t) talk|he (?:won'?t|will not|isn'?t) talk|they (?:won'?t|will not) talk|going through it|been going thru)\b/i;

const CHART_NOUN_RE = /\b(?:appointments?|dentist|doctor|visit|checkup|check-up|chart|reminders?|file|meds?|medications?)\b/i;

const PROBLEM_FRAME_RE =
  /\b(?:forget|forgetting|forgot|remember|blank|zone out|hard time|slip(?:s|ped)?(?: my mind)?|lose track|can't keep track)\b/i;

export function inboundAskedForChartOrFileStatus(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (inboundAsksReminderStatus(trimmed) || looksLikeChartRead(trimmed)) return true;
  return (
    /\b(?:on (?:the|my) chart|in (?:the|my) (?:chart|household|family|file)|who(?:'s| is) on|anyone on|do i have .+ on)\b/i.test(
      trimmed,
    ) || /\b(?:what appointments?|any appointments?)\b/i.test(trimmed)
  );
}

export function inboundLooksLikeProblemShare(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (EXPLICIT_ACTION_RE.test(trimmed)) return false;
  if (inboundLooksLikeProfileWrite(trimmed)) return false;
  if (inboundAskedForChartOrFileStatus(trimmed)) return false;
  if (looksLikeChartWrite(trimmed)) return false;
  if (PROBLEM_SHARE_RE.test(trimmed)) return true;
  return CHART_NOUN_RE.test(trimmed) && PROBLEM_FRAME_RE.test(trimmed);
}

export function looksLikeChartOrFileDump(text: string): boolean {
  return /\b(?:there(?:'s| is) nothing set(?: right now)?|nothing (?:is )?set right now|no appointments? on (?:your|the|my) chart|no one else is on your household|nothing on (?:your|the|my) (?:chart|file))\b/i.test(
    text.trim(),
  );
}

/** Empty-file dump is only valid when they asked what is on the chart or file. */
export function shouldRetryChartOrFileDump(inboundText: string, replyText: string): boolean {
  if (!looksLikeChartOrFileDump(replyText)) return false;
  return !inboundAskedForChartOrFileStatus(inboundText);
}

export function formatProblemShareBlock(): string {
  return "They shared a problem, not a status question. Mentioning an appointment, a person, meds, or forgetting is not a request to check the chart or reminder file. Stay with what they said. Acknowledge it, then one useful next step. Never reply with 'there's nothing set.'";
}

export function buildProblemShareRetrySystemMessage(inboundText: string): string {
  return `They did not ask what is on the chart or reminder file. Do not say what is or isn't set. Address: "${inboundText.trim().slice(0, 280)}". Acknowledge it, then one useful next step. Wording is yours.`;
}

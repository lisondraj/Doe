/** Per-turn mode — gates tools, voice, and post-processors (not per-symptom recipes). */

import type { ActionIntent } from "@/lib/doedtc/agent/action-slots";

export type TurnMode = "crisis" | "distress" | "conversation" | "action";

export type TurnModeResult = {
  mode: TurnMode;
  intent: ActionIntent;
  emergencyOrDiagnosis: boolean;
  disableCommitTools: boolean;
  promptBlock: string;
};

export const CRISIS_REPLY =
  "I'm really sorry you're feeling this way. You're not alone. If you're in crisis, call or text 988, or call 911 if you're in immediate danger.";

const CRISIS_RE =
  /\b(?:don'?t wanna be here|don'?t want to be here|want to die|kill myself|suicide|end my life|hurt myself|self[- ]?harm|better off dead|no reason to live|not safe|going to hurt myself)\b/i;

const DISTRESS_RE =
  /\b(?:can'?t function|cannot function|can barely|overwhelmed|hopeless|worthless|everything is too much|falling apart|i give up|don'?t know how much longer|can'?t cope|can not cope)\b/i;

/** Commit tools hidden unless mode is action (photo parse stays on action intent). */
export const TURN_MODE_COMMIT_TOOLS = new Set([
  "schedule_text",
  "propose_scheduled_text",
  "cancel_scheduled_text",
  "start_habit_workflow",
  "propose_habit_workflow",
  "start_workflow",
  "propose_workflow",
  "start_accountability",
  "propose_accountability",
  "log_symptoms",
  "run_assessment",
  "log_result",
  "add_medication",
  "add_condition",
  "log_appointment",
  "parse_document",
  "read_attachment",
]);

export function inboundLooksLikeCrisis(text: string): boolean {
  return CRISIS_RE.test(text.trim());
}

export function inboundLooksLikeDistress(text: string): boolean {
  return DISTRESS_RE.test(text.trim());
}

export function isNonActionTurnMode(mode: TurnMode): boolean {
  return mode === "crisis" || mode === "distress" || mode === "conversation";
}

export function shouldSkipReminderGrounding(mode: TurnMode): boolean {
  return isNonActionTurnMode(mode);
}

export function shouldSkipReminderSafetyNet(mode: TurnMode): boolean {
  return isNonActionTurnMode(mode);
}

export function shouldSkipRefusalRetry(mode: TurnMode): boolean {
  return isNonActionTurnMode(mode);
}

export function shouldSkipHedgeRewrite(mode: TurnMode): boolean {
  return mode === "distress" || mode === "conversation" || mode === "crisis";
}

export function toolEnabledForTurnMode(toolName: string, mode: TurnMode, intent: ActionIntent): boolean {
  if (mode === "crisis") return false;
  if (mode === "action") return true;
  if (intent === "parse_document" && toolName === "parse_document") return true;
  if (intent === "parse_document" && toolName === "read_attachment") return true;
  if (TURN_MODE_COMMIT_TOOLS.has(toolName)) return false;
  return true;
}

function formatTurnModePromptBlock(mode: TurnMode): string {
  switch (mode) {
    case "crisis":
      return "Primary mode: crisis. No tools. Short empathy. Direct them to 988 or 911. Do not offer reminders, logging, or medical advice.";
    case "distress":
      return "Primary mode: distress. Stay with them. No schedule_text, log_symptoms, or parse_document unless they explicitly asked. One human question max.";
    case "conversation":
      return "Primary mode: conversation. Answer the question from chart context if helpful. Do not call schedule_text or dump the reminder file. No auto-logging.";
    case "action":
      return "Primary mode: action. Use commit tools for the primary intent.";
  }
}

export function classifyTurnMode(params: {
  inboundText: string;
  intent: ActionIntent;
}): TurnModeResult {
  const text = params.inboundText.trim();

  if (inboundLooksLikeCrisis(text)) {
    return {
      mode: "crisis",
      intent: params.intent,
      emergencyOrDiagnosis: true,
      disableCommitTools: true,
      promptBlock: formatTurnModePromptBlock("crisis"),
    };
  }

  if (params.intent !== "none") {
    return {
      mode: "action",
      intent: params.intent,
      emergencyOrDiagnosis: false,
      disableCommitTools: false,
      promptBlock: formatTurnModePromptBlock("action"),
    };
  }

  if (inboundLooksLikeDistress(text)) {
    return {
      mode: "distress",
      intent: params.intent,
      emergencyOrDiagnosis: false,
      disableCommitTools: true,
      promptBlock: formatTurnModePromptBlock("distress"),
    };
  }

  return {
    mode: "conversation",
    intent: params.intent,
    emergencyOrDiagnosis: false,
    disableCommitTools: true,
    promptBlock: formatTurnModePromptBlock("conversation"),
  };
}

export function buildTurnModeVoiceBlock(mode: TurnMode): string {
  switch (mode) {
    case "crisis":
      return `Mode (crisis):
- They may be in danger. Be direct and caring. No tools, no reminders, no logging.
- Give 988 and 911. Keep it short.`;
    case "distress":
      return `Mode (distress):
- They are overwhelmed. Stay present. Do not pivot to reminders or logging unless they asked.
- One short question is fine. No corporate sympathy.`;
    case "conversation":
      return `Mode (conversation):
- Answer what they asked. Use chart context if it helps explain fatigue, meds, sleep, etc.
- Do not offer to set a reminder or log symptoms unless they asked.`;
    case "action":
      return "";
  }
}

import {
  executeDoeDtcTool,
  type DoeDtcToolExecutionContext,
  type DoeDtcToolTurnState,
} from "@/lib/doedtc/agent/tool-dispatch";
import { schedulingToolSucceeded } from "@/lib/doedtc/agent/turn-integrity";
import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";
import { classifyAgentAction, inboundAlreadyAsked } from "@/lib/doedtc/doedtc-agent-policy";
import { setAgentPending } from "@/lib/doedtc/doedtc-pending";
import { extractReminderBody } from "@/lib/doedtc/doedtc-reminder-body";
import { normalizeScheduledTimezone } from "@/lib/doedtc/doedtc-scheduled";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

export {
  extractReminderBody,
  looksLikeConfirmationBody,
  sanitizeScheduledTextBody,
  stripRemindWrapper,
} from "@/lib/doedtc/doedtc-reminder-body";

const REMINDER_TRIGGER_RE =
  /\b(?:remind(?:er)?|text me|ping me|timer|schedule(?:\s+a)?|set a timer)\b/i;

const RELATIVE_TIME_RE = /\b(?:in|for)\s+(\d+)\s+(seconds?|minutes?|hours?)\b/i;
const CLOCK_TIME_RE = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
const NAMED_DAY_TIME_RE =
  /\b(today|tomorrow)(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?\b/i;

export type ReminderIntent = {
  matched: boolean;
  sendAtPhrase: string | null;
  body: string | null;
  missingSlot: "body" | "time" | null;
};

function normalizeRelativeTimePhrase(match: RegExpMatchArray): string {
  const prefix = match[0]!.toLowerCase().startsWith("for") ? "for" : "in";
  return `${prefix} ${match[1]} ${match[2]!.toLowerCase()}`;
}

function extractRelativeTimePhrase(text: string): string | null {
  const match = text.match(RELATIVE_TIME_RE);
  if (!match) return null;
  return normalizeRelativeTimePhrase(match);
}

function extractClockTimePhrase(text: string): string | null {
  const named = text.match(NAMED_DAY_TIME_RE);
  if (named) {
    const day = named[1]!.toLowerCase();
    if (named[2]) {
      const minute = named[3] ? `:${named[3]}` : "";
      const meridiem = named[4] ? named[4].toLowerCase() : "";
      return `${day} at ${named[2]}${minute}${meridiem ? ` ${meridiem}` : ""}`.replace(/\s+/g, " ").trim();
    }
    return day;
  }

  const clock = text.match(CLOCK_TIME_RE);
  if (clock) {
    const minute = clock[2] ? `:${clock[2]}` : "";
    const meridiem = clock[3] ? clock[3].toLowerCase() : "";
    return `at ${clock[1]}${minute}${meridiem}`.trim();
  }

  return null;
}

function extractSendAtPhrase(text: string): string | null {
  return extractRelativeTimePhrase(text) ?? extractClockTimePhrase(text);
}

export function inboundAsksReminderStatus(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (
    /\b(?:in my file|any reminders?|reminders? (?:set|in|active)|what(?:'s| is) (?:set|on (?:the|my) file)|do i have (?:a |any )?(?:reminder|scheduled)|are there any reminders?)\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }
  if (
    /\b(?:active reminders?|my reminders?|current reminders?|what(?:'s| is| are) .{0,24}reminders?)\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }
  return false;
}

const CANCEL_REMINDER_RE =
  /\b(?:don'?t|do not|stop|cancel|never)\s+(?:remind|text me|ping me)\b/i;

/** Whole-message clock/relative answers to "what time?" — including 5:30 without am/pm. */
export function looksLikeTimeAnswer(text: string): boolean {
  const trimmed = text.trim().replace(/[?.!]+$/g, "");
  if (!trimmed || trimmed.length > 48) return false;
  if (extractSendAtPhrase(trimmed)) return true;
  if (/^(?:noon|midnight|tonight|this (?:morning|afternoon|evening)|now)$/i.test(trimmed)) {
    return true;
  }
  return /^(?:at\s+)?\d{1,2}:\d{2}$/i.test(trimmed);
}

export function looksLikeReminderTimeAsk(text: string): boolean {
  return /\b(?:what time|when should i (?:remind|text|ping)|when do you want|what time should)\b/i.test(
    text,
  );
}

export function looksLikeReminderBodyAsk(text: string): boolean {
  return /\b(?:about what|what should (?:the reminder|i) (?:say|remind)|remind you (?:about|of) what)\b/i.test(
    text,
  );
}

export function shouldDeferChartWriteForReminder(params: {
  inboundText: string;
  tool?: string;
  lastOutboundBody?: string | null;
  priorInboundBodies?: string[];
}): boolean {
  if (params.tool === "log_appointment" && looksLikeTimeAnswer(params.inboundText)) {
    return false;
  }
  if (looksLikeTimeAnswer(params.inboundText)) return true;
  const resolved = resolveReminderInboundText(params);
  return parseReminderIntent(resolved).matched;
}

function lastReminderAsk(bodies: string[] | undefined): string | null {
  for (const body of [...(bodies ?? [])].reverse()) {
    const trimmed = body.trim();
    if (!trimmed || !REMINDER_TRIGGER_RE.test(trimmed)) continue;
    if (inboundAsksReminderStatus(trimmed) || CANCEL_REMINDER_RE.test(trimmed)) continue;
    return trimmed;
  }
  return null;
}

/** Bind a time-only (or body-only) follow-up to the in-flight remind-me ask. */
export function resolveReminderInboundText(params: {
  inboundText: string;
  priorInboundBodies?: string[];
  lastOutboundBody?: string | null;
}): string {
  const trimmed = params.inboundText.trim();
  const prior = lastReminderAsk(params.priorInboundBodies);
  const outbound = params.lastOutboundBody?.trim() ?? "";
  const askedTime = looksLikeReminderTimeAsk(outbound);
  const askedBody = looksLikeReminderBodyAsk(outbound);

  if (looksLikeTimeAnswer(trimmed) && (askedTime || prior)) {
    return prior ? `${prior} ${trimmed}`.replace(/\s+/g, " ").trim() : trimmed;
  }
  if (
    askedBody &&
    prior &&
    !looksLikeTimeAnswer(trimmed) &&
    !REMINDER_TRIGGER_RE.test(trimmed)
  ) {
    return `${prior} ${trimmed}`.replace(/\s+/g, " ").trim();
  }
  return trimmed;
}

export function parseReminderIntent(text: string): ReminderIntent {
  const trimmed = text.trim();
  if (!trimmed || !REMINDER_TRIGGER_RE.test(trimmed) || CANCEL_REMINDER_RE.test(trimmed)) {
    return { matched: false, sendAtPhrase: null, body: null, missingSlot: null };
  }
  if (inboundAsksReminderStatus(trimmed) && !extractSendAtPhrase(trimmed)) {
    return { matched: false, sendAtPhrase: null, body: null, missingSlot: null };
  }

  const sendAtPhrase = extractSendAtPhrase(trimmed);
  const body = extractReminderBody(trimmed);
  if (!sendAtPhrase && !body) {
    return { matched: false, sendAtPhrase: null, body: null, missingSlot: null };
  }
  if (!sendAtPhrase) {
    return { matched: true, sendAtPhrase: null, body, missingSlot: "time" };
  }
  return {
    matched: true,
    sendAtPhrase,
    body,
    missingSlot: body ? null : "body",
  };
}

export function buildReminderIntentDirective(intent: ReminderIntent): string | null {
  if (!intent.matched) return null;

  if (intent.missingSlot === "body") {
    return `Reminder request detected with time "${intent.sendAtPhrase}" but no message body.
- Ask exactly one short question: what should the reminder say?
- Do NOT call schedule_text or propose_scheduled_text yet.
- Do NOT call log_family_member or any chart write. This is a reminder for them.
- Do NOT send a profile link.`;
  }

  if (intent.missingSlot === "time") {
    return `Reminder request detected with body "${intent.body}" but no time.
- Ask exactly one short question: what time should I remind you?
- Do NOT call schedule_text or propose_scheduled_text yet.
- Do NOT call log_family_member or any chart write. "Remind me to …" is a task, not a household member.
- Do NOT send a profile link.`;
  }

  return `Reminder request detected — act now.
- Call schedule_text this turn with send_at: "${intent.sendAtPhrase}", body: "${intent.body}", intent: "reminder".
- Do NOT call propose_scheduled_text.
- Do NOT call log_family_member. This reminder is for them.
- Do NOT call send_profile_link.
- Reply with a short confirmation that it is done.`;
}

export function buildReminderClarifyingQuestion(intent: ReminderIntent): string {
  if (intent.sendAtPhrase?.includes("second")) {
    return "About what should I text you?";
  }
  return "About what should I remind you?";
}

export async function storeAwaitingBodyReminderPending(params: {
  user: DoeDtcUserRow;
  intent: ReminderIntent;
}): Promise<void> {
  if (!params.intent.sendAtPhrase) return;
  const timezone = normalizeScheduledTimezone(null);
  await setAgentPending({
    userId: params.user.id,
    kind: "schedule_text",
    commitTool: "schedule_text",
    args: {
      intent: "reminder",
      body: "",
      send_at: params.intent.sendAtPhrase,
      timezone,
      awaiting_body: true,
    },
    summary: `Reminder at ${params.intent.sendAtPhrase} — waiting for what to say.`,
  });
}

export function isAwaitingBodyPending(args: Record<string, unknown>): boolean {
  return args.awaiting_body === true;
}

export function isAwaitingTimePending(args: Record<string, unknown>): boolean {
  return args.awaiting_time === true;
}

export async function storeAwaitingTimeReminderPending(params: {
  user: DoeDtcUserRow;
  intent: ReminderIntent;
}): Promise<void> {
  if (!params.intent.body) return;
  const timezone = normalizeScheduledTimezone(null);
  await setAgentPending({
    userId: params.user.id,
    kind: "schedule_text",
    commitTool: "schedule_text",
    args: {
      intent: "reminder",
      body: params.intent.body,
      send_at: "",
      timezone,
      awaiting_time: true,
    },
    summary: `Reminder to ${params.intent.body} — waiting for a time.`,
  });
}

export function buildAwaitingBodyCommitArgs(
  pendingArgs: Record<string, unknown>,
  body: string,
): Record<string, unknown> {
  const { awaiting_body: _awaiting, ...rest } = pendingArgs;
  return {
    ...rest,
    body: body.trim(),
    intent: typeof rest.intent === "string" && rest.intent.trim() ? rest.intent : "reminder",
  };
}

export function buildAwaitingTimeCommitArgs(
  pendingArgs: Record<string, unknown>,
  inboundText: string,
): Record<string, unknown> {
  const { awaiting_time: _awaiting, ...rest } = pendingArgs;
  const sendAt =
    extractSendAtPhrase(inboundText) ||
    (looksLikeTimeAnswer(inboundText)
      ? `at ${inboundText.trim().replace(/[?.!]+$/g, "")}`
      : "");
  return {
    ...rest,
    send_at: sendAt,
    intent: typeof rest.intent === "string" && rest.intent.trim() ? rest.intent : "reminder",
  };
}

export async function applyReminderSafetyNet(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  ctx: DoeDtcToolExecutionContext;
  state: DoeDtcToolTurnState;
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[];
}): Promise<{ applied: boolean; replyHint?: string }> {
  const intent = parseReminderIntent(params.inboundText);
  if (!intent.matched || intent.missingSlot) {
    return { applied: false };
  }

  if (schedulingToolSucceeded(params.toolsExecuted)) {
    return { applied: false };
  }

  const action = classifyAgentAction({
    inboundText: params.inboundText,
    missingSlot: false,
    textsThirdParty: false,
  });
  if (action !== "act_now" || !inboundAlreadyAsked(params.inboundText)) {
    return { applied: false };
  }

  const output = await executeDoeDtcTool({
    name: "schedule_text",
    args: {
      intent: "reminder",
      body: intent.body,
      send_at: intent.sendAtPhrase,
    },
    ctx: params.ctx,
    state: params.state,
  });

  if (output.ok === false) {
    return { applied: false };
  }

  const phrase = intent.sendAtPhrase ?? "";
  const replyHint = phrase.includes("second")
    ? `Done. I'll text you in a few seconds.`
    : `Done. I'll text you ${phrase.replace(/^in\s+/i, "in ")}.`;

  return { applied: true, replyHint };
}

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
  missingSlot: "body" | null;
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

export function parseReminderIntent(text: string): ReminderIntent {
  const trimmed = text.trim();
  if (!trimmed || !REMINDER_TRIGGER_RE.test(trimmed)) {
    return { matched: false, sendAtPhrase: null, body: null, missingSlot: null };
  }

  const sendAtPhrase = extractSendAtPhrase(trimmed);
  if (!sendAtPhrase) {
    return { matched: false, sendAtPhrase: null, body: null, missingSlot: null };
  }

  const body = extractReminderBody(trimmed);
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
- Do NOT send a profile link.`;
  }

  return `Reminder request detected — act now.
- Call schedule_text this turn with send_at: "${intent.sendAtPhrase}", body: "${intent.body}", intent: "reminder".
- Do NOT call propose_scheduled_text.
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

export async function applyReminderSafetyNet(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  ctx: DoeDtcToolExecutionContext;
  state: DoeDtcToolTurnState;
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[];
}): Promise<{ applied: boolean; replyHint?: string }> {
  const intent = parseReminderIntent(params.inboundText);
  if (!intent.matched || intent.missingSlot === "body") {
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

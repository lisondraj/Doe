/** Unified inbound resolution — deliverable, reminder, and thread continuity for one routing text. */

import {
  isShortDeliverableFollowUp,
  looksLikeSendFollowUp,
  resolveDeliverableInboundText,
} from "@/lib/doedtc/agent/deliverable-policy";
import {
  resolveLiveTopic,
  resolveThreadInboundText,
} from "@/lib/doedtc/agent/thread-context";
import { resolveReminderInboundText } from "@/lib/doedtc/doedtc-reminder-intent";

export type AgentInboundContext = {
  inboundText: string;
  priorInboundBodies?: string[];
  lastOutboundBody?: string | null;
  threadReplyParentBody?: string | null;
};

const DELEGATION_RE =
  /\b(?:you decide|u decide|up to you|your call|whatever works|decide for me|pick (?:for me|something)|specific actions?\s+(?:u|you)\s+decide)\b/i;

const ABSTAIN_STEREOTYPE_RE =
  /\b(?:alcohol|drugs?|marijuana|cannabis|nicotine|smoking|porn|gambling)\b/i;

export function inboundDelegatesToAgent(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return DELEGATION_RE.test(trimmed);
}

export function userMentionedAbstainStereotype(text: string): boolean {
  return ABSTAIN_STEREOTYPE_RE.test(text.trim());
}

export function replyInventsAbstainStereotype(params: {
  replyText: string;
  priorInboundBodies: string[];
  inboundText: string;
  threadReplyParentBody?: string | null;
}): boolean {
  if (!ABSTAIN_STEREOTYPE_RE.test(params.replyText)) return false;
  const corpus = [
    params.inboundText,
    params.threadReplyParentBody ?? "",
    ...params.priorInboundBodies,
  ]
    .join("\n")
    .trim();
  return !userMentionedAbstainStereotype(corpus);
}

export function stripInventedAbstainStereotype(replyText: string): string {
  return replyText
    .replace(/\b(?:from|with|for)\s+alcohol\b/gi, "")
    .replace(/\balcohol\s+(?:abstinence|abstaining|use|consumption)\b/gi, "abstinence")
    .replace(/\b(?:drug|drugs)\s+(?:use|abstinence)\b/gi, "abstinence")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

function appendThreadContinuation(resolved: string, topic: string): string {
  if (!topic || resolved.includes("(continuing:")) return resolved;
  return `${resolved} (continuing: ${topic.slice(0, 200)})`;
}

function resolveAgentTopic(params: AgentInboundContext): string | null {
  const direct = resolveLiveTopic({
    inboundText: params.inboundText,
    priorInboundBodies: params.priorInboundBodies ?? [],
    threadReplyParentBody: params.threadReplyParentBody,
  });
  if (direct && !inboundDelegatesToAgent(direct)) return direct;

  const filtered = (params.priorInboundBodies ?? []).filter(
    (body) => body.trim() && !inboundDelegatesToAgent(body),
  );
  if (filtered.length === 0) return direct;

  return resolveLiveTopic({
    inboundText: params.inboundText,
    priorInboundBodies: filtered,
    threadReplyParentBody: params.threadReplyParentBody,
  });
}

/** One inbound string for tools, finalize, and brief routing. */
export function resolveAgentInboundText(params: AgentInboundContext): string {
  const trimmed = params.inboundText.trim();
  const priorInboundBodies = params.priorInboundBodies ?? [];

  const deliverable = resolveDeliverableInboundText({
    inboundText: trimmed,
    priorInboundBodies,
    lastOutboundBody: params.lastOutboundBody,
  });
  const reminder = resolveReminderInboundText({
    inboundText: trimmed,
    priorInboundBodies,
    lastOutboundBody: params.lastOutboundBody,
  });
  const deliverableOrReminder = deliverable !== trimmed ? deliverable : reminder;

  const topic = resolveAgentTopic({
    inboundText: trimmed,
    priorInboundBodies,
    threadReplyParentBody: params.threadReplyParentBody,
  });

  if (deliverableOrReminder !== trimmed) {
    if (
      topic &&
      (looksLikeSendFollowUp(trimmed) ||
        isShortDeliverableFollowUp(trimmed) ||
        inboundDelegatesToAgent(trimmed))
    ) {
      return appendThreadContinuation(deliverableOrReminder, topic);
    }
    return deliverableOrReminder;
  }

  const threadBound = resolveThreadInboundText({
    inboundText: trimmed,
    priorInboundBodies,
    threadReplyParentBody: params.threadReplyParentBody,
  });

  if (inboundDelegatesToAgent(trimmed) && topic && threadBound === trimmed) {
    return appendThreadContinuation(trimmed, topic);
  }

  return threadBound;
}

export function inferTrackerTitleFromContext(params: AgentInboundContext & {
  lastOutboundBody?: string | null;
}): string | null {
  const topic = resolveAgentTopic(params);
  const corpus = [
    params.inboundText,
    params.lastOutboundBody ?? "",
    topic ?? "",
    ...(params.priorInboundBodies ?? []),
  ]
    .join("\n")
    .trim();

  if (!corpus) return null;

  const abstainMatch = corpus.match(/\b(?:help me )?abstain(?:ing)?(?: from ([^.!?\n]{2,48}))?\b/i);
  if (abstainMatch) {
    const object = abstainMatch[1]?.trim();
    if (object && !isVagueTrackerTitle(object) && userMentionedAbstainStereotype(object)) {
      return `${object.replace(/\b(?:use|consumption)\b/i, "").trim()} tracker`.replace(/\s+/g, " ");
    }
    return "Abstinence tracker";
  }

  const trackMatch = corpus.match(
    /\b(?:track(?:ing)?|tracker for)\s+(?:my\s+)?([a-z][a-z0-9\s-]{1,40})/i,
  );
  if (trackMatch?.[1] && !isVagueTrackerTitle(trackMatch[1])) {
    const title = trackMatch[1].trim();
    if (!/\btracker\b/i.test(title)) return `${title} tracker`;
    return title.replace(/\btracker\b/i, "tracker").trim();
  }

  if (/\btracker\b/i.test(corpus) && topic && topic.length >= 8) {
    const short = topic.slice(0, 48).trim();
    if (!isVagueTrackerTitle(short)) {
      return /\btracker\b/i.test(short) ? short : `${short} tracker`;
    }
  }

  return null;
}

function isVagueTrackerTitle(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized.length < 3) return true;
  return /^(?:it|this|that|something|stuff|help|abstain(?:ing)?|tracker|track(?:ing)?)$/i.test(
    normalized,
  );
}

export function shouldSuppressChartWriteProbe(params: {
  inboundText: string;
  probe: string;
  priorInboundBodies?: string[];
  lastOutboundBody?: string | null;
  threadReplyParentBody?: string | null;
  pendingCommitTool?: string | null;
  rawInboundText?: string | null;
}): boolean {
  if (!params.probe) return false;
  if (params.probe !== "What do you want to track?") return false;

  if (/\(continuing:/i.test(params.inboundText)) return true;

  const trimmed = params.inboundText.trim();
  const rawTrimmed = params.rawInboundText?.trim() || trimmed;
  const isFollowUp =
    looksLikeSendFollowUp(trimmed) ||
    looksLikeSendFollowUp(rawTrimmed) ||
    isShortDeliverableFollowUp(trimmed) ||
    isShortDeliverableFollowUp(rawTrimmed) ||
    /^send me the .+ link$/i.test(trimmed);
  if (!isFollowUp && !inboundDelegatesToAgent(rawTrimmed)) return false;

  const topic = resolveAgentTopic({
    inboundText: rawTrimmed,
    priorInboundBodies: params.priorInboundBodies ?? [],
    threadReplyParentBody: params.threadReplyParentBody,
  });
  if (topic) return true;

  if (params.pendingCommitTool === "create_profile_artifact") return true;

  const outbound = params.lastOutboundBody?.trim() ?? "";
  if (/\btracker\b/i.test(outbound)) return true;

  return Boolean(
    inferTrackerTitleFromContext({
      inboundText: rawTrimmed,
      priorInboundBodies: params.priorInboundBodies,
      lastOutboundBody: params.lastOutboundBody,
      threadReplyParentBody: params.threadReplyParentBody,
    }),
  );
}

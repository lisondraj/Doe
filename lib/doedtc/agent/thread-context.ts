/** Ongoing iMessage thread — later bubbles still see what was said earlier. */

import { looksLikeTimeAnswer } from "@/lib/doedtc/doedtc-reminder-intent";

export const THREAD_TRANSCRIPT_FETCH = 80;
export const THREAD_TRANSCRIPT_KEEP = 40;
export const THREAD_TRANSCRIPT_MAX_CHARS = 12_000;

const FRESH_ASK_RE =
  /\b(?:remind me|text me|screenshot|google|search|log |add |book |schedule |what(?:'s| is| are) (?:on|set|my)|any reminders?|where(?:'s| is)|send (?:me |the )?(?:link|profile|tracker))\b/i;

const FOLLOW_UP_START_RE =
  /^(?:yeah|yep|yes|yup|ok|okay|k|and|also|same|what about(?: that| this)?|about that|and then)\b/i;

const BARE_REPLY_RE = /^(?:yes|yep|yeah|yup|ok|okay|k|no|nope)\.?$/i;

/** Vague continuations that need the live thread topic bound (abstain, strategies, plan). */
const OBJECT_LESS_FOLLOW_UP_RE =
  /\b(?:abstain(?:ing)?|strategies?|tips?|help me with that|help with that|give me (?:a )?(?:plan|strategies?|tips?)|plan(?:\s+out)?(?:\s+the)?(?:\s+next|\s+\d+)|next (?:\d+\s+)?(?:weeks?|days?|months?))\b/i;

export function inboundNeedsLiveTopicBinding(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (FRESH_ASK_RE.test(trimmed)) return false;
  if (looksLikeTimeAnswer(trimmed)) return false;
  if (BARE_REPLY_RE.test(trimmed)) return true;
  if (trimmed.length <= 12) return true;
  if (FOLLOW_UP_START_RE.test(trimmed) && trimmed.split(/\s+/).filter(Boolean).length <= 8) {
    return true;
  }
  if (OBJECT_LESS_FOLLOW_UP_RE.test(trimmed)) return true;
  return false;
}

export function inboundLooksLikeThreadFollowUp(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (looksLikeTimeAnswer(trimmed)) return true;
  return inboundNeedsLiveTopicBinding(trimmed);
}

export function lastSubstantialInbound(bodies: string[], current: string): string | null {
  const currentTrimmed = current.trim();
  for (let i = bodies.length - 1; i >= 0; i -= 1) {
    const body = bodies[i]?.trim() ?? "";
    if (!body || body === currentTrimmed) continue;
    if (BARE_REPLY_RE.test(body)) continue;
    if (looksLikeTimeAnswer(body)) continue;
    if (body.length < 12 && !OBJECT_LESS_FOLLOW_UP_RE.test(body)) continue;
    if (body.length < 12) continue;
    return body;
  }
  return null;
}

export function resolveLiveTopic(params: {
  inboundText: string;
  priorInboundBodies: string[];
  threadReplyParentBody?: string | null;
}): string | null {
  const parent = params.threadReplyParentBody?.trim();
  if (parent && parent.length >= 12) return parent;
  return lastSubstantialInbound(params.priorInboundBodies, params.inboundText.trim());
}

export function resolveThreadInboundText(params: {
  inboundText: string;
  priorInboundBodies: string[];
  threadReplyParentBody?: string | null;
}): string {
  const trimmed = params.inboundText.trim();
  if (!inboundNeedsLiveTopicBinding(trimmed)) return trimmed;
  if (BARE_REPLY_RE.test(trimmed)) return trimmed;
  if (looksLikeTimeAnswer(trimmed)) return trimmed;
  const topic = resolveLiveTopic(params);
  if (!topic) return trimmed;
  if (OBJECT_LESS_FOLLOW_UP_RE.test(trimmed)) {
    return `${trimmed} (continuing: ${topic.slice(0, 200)})`;
  }
  return topic;
}

export function buildMemorySearchQuery(params: {
  inboundText: string;
  priorInboundBodies: string[];
  threadReplyParentBody?: string | null;
}): string {
  const current = params.inboundText.trim();
  const topic = inboundNeedsLiveTopicBinding(current)
    ? resolveLiveTopic(params)
    : null;
  const prior = params.priorInboundBodies
    .map((body) => body.trim())
    .filter((body) => body && body !== current)
    .slice(-4);
  const joined = [...prior, topic, current].filter(Boolean).join("\n").trim();
  return (joined || current).slice(0, 600);
}

export function formatThreadContinuityBlock(params: {
  inboundText: string;
  priorInboundBodies: string[];
  threadReplyParentBody?: string | null;
}): string | undefined {
  if (!inboundNeedsLiveTopicBinding(params.inboundText)) return undefined;
  const topic = resolveLiveTopic(params);
  if (!topic) return undefined;
  return `This inbound continues the thread. They were talking about: "${topic.slice(0, 280)}". Stay with that topic. Refer back to it when it helps. If they say "abstain", "strategies", or "plan" without naming what, bind it to this topic. Never default to alcohol, drugs, or any stereotype. Do not restart as a new topic.`;
}

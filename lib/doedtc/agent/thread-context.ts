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

export function inboundLooksLikeThreadFollowUp(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (FRESH_ASK_RE.test(trimmed)) return false;
  if (looksLikeTimeAnswer(trimmed)) return true;
  if (trimmed.length <= 12) return true;
  if (FOLLOW_UP_START_RE.test(trimmed) && trimmed.split(/\s+/).filter(Boolean).length <= 8) {
    return true;
  }
  return false;
}

export function lastSubstantialInbound(bodies: string[], current: string): string | null {
  const currentTrimmed = current.trim();
  for (let i = bodies.length - 1; i >= 0; i -= 1) {
    const body = bodies[i]?.trim() ?? "";
    if (!body || body === currentTrimmed) continue;
    if (inboundLooksLikeThreadFollowUp(body)) continue;
    if (body.length < 12) continue;
    return body;
  }
  return null;
}

export function resolveThreadInboundText(params: {
  inboundText: string;
  priorInboundBodies: string[];
}): string {
  const trimmed = params.inboundText.trim();
  if (!inboundLooksLikeThreadFollowUp(trimmed)) return trimmed;
  if (BARE_REPLY_RE.test(trimmed)) return trimmed;
  if (looksLikeTimeAnswer(trimmed)) return trimmed;
  return lastSubstantialInbound(params.priorInboundBodies, trimmed) ?? trimmed;
}

export function buildMemorySearchQuery(params: {
  inboundText: string;
  priorInboundBodies: string[];
}): string {
  const current = params.inboundText.trim();
  const prior = params.priorInboundBodies
    .map((body) => body.trim())
    .filter((body) => body && body !== current)
    .slice(-4);
  const joined = [...prior, current].filter(Boolean).join("\n").trim();
  return (joined || current).slice(0, 600);
}

export function formatThreadContinuityBlock(params: {
  inboundText: string;
  priorInboundBodies: string[];
}): string | undefined {
  if (!inboundLooksLikeThreadFollowUp(params.inboundText)) return undefined;
  const prior = lastSubstantialInbound(params.priorInboundBodies, params.inboundText);
  if (!prior) return undefined;
  return `This inbound continues the thread. They were talking about: "${prior.slice(0, 280)}". Stay with that. Refer back to it when it helps. Do not restart as a new topic.`;
}

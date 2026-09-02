/** Parallel in-flight work the agent can name when asked — not a new conversation type. */

import { listInFlightDoeDtcAgentTurns } from "@/lib/doedtc/doedtc-agent-audit";
import { listOpenDoeDtcBrowserJobs } from "@/lib/doedtc/doedtc-browser-db";
import { redactDoeDtcLogText } from "@/lib/doedtc/doedtc-privacy";

export type ActiveWorkItem = {
  kind: "turn" | "browser";
  summary: string;
};

export const DEFERRED_WORK_ACK = "Working on that. I'll text you when I have it.";
export const WORKING_TEXT_ACK_DELAY_MS = 4_000;

export function askedAboutActiveWork(text: string): boolean {
  return /\b(?:what(?:'s| is| are) you (?:working on|doing)|(?:are you )?still (?:working|on that|on it)|any updates?|status on that|how(?:'?s| is) that going)\b/i.test(
    text.trim(),
  );
}

export function looksLikeDeferredWorkClaim(text: string): boolean {
  return /\b(?:i(?:'m| am) working on (?:it|that|this)|i(?:'ll| will) (?:send|text|get (?:back|it to you)|look).{0,48}(?:in a (?:min|minute|moment|sec|second)|shortly|soon|later)|give me a (?:min|minute|sec|second)|one (?:min|minute|sec)|i(?:'ll| will) send (?:it|that) in a min)/i.test(
    text.trim(),
  );
}

export function looksLikeWorkingAck(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (looksLikeDeferredWorkClaim(trimmed)) return true;
  return /\b(?:on it|working on (?:it|that|this)|i(?:'ll| will) text you when)\b/i.test(trimmed);
}

export function ensureDeferredWorkAck(replyText: string, deferred: boolean): string {
  if (!deferred) return replyText;
  const trimmed = replyText.trim();
  if (looksLikeWorkingAck(trimmed)) return trimmed;
  return DEFERRED_WORK_ACK;
}

export function isRedundantWorkingAck(alreadySent: string, nextReply: string): boolean {
  return looksLikeWorkingAck(alreadySent) && looksLikeWorkingAck(nextReply);
}

function clipInbound(text: string): string {
  const cleaned = redactDoeDtcLogText(text).replace(/\s+/g, " ").trim();
  if (cleaned.length <= 80) return cleaned;
  return `${cleaned.slice(0, 77)}...`;
}

export function formatActiveWorkBlock(items: ActiveWorkItem[]): string {
  if (items.length === 0) {
    return "Active work: none besides this turn. If they ask what you're doing, say you're on this message.";
  }
  return [
    "Active work (other parallel tasks — describe these in plain language when they ask what you're doing):",
    ...items.map((item) => `- ${item.summary}`),
  ].join("\n");
}

export async function loadActiveWork(params: {
  userId: string;
  currentTurnId?: string;
}): Promise<ActiveWorkItem[]> {
  const [turns, jobs] = await Promise.all([
    listInFlightDoeDtcAgentTurns({
      userId: params.userId,
      excludeTurnId: params.currentTurnId,
      limit: 8,
    }).catch(() => []),
    listOpenDoeDtcBrowserJobs(params.userId).catch(() => []),
  ]);

  const items: ActiveWorkItem[] = [];
  const seenJobIds = new Set<string>();

  for (const job of jobs) {
    seenJobIds.add(job.id);
    const intent = job.intent?.trim() || "a web task";
    items.push({
      kind: "browser",
      summary: `Browser (${job.status}): ${intent.slice(0, 120)}`,
    });
  }

  for (const turn of turns) {
    if (turn.id === params.currentTurnId) continue;
    if (turn.browser_job_id && seenJobIds.has(turn.browser_job_id)) continue;
    const ask = clipInbound(turn.inbound_text);
    if (!ask) continue;
    items.push({
      kind: "turn",
      summary: `Also handling (${turn.status}): ${ask}`,
    });
  }

  return items.slice(0, 8);
}

/** iMessage tapbacks: lifecycle 👍/✅ only on complex work; occasional matching emoji otherwise. */

export const LIFECYCLE_WORKING_EMOJI = "👍";
export const LIFECYCLE_DONE_EMOJI = "✅";
export const LIFECYCLE_FAILED_EMOJI = "👎";

const SKIP_REACTION_RE =
  /^(?:yes|yep|yeah|ya|ok|okay|sure|no|nope|nah|confirm|stop|thanks|thank you|thx|got it|done|k)\.?$/i;

const COMPLEX_TASK_RE =
  /\b(?:screenshot|take a screenshot|browse|google\.com|look(?:\s+|ing\s+)up|search (?:for|the)|go to (?:https?:\/\/|www\.)|patient portal|sign in|log in|record (?:my )?(?:visit|appointment)|start listen|live view|watch (?:you|the browser)|create (?:a )?guide|how (?:do i|to) inject|prep me for|vault|open (?:this |the )?page)\b/i;

export function inboundSkipsReaction(text: string): boolean {
  return SKIP_REACTION_RE.test(text.trim());
}

export function inboundLooksComplex(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || inboundSkipsReaction(trimmed)) return false;
  return COMPLEX_TASK_RE.test(trimmed);
}

export function inferMatchingReaction(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed || inboundSkipsReaction(trimmed)) return null;
  if (/\b(?:lmao|lol|haha|heh|😂|🤣)\b/i.test(trimmed) || /😂|🤣/.test(trimmed)) return "😂";
  if (/(?:❤️|💕|💖)/.test(trimmed) || /\blove (?:this|it|you)\b/i.test(trimmed)) return "❤️";
  if (/\b(?:thank(?:s| you)|thx|ty|🙏)\b/i.test(trimmed) || /🙏/.test(trimmed)) return "🙏";
  if (/\b(?:yay|woo+|let'?s go|lets go|🔥)\b/i.test(trimmed) || /🔥/.test(trimmed)) return "🔥";
  if (/\b(?:ugh|sad|unfortunately|sucks)\b/i.test(trimmed) || /😞|😔|😢/.test(trimmed)) return "💙";
  if (/\b(?:wow|nice|sick|dope|whoa)\b/i.test(trimmed)) return "👀";
  if (/\b(?:good luck|fingers crossed|hope)\b/i.test(trimmed)) return "🤞";
  return null;
}

export function stableTextHash(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** About 1 in 3 semantically matching messages get a tapback. Hash keeps it stable. */
export function pickMatchingReaction(
  text: string,
  options?: { hash?: number; every?: number },
): string | null {
  const emoji = inferMatchingReaction(text);
  if (!emoji) return null;
  const every = options?.every ?? 3;
  const hash = options?.hash ?? stableTextHash(text.trim().toLowerCase());
  if (hash % every !== 0) return null;
  return emoji;
}

export function isLifecycleReactionEmoji(emoji: string | null | undefined): boolean {
  return (
    emoji === LIFECYCLE_WORKING_EMOJI ||
    emoji === LIFECYCLE_DONE_EMOJI ||
    emoji === LIFECYCLE_FAILED_EMOJI
  );
}

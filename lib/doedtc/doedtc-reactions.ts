/** iMessage tapbacks: lifecycle 👍/✅ on complex work; occasional content-matched emoji otherwise. */

import { inboundHasAttachments } from "@/lib/doedtc/agent/attachments";
import { inboundLooksLikeCrisis, inboundLooksLikeDistress } from "@/lib/doedtc/agent/turn-mode";

export const LIFECYCLE_WORKING_EMOJI = "👍";
export const LIFECYCLE_DONE_EMOJI = "✅";
export const LIFECYCLE_FAILED_EMOJI = "👎";

const SKIP_REACTION_RE =
  /^(?:yes|yep|yeah|ya|ok|okay|sure|no|nope|nah|confirm|stop|got it|done|k|\?+)\.?$/i;

const COMPLEX_TASK_RE =
  /\b(?:screenshot|take a screenshot|browse|google\.com|look(?:\s+|ing\s+)up|search (?:for|the)|go to (?:https?:\/\/|www\.)|patient portal|sign in|log in|record (?:my )?(?:visit|appointment)|start listen|live view|watch (?:you|the browser)|create (?:a )?guide|how (?:do i|to) inject|prep me for|vault|open (?:this |the )?page)\b/i;

export function inboundSkipsReaction(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (inboundLooksLikeCrisis(trimmed) || inboundLooksLikeDistress(trimmed)) return true;
  return SKIP_REACTION_RE.test(trimmed);
}

export function inboundLooksComplex(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || inboundSkipsReaction(trimmed)) return false;
  if (inboundHasAttachments(trimmed)) return true;
  return COMPLEX_TASK_RE.test(trimmed);
}

function pickFrom(options: readonly string[], hash: number): string {
  return options[Math.abs(hash) % options.length]!;
}

/** Strong match — clearly related to what they said. */
export function inferMatchingReaction(text: string, hash = 0): string | null {
  const trimmed = text.trim();
  if (!trimmed || inboundSkipsReaction(trimmed)) return null;

  if (/\b(?:lmao|lol|haha|heh|rofl)\b/i.test(trimmed) || /😂|🤣/.test(trimmed)) {
    return pickFrom(["😂", "😆"], hash);
  }
  if (/(?:❤️|💕|💖)/.test(trimmed) || /\blove (?:this|it|you|that)\b/i.test(trimmed)) {
    return pickFrom(["❤️", "🙏"], hash);
  }
  if (/\b(?:thank(?:s| you)|thx|ty)\b/i.test(trimmed) || /🙏/.test(trimmed)) {
    return pickFrom(["🙏", "❤️"], hash);
  }
  if (/\b(?:yay|woo+|let'?s go|lets go|proud|nailed it|crushed it)\b/i.test(trimmed) || /🔥/.test(trimmed)) {
    return pickFrom(["🔥", "🙌"], hash);
  }
  if (
    /\b(?:ugh|sad|unfortunately|sucks|hurts?|painful|exhausted|miserable|rough day|hard day)\b/i.test(
      trimmed,
    ) ||
    /😞|😔|😢/.test(trimmed)
  ) {
    return pickFrom(["💙", "🫂"], hash);
  }
  if (/\b(?:wow|nice|sick|dope|whoa|holy)\b/i.test(trimmed)) {
    return pickFrom(["👀", "‼️"], hash);
  }
  if (/\b(?:good luck|fingers crossed|hope (?:so|this|it))\b/i.test(trimmed)) {
    return "🤞";
  }
  return null;
}

/** Milder match for ordinary health asks — still skipped most of the time. */
export function inferAmbientReaction(text: string, hash = 0): string | null {
  const trimmed = text.trim();
  if (!trimmed || inboundSkipsReaction(trimmed)) return null;
  if (inferMatchingReaction(trimmed, hash)) return null;

  if (/\b(?:tired|headache|migraine|nauseous|sick|sore|dizzy|can't sleep|cant sleep)\b/i.test(trimmed)) {
    return pickFrom(["💙", "🫂"], hash);
  }
  if (
    /\b(?:log|logged|track(?:ing)?|took my|taking my|i take|add .+ to (?:my )?(?:chart|profile))\b/i.test(
      trimmed,
    )
  ) {
    return pickFrom(["💪", "🙌"], hash);
  }
  if (
    /\b(?:remind|timer|text me|ping me|tomorrow|tonight|in \d+\s+(?:seconds?|minutes?|hours?))\b/i.test(
      trimmed,
    )
  ) {
    return pickFrom(["👌", "⏰"], hash);
  }
  if (/\?/.test(trimmed) && trimmed.length >= 12) {
    return "❓";
  }
  if (trimmed.length >= 24) {
    return pickFrom(["👀", "👌"], hash);
  }
  return null;
}

export function stableTextHash(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Strong matches ~1 in 2. Ambient (remind / log / longer asks) ~1 in 4.
 * Hash keeps the same inbound stable.
 */
export function pickMatchingReaction(
  text: string,
  options?: { hash?: number; every?: number; ambientEvery?: number },
): string | null {
  const trimmed = text.trim();
  const hash = options?.hash ?? stableTextHash(trimmed.toLowerCase());
  const strong = inferMatchingReaction(trimmed, hash);
  if (strong) {
    const every = options?.every ?? 2;
    if (hash % every !== 0) return null;
    return strong;
  }
  const ambient = inferAmbientReaction(trimmed, hash);
  if (!ambient) return null;
  const ambientEvery = options?.ambientEvery ?? 4;
  if (hash % ambientEvery !== 0) return null;
  return ambient;
}

export function isLifecycleReactionEmoji(emoji: string | null | undefined): boolean {
  return (
    emoji === LIFECYCLE_WORKING_EMOJI ||
    emoji === LIFECYCLE_DONE_EMOJI ||
    emoji === LIFECYCLE_FAILED_EMOJI
  );
}

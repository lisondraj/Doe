/** Minimum typing/think time so fast model turns do not land instantly. */
export const MIN_OUTBOUND_THINK_MS = 1_800;
export const MAX_OUTBOUND_THINK_MS = 5_200;
export const MIN_BUBBLE_GAP_MS = 700;
export const MAX_BUBBLE_GAP_MS = 1_600;
export const TYPING_PULSE_MS = 2_400;

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Remaining pause before the first outbound of a turn.
 * Scales slightly with reply length; subtracts time already spent thinking.
 */
export function remainingOutboundThinkMs(params: {
  startedAtMs: number;
  replyText: string;
  nowMs?: number;
}): number {
  const now = params.nowMs ?? Date.now();
  const elapsed = Math.max(0, now - params.startedAtMs);
  const chars = params.replyText.trim().length;
  const stretch = Math.min(2_800, Math.round(chars * 18));
  const target = Math.min(MAX_OUTBOUND_THINK_MS, MIN_OUTBOUND_THINK_MS + stretch);
  return Math.max(0, target - elapsed);
}

export async function waitForOutboundThinkTime(params: {
  startedAtMs: number;
  replyText: string;
}): Promise<void> {
  const remaining = remainingOutboundThinkMs(params);
  if (remaining > 0) await sleepMs(remaining);
}

export function bubbleGapMs(nextBubble: string): number {
  const chars = nextBubble.trim().length;
  const stretch = Math.min(900, Math.round(chars * 12));
  return Math.min(MAX_BUBBLE_GAP_MS, MIN_BUBBLE_GAP_MS + stretch);
}

export async function waitForBubbleGap(nextBubble: string): Promise<void> {
  await sleepMs(bubbleGapMs(nextBubble));
}

function splitSentences(text: string): string[] {
  const parts = text
    .split(/(?<=[.?!])\s+(?=[A-Z0-9“"'])/)
    .map((row) => row.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text.trim()];
}

/**
 * Two iMessage bubbles when there are two beats. Never more than two text bubbles.
 * Short, single-thought, or working-ack replies stay as one.
 */
export function splitOutboundBubbles(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length < 90) return [trimmed];
  if (/\b(?:i(?:'ll| will) text you when|working on (?:it|that|this))\b/i.test(trimmed)) {
    return [trimmed];
  }

  const paragraphs = trimmed
    .split(/\n\n+/)
    .map((row) => row.trim())
    .filter(Boolean);
  if (paragraphs.length >= 2) {
    return [paragraphs[0]!, paragraphs.slice(1).join("\n\n")].filter(Boolean).slice(0, 2);
  }

  const sentences = splitSentences(trimmed.replace(/\n+/g, " "));
  if (sentences.length < 2) return [trimmed];

  const first = sentences[0]!;
  const rest = sentences.slice(1).join(" ");
  if (first.length < 24 || rest.length < 20) return [trimmed];

  const restIsQuestion = /\?$/.test(rest);
  const twoBeats = sentences.length >= 2 && (restIsQuestion || sentences.length >= 3 || first.length >= 40);
  if (!twoBeats) return [trimmed];
  return [first, rest];
}

export function startTypingPulse(params: {
  chatId?: string | null;
  pulse: (chatId: string) => Promise<void>;
  intervalMs?: number;
}): () => void {
  const chatId = params.chatId?.trim();
  if (!chatId) return () => undefined;

  let stopped = false;
  const intervalMs = params.intervalMs ?? TYPING_PULSE_MS;

  const tick = async () => {
    if (stopped) return;
    try {
      await params.pulse(chatId);
    } catch {
      // Typing is best-effort.
    }
  };

  void tick();
  const timer = setInterval(() => {
    void tick();
  }, intervalMs);

  return () => {
    stopped = true;
    clearInterval(timer);
  };
}

/** Minimum typing/think time so fast model turns do not land instantly. */
export const MIN_OUTBOUND_THINK_MS = 900;
export const MAX_OUTBOUND_THINK_MS = 2_500;

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
  const stretch = Math.min(1_400, Math.round(chars * 10));
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

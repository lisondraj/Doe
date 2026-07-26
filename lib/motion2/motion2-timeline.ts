export const MOTION2_DURATION = 20;

export const MOTION2_SCENES = {
  logo: { start: 0, end: 4 },
  summary: { start: 4, end: 8.5 },
  call: { start: 8.5, end: 13 },
  agents: { start: 13, end: 17 },
  outro: { start: 17, end: MOTION2_DURATION },
} as const;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Opacity for a scene window with optional fade in/out (seconds). */
export function sceneAlpha(
  t: number,
  start: number,
  end: number,
  fadeIn = 0.32,
  fadeOut = 0.28,
) {
  if (t < start || t >= end) return 0;
  if (fadeIn > 0 && t < start + fadeIn) return (t - start) / fadeIn;
  if (fadeOut > 0 && t > end - fadeOut) return (end - t) / fadeOut;
  return 1;
}

/** Local 0–1 progress inside a scene. */
export function sceneProgress(t: number, start: number, end: number) {
  return clamp((t - start) / (end - start), 0, 1);
}

/** Slide-up reveal based on local scene time. */
export function sceneEnterY(t: number, start: number, delay = 0.08, distance = 28) {
  const local = clamp((t - start - delay) / 0.42, 0, 1);
  return (1 - easeOut(local)) * distance;
}

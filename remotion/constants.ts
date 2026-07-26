export const DOE_LAUNCH_FPS = 30;
export const DOE_LAUNCH_DURATION_SEC = 20;
export const DOE_LAUNCH_DURATION_FRAMES = DOE_LAUNCH_FPS * DOE_LAUNCH_DURATION_SEC;
export const DOE_LAUNCH_WIDTH = 1920;
export const DOE_LAUNCH_HEIGHT = 1080;

/** Crossfade length between adjacent scenes (~0.47s). */
export const DOE_LAUNCH_TRANSITION_FRAMES = 14;

/**
 * Overlapping scene windows — total stays 600 frames (20s).
 * Each boundary shares TRANSITION frames with the previous scene.
 */
export const DOE_LAUNCH_SCENES = {
  logo: { from: 0, duration: 120 },
  summary: { from: 106, duration: 130 },
  call: { from: 222, duration: 130 },
  agents: { from: 338, duration: 130 },
  outro: { from: 454, duration: 146 },
} as const;

export const DOE_LAUNCH_GOLD_GRADIENT =
  "linear-gradient(180deg, #e8c08e 0%, #d4a574 52%, rgba(212, 165, 116, 0.72) 100%)";

export const DOE_LAUNCH_BROWN_BG =
  "radial-gradient(ellipse 72% 58% at 50% 0%, rgba(245, 230, 208, 0.1), transparent 68%), radial-gradient(ellipse 42% 42% at 88% 82%, rgba(168, 118, 84, 0.12), transparent 62%), linear-gradient(168deg, #241c14 0%, #1a1208 100%)";

export const DOE_LAUNCH_CREAM_BG =
  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 255, 255, 0.55), transparent 70%), linear-gradient(180deg, #f7f6f3 0%, #faf0d8 100%)";

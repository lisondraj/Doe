export const DOEHEALTH_DESK_HERO_HEADLINE = {
  line1: "Health intelligence",
  builtForPrefix: "built for",
} as const;

/** Two lines under the rotating title. */
export const DOEHEALTH_DESK_HERO_DEK = [
  "Doe believes every aspect of healthcare",
  "should be run by its own intelligence model.",
] as const;

export const DOEHEALTH_DESK_HERO_SECURE = "Secure your intelligence model";

/** Rotating audience on line 2 — order is intentional. */
export const DOEHEALTH_DESK_HERO_AUDIENCE = [
  "practices",
  "providers",
  "patients",
  "students",
] as const;

export const DOEHEALTH_DESK_HERO_AUDIENCE_ROTATE_MS = 3_200;

/** Keep in sync with `.doehealth-desk-hero__audience-word` animation duration in doehealth-desk.css */
export const DOEHEALTH_DESK_HERO_AUDIENCE_CROSSFADE_MS = 550;

/** Keep in sync with `--desk-headline-darken-*` on desk iPhone in doehealth-desk.css */
export const DOEHEALTH_DESK_HERO_HEADLINE_DARKEN_MS = 4_000;
export const DOEHEALTH_DESK_HERO_HEADLINE_DARKEN_DELAY_MS = 800;

/** Desktop hero: wait, fade the title in from nothing, then run the horizontal highlight. */
export const DOEHEALTH_DESK_HERO_DESKTOP_TIMING = {
  startDelayMs: 500,
  /** Swipe starts as the 1s fade-up (desktop `.doehealth-desk-hero__line` transition) lands. */
  introRevealMs: 800,
  /** Keep in sync with desktop `--desk-headline-darken-*` in doehealth-desk.css */
  darkenMs: 5_500,
  darkenDelayMs: 350,
} as const;

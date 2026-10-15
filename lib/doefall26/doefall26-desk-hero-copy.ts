export const DOE_FALL26_DESK_HERO_HEADLINE = {
  line1: "Health intelligence",
  builtForPrefix: "built for",
} as const;

/** Two lines under the rotating title. */
export const DOE_FALL26_DESK_HERO_DEK = [
  "We're giving every aspect of healthcare their own",
  "secure, powerful, and designable intelligence.",
] as const;

export const DOE_FALL26_DESK_HERO_SECURE = "Secure your intelligence model";

/** Rotating audience on line 2 — order is intentional. */
export const DOE_FALL26_DESK_HERO_AUDIENCE = [
  "practices",
  "providers",
  "patients",
  "students",
] as const;

export const DOE_FALL26_DESK_HERO_AUDIENCE_ROTATE_MS = 3_200;

/** Keep in sync with `.doefall26-desk-hero__audience-word` animation duration in doefall26-desk.css */
export const DOE_FALL26_DESK_HERO_AUDIENCE_CROSSFADE_MS = 550;

/** Keep in sync with `--fall26-headline-darken-*` on desk iPhone in doefall26-desk.css */
export const DOE_FALL26_DESK_HERO_HEADLINE_DARKEN_MS = 4_000;
export const DOE_FALL26_DESK_HERO_HEADLINE_DARKEN_DELAY_MS = 800;

/** Desktop hero: wait, fade the title in from nothing, then run the horizontal highlight. */
export const DOE_FALL26_DESK_HERO_DESKTOP_TIMING = {
  startDelayMs: 0,
  /** Swipe starts immediately on page load. */
  introRevealMs: 0,
  /** Keep in sync with desktop `--fall26-headline-darken-*` in doefall26-desk.css */
  darkenMs: 5_500,
  darkenDelayMs: 0,
} as const;

/** iPhone hero: both title lines fade in together, then the diagonal swipe runs immediately. */
export const DOE_FALL26_DESK_HERO_PHONE_TIMING = {
  /** Keep in sync with `--fall26-hero-intro-duration` on phone in doefall26-desk.css */
  introRevealMs: 0,
  darkenMs: DOE_FALL26_DESK_HERO_HEADLINE_DARKEN_MS,
  darkenDelayMs: 0,
} as const;

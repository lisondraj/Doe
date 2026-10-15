/** Single brown colour throughout. */
export const DOEHEALTH_DESK2_HERO_HEADLINE = {
  line1: "Get your clinic ready",
  line2: "for personal agents.",
} as const;

/** Two lines under the title. */
export const DOEHEALTH_DESK2_HERO_DEK = [
  "Help personal agents find your clinic",
  "faster and more frequently.",
] as const;

export const DOEHEALTH_DESK2_HERO_SECURE = "Join our waitlist & secure founding prices";

/** Rotating audience on line 2 — order is intentional. */
export const DOEHEALTH_DESK2_HERO_AUDIENCE = [
  "practices",
  "providers",
  "patients",
  "students",
] as const;

export const DOEHEALTH_DESK2_HERO_AUDIENCE_ROTATE_MS = 3_200;

/** Keep in sync with `.doehealth-desk2-hero__audience-word` animation duration in doehealth-desk2.css */
export const DOEHEALTH_DESK2_HERO_AUDIENCE_CROSSFADE_MS = 550;

/** Keep in sync with `--desk2-headline-darken-*` on desk iPhone in doehealth-desk2.css */
export const DOEHEALTH_DESK2_HERO_HEADLINE_DARKEN_MS = 4_000;
export const DOEHEALTH_DESK2_HERO_HEADLINE_DARKEN_DELAY_MS = 800;

/** Desktop hero: wait, fade the title in from nothing, then run the horizontal highlight. */
export const DOEHEALTH_DESK2_HERO_DESKTOP_TIMING = {
  startDelayMs: 0,
  /** Swipe starts immediately on page load. */
  introRevealMs: 0,
  /** Keep in sync with desktop `--desk2-headline-darken-*` in doehealth-desk2.css */
  darkenMs: 5_500,
  darkenDelayMs: 0,
} as const;

/** iPhone hero: both title lines fade in together, then the diagonal swipe runs immediately. */
export const DOEHEALTH_DESK2_HERO_PHONE_TIMING = {
  /** Keep in sync with `--desk2-hero-intro-duration` on phone in doehealth-desk2.css */
  introRevealMs: 0,
  darkenMs: DOEHEALTH_DESK2_HERO_HEADLINE_DARKEN_MS,
  darkenDelayMs: 0,
} as const;

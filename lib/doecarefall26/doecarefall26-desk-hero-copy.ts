export const DOECAREFALL26_DESK_HERO_HEADLINE = {
  line1: "Health intelligence",
  builtForPrefix: "built for",
} as const;

/** Body copy under the rotating title. */
export const DOECAREFALL26_DESK_HERO_DEK = [
  "We're reimagining how providers and patients",
  "incorporate AI into their lives.",
] as const;

export const DOECAREFALL26_DESK_HERO_SECURE = "Be the first to find out";

/** Rotating audience on line 2 — order is intentional. */
export const DOECAREFALL26_DESK_HERO_AUDIENCE = [
  "practices",
  "providers",
  "patients",
  "students",
] as const;

/** Desktop hero carousel — same order, no students. */
export const DOECAREFALL26_DESK_HERO_AUDIENCE_DESKTOP = [
  "practices",
  "providers",
  "patients",
] as const;

export const DOECAREFALL26_DESK_HERO_AUDIENCE_ROTATE_MS = 3_200;

/** Keep in sync with `.doecarefall26-desk-hero__audience-word` animation duration in doecarefall26-desk.css */
export const DOECAREFALL26_DESK_HERO_AUDIENCE_CROSSFADE_MS = 550;

/** Keep in sync with `--carefall26-headline-darken-*` on desk iPhone in doecarefall26-desk.css */
export const DOECAREFALL26_DESK_HERO_HEADLINE_DARKEN_MS = 4_000;
export const DOECAREFALL26_DESK_HERO_HEADLINE_DARKEN_DELAY_MS = 800;

/** Desktop hero: wait, fade the title in from nothing, then run the horizontal highlight. */
export const DOECAREFALL26_DESK_HERO_DESKTOP_TIMING = {
  startDelayMs: 0,
  /** Swipe starts immediately on page load. */
  introRevealMs: 0,
  /** Keep in sync with desktop `--carefall26-headline-darken-*` in doecarefall26-desk.css */
  darkenMs: 5_500,
  darkenDelayMs: 0,
} as const;

/** iPhone hero: both title lines fade in together, then the diagonal swipe runs immediately. */
export const DOECAREFALL26_DESK_HERO_PHONE_TIMING = {
  /** Keep in sync with `--carefall26-hero-intro-duration` on phone in doecarefall26-desk.css */
  introRevealMs: 0,
  darkenMs: DOECAREFALL26_DESK_HERO_HEADLINE_DARKEN_MS,
  darkenDelayMs: 0,
} as const;

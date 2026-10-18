/**
 * Single brown colour throughout. Each headline is two lines, each one line at every size. One is picked at random on
 * every page load; the first is the default before that pick (server render and first client render).
 */
export const DOEHEALTH_DESK2_HERO_HEADLINES = [
  { line1: "Grow clinic revenue", line2: "with personal AI agents." },
  { line1: "Personal agents arrived.", line2: "Is your clinic ready?" },
  { line1: "Let personal agents", line2: "bring you more patients." },
  { line1: "Patients book their visit", line2: "through their agents." },
  { line1: "Be the first clinic", line2: "their agents choose." },
  { line1: "Every patient's agent answers", line2: "in seconds flat." },
  { line1: "Agents book care.", line2: "Make sure it's yours." },
  { line1: "When agents search,", line2: "your clinic shows up." },
  { line1: "Patients ask agents first.", line2: "Be the answer." },
  { line1: "Care moves to agents.", line2: "Be found there." },
  { line1: "Your next patient", line2: "starts with an agent." },
  { line1: "Agents find your clinic.", line2: "Make it yours." },
  { line1: "Agents are choosing clinics.", line2: "Be their pick." },
] as const;

/** Two lines under the title. */
export const DOEHEALTH_DESK2_HERO_DEK = [
  "Doe is an intelligent platform connecting",
  "clinics & personal AI agents.",
] as const;

export const DOEHEALTH_DESK2_HERO_SECURE = "Join our waitlist";

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

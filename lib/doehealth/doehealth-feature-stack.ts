import { pickCommunicationSlides } from "@/lib/doephone/communication-carousel";

/** /doehealth — slide list (agents shader band includes specialty before workflow carousel). */
export const DOEHEALTH_HOME_FEATURE_SLIDE_IDS = [
  "agents",
  "front-desk",
  "inbox",
  "ambient",
] as const;

export const DOEHEALTH_HOME_FEATURE_SLIDES = pickCommunicationSlides(DOEHEALTH_HOME_FEATURE_SLIDE_IDS);

/** Insert specialty band between Built by doctors shader and agents workflow carousel. */
export const DOEHEALTH_SPECIALTY_BEFORE_AGENTS_WORKFLOW = true;

/** Stop horizontal specialty chip marquee; layout and edge bleed unchanged. */
export const DOEHEALTH_FREEZE_SPECIALTY_MARQUEE = true;

/** Inbox card + prior auth shader band directly under the specialty section. */
export const DOEHEALTH_PRIOR_AUTH_AFTER_SPECIALTY = true;

/** /doehealth — render shader band before feature card for these slides. */
export const DOEHEALTH_SHADER_BEFORE_CARD_SLIDE_IDS = ["agents"] as const;

/** /doehealth — disable chevron/swipe carousel and hero orb tap interactions. */
export const DOEHEALTH_DISABLE_CAROUSEL_INTERACTIONS = true;

/** /doehealth — hide the 2×2 stats grid and workflow pills under Built by doctors. */
export const DOEHEALTH_HIDE_ACTIVE_AGENTS_VISUAL = true;

/** /doehealth — voice-first roadmap diagram under Built by doctors copy. */
export const DOEHEALTH_SHOW_VOICE_ROADMAP_DIAGRAM = true;

/** /doehealth — vertical switch carousel beside closing Doe wordmark. */
export const DOEHEALTH_SHOW_CLOSING_LABEL_CAROUSEL = true;

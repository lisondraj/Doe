import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import {
  BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
  BROADER_DOE_VISION_FINAL_PARAGRAPH,
} from "@/lib/blog/broader-doe-vision-article";
import { PULSE_CALL_HISTORY_FEATURE_CARDS } from "@/lib/blog/pulse-call-history-feature-cards";
import { CARE_COORDINATION_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const PULSE_CALL_HISTORY_SLUG = "pulse-call-history";

export const PULSE_CALL_HISTORY_PATH = `/blog/${PULSE_CALL_HISTORY_SLUG}`;

export const PULSE_CALL_HISTORY_ARTICLE = {
  slug: PULSE_CALL_HISTORY_SLUG,
  path: PULSE_CALL_HISTORY_PATH,
  title: "Pulse: Call History",
  excerpt:
    "Call History gives clinics one place to review every Pulse agent call — with action logs, audio playback, callbacks, and prompt-based analysis.",
  subheading: "Every agent call, logged and reviewable.",
  openingLede:
    "Today, we're introducing two new sub-features under Pulse — Call History and Ambient — built with doctors in mind.",
  openingLedeContinuation:
    "We've reimagined how clinics review every call handled by Pulse agents. From a single workspace, your team can replay conversations, inspect what agents did, and dig into patterns across your entire call history.",
  byline: "By James Lisondra",
  date: "August 4, 2026",
  heroBackdrop: CARE_COORDINATION_BACKDROP,
  featureCards: PULSE_CALL_HISTORY_FEATURE_CARDS,
  bodyParagraphs: [],
  proposalHighlightLead: "",
  proposalHighlightContinuation: "",
  proposalClosing: "",
  thesisSectionHeadline: "",
  thesisIntro: "",
  thesisPoints: [],
  closing: "",
  finalParagraph: BROADER_DOE_VISION_FINAL_PARAGRAPH,
  emailInviteHeadline: BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  emailInviteLabel: BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
} satisfies AboutStyleLongformArticle;

export const PULSE_CALL_HISTORY_TITLE = PULSE_CALL_HISTORY_ARTICLE.title;

export const PULSE_CALL_HISTORY_EXCERPT = PULSE_CALL_HISTORY_ARTICLE.excerpt;

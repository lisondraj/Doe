import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import {
  BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
  BROADER_DOE_VISION_FINAL_PARAGRAPH,
} from "@/lib/blog/broader-doe-vision-article";
import { PULSE_AMBIENT_FEATURE_CARDS } from "@/lib/blog/pulse-ambient-feature-cards";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const PULSE_AMBIENT_SLUG = "pulse-ambient";

export const PULSE_AMBIENT_PATH = `/blog/${PULSE_AMBIENT_SLUG}`;

export const PULSE_AMBIENT_ARTICLE = {
  slug: PULSE_AMBIENT_SLUG,
  path: PULSE_AMBIENT_PATH,
  title: "Pulse: Ambient",
  excerpt:
    "Ambient turns Pulse conversations into structured chart notes — passively captured, clinician-reviewed, and written back to your EMR.",
  subheading: "Documentation that listens with you.",
  openingLede:
    "Today, we're introducing two new sub-features under Pulse — Call History and Ambient — built with doctors in mind.",
  openingLedeContinuation:
    "Ambient brings passive documentation into every Pulse interaction. Conversations become structured chart notes your team can review, edit, and sign off — without adding another step to the visit.",
  byline: "By James Lisondra",
  date: "August 4, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  featureCards: PULSE_AMBIENT_FEATURE_CARDS,
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

export const PULSE_AMBIENT_TITLE = PULSE_AMBIENT_ARTICLE.title;

export const PULSE_AMBIENT_EXCERPT = PULSE_AMBIENT_ARTICLE.excerpt;

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
    "Ambient prepares every scheduled visit after an agent call, briefs physicians on the week ahead, and runs an in-room session that surfaces answers from the chart, call history, and the web while you stay with the patient.",
  subheading: "Everything you need for a seamless appointment.",
  openingLede:
    "Today, we're introducing two new sub-features under Pulse, Call History and Ambient, built with doctors in mind.",
  openingLedeContinuation:
    "Ambient closes the gap between what Pulse learns on the phone and what physicians need in the exam room. After an agent call that schedules a visit, Ambient begins preparing that appointment automatically. Before the week starts, doctors receive one summary of every patient coming in and the context worth reviewing.",
  openingLedeContinuation2:
    "When the visit begins, they tap Start on a pre-built session that listens in the room, transcribes the conversation, and pulls the right information, from the chart, from call history, or from the web, as the patient speaks so clinicians can respond without breaking eye contact.",
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

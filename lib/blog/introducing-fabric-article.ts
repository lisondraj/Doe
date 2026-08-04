import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import {
  BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
  BROADER_DOE_VISION_FINAL_PARAGRAPH,
} from "@/lib/blog/broader-doe-vision-article";
import { INTRODUCING_FABRIC_FEATURE_CARDS } from "@/lib/blog/introducing-fabric-feature-cards";
import { DESIGN3_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const INTRODUCING_FABRIC_SLUG = "introducing-fabric";

export const INTRODUCING_FABRIC_PATH = `/blog/${INTRODUCING_FABRIC_SLUG}`;

export const INTRODUCING_FABRIC_ARTICLE = {
  slug: INTRODUCING_FABRIC_SLUG,
  path: INTRODUCING_FABRIC_PATH,
  title: "Introducing Fabric",
  excerpt:
    "Fabric lets clinical teams design the workflows they actually run — visually, in plain language, and without waiting on a vendor roadmap.",
  subheading: "Design your own clinical intelligence.",
  openingLede: "Today, we're excited to introduce Doe's first two flagship products, Pulse and Fabric.",
  openingLedeContinuation:
    "Doe Fabric is a visual-first no-code agent builder that empowers doctors and their clinics to design their own voice agents. We aim to bring intelligence closer to the providers they will benefit the most, by allowing them to customize agents to fit their own clinic logic, workflows, and policies.",
  byline: "By James Lisondra",
  date: "August 2, 2026",
  heroBackdrop: DESIGN3_BACKDROP,
  featureCards: INTRODUCING_FABRIC_FEATURE_CARDS,
  bodyParagraphs: [
    "Every specialty, every site, and every team develops its own rhythm for intake, follow-up, escalation, and closure. Most EHRs treat that rhythm as customization. In practice it becomes a backlog of requests, workarounds, and sticky notes on monitors.",
    "Fabric gives clinical and operational leaders a direct way to compose those rhythms inside Doe. You lay out steps, assign owners, define triggers, and preview how work moves before anything goes live for staff.",
    "We are not trying to replace thoughtful implementation. We are trying to remove the gap between how a workflow should work and how long it takes to exist in software. Fabric is opinionated about safety — every step keeps chart context, audit history, and role boundaries attached.",
    "Early design partners are using Fabric for referral intake, prior auth prep, post-visit follow-up, and specialty-specific triage paths that used to live in spreadsheets. The common thread is ownership: the people who run the workflow are the people who can change it.",
    "Fabric is entering private beta with a small set of primary care and specialty groups. If your team has a workflow you wish you could ship this week, we would like to hear about it.",
  ],
  contactParagraphIndex: 4,
  proposalHighlightLead:
    "We believe the teams closest to care should be able to shape the tools they rely on — quickly, safely, and without surrendering governance.",
  proposalHighlightContinuation:
    "Fabric is how Doe puts that belief into practice.",
  proposalClosing:
    "We will share more soon about templates, versioning, and how Fabric connects to agents, messaging, and documentation across Doe.",
  thesisSectionHeadline: "What Fabric Makes Possible",
  thesisIntro: "Fabric starts from three commitments that will shape every release:",
  thesisPoints: [
    "Workflows should be editable by the people who run them, with guardrails that keep clinical and operational safety intact.",
    "Every step should stay connected to chart facts, messages, and tasks so context never splits across tools.",
    "Changes should be previewable before launch so teams can iterate without disrupting live clinic operations.",
  ],
  closing:
    "These commitments will guide Fabric as we expand from beta into the broader Doe platform.",
  finalParagraph: BROADER_DOE_VISION_FINAL_PARAGRAPH,
  emailInviteHeadline: BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  emailInviteLabel: BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
} satisfies AboutStyleLongformArticle;

export const INTRODUCING_FABRIC_TITLE = INTRODUCING_FABRIC_ARTICLE.title;

export const INTRODUCING_FABRIC_EXCERPT = INTRODUCING_FABRIC_ARTICLE.excerpt;

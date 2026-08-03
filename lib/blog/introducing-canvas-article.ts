import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { INTRODUCING_CANVAS_FEATURE_CARDS } from "@/lib/blog/introducing-canvas-feature-cards";
import { DESIGN3_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const INTRODUCING_CANVAS_SLUG = "introducing-canvas";

export const INTRODUCING_CANVAS_PATH = `/blog/${INTRODUCING_CANVAS_SLUG}`;

export const INTRODUCING_CANVAS_ARTICLE = {
  slug: INTRODUCING_CANVAS_SLUG,
  path: INTRODUCING_CANVAS_PATH,
  title: "Introducing Canvas",
  excerpt:
    "Canvas lets clinical teams design the workflows they actually run — visually, in plain language, and without waiting on a vendor roadmap.",
  subheading:
    "Build the workflows your clinic already runs — without writing code or opening a ticket.",
  openingLede:
    "Today we are introducing Canvas, Doe's visual workflow studio for teams that need software to match how care is really delivered.",
  byline: "By James Lisondra",
  date: "August 2, 2026",
  heroBackdrop: DESIGN3_BACKDROP,
  featureCards: INTRODUCING_CANVAS_FEATURE_CARDS,
  bodyParagraphs: [
    "Every specialty, every site, and every team develops its own rhythm for intake, follow-up, escalation, and closure. Most EHRs treat that rhythm as customization. In practice it becomes a backlog of requests, workarounds, and sticky notes on monitors.",
    "Canvas gives clinical and operational leaders a direct way to compose those rhythms inside Doe. You lay out steps, assign owners, define triggers, and preview how work moves before anything goes live for staff.",
    "We are not trying to replace thoughtful implementation. We are trying to remove the gap between how a workflow should work and how long it takes to exist in software. Canvas is opinionated about safety — every step keeps chart context, audit history, and role boundaries attached.",
    "Early design partners are using Canvas for referral intake, prior auth prep, post-visit follow-up, and specialty-specific triage paths that used to live in spreadsheets. The common thread is ownership: the people who run the workflow are the people who can change it.",
    "Canvas is entering private beta with a small set of primary care and specialty groups. If your team has a workflow you wish you could ship this week, we would like to hear about it.",
  ],
  contactParagraphIndex: 4,
  proposalHighlightLead:
    "We believe the teams closest to care should be able to shape the tools they rely on — quickly, safely, and without surrendering governance.",
  proposalHighlightContinuation:
    "Canvas is how Doe puts that belief into practice.",
  proposalClosing:
    "We will share more soon about templates, versioning, and how Canvas connects to agents, messaging, and documentation across Doe.",
  thesisSectionHeadline: "What Canvas Makes Possible",
  thesisIntro: "Canvas starts from three commitments that will shape every release:",
  thesisPoints: [
    "Workflows should be editable by the people who run them, with guardrails that keep clinical and operational safety intact.",
    "Every step should stay connected to chart facts, messages, and tasks so context never splits across tools.",
    "Changes should be previewable before launch so teams can iterate without disrupting live clinic operations.",
  ],
  closing:
    "These commitments will guide Canvas as we expand from beta into the broader Doe platform.",
  finalParagraph:
    "If your team has workflows that deserve better software, we would welcome the chance to connect.",
  emailInviteHeadline: "We'd love to chat.",
  emailInviteLabel: "Email James",
} satisfies AboutStyleLongformArticle;

export const INTRODUCING_CANVAS_TITLE = INTRODUCING_CANVAS_ARTICLE.title;

export const INTRODUCING_CANVAS_EXCERPT = INTRODUCING_CANVAS_ARTICLE.excerpt;

import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";
import {
  DOEPHONE_HERO_BACKDROP,
  HEY_CAROUSEL_BACKDROP,
  DESIGN3_BACKDROP,
  DESIGN5_BACKDROP,
} from "@/lib/workflow-carousel-design-backdrops";

export type BlogArticle = {
  slug: string;
  eyebrow: string;
  title: string;
  author: string;
  date: string;
  body: readonly [string, string, string];
  backdrop: WorkflowCarouselDesignBackdrop;
};

export const BLOG_ARTICLES: readonly BlogArticle[] = [
  {
    slug: "code-intelligence-for-doe-agent",
    eyebrow: "Now / AI",
    title: "Code Intelligence for Doe Agent",
    author: "Karri Saarinen",
    date: "May 14, 2026",
    body: [
      "Doe Agent can now read your codebase and answer questions from the source itself. It can explain how a feature works, investigate likely causes behind a problem, and help teams understand the current implementation directly.",
      "Instead of guessing from stale docs or a partial stack trace, engineers ask in plain language and get answers grounded in the repo—file paths, call sites, and the contracts that actually ship. The agent cites what it read so you can verify before you merge.",
      "We built this for teams that move fast without leaving context on Slack threads. Code intelligence keeps product, clinical, and platform work tied to the same source of truth as the code review.",
    ],
    backdrop: DOEPHONE_HERO_BACKDROP,
  },
  {
    slug: "ambient-documentation-at-the-bedside",
    eyebrow: "Product / Clinical",
    title: "Ambient Documentation at the Bedside",
    author: "Maya Chen",
    date: "April 28, 2026",
    body: [
      "Doe listens during the visit, drafts the note with citations, and surfaces only what needs a clinician's eyes before sign-off. The chart updates without another hour at the keyboard after clinic.",
      "Ambient capture runs with explicit consent and clear controls—pause, discard, or edit before anything lands in the record. Drafts follow your note templates and pull problem lists, meds, and prior visits so you are not starting from a blank screen.",
      "The goal is not to remove the clinician from the note. It is to remove the clerical tax that keeps smart people documenting instead of caring for the next patient in the queue.",
    ],
    backdrop: HEY_CAROUSEL_BACKDROP,
  },
  {
    slug: "prior-auth-grounded-in-chart-facts",
    eyebrow: "Workflow / Revenue",
    title: "Prior Auth Grounded in Chart Facts",
    author: "James Okonkwo",
    date: "April 3, 2026",
    body: [
      "Prior authorization packets assemble from live chart context—diagnoses, labs, and prior denials—so teams stop retyping the same story into payer portals every week.",
      "Doe maps payer criteria to what is already documented, flags missing labs or stale imaging, and drafts the clinical justification with citations back to the chart. Staff review, edit, and submit instead of hunting through scanned PDFs.",
      "When denials arrive, the same thread picks up where it left off. Appeals reuse the original evidence trail so revenue cycle does not lose the narrative between first submission and second look.",
    ],
    backdrop: DESIGN5_BACKDROP,
  },
  {
    slug: "one-inbox-for-every-channel",
    eyebrow: "Now / Inbox",
    title: "One Inbox for Every Channel",
    author: "Elena Vasquez",
    date: "March 12, 2026",
    body: [
      "Patient messages, lab callbacks, and referral faxes land in one triaged stream. Doe drafts replies, routes escalations, and keeps nothing trapped in a screenshot on someone's camera roll.",
      "Every thread carries context—who the patient is, which visit is next, and what was promised last time. Triage rules respect scope of practice so nurses, MAs, and physicians each see work meant for their license.",
      "The inbox is the front door to everything else in Doe. Agents run inside the same conversation: scheduling, prior auth, and follow-up tasks stay attached to the message that started them.",
    ],
    backdrop: DESIGN3_BACKDROP,
  },
] as const;

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}

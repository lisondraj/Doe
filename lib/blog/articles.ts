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
  intro: string;
  backdrop: WorkflowCarouselDesignBackdrop;
};

export const BLOG_ARTICLES: readonly BlogArticle[] = [
  {
    slug: "code-intelligence-for-doe-agent",
    eyebrow: "Now / AI",
    title: "Code Intelligence for Doe Agent",
    author: "Karri Saarinen",
    date: "May 14, 2026",
    intro:
      "Doe Agent can now read your codebase and answer questions from the source itself. It can explain how a feature works, investigate likely causes behind a problem, and help teams understand the current implementation directly.",
    backdrop: DOEPHONE_HERO_BACKDROP,
  },
  {
    slug: "ambient-documentation-at-the-bedside",
    eyebrow: "Product / Clinical",
    title: "Ambient Documentation at the Bedside",
    author: "Maya Chen",
    date: "April 28, 2026",
    intro:
      "Doe listens during the visit, drafts the note with citations, and surfaces only what needs a clinician’s eyes before sign-off. The chart updates without another hour at the keyboard after clinic.",
    backdrop: HEY_CAROUSEL_BACKDROP,
  },
  {
    slug: "prior-auth-grounded-in-chart-facts",
    eyebrow: "Workflow / Revenue",
    title: "Prior Auth Grounded in Chart Facts",
    author: "James Okonkwo",
    date: "April 3, 2026",
    intro:
      "Prior authorization packets assemble from live chart context—diagnoses, labs, and prior denials—so teams stop retyping the same story into payer portals every week.",
    backdrop: DESIGN5_BACKDROP,
  },
  {
    slug: "one-inbox-for-every-channel",
    eyebrow: "Now / Inbox",
    title: "One Inbox for Every Channel",
    author: "Elena Vasquez",
    date: "March 12, 2026",
    intro:
      "Patient messages, lab callbacks, and referral faxes land in one triaged stream. Doe drafts replies, routes escalations, and keeps nothing trapped in a screenshot on someone’s camera roll.",
    backdrop: DESIGN3_BACKDROP,
  },
] as const;

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}

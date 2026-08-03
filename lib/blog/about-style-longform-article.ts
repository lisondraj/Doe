import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

/** Shared longform layout used by /about-style blog pages (Broader Doe Vision shell). */
export type AboutStyleLongformArticle = {
  slug: string;
  path: string;
  title: string;
  excerpt: string;
  subheading: string;
  openingLede: string;
  byline: string;
  date: string;
  heroBackdrop: WorkflowCarouselDesignBackdrop;
  bodyParagraphs: readonly string[];
  contactParagraphIndex?: number;
  aiPlaybookParagraphIndex?: number;
  aiPlaybookParagraph?: {
    before: string;
    bold: string;
    after: string;
  };
  proposalHighlightLead: string;
  proposalHighlightContinuation: string;
  proposalClosing: string;
  thesisSectionHeadline: string;
  thesisIntro: string;
  thesisPoints: readonly string[];
  closing: string;
  finalParagraph: string;
  emailInviteHeadline: string;
  emailInviteLabel: string;
};

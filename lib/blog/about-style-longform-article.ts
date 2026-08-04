import type { AboutStyleArticleContentBlock } from "@/lib/blog/about-style-article-content-blocks";
import type { AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";
import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

/** Shared longform layout used by /about-style blog pages (Broader Doe Vision shell). */
export type AboutStyleLongformArticle = {
  slug: string;
  path: string;
  title: string;
  /** Optional second title line rendered beneath `title` in the hero. */
  titleLine2?: string;
  excerpt: string;
  subheading: string;
  openingLede: string;
  /** Product intro pages — body copy after the bold opening sentence. */
  openingLedeContinuation?: string;
  /** Product intro pages — optional third intro paragraph after continuation. */
  openingLedeContinuation2?: string;
  byline: string;
  date: string;
  heroBackdrop: WorkflowCarouselDesignBackdrop;
  /** Square shader tiles beneath the hero band — optional per page. */
  featureCards?: readonly AboutStyleFeatureCard[];
  /** Interleaved body copy with optional shader figures — Doe Labs proposal articles. */
  contentBlocks?: readonly AboutStyleArticleContentBlock[];
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

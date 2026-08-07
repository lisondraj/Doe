import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { GENOME_IS_BUILT_FOR_YOU_FEATURE_CARDS } from "@/lib/blog/genome-is-built-for-you-feature-cards";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const GENOME_IS_BUILT_FOR_YOU_SLUG = "genome-is-built-for-you";

export const GENOME_IS_BUILT_FOR_YOU_PATH = `/blog/${GENOME_IS_BUILT_FOR_YOU_SLUG}`;

export const GENOME_IS_BUILT_FOR_YOU_ARTICLE = {
  slug: GENOME_IS_BUILT_FOR_YOU_SLUG,
  path: GENOME_IS_BUILT_FOR_YOU_PATH,
  title: "Genome is built for you",
  excerpt:
    "Ten ways Genome gives provider organizations a clinic-specific model that learns from approved workflows and operates in private cloud compute.",
  subheading: "Your clinic's own model.",
  openingLede:
    "Your clinic should not have to adapt its care delivery to the assumptions of a generic model.",
  openingLedeContinuation:
    "Genome is designed to give provider organizations a model that reflects the workflows, specialty language, and governance standards they have built over time. It works within private cloud compute dedicated to the clinic, so supported patient and operational context stays in the environment responsible for it.",
  openingLedeContinuation2:
    "The result is not a replacement for clinical judgment. It is an intelligence layer designed to make routine work more consistent, improve through approved feedback, and remain accountable to the people who deliver care.",
  byline: "By James Lisondra",
  date: "August 7, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  featureCards: GENOME_IS_BUILT_FOR_YOU_FEATURE_CARDS,
  bodyParagraphs: [],
  proposalHighlightLead: "",
  proposalHighlightContinuation: "",
  proposalClosing: "",
  thesisSectionHeadline: "",
  thesisIntro: "",
  thesisPoints: [],
  closing: "",
  finalParagraph:
    "Genome is being developed with provider organizations that want to evaluate clinic-specific intelligence within their own clinical, operational, and governance framework.",
  emailInviteHeadline: "Discuss Genome with Doe.",
  emailInviteLabel: "Contact James",
} satisfies AboutStyleLongformArticle;

export const GENOME_IS_BUILT_FOR_YOU_TITLE = GENOME_IS_BUILT_FOR_YOU_ARTICLE.title;

export const GENOME_IS_BUILT_FOR_YOU_EXCERPT = GENOME_IS_BUILT_FOR_YOU_ARTICLE.excerpt;

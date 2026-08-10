import type { BlogLandingPost } from "@/lib/blog/blog-landing-posts";

type PremedBlogPreviewCopy = {
  excerpt: string;
  previewSubheading?: string;
  panelDescription: string;
};

/** /premed — vague preview copy keyed by blog slug; titles stay unchanged. */
export const PREMED_BLOG_PREVIEW_COPY: Record<string, PremedBlogPreviewCopy> = {
  "blended-intelligence": {
    excerpt: "Early writing on how Doe thinks about intelligence in care delivery.",
    previewSubheading: "An overview of Doe's intelligence approach.",
    panelDescription: "Early writing on intelligence in care delivery.",
  },
  "genome-is-built-for-you": {
    excerpt: "How Genome is designed around the teams and workflows that use it.",
    previewSubheading: "A closer look at the Genome experience.",
    panelDescription: "How Genome is designed around the teams that use it.",
  },
  "introducing-genome": {
    excerpt: "A first look at Genome within the Doe platform.",
    previewSubheading: "Introducing Genome.",
    panelDescription: "A first look at Genome within the Doe platform.",
  },
  "intelligence-for-every-clinic": {
    excerpt: "An early outline of Doe's view on intelligence in healthcare.",
    previewSubheading: "Doe's intelligence perspective.",
    panelDescription: "An early outline of Doe's view on intelligence.",
  },
  "introducing-float": {
    excerpt: "An introduction to Float and financial operations at Doe.",
    previewSubheading: "Introducing Float.",
    panelDescription: "An introduction to Float and financial operations.",
  },
  "pulse-call-history": {
    excerpt: "How teams can review and learn from voice interactions.",
    previewSubheading: "Pulse: Call History.",
    panelDescription: "Reviewing and learning from voice interactions.",
  },
  "pulse-ambient": {
    excerpt: "How conversation context can support visits and preparation.",
    previewSubheading: "Pulse: Ambient.",
    panelDescription: "Conversation context for visits and preparation.",
  },
  "introducing-pulse": {
    excerpt: "An introduction to Pulse and voice-led workflows for care teams.",
    previewSubheading: "Introducing Pulse.",
    panelDescription: "An introduction to Pulse and voice-led workflows.",
  },
  "introducing-fabric": {
    excerpt: "An introduction to Fabric and building workflows in plain language.",
    previewSubheading: "Introducing Fabric.",
    panelDescription: "An introduction to Fabric and workflow building.",
  },
  "the-broader-doe-vision": {
    excerpt: "Doe's broader view on intelligence, medicine, and the years ahead.",
    previewSubheading: "The Broader Doe Vision.",
    panelDescription: "Doe's broader view on intelligence and medicine.",
  },
};

export function withPremedBlogPreviewCopy(post: BlogLandingPost): BlogLandingPost {
  const copy = PREMED_BLOG_PREVIEW_COPY[post.slug];
  if (!copy) return post;

  return {
    ...post,
    excerpt: copy.excerpt,
    previewSubheading: copy.previewSubheading ?? post.previewSubheading,
  };
}

export function premedBlogPanelDescription(slug: string): string {
  return PREMED_BLOG_PREVIEW_COPY[slug]?.panelDescription ?? "Early writing from Doe.";
}

import type { BlogLandingPost } from "@/lib/blog/blog-landing-posts";

type PremedBlogCarouselCopy = {
  excerpt: string;
  previewSubheading: string;
};

/** /premed — vague carousel preview copy keyed by blog slug; titles stay unchanged. */
export const PREMED_BLOG_CAROUSEL_COPY: Record<string, PremedBlogCarouselCopy> = {
  "blended-intelligence": {
    excerpt:
      "Doe's Blended Intelligence approach is about giving clinics secure control over their own intelligence while still reaching for deeper reasoning when the clinical work truly requires it.",
    previewSubheading: "Secure intelligence designed for clinics.",
  },
  "genome-is-built-for-you": {
    excerpt:
      "Genome is designed to feel personal to the organization using it, shaped by approved workflows and built for governed environments where clinical teams need trust and continuity.",
    previewSubheading: "Intelligence shaped around your clinic.",
  },
  "introducing-genome": {
    excerpt:
      "Genome introduces a way for clinics to carry intelligence shaped by their own workflows, within a private environment designed for governance and continuity.",
    previewSubheading: "Intelligence built around your clinic.",
  },
  "intelligence-for-every-clinic": {
    excerpt:
      "A Doe Labs outline of the intelligence direction Doe is building toward for clinical operations, with privacy, practical deployment, and long-term control kept firmly in view.",
    previewSubheading: "The direction Doe is building toward.",
  },
  "introducing-float": {
    excerpt:
      "Float extends Doe into another layer of clinic operations, bringing related workflows together in one coherent surface rather than leaving teams to stitch disconnected tools together by hand.",
    previewSubheading: "Another layer of clinic operations.",
  },
  "pulse-call-history": {
    excerpt:
      "Call History gives clinics one place to look back at Pulse activity, understand what happened, and keep a clear record teams can return to with confidence over time.",
    previewSubheading: "Activity you can review and trust.",
  },
  "pulse-ambient": {
    excerpt:
      "Ambient is built to help teams prepare for what is ahead, stay oriented through a demanding week, and keep useful context nearby during care without pulling attention away from the patient or the rhythm of each visit.",
    previewSubheading: "Support through the flow of care.",
  },
  "introducing-pulse": {
    excerpt:
      "Pulse is Doe's step toward giving care teams a clearer live view of what needs attention across the workflows they navigate throughout each day.",
    previewSubheading: "A clearer view of what matters now.",
  },
  "introducing-fabric": {
    excerpt:
      "Fabric is built so clinical teams can shape the workflows they actually run on their own terms, instead of being locked to someone else's product roadmap.",
    previewSubheading: "Tools shaped by the teams who use them.",
  },
  "the-broader-doe-vision": {
    excerpt:
      "Doe's broader view is that intelligence in medicine is entering a rapid transformation that will look nothing like the tools and assumptions shaping care today.",
    previewSubheading: "The Broader Doe Vision.",
  },
};

/** /premed — vague blog carousel copy with roughly the same length as the public excerpts. */
export function withPremedBlogPreviewCopy(post: BlogLandingPost): BlogLandingPost {
  const copy = PREMED_BLOG_CAROUSEL_COPY[post.slug];
  if (!copy) return post;

  return {
    ...post,
    excerpt: copy.excerpt,
    previewSubheading: copy.previewSubheading,
  };
}

export function premedBlogPanelDescription(slug: string): string {
  return PREMED_BLOG_CAROUSEL_COPY[slug]?.excerpt ?? "Early writing from Doe.";
}

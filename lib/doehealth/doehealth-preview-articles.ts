/**
 * The /news articles /earlypreview links to, and the Compliance & Security memo, each duplicated at `/preview-<slug>`:
 * the same article, with the /earlypreview nav (no page links, "Contact James" in place of the waitlist). Kept apart
 * from the article bodies so the middleware can read the paths without loading them.
 */
export const PREVIEW_ARTICLE_SLUGS = [
  "healthcare-in-the-era-of-personal-agents",
  "the-health-system-mapped-for-agents",
  "beyond-find-me-a-doctor",
  "the-new-front-door-for-aesthetic-care",
  "membership-medicine-extended-by-agents",
  "compliance-and-security-through-seed",
  "how-personal-agents-reach-organizations",
  "the-compliance-plan-index-first-phi-when-earned",
] as const;

export type PreviewArticleSlug = (typeof PREVIEW_ARTICLE_SLUGS)[number];

export function previewArticlePath(slug: PreviewArticleSlug) {
  return `/preview-${slug}`;
}

/** Every duplicate's path; doehealth.care serves these instead of bouncing them to `/`. */
export const PREVIEW_ARTICLE_PATHS = PREVIEW_ARTICLE_SLUGS.map(previewArticlePath);

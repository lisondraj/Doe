export const BLOG_POST_CATEGORY_FOUNDERS_MEMO = "Founder's Memo" as const;

export const BLOG_POST_CATEGORY_NEW_RELEASES = "New Releases" as const;

export const BLOG_POST_CATEGORY_PULSE_PRODUCT_DESIGN = "Product Design" as const;

export const BLOG_POST_CATEGORY_FEATURES = "Features" as const;

export const BLOG_POST_CATEGORY_DOE_LABS = "Doe Labs" as const;

export type BlogPostCategory =
  | typeof BLOG_POST_CATEGORY_FOUNDERS_MEMO
  | typeof BLOG_POST_CATEGORY_NEW_RELEASES
  | typeof BLOG_POST_CATEGORY_PULSE_PRODUCT_DESIGN
  | typeof BLOG_POST_CATEGORY_FEATURES
  | typeof BLOG_POST_CATEGORY_DOE_LABS;

const BLOG_POST_CATEGORIES: Record<string, BlogPostCategory> = {
  "the-broader-doe-vision": BLOG_POST_CATEGORY_FOUNDERS_MEMO,
  "our-founder-story": BLOG_POST_CATEGORY_FOUNDERS_MEMO,
  "introducing-pulse": BLOG_POST_CATEGORY_NEW_RELEASES,
  "introducing-fabric": BLOG_POST_CATEGORY_NEW_RELEASES,
  "introducing-float": BLOG_POST_CATEGORY_FEATURES,
  "intelligence-for-every-clinic": BLOG_POST_CATEGORY_DOE_LABS,
  "introducing-genome": BLOG_POST_CATEGORY_FEATURES,
  "blended-intelligence": BLOG_POST_CATEGORY_DOE_LABS,
  "genome-is-built-for-you": BLOG_POST_CATEGORY_PULSE_PRODUCT_DESIGN,
  "pulse-call-history": BLOG_POST_CATEGORY_PULSE_PRODUCT_DESIGN,
  "pulse-ambient": BLOG_POST_CATEGORY_PULSE_PRODUCT_DESIGN,
};

export function blogPostCategory(slug: string): BlogPostCategory | undefined {
  return BLOG_POST_CATEGORIES[slug];
}

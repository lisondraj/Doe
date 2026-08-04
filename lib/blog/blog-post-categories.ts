export const BLOG_POST_CATEGORY_FOUNDERS_MEMO = "Founder's Memo" as const;

export const BLOG_POST_CATEGORY_NEW_RELEASES = "New Releases" as const;

export const BLOG_POST_CATEGORY_PULSE_PRODUCT_DESIGN = "Pulse: Product Design" as const;

export type BlogPostCategory =
  | typeof BLOG_POST_CATEGORY_FOUNDERS_MEMO
  | typeof BLOG_POST_CATEGORY_NEW_RELEASES
  | typeof BLOG_POST_CATEGORY_PULSE_PRODUCT_DESIGN;

const BLOG_POST_CATEGORIES: Record<string, BlogPostCategory> = {
  "the-broader-doe-vision": BLOG_POST_CATEGORY_FOUNDERS_MEMO,
  "introducing-pulse": BLOG_POST_CATEGORY_NEW_RELEASES,
  "introducing-fabric": BLOG_POST_CATEGORY_NEW_RELEASES,
  "pulse-call-history": BLOG_POST_CATEGORY_PULSE_PRODUCT_DESIGN,
  "pulse-ambient": BLOG_POST_CATEGORY_PULSE_PRODUCT_DESIGN,
};

export function blogPostCategory(slug: string): BlogPostCategory | undefined {
  return BLOG_POST_CATEGORIES[slug];
}

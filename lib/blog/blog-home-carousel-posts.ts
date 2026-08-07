import { BROADER_DOE_VISION_SLUG } from "@/lib/blog/broader-doe-vision-article";
import { BLOG_LANDING_POSTS, type BlogLandingPost } from "@/lib/blog/blog-landing-posts";

/** Desktop /doehealth home carousel — Broader Doe Vision second so one card peeks left. */
const BLOG_HOME_DESKTOP_CAROUSEL_SLUG_ORDER = [
  "introducing-genome",
  "introducing-fabric",
  BROADER_DOE_VISION_SLUG,
  "introducing-pulse",
  "pulse-ambient",
  "pulse-call-history",
  "introducing-float",
  "intelligence-for-every-clinic",
] as const;

export const BLOG_HOME_DESKTOP_CAROUSEL_INITIAL_INDEX = BLOG_HOME_DESKTOP_CAROUSEL_SLUG_ORDER.indexOf(
  BROADER_DOE_VISION_SLUG,
);

export function homeBlogCarouselPostsDesktop(): BlogLandingPost[] {
  const bySlug = new Map(BLOG_LANDING_POSTS.map((post) => [post.slug, post]));
  return BLOG_HOME_DESKTOP_CAROUSEL_SLUG_ORDER.map((slug) => bySlug.get(slug)!);
}

/** Mobile /doehealth home carousel — oldest first (Broader Doe Vision leads). */
export function homeBlogCarouselPostsMobile(): BlogLandingPost[] {
  return [...BLOG_LANDING_POSTS].reverse();
}

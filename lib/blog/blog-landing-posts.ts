import {
  BROADER_DOE_VISION_BYLINE,
  BROADER_DOE_VISION_DATE,
  BROADER_DOE_VISION_HERO_BACKDROP,
  BROADER_DOE_VISION_OPENING_LEDE,
  BROADER_DOE_VISION_PATH,
  BROADER_DOE_VISION_SUBHEADING,
  BROADER_DOE_VISION_TITLE,
} from "@/lib/blog/broader-doe-vision-article";
import {
  INTRODUCING_FABRIC_ARTICLE,
  INTRODUCING_FABRIC_PATH,
} from "@/lib/blog/introducing-fabric-article";
import {
  INTRODUCING_PULSE_ARTICLE,
  INTRODUCING_PULSE_PATH,
} from "@/lib/blog/introducing-pulse-article";
import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type BlogLandingPost = {
  slug: string;
  path: string;
  title: string;
  subheading: string;
  excerpt: string;
  byline: string;
  date: string;
  heroBackdrop: WorkflowCarouselDesignBackdrop;
};

/** Featured posts on /blog — Pulse, Fabric, and Broader Doe Vision. */
export const BLOG_LANDING_POSTS: readonly BlogLandingPost[] = [
  {
    slug: INTRODUCING_PULSE_ARTICLE.slug,
    path: INTRODUCING_PULSE_PATH,
    title: INTRODUCING_PULSE_ARTICLE.title,
    subheading: INTRODUCING_PULSE_ARTICLE.subheading,
    excerpt: INTRODUCING_PULSE_ARTICLE.excerpt,
    byline: INTRODUCING_PULSE_ARTICLE.byline,
    date: INTRODUCING_PULSE_ARTICLE.date,
    heroBackdrop: INTRODUCING_PULSE_ARTICLE.heroBackdrop,
  },
  {
    slug: INTRODUCING_FABRIC_ARTICLE.slug,
    path: INTRODUCING_FABRIC_PATH,
    title: INTRODUCING_FABRIC_ARTICLE.title,
    subheading: INTRODUCING_FABRIC_ARTICLE.subheading,
    excerpt: INTRODUCING_FABRIC_ARTICLE.excerpt,
    byline: INTRODUCING_FABRIC_ARTICLE.byline,
    date: INTRODUCING_FABRIC_ARTICLE.date,
    heroBackdrop: INTRODUCING_FABRIC_ARTICLE.heroBackdrop,
  },
  {
    slug: "the-broader-doe-vision",
    path: BROADER_DOE_VISION_PATH,
    title: BROADER_DOE_VISION_TITLE,
    subheading: BROADER_DOE_VISION_SUBHEADING,
    excerpt: BROADER_DOE_VISION_OPENING_LEDE,
    byline: BROADER_DOE_VISION_BYLINE,
    date: BROADER_DOE_VISION_DATE,
    heroBackdrop: BROADER_DOE_VISION_HERO_BACKDROP,
  },
] as const;

export const BLOG_LANDING_PATH = "/blog";

export const BLOG_LANDING_TITLE = "Blog";

export const BLOG_LANDING_SUBHEADING = "August 2026 / Doe Fall Launch";

/** Other featured posts in landing order, starting after the current article. */
export function getOtherBlogLandingPosts(currentSlug: string): BlogLandingPost[] {
  const currentIndex = BLOG_LANDING_POSTS.findIndex((post) => post.slug === currentSlug);
  if (currentIndex === -1) {
    return [...BLOG_LANDING_POSTS];
  }

  return [
    ...BLOG_LANDING_POSTS.slice(currentIndex + 1),
    ...BLOG_LANDING_POSTS.slice(0, currentIndex),
  ];
}

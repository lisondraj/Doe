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
  INTRODUCING_CANVAS_ARTICLE,
  INTRODUCING_CANVAS_PATH,
} from "@/lib/blog/introducing-canvas-article";
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

/** Featured posts on /blog — Pulse, Canvas, and Broader Doe Vision. */
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
    slug: INTRODUCING_CANVAS_ARTICLE.slug,
    path: INTRODUCING_CANVAS_PATH,
    title: INTRODUCING_CANVAS_ARTICLE.title,
    subheading: INTRODUCING_CANVAS_ARTICLE.subheading,
    excerpt: INTRODUCING_CANVAS_ARTICLE.excerpt,
    byline: INTRODUCING_CANVAS_ARTICLE.byline,
    date: INTRODUCING_CANVAS_ARTICLE.date,
    heroBackdrop: INTRODUCING_CANVAS_ARTICLE.heroBackdrop,
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

import {
  BROADER_DOE_VISION_BYLINE,
  BROADER_DOE_VISION_DATE,
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
import {
  PULSE_AMBIENT_ARTICLE,
  PULSE_AMBIENT_PATH,
} from "@/lib/blog/pulse-ambient-article";
import {
  PULSE_CALL_HISTORY_ARTICLE,
  PULSE_CALL_HISTORY_PATH,
} from "@/lib/blog/pulse-call-history-article";
import { blogLandingPreviewShader, BLOG_PREVIEW_BROADER_DOE_VISION_SUBHEADING } from "@/lib/blog/blog-landing-preview-shaders";
import { blogCarouselPreviewShader } from "@/lib/blog/blog-carousel-preview-shaders";
import type { AboutStyleFeatureShaderVariant } from "@/lib/blog/about-style-feature-card";
import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

export type BlogLandingPost = {
  slug: string;
  path: string;
  title: string;
  subheading: string;
  /** Override subheading on /blog list + related carousel previews only. */
  previewSubheading?: string;
  excerpt: string;
  byline: string;
  date: string;
  previewShaderVariant: AboutStyleFeatureShaderVariant;
  carouselShaderVariant: ProtoGrainGradientVariant;
};

/** Featured posts on /blog — Pulse sub-features, flagship launches, and Broader Doe Vision. */
export const BLOG_LANDING_POSTS: readonly BlogLandingPost[] = [
  {
    slug: PULSE_CALL_HISTORY_ARTICLE.slug,
    path: PULSE_CALL_HISTORY_PATH,
    title: PULSE_CALL_HISTORY_ARTICLE.title,
    subheading: PULSE_CALL_HISTORY_ARTICLE.subheading,
    excerpt: PULSE_CALL_HISTORY_ARTICLE.excerpt,
    byline: PULSE_CALL_HISTORY_ARTICLE.byline,
    date: PULSE_CALL_HISTORY_ARTICLE.date,
    previewShaderVariant: blogLandingPreviewShader(PULSE_CALL_HISTORY_ARTICLE.slug),
    carouselShaderVariant: blogCarouselPreviewShader(PULSE_CALL_HISTORY_ARTICLE.slug),
  },
  {
    slug: PULSE_AMBIENT_ARTICLE.slug,
    path: PULSE_AMBIENT_PATH,
    title: PULSE_AMBIENT_ARTICLE.title,
    subheading: PULSE_AMBIENT_ARTICLE.subheading,
    excerpt: PULSE_AMBIENT_ARTICLE.excerpt,
    byline: PULSE_AMBIENT_ARTICLE.byline,
    date: PULSE_AMBIENT_ARTICLE.date,
    previewShaderVariant: blogLandingPreviewShader(PULSE_AMBIENT_ARTICLE.slug),
    carouselShaderVariant: blogCarouselPreviewShader(PULSE_AMBIENT_ARTICLE.slug),
  },
  {
    slug: INTRODUCING_PULSE_ARTICLE.slug,
    path: INTRODUCING_PULSE_PATH,
    title: INTRODUCING_PULSE_ARTICLE.title,
    subheading: INTRODUCING_PULSE_ARTICLE.subheading,
    excerpt: INTRODUCING_PULSE_ARTICLE.excerpt,
    byline: INTRODUCING_PULSE_ARTICLE.byline,
    date: INTRODUCING_PULSE_ARTICLE.date,
    previewShaderVariant: blogLandingPreviewShader(INTRODUCING_PULSE_ARTICLE.slug),
    carouselShaderVariant: blogCarouselPreviewShader(INTRODUCING_PULSE_ARTICLE.slug),
  },
  {
    slug: INTRODUCING_FABRIC_ARTICLE.slug,
    path: INTRODUCING_FABRIC_PATH,
    title: INTRODUCING_FABRIC_ARTICLE.title,
    subheading: INTRODUCING_FABRIC_ARTICLE.subheading,
    excerpt: INTRODUCING_FABRIC_ARTICLE.excerpt,
    byline: INTRODUCING_FABRIC_ARTICLE.byline,
    date: INTRODUCING_FABRIC_ARTICLE.date,
    previewShaderVariant: blogLandingPreviewShader(INTRODUCING_FABRIC_ARTICLE.slug),
    carouselShaderVariant: blogCarouselPreviewShader(INTRODUCING_FABRIC_ARTICLE.slug),
  },
  {
    slug: "the-broader-doe-vision",
    path: BROADER_DOE_VISION_PATH,
    title: BROADER_DOE_VISION_TITLE,
    subheading: BROADER_DOE_VISION_SUBHEADING,
    previewSubheading: BLOG_PREVIEW_BROADER_DOE_VISION_SUBHEADING,
    excerpt: BROADER_DOE_VISION_OPENING_LEDE,
    byline: BROADER_DOE_VISION_BYLINE,
    date: BROADER_DOE_VISION_DATE,
    previewShaderVariant: blogLandingPreviewShader("the-broader-doe-vision"),
    carouselShaderVariant: blogCarouselPreviewShader("the-broader-doe-vision"),
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

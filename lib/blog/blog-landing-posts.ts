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
  INTRODUCING_FLOAT_ARTICLE,
  INTRODUCING_FLOAT_PATH,
} from "@/lib/blog/introducing-float-article";
import {
  INTRODUCING_GENOME_ARTICLE,
  INTRODUCING_GENOME_PATH,
} from "@/lib/blog/introducing-genome-article";
import {
  BLENDED_INTELLIGENCE_ARTICLE,
  BLENDED_INTELLIGENCE_PATH,
} from "@/lib/blog/blended-intelligence-article";
import {
  GENOME_IS_BUILT_FOR_YOU_ARTICLE,
  GENOME_IS_BUILT_FOR_YOU_PATH,
} from "@/lib/blog/genome-is-built-for-you-article";
import {
  INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE,
  INTELLIGENCE_FOR_EVERY_CLINIC_PATH,
} from "@/lib/blog/intelligence-for-every-clinic-article";
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
import { blogPostCategory, type BlogPostCategory } from "@/lib/blog/blog-post-categories";
import type { AboutStyleFeatureShaderVariant } from "@/lib/blog/about-style-feature-card";
import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

export type BlogLandingPost = {
  slug: string;
  path: string;
  title: string;
  category: BlogPostCategory;
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
    slug: BLENDED_INTELLIGENCE_ARTICLE.slug,
    path: BLENDED_INTELLIGENCE_PATH,
    title: BLENDED_INTELLIGENCE_ARTICLE.title,
    category: blogPostCategory(BLENDED_INTELLIGENCE_ARTICLE.slug)!,
    subheading: BLENDED_INTELLIGENCE_ARTICLE.subheading,
    excerpt: BLENDED_INTELLIGENCE_ARTICLE.excerpt,
    byline: BLENDED_INTELLIGENCE_ARTICLE.byline,
    date: BLENDED_INTELLIGENCE_ARTICLE.date,
    previewShaderVariant: blogLandingPreviewShader(BLENDED_INTELLIGENCE_ARTICLE.slug),
    carouselShaderVariant: blogCarouselPreviewShader(BLENDED_INTELLIGENCE_ARTICLE.slug),
  },
  {
    slug: GENOME_IS_BUILT_FOR_YOU_ARTICLE.slug,
    path: GENOME_IS_BUILT_FOR_YOU_PATH,
    title: GENOME_IS_BUILT_FOR_YOU_ARTICLE.title,
    category: blogPostCategory(GENOME_IS_BUILT_FOR_YOU_ARTICLE.slug)!,
    subheading: GENOME_IS_BUILT_FOR_YOU_ARTICLE.subheading,
    excerpt: GENOME_IS_BUILT_FOR_YOU_ARTICLE.excerpt,
    byline: GENOME_IS_BUILT_FOR_YOU_ARTICLE.byline,
    date: GENOME_IS_BUILT_FOR_YOU_ARTICLE.date,
    previewShaderVariant: blogLandingPreviewShader(GENOME_IS_BUILT_FOR_YOU_ARTICLE.slug),
    carouselShaderVariant: blogCarouselPreviewShader(GENOME_IS_BUILT_FOR_YOU_ARTICLE.slug),
  },
  {
    slug: INTRODUCING_GENOME_ARTICLE.slug,
    path: INTRODUCING_GENOME_PATH,
    title: INTRODUCING_GENOME_ARTICLE.title,
    category: blogPostCategory(INTRODUCING_GENOME_ARTICLE.slug)!,
    subheading: INTRODUCING_GENOME_ARTICLE.subheading,
    excerpt: INTRODUCING_GENOME_ARTICLE.excerpt,
    byline: INTRODUCING_GENOME_ARTICLE.byline,
    date: INTRODUCING_GENOME_ARTICLE.date,
    previewShaderVariant: blogLandingPreviewShader(INTRODUCING_GENOME_ARTICLE.slug),
    carouselShaderVariant: blogCarouselPreviewShader(INTRODUCING_GENOME_ARTICLE.slug),
  },
  {
    slug: INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.slug,
    path: INTELLIGENCE_FOR_EVERY_CLINIC_PATH,
    title: `${INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.title} ${INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.titleLine2}`,
    category: blogPostCategory(INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.slug)!,
    subheading: INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.subheading,
    excerpt: INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.excerpt,
    byline: INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.byline,
    date: INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.date,
    previewShaderVariant: blogLandingPreviewShader(INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.slug),
    carouselShaderVariant: blogCarouselPreviewShader(INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.slug),
  },
  {
    slug: INTRODUCING_FLOAT_ARTICLE.slug,
    path: INTRODUCING_FLOAT_PATH,
    title: INTRODUCING_FLOAT_ARTICLE.title,
    category: blogPostCategory(INTRODUCING_FLOAT_ARTICLE.slug)!,
    subheading: INTRODUCING_FLOAT_ARTICLE.subheading,
    excerpt: INTRODUCING_FLOAT_ARTICLE.excerpt,
    byline: INTRODUCING_FLOAT_ARTICLE.byline,
    date: INTRODUCING_FLOAT_ARTICLE.date,
    previewShaderVariant: blogLandingPreviewShader(INTRODUCING_FLOAT_ARTICLE.slug),
    carouselShaderVariant: blogCarouselPreviewShader(INTRODUCING_FLOAT_ARTICLE.slug),
  },
  {
    slug: PULSE_CALL_HISTORY_ARTICLE.slug,
    path: PULSE_CALL_HISTORY_PATH,
    title: PULSE_CALL_HISTORY_ARTICLE.title,
    category: blogPostCategory(PULSE_CALL_HISTORY_ARTICLE.slug)!,
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
    category: blogPostCategory(PULSE_AMBIENT_ARTICLE.slug)!,
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
    category: blogPostCategory(INTRODUCING_PULSE_ARTICLE.slug)!,
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
    category: blogPostCategory(INTRODUCING_FABRIC_ARTICLE.slug)!,
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
    category: blogPostCategory("the-broader-doe-vision")!,
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

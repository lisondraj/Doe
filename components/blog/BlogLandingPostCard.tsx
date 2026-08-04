"use client";

import Link from "next/link";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { BlogArticleCategory } from "@/components/blog/BlogArticleCategory";
import { aboutStyleFeatureShaderSurface } from "@/lib/blog/about-style-feature-card";
import { blogPreviewShaderSurface } from "@/lib/blog/blog-preview-shader-surface";
import {
  BLOG_LANDING_CARD_BYLINE_TW,
  BLOG_LANDING_CARD_EXCERPT_TW,
  BLOG_LANDING_CARD_STACK,
  BLOG_LANDING_CARD_SUBHEADING_TW,
  BLOG_LANDING_CARD_TITLE_TW,
  BLOG_LANDING_CARD_VISUAL_TW,
  BLOG_LANDING_READ_MORE_TW,
} from "@/lib/blog/blog-landing-layout-styles";
import type { BlogLandingPost } from "@/lib/blog/blog-landing-posts";
import { BROADER_DOE_VISION_SLUG } from "@/lib/blog/broader-doe-vision-article";
import { PULSE_AMBIENT_SLUG } from "@/lib/blog/pulse-ambient-article";

function BlogLandingReadMoreArrow() {
  return (
    <svg
      className="h-4 w-4 shrink-0 iphone-page:h-[clamp(0.9rem,0.8rem+0.5vmin,1.05rem)] iphone-page:w-[clamp(0.9rem,0.8rem+0.5vmin,1.05rem)]"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 8h9M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type BlogLandingPostCardProps = {
  post: BlogLandingPost;
  /** When false, render card markup only (carousel wraps with its own link). */
  linked?: boolean;
  /** List previews on /blog use list shader variants; carousel uses distinct frozen flow presets. */
  previewContext?: "list" | "carousel";
};

/** /blog landing card — shader thumbnail, title, subheading, meta, excerpt, read more. */
export function BlogLandingPostCard({
  post,
  linked = true,
  previewContext = "list",
}: BlogLandingPostCardProps) {
  const subheading = post.previewSubheading ?? post.subheading;
  const shader =
    previewContext === "carousel"
      ? blogPreviewShaderSurface(post.carouselShaderVariant)
      : aboutStyleFeatureShaderSurface(post.previewShaderVariant);

  const card = (
    <article
      className={`${BLOG_LANDING_CARD_STACK}${post.slug === BROADER_DOE_VISION_SLUG ? " blog-landing-card--broader-doe-vision" : ""}${post.slug === PULSE_AMBIENT_SLUG ? " blog-landing-card--pulse-ambient" : ""}`}
    >
      <div
        className={`${BLOG_LANDING_CARD_VISUAL_TW} blog-landing-card-visual__shader`}
        style={{ backgroundColor: shader.colorBack }}
        aria-hidden
      >
        <ProtoGrainGradient
          static
          variant={shader.variant}
          colors={shader.colors}
          colorBack={shader.colorBack}
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <div className="blog-landing-card-copy mt-5 iphone-page:mt-6">
        <BlogArticleCategory category={post.category} variant="preview" />
        <h2 className={BLOG_LANDING_CARD_TITLE_TW}>{post.title}</h2>
        <p className={BLOG_LANDING_CARD_SUBHEADING_TW}>{subheading}</p>
        <p className={BLOG_LANDING_CARD_BYLINE_TW}>
          {post.byline}
          <span className="mx-2" aria-hidden>
            ·
          </span>
          {post.date}
        </p>
        <p className={BLOG_LANDING_CARD_EXCERPT_TW}>{post.excerpt}</p>
        <span className={BLOG_LANDING_READ_MORE_TW}>
          Read more
          <BlogLandingReadMoreArrow />
        </span>
      </div>
    </article>
  );

  if (!linked) {
    return card;
  }

  return (
    <Link href={post.path} className="group block no-underline">
      {card}
    </Link>
  );
}

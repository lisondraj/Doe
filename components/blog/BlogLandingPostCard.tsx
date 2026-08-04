import Link from "next/link";

import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import {
  BLOG_LANDING_CARD_EXCERPT_TW,
  BLOG_LANDING_CARD_META_TW,
  BLOG_LANDING_CARD_STACK,
  BLOG_LANDING_CARD_SUBHEADING_TW,
  BLOG_LANDING_CARD_TITLE_TW,
  BLOG_LANDING_CARD_VISUAL_TW,
  BLOG_LANDING_READ_MORE_TW,
} from "@/lib/blog/blog-landing-layout-styles";
import type { BlogLandingPost } from "@/lib/blog/blog-landing-posts";

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
};

/** /blog landing card — shader thumbnail, title, subheading, meta, excerpt, read more. */
export function BlogLandingPostCard({ post, linked = true }: BlogLandingPostCardProps) {
  const card = (
    <article className={BLOG_LANDING_CARD_STACK}>
      <div className={BLOG_LANDING_CARD_VISUAL_TW}>
        <BlogHeroVisual
          backdrop={post.heroBackdrop}
          variant="list"
          boxClassName="absolute inset-0 h-full w-full rounded-[inherit]"
          gapClassName=""
          useAboutHeroDuskShader
          staticShader
        />
      </div>

      <div className="blog-landing-card-copy mt-5 iphone-page:mt-6">
        <h2 className={BLOG_LANDING_CARD_TITLE_TW}>{post.title}</h2>
        <p className={BLOG_LANDING_CARD_SUBHEADING_TW}>{post.subheading}</p>
        <p className={BLOG_LANDING_CARD_META_TW}>
          {post.byline.replace(/^By /, "")}
          <span className="mx-2 opacity-60" aria-hidden>
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

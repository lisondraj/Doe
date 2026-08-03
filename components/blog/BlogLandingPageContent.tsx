import Link from "next/link";

import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { ABOUT_PAGE_HERO_BOX_TW } from "@/lib/about/about-layout-styles";
import {
  BLOG_LANDING_CARD_EXCERPT_TW,
  BLOG_LANDING_CARD_META_TW,
  BLOG_LANDING_CARD_STACK,
  BLOG_LANDING_CARD_SUBHEADING_TW,
  BLOG_LANDING_CARD_TITLE_TW,
  BLOG_LANDING_CARD_VISUAL_TW,
  BLOG_LANDING_HERO_WRAP,
  BLOG_LANDING_LIST_DIVIDER_LINE,
  BLOG_LANDING_LIST_DIVIDER_WRAP,
  BLOG_LANDING_LIST_TOP_GAP,
  BLOG_LANDING_READ_MORE_TW,
  BROADER_DOE_VISION_HERO_HEADLINES_WRAP,
  BROADER_DOE_VISION_HERO_INTRO_WRAP,
  BROADER_DOE_VISION_SUBHEADING_TW,
  BROADER_DOE_VISION_TITLE_TW,
} from "@/lib/blog/blog-landing-layout-styles";
import {
  BLOG_LANDING_POSTS,
  BLOG_LANDING_SUBHEADING,
  BLOG_LANDING_TITLE,
} from "@/lib/blog/blog-landing-posts";
import { BROADER_DOE_VISION_HERO_BACKDROP } from "@/lib/blog/broader-doe-vision-article";

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

/** /blog — about-style landing hero and featured post list. */
export function BlogLandingPageContent() {
  return (
    <div className="about-page-content blog-landing-page">
      <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
        <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
          <h1 className={BROADER_DOE_VISION_TITLE_TW}>{BLOG_LANDING_TITLE}</h1>
          <p className={`${BROADER_DOE_VISION_SUBHEADING_TW} mx-auto max-w-[36ch]`}>
            {BLOG_LANDING_SUBHEADING}
          </p>
        </div>
      </header>

      <div className={BLOG_LANDING_HERO_WRAP}>
        <BlogHeroVisual
          backdrop={BROADER_DOE_VISION_HERO_BACKDROP}
          variant="hero"
          boxClassName={ABOUT_PAGE_HERO_BOX_TW}
          gapClassName=""
          useAboutHeroDuskShader
        />
      </div>

      <ul className={`${BLOG_LANDING_LIST_TOP_GAP} m-0 list-none p-0`}>
        {BLOG_LANDING_POSTS.map((post, index) => (
          <li key={post.slug}>
            {index > 0 ? (
              <div className={BLOG_LANDING_LIST_DIVIDER_WRAP} aria-hidden>
                <div className={BLOG_LANDING_LIST_DIVIDER_LINE} />
              </div>
            ) : null}

            <Link href={post.path} className="group block no-underline">
              <article className={BLOG_LANDING_CARD_STACK}>
                <div className={BLOG_LANDING_CARD_VISUAL_TW}>
                  <BlogHeroVisual
                    backdrop={post.heroBackdrop}
                    variant="list"
                    boxClassName="absolute inset-0 h-full w-full rounded-[inherit]"
                    gapClassName=""
                    useAboutHeroDuskShader
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

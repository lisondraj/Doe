import { BlogLandingPostCard } from "@/components/blog/BlogLandingPostCard";
import {
  BLOG_LANDING_LIST_DIVIDER_LINE,
  BLOG_LANDING_LIST_DIVIDER_WRAP,
  BLOG_LANDING_LIST_TOP_GAP,
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

/** /blog — about-style landing hero and featured post list. */
export function BlogLandingPageContent() {
  return (
    <div className="about-page-content blog-landing-page">
      <header className={BROADER_DOE_VISION_HERO_INTRO_WRAP}>
        <div className={BROADER_DOE_VISION_HERO_HEADLINES_WRAP}>
          <h1 className={`${BROADER_DOE_VISION_TITLE_TW} blog-landing-hero-title`}>{BLOG_LANDING_TITLE}</h1>
          <p className={`${BROADER_DOE_VISION_SUBHEADING_TW} mx-auto max-w-[36ch]`}>
            {BLOG_LANDING_SUBHEADING}
          </p>
        </div>
      </header>

      <ul className={`${BLOG_LANDING_LIST_TOP_GAP} m-0 list-none p-0`}>
        {BLOG_LANDING_POSTS.map((post, index) => (
          <li key={post.slug}>
            {index > 0 ? (
              <div className={BLOG_LANDING_LIST_DIVIDER_WRAP} aria-hidden>
                <div className={BLOG_LANDING_LIST_DIVIDER_LINE} />
              </div>
            ) : null}

            <BlogLandingPostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}

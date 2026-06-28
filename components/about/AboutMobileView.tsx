"use client";

import { renderArticleBlock } from "@/components/blog/ArticleBodyBlocks";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import {
  ABOUT_HERO_HEADLINE_WRAP,
  ABOUT_PAGE_HERO_HEADLINE_PT,
  ABOUT_PAGE_HERO_WRAP,
  ABOUT_PAGE_SUBHEADING_TW,
  ABOUT_PAGE_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_PAGE_ARTICLE, ABOUT_PAGE_HERO_BACKDROP, ABOUT_PAGE_HERO_PATTERN_SCALE } from "@/lib/about/about-page-article";
import { BLOG_CONTENT_PT, BLOG_FEATURE_BOX_TW } from "@/lib/blog/blog-layout-styles";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

/** iPhone /about — mission headline, fundraising subheading, and full blog article body. */
export function AboutMobileView() {
  useDoePhoneStableViewport();

  return (
    <BlogMobileShell
      showJoinCta={false}
      ctaLayout="subpage-about"
      logoLink={false}
      footerLinksDisabled
      shellMinHeightClass="min-h-[var(--app-vh,100lvh)]"
    >
      <main className={`w-full ${BLOG_CONTENT_PT} ${ABOUT_PAGE_HERO_HEADLINE_PT}`}>
        <div className={ABOUT_HERO_HEADLINE_WRAP}>
          <h1 className={ABOUT_PAGE_TITLE_TW}>
            <span className="block">Doe is on a mission</span>
            <span className="block">to redefine healthcare.</span>
          </h1>

          <p className={ABOUT_PAGE_SUBHEADING_TW}>
            We intend to register as a Delaware corporation and are actively raising a pre-seed round.
          </p>
        </div>

        <div className={ABOUT_PAGE_HERO_WRAP}>
          <BlogHeroVisual
            backdrop={ABOUT_PAGE_HERO_BACKDROP}
            variant="hero"
            boxClassName={BLOG_FEATURE_BOX_TW}
            gapClassName=""
            patternScale={ABOUT_PAGE_HERO_PATTERN_SCALE}
          />
        </div>

        <div className="article-body text-left">
          {ABOUT_PAGE_ARTICLE.body.map((block, index) => renderArticleBlock(block, index))}
        </div>
      </main>
    </BlogMobileShell>
  );
}

"use client";

import { renderArticleBlock } from "@/components/blog/ArticleBodyBlocks";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import {
  ABOUT_HERO_BOX_TW,
  ABOUT_HERO_WRAP,
  ABOUT_PAGE_SUBHEADING_TW,
  ABOUT_PAGE_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";
import { getBlogArticle } from "@/lib/blog/articles";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

const ABOUT_ARTICLE_SLUG = "ambient-documentation-at-the-bedside";

const ABOUT_ARTICLE =
  getBlogArticle(ABOUT_ARTICLE_SLUG) ??
  (() => {
    throw new Error("Missing about page article");
  })();

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
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <h1 className={ABOUT_PAGE_TITLE_TW}>
          <span className="block">Doe is on a mission</span>
          <span className="block">to redefine healthcare.</span>
        </h1>

        <p className={ABOUT_PAGE_SUBHEADING_TW}>
          We intend to register as a Delaware corporation and are actively raising a pre-seed round.
        </p>

        <div className={ABOUT_HERO_WRAP}>
          <BlogHeroVisual backdrop={ABOUT_ARTICLE.backdrop} variant="hero" boxClassName={ABOUT_HERO_BOX_TW} gapClassName="" />
        </div>

        <div className={`article-body text-left`}>
          {ABOUT_ARTICLE.body.map((block, index) => renderArticleBlock(block, index))}
        </div>
      </main>
    </BlogMobileShell>
  );
}

"use client";

import { AboutStyleArticleDesktopView } from "@/components/blog/AboutStyleArticleDesktopView";
import { AboutStyleArticleMobileView } from "@/components/blog/AboutStyleArticleMobileView";
import { AboutStyleArticlePageContent } from "@/components/blog/AboutStyleArticlePageContent";
import { PremedLearnMoreProvider } from "@/components/premed/PremedLearnMoreProvider";
import { PremedLinkGuard } from "@/components/premed/PremedLinkGuard";
import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { buildAboutStyleArticleTocItems } from "@/lib/blog/about-style-article-toc";
import { OUR_FOUNDER_STORY_SLUG } from "@/lib/blog/our-founder-story-article";
import { BLOG_DUSK_FOOTER_BACKDROP } from "@/lib/blog/blog-about-shader-backdrops";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";

type AboutStyleArticleRouterProps = {
  article: AboutStyleLongformArticle;
};

/** /about-style longform article — iPhone + desktop variants. */
export function AboutStyleArticleRouter({ article }: AboutStyleArticleRouterProps) {
  const variant = useAboutPageVariant();
  const tocItems = buildAboutStyleArticleTocItems(article);
  const content = <AboutStyleArticlePageContent article={article} tocItems={tocItems} />;
  const footerBackdropImageSrc =
    article.slug === OUR_FOUNDER_STORY_SLUG ? BLOG_DUSK_FOOTER_BACKDROP : undefined;

  const page =
    variant === "desktop" ? (
      <AboutStyleArticleDesktopView tocItems={tocItems} footerBackdropImageSrc={footerBackdropImageSrc}>
        {content}
      </AboutStyleArticleDesktopView>
    ) : (
      <AboutStyleArticleMobileView
        tocItems={tocItems}
        currentSlug={article.slug}
        footerBackdropImageSrc={footerBackdropImageSrc}
      >
        {content}
      </AboutStyleArticleMobileView>
    );

  if (article.slug === OUR_FOUNDER_STORY_SLUG) {
    return (
      <PremedLearnMoreProvider>
        <PremedLinkGuard>{page}</PremedLinkGuard>
      </PremedLearnMoreProvider>
    );
  }

  return page;
}

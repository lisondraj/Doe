"use client";

import { AboutStyleArticleDesktopView } from "@/components/blog/AboutStyleArticleDesktopView";
import { AboutStyleArticleMobileView } from "@/components/blog/AboutStyleArticleMobileView";
import { AboutStyleArticlePageContent } from "@/components/blog/AboutStyleArticlePageContent";
import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { buildAboutStyleArticleTocItems } from "@/lib/blog/about-style-article-toc";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";

type AboutStyleArticleRouterProps = {
  article: AboutStyleLongformArticle;
};

/** /about-style longform article — iPhone + desktop variants. */
export function AboutStyleArticleRouter({ article }: AboutStyleArticleRouterProps) {
  const variant = useAboutPageVariant();
  const tocItems = buildAboutStyleArticleTocItems(article);
  const content = <AboutStyleArticlePageContent article={article} tocItems={tocItems} />;

  return variant === "desktop" ? (
    <AboutStyleArticleDesktopView tocItems={tocItems}>{content}</AboutStyleArticleDesktopView>
  ) : (
    <AboutStyleArticleMobileView tocItems={tocItems} currentSlug={article.slug}>
      {content}
    </AboutStyleArticleMobileView>
  );
}

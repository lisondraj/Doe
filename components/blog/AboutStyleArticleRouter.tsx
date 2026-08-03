"use client";

import { AboutStyleArticleDesktopView } from "@/components/blog/AboutStyleArticleDesktopView";
import { AboutStyleArticleMobileView } from "@/components/blog/AboutStyleArticleMobileView";
import { AboutStyleArticlePageContent } from "@/components/blog/AboutStyleArticlePageContent";
import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";

type AboutStyleArticleRouterProps = {
  article: AboutStyleLongformArticle;
};

/** /about-style longform article — iPhone + desktop variants. */
export function AboutStyleArticleRouter({ article }: AboutStyleArticleRouterProps) {
  const variant = useAboutPageVariant();
  const content = <AboutStyleArticlePageContent article={article} />;

  return variant === "desktop" ? (
    <AboutStyleArticleDesktopView>{content}</AboutStyleArticleDesktopView>
  ) : (
    <AboutStyleArticleMobileView>{content}</AboutStyleArticleMobileView>
  );
}

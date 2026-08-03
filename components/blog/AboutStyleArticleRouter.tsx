"use client";

import { useLayoutEffect } from "react";

import { AboutStyleArticleDesktopView } from "@/components/blog/AboutStyleArticleDesktopView";
import { AboutStyleArticleMobileView } from "@/components/blog/AboutStyleArticleMobileView";
import { AboutStyleArticlePageContent } from "@/components/blog/AboutStyleArticlePageContent";
import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";
import { isAboutStyleProductIntro } from "@/lib/blog/broader-doe-vision-layout-styles";

type AboutStyleArticleRouterProps = {
  article: AboutStyleLongformArticle;
};

/** /about-style longform article — iPhone + desktop variants. */
export function AboutStyleArticleRouter({ article }: AboutStyleArticleRouterProps) {
  const variant = useAboutPageVariant();
  const productIntro = isAboutStyleProductIntro(article.slug);
  const content = <AboutStyleArticlePageContent article={article} />;

  useLayoutEffect(() => {
    if (!productIntro) return;
    document.documentElement.setAttribute("data-about-product-intro", "true");
    return () => {
      document.documentElement.removeAttribute("data-about-product-intro");
    };
  }, [productIntro]);

  return variant === "desktop" ? (
    <AboutStyleArticleDesktopView>{content}</AboutStyleArticleDesktopView>
  ) : (
    <AboutStyleArticleMobileView>{content}</AboutStyleArticleMobileView>
  );
}

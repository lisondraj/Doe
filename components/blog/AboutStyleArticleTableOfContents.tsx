"use client";

import { AboutStyleArticleTocPanel } from "@/components/blog/AboutStyleArticleTocPanel";
import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";
import { ABOUT_STYLE_ARTICLE_TOC_WRAP } from "@/lib/blog/about-style-article-toc-layout-styles";

type AboutStyleArticleTableOfContentsProps = {
  items: readonly AboutStyleArticleTocItem[];
  hideArticleAudio?: boolean;
};

/** Inline table of contents below the hero shader band. */
export function AboutStyleArticleTableOfContents({
  items,
  hideArticleAudio = false,
}: AboutStyleArticleTableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Table of contents" className={ABOUT_STYLE_ARTICLE_TOC_WRAP}>
      <AboutStyleArticleTocPanel items={items} variant="inline" hideArticleAudio={hideArticleAudio} />
    </nav>
  );
}

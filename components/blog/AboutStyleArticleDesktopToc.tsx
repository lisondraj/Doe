"use client";

import { AboutStyleArticleTocPanel } from "@/components/blog/AboutStyleArticleTocPanel";
import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";

type AboutStyleArticleDesktopTocProps = {
  items: readonly AboutStyleArticleTocItem[];
};

/** Desktop — sticky left-rail table of contents beside the article column. */
export function AboutStyleArticleDesktopToc({ items }: AboutStyleArticleDesktopTocProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Table of contents" className="about-desktop-content-panel about-style-article-desktop-toc">
      <AboutStyleArticleTocPanel items={items} variant="desktop" />
    </nav>
  );
}

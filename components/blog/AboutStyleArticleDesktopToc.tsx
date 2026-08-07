"use client";

import { useLayoutEffect, useRef } from "react";

import { AboutStyleArticleTocPanel } from "@/components/blog/AboutStyleArticleTocPanel";
import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";

type AboutStyleArticleDesktopTocProps = {
  items: readonly AboutStyleArticleTocItem[];
};

/** Desktop — sticky left-rail table of contents beside the article column. */
export function AboutStyleArticleDesktopToc({ items }: AboutStyleArticleDesktopTocProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const layout = host.closest<HTMLElement>(".about-desktop-article-layout");
    const contentColumn = layout?.querySelector<HTMLElement>(".broader-doe-desktop-content");
    if (!layout || !contentColumn) return undefined;

    const syncRailBounds = () => {
      const stopMarker =
        contentColumn.querySelector<HTMLElement>(".blog-article-footer-carousel-band") ??
        contentColumn.querySelector<HTMLElement>(".blog-article-carousel-divider");

      if (!stopMarker) {
        host.style.removeProperty("height");
        host.style.removeProperty("align-self");
        host.removeAttribute("data-toc-clamped");
        return;
      }

      const layoutTop = layout.getBoundingClientRect().top;
      const stopTop = stopMarker.getBoundingClientRect().top;
      const height = Math.max(0, Math.round(stopTop - layoutTop));

      host.style.alignSelf = "start";
      host.style.height = `${height}px`;
      host.dataset.tocClamped = "true";
    };

    syncRailBounds();

    const ro = new ResizeObserver(syncRailBounds);
    ro.observe(contentColumn);
    ro.observe(layout);

    window.addEventListener("scroll", syncRailBounds, { passive: true });
    window.addEventListener("resize", syncRailBounds);
    void document.fonts?.ready.then(syncRailBounds);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", syncRailBounds);
      window.removeEventListener("resize", syncRailBounds);
      host.style.removeProperty("height");
      host.style.removeProperty("align-self");
      host.removeAttribute("data-toc-clamped");
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={hostRef} className="about-style-article-desktop-toc-rail-host">
      <div className="about-style-article-desktop-toc-rail">
        <nav aria-label="Table of contents" className="about-desktop-content-panel about-style-article-desktop-toc">
          <AboutStyleArticleTocPanel items={items} variant="desktop" />
        </nav>
      </div>
    </div>
  );
}

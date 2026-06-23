"use client";

import { useLayoutEffect, useRef } from "react";

import { BlogFilterBar } from "@/components/blog/BlogFilterBar";
import { BlogLandingHeroGraphic } from "@/components/blog/BlogLandingHeroGraphic";
import { fitBlogHeroHeadline } from "@/lib/blog/fit-blog-hero-headline";
import {
  BLOG_LANDING_HERO_BOX_TW,
  BLOG_LANDING_HERO_CONTAINER_TW,
  BLOG_LANDING_HERO_FOOTER_TW,
  BLOG_LANDING_HERO_HEADLINE_TW,
  BLOG_LANDING_HERO_HEIGHT,
} from "@/lib/blog/blog-layout-styles";

export function BlogLandingHero({ className = "" }: { className?: string }) {
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const headlineCellRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const headline = headlineRef.current;
    const cell = headlineCellRef.current;
    if (!headline || !cell) return;

    const measure = () => fitBlogHeroHeadline(headline, cell);

    measure();
    const raf = requestAnimationFrame(measure);

    const ro = new ResizeObserver(measure);
    ro.observe(headline);
    ro.observe(cell);

    const onViewportChange = () => measure();
    window.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("scroll", onViewportChange);

    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) measure();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("scroll", onViewportChange);
    };
  }, []);

  return (
    <div
      className={`${BLOG_LANDING_HERO_CONTAINER_TW} relative w-full overflow-hidden ${BLOG_LANDING_HERO_BOX_TW} ${BLOG_LANDING_HERO_HEIGHT} ${className}`.trim()}
    >
      <BlogLandingHeroGraphic />

      <div className={BLOG_LANDING_HERO_FOOTER_TW}>
        <div ref={headlineCellRef} className="min-w-0 overflow-hidden">
          <p ref={headlineRef} className={BLOG_LANDING_HERO_HEADLINE_TW}>
            <span className="block">Let&rsquo;s rebuild</span>
            <span className="block">healthcare.</span>
          </p>
        </div>

        <div className="shrink-0 self-end">
          <BlogFilterBar variant="hero" />
        </div>
      </div>
    </div>
  );
}

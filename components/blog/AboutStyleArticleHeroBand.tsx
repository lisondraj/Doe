"use client";

import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { ABOUT_PAGE_HERO_BOX_TW } from "@/lib/about/about-layout-styles";
import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

type AboutStyleArticleHeroBandProps = {
  backdrop?: WorkflowCarouselDesignBackdrop;
  boxClassName?: string;
  wrapClassName: string;
};

/** iPhone about-style blog articles — hero shader band (shared mount path with /blog/*). */
export function AboutStyleArticleHeroBand({
  backdrop,
  boxClassName = ABOUT_PAGE_HERO_BOX_TW,
  wrapClassName,
}: AboutStyleArticleHeroBandProps) {
  return (
    <div className={wrapClassName}>
      <BlogHeroVisual
        backdrop={backdrop}
        variant="hero"
        boxClassName={boxClassName}
        gapClassName=""
        useAboutHeroDuskShader
        aboutStyleArticleHero
      />
    </div>
  );
}

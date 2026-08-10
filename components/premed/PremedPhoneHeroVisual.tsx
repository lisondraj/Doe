"use client";

import { useLayoutEffect, useState } from "react";

import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { ABOUT_PAGE_HERO_BOX_TW } from "@/lib/about/about-layout-styles";
import { DOE_HOME_HERO_DUSK_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";
import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

type PremedPhoneHeroVisualProps = {
  backdrop?: WorkflowCarouselDesignBackdrop;
  boxClassName?: string;
  gapClassName?: string;
};

/** /premed iPhone — pin about-page attrs before the hero shader mounts (avoids brown first paint). */
export function PremedPhoneHeroVisual({
  backdrop,
  boxClassName = ABOUT_PAGE_HERO_BOX_TW,
  gapClassName = "",
}: PremedPhoneHeroVisualProps) {
  const [shaderReady, setShaderReady] = useState(false);

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-about-page", "true");
    html.removeAttribute("data-home-page");
    html.setAttribute("data-doeforvc-always-phone", "true");
    setShaderReady(true);
  }, []);

  if (!shaderReady) {
    return (
      <div
        className={`about-hero-visual relative w-full overflow-hidden ${boxClassName}`.trim()}
        style={{ backgroundColor: DOE_HOME_HERO_DUSK_PALETTE.back }}
        aria-hidden
      />
    );
  }

  return (
    <BlogHeroVisual
      backdrop={backdrop}
      variant="hero"
      boxClassName={boxClassName}
      gapClassName={gapClassName}
      useAboutHeroDuskShader
    />
  );
}

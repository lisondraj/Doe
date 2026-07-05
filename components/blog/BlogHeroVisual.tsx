"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";
import {
  DOE_HOME_ORANGE_PALETTE,
  doeHomeHeroShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import { BLOG_FEATURE_BOX_TW, BLOG_TITLE_VISUAL_GAP } from "@/lib/blog/blog-layout-styles";

const HOME_HERO_SHADER = doeHomeHeroShaderSurface();

export function BlogHeroVisual({
  backdrop,
  variant = "hero",
  boxClassName,
  gapClassName,
  patternScale,
  useHomeHeroShader = false,
  children,
}: {
  backdrop: WorkflowCarouselDesignBackdropType;
  variant?: "hero" | "list";
  boxClassName?: string;
  gapClassName?: string;
  patternScale?: number;
  /** Main-page hero palette + Paper shader flow (colour/grain from home hero). */
  useHomeHeroShader?: boolean;
  children?: React.ReactNode;
}) {
  const gap = gapClassName ?? (variant === "hero" ? BLOG_TITLE_VISUAL_GAP : "");

  return (
    <div
      className={`about-hero-visual relative w-full overflow-hidden ${boxClassName ?? BLOG_FEATURE_BOX_TW} ${gap}`.trim()}
      style={useHomeHeroShader ? { backgroundColor: DOE_HOME_ORANGE_PALETTE.back } : undefined}
      aria-hidden={children ? undefined : true}
    >
      {useHomeHeroShader ? (
        <ProtoGrainGradient
          variant={HOME_HERO_SHADER.variant}
          colors={HOME_HERO_SHADER.colors}
          colorBack={HOME_HERO_SHADER.colorBack}
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <WorkflowCarouselDesignBackdrop
          backdrop={backdrop}
          embedded
          className="absolute inset-0 h-full w-full"
          patternScale={patternScale}
        />
      )}
      {children}
    </div>
  );
}

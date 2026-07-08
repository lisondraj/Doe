"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";
import {
  DOE_HOME_HERO_DUSK_PALETTE,
  DOE_HOME_ORANGE_PALETTE,
  doeHomeHeroDuskShaderSurface,
  doeHomeHeroShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import { BLOG_FEATURE_BOX_TW, BLOG_TITLE_VISUAL_GAP } from "@/lib/blog/blog-layout-styles";

const HOME_HERO_SHADER = doeHomeHeroShaderSurface();
const HOME_HERO_DUSK_SHADER = doeHomeHeroDuskShaderSurface();

export function BlogHeroVisual({
  backdrop,
  variant = "hero",
  boxClassName,
  gapClassName,
  patternScale,
  useHomeHeroShader = false,
  useHomeHeroDuskShader = false,
  children,
}: {
  backdrop: WorkflowCarouselDesignBackdropType;
  variant?: "hero" | "list";
  boxClassName?: string;
  gapClassName?: string;
  patternScale?: number;
  /** Main-page hero palette + Paper shader flow (colour/grain from home hero). */
  useHomeHeroShader?: boolean;
  /** iPhone home/about dusk — desert dusk hero shader palette. */
  useHomeHeroDuskShader?: boolean;
  children?: React.ReactNode;
}) {
  const gap = gapClassName ?? (variant === "hero" ? BLOG_TITLE_VISUAL_GAP : "");
  const heroShader = useHomeHeroDuskShader ? HOME_HERO_DUSK_SHADER : HOME_HERO_SHADER;
  const heroBack = useHomeHeroDuskShader
    ? DOE_HOME_HERO_DUSK_PALETTE.back
    : useHomeHeroShader
      ? DOE_HOME_ORANGE_PALETTE.back
      : undefined;

  return (
    <div
      className={`about-hero-visual relative w-full overflow-hidden ${boxClassName ?? BLOG_FEATURE_BOX_TW} ${gap}`.trim()}
      style={useHomeHeroShader || useHomeHeroDuskShader ? { backgroundColor: heroBack } : undefined}
      aria-hidden={children ? undefined : true}
    >
      {useHomeHeroShader || useHomeHeroDuskShader ? (
        <ProtoGrainGradient
          variant={heroShader.variant}
          colors={heroShader.colors}
          colorBack={heroShader.colorBack}
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

"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";
import {
  DOE_HOME_HERO_DUSK_PALETTE,
  DOE_HOME_ORANGE_PALETTE,
  doeAboutHeroDuskShaderSurface,
  doeHomeHeroDuskShaderSurface,
  doeHomeHeroShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import { BLOG_FEATURE_BOX_TW, BLOG_TITLE_VISUAL_GAP } from "@/lib/blog/blog-layout-styles";

const HOME_HERO_SHADER = doeHomeHeroShaderSurface();
const HOME_HERO_DUSK_SHADER = doeHomeHeroDuskShaderSurface();
const ABOUT_HERO_DUSK_SHADER = doeAboutHeroDuskShaderSurface();

export function BlogHeroVisual({
  backdrop,
  variant = "hero",
  boxClassName,
  gapClassName,
  patternScale,
  useHomeHeroShader = false,
  useHomeHeroDuskShader = false,
  useAboutHeroDuskShader = false,
  staticShader = false,
  children,
}: {
  backdrop: WorkflowCarouselDesignBackdropType;
  variant?: "hero" | "list";
  boxClassName?: string;
  gapClassName?: string;
  patternScale?: number;
  /** Main-page hero palette + Paper shader flow (colour/grain from home hero). */
  useHomeHeroShader?: boolean;
  /** iPhone home dusk — desert dusk hero shader palette. */
  useHomeHeroDuskShader?: boolean;
  /** /about + about-style blog — dedicated about-hero dusk shader preset. */
  useAboutHeroDuskShader?: boolean;
  /** Freeze shader motion — keep flow appearance without animation. */
  staticShader?: boolean;
  children?: React.ReactNode;
}) {
  const gap = gapClassName ?? (variant === "hero" ? BLOG_TITLE_VISUAL_GAP : "");
  const heroShader = useAboutHeroDuskShader
    ? ABOUT_HERO_DUSK_SHADER
    : useHomeHeroDuskShader
      ? HOME_HERO_DUSK_SHADER
      : HOME_HERO_SHADER;
  const heroBack = useAboutHeroDuskShader || useHomeHeroDuskShader
    ? DOE_HOME_HERO_DUSK_PALETTE.back
    : useHomeHeroShader
      ? DOE_HOME_ORANGE_PALETTE.back
      : undefined;
  const usesHeroShader = useHomeHeroShader || useHomeHeroDuskShader || useAboutHeroDuskShader;

  return (
    <div
      className={`about-hero-visual relative w-full overflow-hidden ${boxClassName ?? BLOG_FEATURE_BOX_TW} ${gap}`.trim()}
      style={usesHeroShader ? { backgroundColor: heroBack } : undefined}
      aria-hidden={children ? undefined : true}
    >
      {usesHeroShader ? (
        <ProtoGrainGradient
          static={staticShader}
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

"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";
import {
  aboutStyleFeatureShaderSurface,
  type AboutStyleFeatureShaderVariant,
} from "@/lib/blog/about-style-feature-card";
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
  previewShaderVariant,
  staticShader = false,
  children,
}: {
  backdrop?: WorkflowCarouselDesignBackdropType;
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
  /** Landing list / related carousel — per-post static shader (not workflow carousel art). */
  previewShaderVariant?: AboutStyleFeatureShaderVariant;
  /** Freeze shader motion — keep flow appearance without animation. */
  staticShader?: boolean;
  children?: React.ReactNode;
}) {
  const gap = gapClassName ?? (variant === "hero" ? BLOG_TITLE_VISUAL_GAP : "");
  const previewShader = previewShaderVariant
    ? aboutStyleFeatureShaderSurface(previewShaderVariant)
    : null;
  const heroShader = useAboutHeroDuskShader
    ? ABOUT_HERO_DUSK_SHADER
    : useHomeHeroDuskShader
      ? HOME_HERO_DUSK_SHADER
      : HOME_HERO_SHADER;
  const heroBack = previewShader
    ? previewShader.colorBack
    : useAboutHeroDuskShader || useHomeHeroDuskShader
      ? DOE_HOME_HERO_DUSK_PALETTE.back
      : useHomeHeroShader
        ? DOE_HOME_ORANGE_PALETTE.back
        : undefined;
  const usesHeroShader =
    previewShader !== null || useHomeHeroShader || useHomeHeroDuskShader || useAboutHeroDuskShader;

  return (
    <div
      className={`about-hero-visual relative w-full overflow-hidden ${boxClassName ?? BLOG_FEATURE_BOX_TW} ${gap}`.trim()}
      style={usesHeroShader ? { backgroundColor: heroBack } : undefined}
      aria-hidden={children ? undefined : true}
    >
      {usesHeroShader ? (
        <ProtoGrainGradient
          static={staticShader || previewShader !== null}
          variant={previewShader ? previewShader.variant : heroShader.variant}
          colors={previewShader ? previewShader.colors : heroShader.colors}
          colorBack={previewShader ? previewShader.colorBack : heroShader.colorBack}
          className="absolute inset-0 h-full w-full"
        />
      ) : backdrop ? (
        <WorkflowCarouselDesignBackdrop
          backdrop={backdrop}
          embedded
          className="absolute inset-0 h-full w-full"
          patternScale={patternScale}
        />
      ) : null}
      {children}
    </div>
  );
}

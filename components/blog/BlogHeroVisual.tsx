"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";
import {
  aboutStyleFeatureShaderSurface,
  type AboutStyleFeatureShaderVariant,
} from "@/lib/blog/about-style-feature-card";
import { blogPreviewShaderSurface } from "@/lib/blog/blog-preview-shader-surface";
import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";
import {
  DOE_HOME_HERO_DUSK_PALETTE,
  DOE_HOME_ORANGE_PALETTE,
  doeAboutHeroDuskShaderSurface,
  doeHomeHeroDuskShaderSurface,
  doeHomeHeroShaderSurface,
  doeJoinCampusHeroDuskShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import { BLOG_FEATURE_BOX_TW, BLOG_TITLE_VISUAL_GAP } from "@/lib/blog/blog-layout-styles";

const HOME_HERO_SHADER = doeHomeHeroShaderSurface();
const HOME_HERO_DUSK_SHADER = doeHomeHeroDuskShaderSurface();
const ABOUT_HERO_DUSK_SHADER = doeAboutHeroDuskShaderSurface();
const JOIN_CAMPUS_HERO_DUSK_SHADER = doeJoinCampusHeroDuskShaderSurface();

export function BlogHeroVisual({
  backdrop,
  variant = "hero",
  boxClassName,
  gapClassName,
  patternScale,
  useHomeHeroShader = false,
  useHomeHeroDuskShader = false,
  useAboutHeroDuskShader = false,
  useJoinCampusHeroDuskShader = false,
  previewShaderVariant,
  carouselShaderVariant,
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
  /** /join campus ambassador — dusk palette with ripple flow (introducing-pulse preset). */
  useJoinCampusHeroDuskShader?: boolean;
  /** /blog list previews — per-post static shader tile. */
  previewShaderVariant?: AboutStyleFeatureShaderVariant;
  /** Related carousel — frozen flow preset (same appearance, no animation). */
  carouselShaderVariant?: ProtoGrainGradientVariant;
  /** Freeze shader motion — keep flow appearance without animation. */
  staticShader?: boolean;
  children?: React.ReactNode;
}) {
  const gap = gapClassName ?? (variant === "hero" ? BLOG_TITLE_VISUAL_GAP : "");
  const carouselShader = carouselShaderVariant ? blogPreviewShaderSurface(carouselShaderVariant) : null;
  const previewShader = previewShaderVariant
    ? aboutStyleFeatureShaderSurface(previewShaderVariant)
    : null;
  const activePreviewShader = carouselShader ?? previewShader;
  const heroShader = useJoinCampusHeroDuskShader
    ? JOIN_CAMPUS_HERO_DUSK_SHADER
    : useAboutHeroDuskShader
      ? ABOUT_HERO_DUSK_SHADER
      : useHomeHeroDuskShader
        ? HOME_HERO_DUSK_SHADER
        : HOME_HERO_SHADER;
  const heroBack = activePreviewShader
    ? activePreviewShader.colorBack
    : useJoinCampusHeroDuskShader || useAboutHeroDuskShader || useHomeHeroDuskShader
      ? DOE_HOME_HERO_DUSK_PALETTE.back
      : useHomeHeroShader
        ? DOE_HOME_ORANGE_PALETTE.back
        : undefined;
  const usesHeroShader =
    activePreviewShader !== null ||
    useHomeHeroShader ||
    useHomeHeroDuskShader ||
    useAboutHeroDuskShader ||
    useJoinCampusHeroDuskShader;

  return (
    <div
      className={`about-hero-visual relative w-full overflow-hidden ${boxClassName ?? BLOG_FEATURE_BOX_TW} ${gap}`.trim()}
      style={usesHeroShader ? { backgroundColor: heroBack } : undefined}
      aria-hidden={children ? undefined : true}
    >
      {usesHeroShader ? (
        <ProtoGrainGradient
          static={carouselShader ? false : staticShader || previewShader !== null}
          variant={activePreviewShader ? activePreviewShader.variant : heroShader.variant}
          colors={activePreviewShader ? activePreviewShader.colors : heroShader.colors}
          colorBack={activePreviewShader ? activePreviewShader.colorBack : heroShader.colorBack}
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

import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";
import { doeAboutHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";

/** Motionless about-style feature tile flows — excludes truchet (worm-like) presets. */
export const ABOUT_STYLE_FEATURE_SHADER_VARIANTS = [
  "agents",
  "front-desk",
  "front-desk-band",
  "customize-agents-band",
  "ambient",
  "ambient-band",
  "validate",
  "looking-ahead",
  "prototype",
  "meet-proto-stack-1",
  "active-agents-band",
  "integrate",
] as const satisfies readonly ProtoGrainGradientVariant[];

export type AboutStyleFeatureShaderVariant = (typeof ABOUT_STYLE_FEATURE_SHADER_VARIANTS)[number];

export type AboutStyleFeatureCard = {
  id: string;
  shaderVariant: AboutStyleFeatureShaderVariant;
  subheading: string;
  description: string;
};

export function aboutStyleFeatureShaderSurface(variant: AboutStyleFeatureShaderVariant) {
  const hero = doeAboutHeroDuskShaderSurface();
  return {
    variant,
    colors: hero.colors,
    colorBack: hero.colorBack,
  };
}

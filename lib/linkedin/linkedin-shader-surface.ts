import { DOE_HOME_HERO_DUSK_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

/** LinkedIn capture — integrate flow, browner and raised vs the blog carousel card. */
export type LinkedInShaderSurface = {
  variant: ProtoGrainGradientVariant;
  colors: readonly [string, string, string];
  colorBack: string;
  offsetY: number;
  offsetX: number;
  intensity: number;
  softness: number;
  scale: number;
  rotation: number;
};

export function linkedInShaderSurface(): LinkedInShaderSurface {
  return {
    variant: "integrate",
    colors: [
      DOE_HOME_HERO_DUSK_PALETTE.clay,
      "#9A422E",
      DOE_HOME_HERO_DUSK_PALETTE.horizon,
    ],
    colorBack: DOE_HOME_HERO_DUSK_PALETTE.back,
    offsetY: -0.34,
    offsetX: 0.04,
    intensity: 0.26,
    softness: 0.64,
    scale: 1.06,
    rotation: 168,
  };
}

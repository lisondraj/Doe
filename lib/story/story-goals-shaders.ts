import { doeHomeHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const dusk = doeHomeHeroDuskShaderSurface();

/** Goals at Seed ARR hero — wide wave band, dusk palette (no truchet / worm). */
export const STORY_GOALS_ARR_HERO_SHADER: ProtoGrainGradientSurface = {
  variant: "story-goals-arr-hero",
  colors: dusk.colors,
  colorBack: dusk.colorBack,
};

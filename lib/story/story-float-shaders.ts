import { doeHomeHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const dusk = doeHomeHeroDuskShaderSurface();

/** Float tab top-right tile — wave flow (no truchet / worm). */
export const STORY_FLOAT_TOP_RIGHT_SHADER: ProtoGrainGradientSurface = {
  variant: "story-float-tr",
  colors: dusk.colors,
  colorBack: dusk.colorBack,
};

/** Float tab mid-left tile — blob pool (no truchet / worm). */
export const STORY_FLOAT_MID_LEFT_SHADER: ProtoGrainGradientSurface = {
  variant: "story-float-mid-left",
  colors: [
    dusk.colors[1],
    dusk.colors[0],
    "#24180C",
  ],
  colorBack: dusk.colorBack,
};

import { doeHomeHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const dusk = doeHomeHeroDuskShaderSurface();

/** Pulse tab tall vertical tile — ripple flow, dusk palette (no truchet / worm). */
export const STORY_PULSE_TALL_LEFT_SHADER: ProtoGrainGradientSurface = {
  variant: "story-pulse-tall",
  colors: [
    dusk.colors[1],
    "#24180C",
    dusk.colors[0],
  ],
  colorBack: dusk.colorBack,
};

/** Pulse tab wide bottom-right tile — corners wash, dusk palette (no truchet / worm). */
export const STORY_PULSE_WIDE_BOTTOM_SHADER: ProtoGrainGradientSurface = {
  variant: "story-pulse-wide",
  colors: [
    "#24180C",
    dusk.colors[1],
    dusk.colors[0],
  ],
  colorBack: dusk.colorBack,
};

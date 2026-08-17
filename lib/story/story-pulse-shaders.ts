import {
  DOE_HOME_HERO_DUSK_SHADER_COLORS,
  doeHomeHeroDuskShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const dusk = doeHomeHeroDuskShaderSurface();
const [d0, d1] = DOE_HOME_HERO_DUSK_SHADER_COLORS;

/** Pulse tab tall vertical tile — ripple flow, dusk palette (no truchet / worm). */
export const STORY_PULSE_TALL_LEFT_SHADER: ProtoGrainGradientSurface = {
  variant: "story-pulse-tall",
  colors: [d1, "#24180C", d0],
  colorBack: dusk.colorBack,
};

/** Pulse tab wide bottom-right tile — corners wash, dusk palette (no truchet / worm). */
export const STORY_PULSE_WIDE_BOTTOM_SHADER: ProtoGrainGradientSurface = {
  variant: "story-pulse-wide",
  colors: ["#24180C", d1, d0],
  colorBack: dusk.colorBack,
};

import {
  DOE_HOME_HERO_DUSK_SHADER_COLORS,
  doeHomeHeroDuskShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const dusk = doeHomeHeroDuskShaderSurface();
const [d0, , d2] = DOE_HOME_HERO_DUSK_SHADER_COLORS;

/** Fabric tab tall left tile — ripple pool, dusk palette (no truchet / worm). */
export const STORY_FABRIC_TALL_LEFT_SHADER: ProtoGrainGradientSurface = {
  variant: "story-fabric-tall",
  colors: [d0, "#24180C", d2],
  colorBack: dusk.colorBack,
};

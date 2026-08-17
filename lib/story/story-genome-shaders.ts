import {
  DOE_HOME_HERO_DUSK_SHADER_COLORS,
  doeHomeHeroDuskShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const dusk = doeHomeHeroDuskShaderSurface();
const [d0, d1] = DOE_HOME_HERO_DUSK_SHADER_COLORS;

/** Genome tab wide top-left tile — shortlist wave, dusk palette (no truchet / worm). */
export const STORY_GENOME_TOP_LEFT_SHADER: ProtoGrainGradientSurface = {
  variant: "story-genome-tl",
  colors: dusk.colors,
  colorBack: dusk.colorBack,
};

/** Genome tab wide bottom-right tile — ripple pool, dusk palette (no truchet / worm). */
export const STORY_GENOME_BOTTOM_RIGHT_SHADER: ProtoGrainGradientSurface = {
  variant: "story-genome-br",
  colors: [d0, d1, "#24180C"],
  colorBack: dusk.colorBack,
};

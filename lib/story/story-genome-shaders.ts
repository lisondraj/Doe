import { doeHomeHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const dusk = doeHomeHeroDuskShaderSurface();

/** Genome tab wide top-left tile — shortlist wave, dusk palette (no truchet / worm). */
export const STORY_GENOME_TOP_LEFT_SHADER: ProtoGrainGradientSurface = {
  variant: "story-genome-tl",
  colors: dusk.colors,
  colorBack: dusk.colorBack,
};

/** Genome tab wide bottom-right tile — ripple pool, dusk palette (no truchet / worm). */
export const STORY_GENOME_BOTTOM_RIGHT_SHADER: ProtoGrainGradientSurface = {
  variant: "story-genome-br",
  colors: [
    dusk.colors[0],
    dusk.colors[1],
    "#24180C",
  ],
  colorBack: dusk.colorBack,
};

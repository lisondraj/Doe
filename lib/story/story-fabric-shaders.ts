import { doeHomeHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const dusk = doeHomeHeroDuskShaderSurface();

/** Fabric tab tall left tile — ripple pool, dusk palette (no truchet / worm). */
export const STORY_FABRIC_TALL_LEFT_SHADER: ProtoGrainGradientSurface = {
  variant: "story-fabric-tall",
  colors: [
    dusk.colors[0],
    "#24180C",
    dusk.colors[2],
  ],
  colorBack: dusk.colorBack,
};

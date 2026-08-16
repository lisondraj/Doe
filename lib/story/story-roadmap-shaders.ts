import { doeHomeHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const dusk = doeHomeHeroDuskShaderSurface();

/** Roadmap Front-desk tile — reception ripple, dusk palette. */
export const STORY_ROADMAP_FRONT_DESK_SHADER: ProtoGrainGradientSurface = {
  variant: "story-roadmap-front-desk",
  colors: dusk.colors,
  colorBack: dusk.colorBack,
};

/** Roadmap Prior Auth tile — structured corners, dusk palette. */
export const STORY_ROADMAP_PRIOR_AUTH_SHADER: ProtoGrainGradientSurface = {
  variant: "story-roadmap-prior-auth",
  colors: [
    dusk.colors[1],
    dusk.colors[0],
    "#24180C",
  ],
  colorBack: dusk.colorBack,
};

/** Roadmap Results tile — wave flow, dusk palette. */
export const STORY_ROADMAP_RESULTS_SHADER: ProtoGrainGradientSurface = {
  variant: "story-roadmap-results",
  colors: [
    dusk.colors[1],
    dusk.colors[0],
    "#24180C",
  ],
  colorBack: dusk.colorBack,
};

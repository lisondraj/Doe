import {
  DOE_HOME_HERO_DUSK_SHADER_COLORS,
  doeHomeHeroDuskShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const dusk = doeHomeHeroDuskShaderSurface();
const [d0, d1] = DOE_HOME_HERO_DUSK_SHADER_COLORS;

/** Roadmap Front-desk tile — reception ripple, dusk palette. */
export const STORY_ROADMAP_FRONT_DESK_SHADER: ProtoGrainGradientSurface = {
  variant: "story-roadmap-front-desk",
  colors: dusk.colors,
  colorBack: dusk.colorBack,
};

/** Roadmap Prior Auth tile — structured corners, dusk palette. */
export const STORY_ROADMAP_PRIOR_AUTH_SHADER: ProtoGrainGradientSurface = {
  variant: "story-roadmap-prior-auth",
  colors: [d1, d0, "#24180C"],
  colorBack: dusk.colorBack,
};

/** Roadmap Results tile — wave flow, dusk palette. */
export const STORY_ROADMAP_RESULTS_SHADER: ProtoGrainGradientSurface = {
  variant: "story-roadmap-results",
  colors: [d1, d0, "#24180C"],
  colorBack: dusk.colorBack,
};

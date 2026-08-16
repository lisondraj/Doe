import {
  doeHomeDuskFooterShaderSurface,
  doeHomeHeroDuskShaderSurface,
  doeJoinCampusHeroDuskShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

/** /doehealth hero dusk flow — story Meet Doe modal slide 1. */
export const STORY_MEET_DOE_MODAL_SHADER = doeHomeHeroDuskShaderSurface();

/** Meet Doe modal slide 4 — corners flow (distinct from slides 1–3; not truchet / worm). */
function storyMeetDoeModalSlide4ShaderSurface(): ProtoGrainGradientSurface {
  const dusk = doeHomeHeroDuskShaderSurface();
  return {
    variant: "meet-proto-stack-2",
    colors: dusk.colors,
    colorBack: dusk.colorBack,
  };
}

/** Meet Doe modal — one distinct flow preset per slide (no truchet / worm). */
export const STORY_MEET_DOE_MODAL_SHADERS: readonly ProtoGrainGradientSurface[] = [
  doeHomeHeroDuskShaderSurface(),
  doeJoinCampusHeroDuskShaderSurface(),
  doeHomeDuskFooterShaderSurface(),
  storyMeetDoeModalSlide4ShaderSurface(),
] as const;

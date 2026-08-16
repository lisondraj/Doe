import { doeHomeDuskShaderBandSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

const ambientShader = doeHomeDuskShaderBandSurface("ambient");

/** Story team tab — James card (ambient-band flipped). */
export const STORY_TEAM_JAMES_SHADER: ProtoGrainGradientSurface | undefined = ambientShader
  ? { ...ambientShader, variant: "ambient-band-flip" }
  : undefined;

/** Story team tab — Matthew card (ambient-band). */
export const STORY_TEAM_MATTHEW_SHADER: ProtoGrainGradientSurface | undefined = ambientShader;

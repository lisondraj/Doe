import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

/** /doehealth routed-calls band — palette (decoupled from main-page hero/card shaders). */
export const DOEHEALTH_ROUTED_CALLS_PALETTE = {
  back: "#1A1208",
  horizon: "#E8A060",
  clay: "#C45C42",
  sand: "#F2D8A8",
} as const;

/** Shader surface for the doehealth routed-calls panel only. */
export const DOEHEALTH_ROUTED_CALLS_SHADER: ProtoGrainGradientSurface = {
  variant: "doehealth-routed-calls",
  colors: [
    DOEHEALTH_ROUTED_CALLS_PALETTE.horizon,
    DOEHEALTH_ROUTED_CALLS_PALETTE.clay,
    DOEHEALTH_ROUTED_CALLS_PALETTE.sand,
  ],
  colorBack: DOEHEALTH_ROUTED_CALLS_PALETTE.back,
};

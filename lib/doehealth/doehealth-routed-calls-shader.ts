import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

/** /doehealth — left-bleed routed calls (warm amber ripple). */
export const DOEHEALTH_ROUTED_CALLS_LEFT_PALETTE = {
  back: "#1A1208",
  ember: "#E8A060",
  clay: "#C45C42",
  sand: "#F2D8A8",
} as const;

/** Left-bleed shader — warm pool drifting from the left edge. */
export const DOEHEALTH_ROUTED_CALLS_LEFT_SHADER: ProtoGrainGradientSurface = {
  variant: "doehealth-routed-calls-left",
  colors: [
    DOEHEALTH_ROUTED_CALLS_LEFT_PALETTE.ember,
    DOEHEALTH_ROUTED_CALLS_LEFT_PALETTE.clay,
    DOEHEALTH_ROUTED_CALLS_LEFT_PALETTE.sand,
  ],
  colorBack: DOEHEALTH_ROUTED_CALLS_LEFT_PALETTE.back,
};

/** Right-bleed shader — same dusk palette as left, wave drift upper-right. */
export const DOEHEALTH_ROUTED_CALLS_RIGHT_SHADER: ProtoGrainGradientSurface = {
  variant: "doehealth-routed-calls-right",
  colors: [
    DOEHEALTH_ROUTED_CALLS_LEFT_PALETTE.ember,
    DOEHEALTH_ROUTED_CALLS_LEFT_PALETTE.clay,
    DOEHEALTH_ROUTED_CALLS_LEFT_PALETTE.sand,
  ],
  colorBack: DOEHEALTH_ROUTED_CALLS_LEFT_PALETTE.back,
};

/**
 * /proto home hero — experiment palette.
 *
 * Edit the four values below to try new hero directions. iPhone feature-box
 * palettes live in proto-feature-palettes.ts (one unique set per section).
 *
 * Current direction: indigo dusk → dusty rose → apricot lift.
 */
export const PROTO_HERO_PALETTE = {
  /** Shader void + section background while the gradient mounts. */
  back: "#1a2234",
  /** Upper bloom — cool sky / periwinkle. */
  bloom: "#6888c8",
  /** Mid transition — muted rose. */
  mid: "#986878",
  /** Warm highlight — soft apricot gold. */
  lift: "#dcc090",
} as const;

export const PROTO_HOME_HERO_SHADER_COLOR_BACK = PROTO_HERO_PALETTE.back;

export const PROTO_HOME_HERO_SHADER_COLORS = [
  PROTO_HERO_PALETTE.bloom,
  PROTO_HERO_PALETTE.mid,
  PROTO_HERO_PALETTE.lift,
] as const;

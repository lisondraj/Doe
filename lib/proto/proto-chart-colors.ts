/** Proto reception palette — data viz on dark backgrounds. */
export const PROTO_CHART_COLORS = {
  /** Warm primary — matches gradient gold highlights. */
  accent: "#E7A944",
  /** Secondary warm — reception copper. */
  accentWarm: "#C46848",
  /** Cool slice / track tint — bridge blue. */
  cool: "#6A9098",
  /** Deep cool — reception blue. */
  coolDeep: "#5A7888",
  track: "rgba(106, 144, 152, 0.22)",
  gridLine: "rgba(106, 144, 152, 0.12)",
  axis: "rgba(106, 144, 152, 0.38)",
  sliceMuted: "#6A9098",
  sliceMid: "#5A7888",
  donutCenter: "#121819",
} as const;

export const PROTO_CHART_SLICE_COLORS = [
  PROTO_CHART_COLORS.accent,
  PROTO_CHART_COLORS.cool,
  PROTO_CHART_COLORS.coolDeep,
] as const;

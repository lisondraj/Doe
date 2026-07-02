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

/** Proto gradient fills for statistics in /proto-invest. */
export const PROTO_CHART_GRADIENTS = {
  bar: "linear-gradient(90deg, #2A4558 0%, #5A7888 42%, #C46848 74%, #E7A944 100%)",
  track: "linear-gradient(90deg, rgba(61,98,112,0.36) 0%, rgba(90,120,136,0.28) 55%, rgba(106,144,152,0.24) 100%)",
  tamBar: "linear-gradient(180deg, #E7A944 0%, #C46848 58%, #5A7888 100%)",
} as const;

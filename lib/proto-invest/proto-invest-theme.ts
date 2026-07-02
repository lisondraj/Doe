import { PROTO_CHART_COLORS } from "@/lib/proto/proto-chart-colors";

/** Shared /proto-invest chrome tokens — aligned with proto nav + section bands. */
export const PROTO_INVEST_PANEL_BG = "#151c1f";
export const PROTO_INVEST_PAGE_BG = "#121819";
export const PROTO_INVEST_BORDER = "#2A3538";

/** Chart palette — proto reception gold + bridge blue on dark. */
export const PROTO_INVEST_CHART_COLORS = {
  accent: PROTO_CHART_COLORS.accent,
  accentAlt: PROTO_CHART_COLORS.accentWarm,
  track: PROTO_CHART_COLORS.track,
  gridLine: PROTO_CHART_COLORS.gridLine,
  axis: PROTO_CHART_COLORS.axis,
  sliceMuted: PROTO_CHART_COLORS.sliceMuted,
  sliceMid: PROTO_CHART_COLORS.sliceMid,
  donutCenter: PROTO_CHART_COLORS.donutCenter,
  label: "rgba(255, 255, 255, 0.72)",
  labelStrong: "#ffffff",
  labelMuted: "rgba(255, 255, 255, 0.55)",
} as const;

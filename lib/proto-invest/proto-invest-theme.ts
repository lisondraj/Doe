/** Shared /proto-invest chrome tokens — aligned with proto nav + section bands. */
export const PROTO_INVEST_PANEL_BG = "#151c1f";
export const PROTO_INVEST_PAGE_BG = "#121819";
export const PROTO_INVEST_BORDER = "#2A3538";

/** Chart palette — proto reception copper + muted white slices on dark. */
export const PROTO_INVEST_CHART_COLORS = {
  accent: "#C46848",
  accentAlt: "#D2774C",
  track: "rgba(255, 255, 255, 0.12)",
  gridLine: "rgba(255, 255, 255, 0.07)",
  axis: "rgba(255, 255, 255, 0.22)",
  sliceMuted: "rgba(255, 255, 255, 0.22)",
  sliceMid: "rgba(255, 255, 255, 0.38)",
  donutCenter: PROTO_INVEST_PAGE_BG,
  label: "rgba(255, 255, 255, 0.72)",
  labelStrong: "#ffffff",
  labelMuted: "rgba(255, 255, 255, 0.55)",
} as const;

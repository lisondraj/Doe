import {
  DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
} from "@/lib/doephone/communication-glass-styles";

/** Hero inbox — outer shell (warm, low-luminance frosted). */
export const HERO_TRIAGE_SHELL_GRADIENT =
  "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,228,196,0.05) 38%, rgba(210,119,76,0.04) 100%)";

/** Hero inbox — second inner layer (subtle depth, not bright grey). */
export const HERO_TRIAGE_INNER_GRADIENT =
  "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,236,205,0.025) 52%, rgba(232,169,68,0.015) 100%)";

/** Hero inbox — column / pane surfaces. */
export const HERO_TRIAGE_PANE_GRADIENT =
  "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)";

/** Hero inbox — chips, rows, compose fields. */
export const HERO_TRIAGE_CHIP_GRADIENT =
  "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)";

/** Hero inbox — selected row glass. */
export const HERO_TRIAGE_SELECTED_GRADIENT =
  "linear-gradient(135deg, rgba(37,99,235,0.55) 0%, rgba(37,99,235,0.38) 100%)";

/** Re-exports for hero inbox glass shell. */
export {
  DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
};

/**
 * Card width — wider than the hero; right edge clips at section overflow.
 */
export const HERO_TRIAGE_PANEL_WIDTH = {
  mobile: "220vw",
  desktop: "min(108rem, 138vw)",
} as const;

/** Mobile — starts ~1/4 across the viewport, lifted above hero floor so top clips. */
export const HERO_TRIAGE_PANEL_ANCHOR = {
  mobile: { left: "18vw", bottom: "-2rem" },
} as const;

/** Mobile scale — applied from bottom-left so the card reads larger in the hero. */
export const HERO_TRIAGE_MOBILE_SCALE = 1.22;

/** Mobile inbox list column — narrow so email pane dominates the visible frame. */
export const HERO_TRIAGE_MOBILE_LIST_WIDTH = "20%";

/** Mobile card heights — fixed height so email pane's flex:1 compose area fills to bottom. */
export const HERO_TRIAGE_MOBILE_MIN_HEIGHT = {
  outer: "56rem",
  inner: "60rem",
} as const;

export const HERO_TRIAGE_PANEL_LEFT = {
  mobile: undefined,
} as const;

export const HERO_TRIAGE_PANEL_RIGHT = {
  mobile: undefined,
  desktop: "calc(min(108rem, 138vw) / -2)",
} as const;

/** Triage Intelligence floating widget width inside the card. */
export const HERO_TRIAGE_WIDGET_WIDTH = {
  mobile: "min(36rem, 92%)",
  desktop: "min(22rem, 68%)",
} as const;

/** No 3D tilt — card sits flat; hero overflow clips right/bottom edges. */
export const HERO_TRIAGE_TILT = {
  mobile: "none",
  desktop: "none",
} as const;

export const HERO_TRIAGE_GLASS = {
  title: "rgba(255, 255, 255, 0.96)",
  breadcrumb: "rgba(255, 255, 255, 0.52)",
  body: "rgba(255, 255, 255, 0.60)",
  activity: "rgba(255, 255, 255, 0.34)",
  status: "rgba(196, 214, 226, 0.72)",
  accent: "#F2994A",
  accentDeep: "#D2774C",
  panelBorder: "rgba(255, 255, 255, 0.11)",
  widgetBorder: "rgba(255, 255, 255, 0.10)",
  panelShadow:
    "0 48px 96px rgba(0, 0, 0, 0.52), 0 18px 44px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.10)",
  widgetShadow: "0 12px 36px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
} as const;

/** Outer card — warm frosted glass; no backdrop-blur on phone (keeps UI sharp at scale). */
export const HERO_TRIAGE_OUTER_GLASS_TW =
  `${DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW} shadow-[inset_0_1px_0_rgba(255,255,255,0.13)] [transform:translateZ(0)] backdrop-blur-[12px] iphone-page:backdrop-blur-none`;

export const HERO_TRIAGE_INNER_GLASS_TW =
  "backdrop-blur-[6px] iphone-page:backdrop-blur-none [transform:translateZ(0)]";

/** Per-pane frosted surface — nav, list, detail columns and chips. */
export const HERO_TRIAGE_PANE_GLASS_TW =
  "backdrop-blur-[4px] iphone-page:backdrop-blur-none [transform:translateZ(0)]";

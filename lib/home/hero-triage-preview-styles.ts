import {
  DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW,
  DOEPHONE_COMMUNICATION_OUTER_GLASS_TW,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
} from "@/lib/doephone/communication-glass-styles";

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

/** Outer card — warm frosted glass matching Integrations section panel. */
export const HERO_TRIAGE_OUTER_GLASS_TW =
  `${DOEPHONE_COMMUNICATION_OUTER_GLASS_TW} backdrop-blur-[20px] iphone-page:backdrop-blur-[16px]`;

export const HERO_TRIAGE_INNER_GLASS_TW =
  "backdrop-blur-[10px] iphone-page:backdrop-blur-[7px] [transform:translateZ(0)]";

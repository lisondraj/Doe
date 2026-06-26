import {
  DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
} from "@/lib/doephone/communication-glass-styles";

/** Hero inbox — outer shell (warm, low-luminance frosted). */
export const HERO_TRIAGE_SHELL_GRADIENT =
  "linear-gradient(135deg, rgba(255,236,205,0.08) 0%, rgba(231,169,68,0.06) 38%, rgba(210,119,76,0.05) 100%)";

/** Hero inbox — second inner layer (subtle depth, warm Doe depth). */
export const HERO_TRIAGE_INNER_GRADIENT =
  "linear-gradient(145deg, rgba(255,228,196,0.05) 0%, rgba(212,157,79,0.035) 52%, rgba(210,119,76,0.025) 100%)";

/** Hero inbox — column / pane surfaces. */
export const HERO_TRIAGE_PANE_GRADIENT =
  "linear-gradient(180deg, rgba(255,236,205,0.045) 0%, rgba(210,119,76,0.025) 55%, rgba(255,255,255,0.012) 100%)";

/** Hero inbox — chips, rows, compose fields. */
export const HERO_TRIAGE_CHIP_GRADIENT =
  "linear-gradient(135deg, rgba(255,228,196,0.09) 0%, rgba(231,169,68,0.045) 52%, rgba(255,255,255,0.02) 100%)";

/** Hero inbox — selected row glass (Doe gold / amber). */
export const HERO_TRIAGE_SELECTED_GRADIENT =
  "linear-gradient(135deg, rgba(231,169,68,0.55) 0%, rgba(210,119,76,0.48) 52%, rgba(196,122,90,0.4) 100%)";

/** Join hero inbox — flat avatar tile (no gradient). */
export const HERO_TRIAGE_JOIN_AVATAR_FLAT =
  "bg-[#EFECE7] text-[#1E343A] font-semibold border border-[#E8E8E8]";

/** @deprecated Use HERO_TRIAGE_JOIN_AVATAR_FLAT for join desktop; kept for mobile compact rows. */
export const HERO_TRIAGE_JOIN_AVATAR_GRADIENT =
  "bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] text-white font-semibold";

export const HERO_TRIAGE_JOIN_NAV_CHIP_ACTIVE = "bg-[#F7F6F3]";

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

/** Mobile — starts further left, lifted so top and right clip inside hero overflow. */
export const HERO_TRIAGE_PANEL_ANCHOR = {
  mobile: { left: "6vw", bottom: "1.25rem" },
} as const;

/** Mobile scale — applied from bottom-left so the card reads larger in the hero. */
export const HERO_TRIAGE_MOBILE_SCALE = 1.38;

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
  `${DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW} shadow-[inset_0_1px_0_rgba(255,228,196,0.14)] [transform:translateZ(0)] backdrop-blur-[12px] iphone-page:backdrop-blur-none`;

export const HERO_TRIAGE_INNER_GLASS_TW =
  "backdrop-blur-[6px] iphone-page:backdrop-blur-none [transform:translateZ(0)]";

/** Per-pane frosted surface — nav, list, detail columns and chips. */
export const HERO_TRIAGE_PANE_GLASS_TW =
  "backdrop-blur-[4px] iphone-page:backdrop-blur-none [transform:translateZ(0)]";

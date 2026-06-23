import {
  DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
} from "@/lib/doephone/communication-glass-styles";

export {
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
};

/**
 * Card width — right side bleeds past the viewport edge.
 * Mobile: card is wide enough that ~50% is visible; the 3D tilt pulls the left
 * portion forward so the breadcrumb / title land close to the left viewport edge.
 */
export const HERO_TRIAGE_PANEL_WIDTH = {
  mobile: "162vw",
  desktop: "min(108rem, 138vw)",
} as const;

/**
 * Negative right offset — controls how far the card bleeds past the right edge.
 * Mobile value puts the card's CSS left edge at ~8vw so the 3D perspective
 * transform leaves the breadcrumb/title fully in frame.
 */
export const HERO_TRIAGE_PANEL_RIGHT = {
  mobile: "-70vw",
  desktop: "calc(min(108rem, 138vw) / -2)",
} as const;

/** Triage Intelligence floating widget width inside the card. */
export const HERO_TRIAGE_WIDGET_WIDTH = {
  mobile: "min(22rem, 94%)",
  desktop: "min(22rem, 68%)",
} as const;

/**
 * 3D tilt — single transform on the card shell; inner content stays flat in
 * the same plane. Mobile has slightly stronger perspective to match the
 * oblique camera angle shown in the reference screenshots.
 */
export const HERO_TRIAGE_TILT = {
  mobile: "perspective(1050px) rotateX(10deg) rotateY(20deg)",
  desktop: "perspective(1400px) rotateX(8deg) rotateY(18deg)",
} as const;

export const HERO_TRIAGE_GLASS = {
  title: "rgba(255, 255, 255, 0.96)",
  breadcrumb: "rgba(255, 255, 255, 0.56)",
  body: "rgba(255, 255, 255, 0.64)",
  activity: "rgba(255, 255, 255, 0.38)",
  status: "rgba(196, 214, 226, 0.76)",
  accent: "#F2994A",
  accentDeep: "#D2774C",
  panelBorder: "rgba(255, 255, 255, 0.13)",
  widgetBorder: "rgba(255, 255, 255, 0.14)",
  panelShadow:
    "0 36px 88px rgba(14, 28, 34, 0.34), 0 12px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.13)",
  widgetShadow: "0 14px 40px rgba(10, 22, 28, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
} as const;

export const HERO_TRIAGE_OUTER_GLASS_TW =
  `${DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW} backdrop-blur-[5px] iphone-page:backdrop-blur-[3px]`;

export const HERO_TRIAGE_INNER_GLASS_TW =
  `${DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW} backdrop-blur-[2px] iphone-page:backdrop-blur-[1px]`;

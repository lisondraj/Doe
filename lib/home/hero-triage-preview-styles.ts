import {
  DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW,
} from "@/lib/doephone/communication-glass-styles";

/**
 * Dark frosted-glass outer panel gradient — matches the reference screenshots
 * where the card reads as a clearly dark element against the warm backdrop.
 */
export const HERO_TRIAGE_PANEL_GRADIENT =
  "linear-gradient(145deg, rgba(10,16,22,0.88) 0%, rgba(8,13,20,0.85) 60%, rgba(12,18,26,0.84) 100%)";

/**
 * Dark frosted-glass inner widget area (header strip of Triage Intelligence).
 */
export const HERO_TRIAGE_WIDGET_HEADER_GRADIENT =
  "linear-gradient(145deg, rgba(16,24,32,0.94) 0%, rgba(10,16,24,0.92) 100%)";

/**
 * Dark frosted-glass body for suggestion / relation rows inside the widget.
 */
export const HERO_TRIAGE_WIDGET_BODY_GRADIENT =
  "linear-gradient(145deg, rgba(14,20,28,0.90) 0%, rgba(9,14,20,0.88) 100%)";

/** Re-exports kept for legacy callers. */
export {
  DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW,
};

/**
 * Card width — right portion bleeds past the viewport edge.
 * At 140 vw the visible left half shows all content proportionally;
 * the right side simply disappears off screen to imply a larger canvas.
 */
export const HERO_TRIAGE_PANEL_WIDTH = {
  mobile: "140vw",
  desktop: "min(108rem, 138vw)",
} as const;

/**
 * Negative right offset.
 * With width 140 vw and right -37 vw the CSS left edge sits at ~3 vw.
 * After the rotateY perspective transform that moves the near-left corner
 * rightward, the visual left edge lands approximately 0–5 vw from the
 * viewport edge — matching the reference screenshots.
 */
export const HERO_TRIAGE_PANEL_RIGHT = {
  mobile: "-37vw",
  desktop: "calc(min(108rem, 138vw) / -2)",
} as const;

/** Triage Intelligence floating widget width inside the card. */
export const HERO_TRIAGE_WIDGET_WIDTH = {
  mobile: "min(22rem, 94%)",
  desktop: "min(22rem, 68%)",
} as const;

/**
 * 3D tilt — perspective(900px) gives a notably stronger depth cue on mobile,
 * matching the oblique camera angle in the reference screenshots.
 */
export const HERO_TRIAGE_TILT = {
  mobile: "perspective(900px) rotateX(8deg) rotateY(22deg)",
  desktop: "perspective(1400px) rotateX(8deg) rotateY(18deg)",
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

/** Outer card — increased blur gives a stronger frosted-glass depth on coloured backgrounds. */
export const HERO_TRIAGE_OUTER_GLASS_TW =
  `${DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW} backdrop-blur-[18px] iphone-page:backdrop-blur-[14px]`;

export const HERO_TRIAGE_INNER_GLASS_TW =
  `${DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW} backdrop-blur-[8px] iphone-page:backdrop-blur-[6px]`;

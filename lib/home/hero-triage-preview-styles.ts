import {
  DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
} from "@/lib/doephone/communication-glass-styles";

export {
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
};

/** Card width — half bleeds past the right viewport edge. */
export const HERO_TRIAGE_PANEL_WIDTH = {
  mobile: "168vw",
  desktop: "min(108rem, 138vw)",
} as const;

export const HERO_TRIAGE_PANEL_RIGHT = {
  mobile: "-84vw",
  desktop: "calc(min(108rem, 138vw) / -2)",
} as const;

/** Shared 3D tilt — one transform on the card shell; inner content stays flat in the same plane. */
export const HERO_TRIAGE_TILT = {
  mobile: "perspective(1200px) rotateX(9deg) rotateY(17deg)",
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

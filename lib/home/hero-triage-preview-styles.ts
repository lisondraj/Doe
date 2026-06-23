import {
  DOEPHONE_COMMUNICATION_INNER_GLASS_TW,
  DOEPHONE_COMMUNICATION_OUTER_GLASS_TW,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
} from "@/lib/doephone/communication-glass-styles";

export {
  DOEPHONE_COMMUNICATION_INNER_GLASS_TW,
  DOEPHONE_COMMUNICATION_OUTER_GLASS_TW,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
};

/** Hero triage panel — half bleeds past the right viewport edge. */
export const HERO_TRIAGE_PANEL_WIDTH = {
  mobile: "200vw",
  desktop: "min(132rem, 168vw)",
} as const;

export const HERO_TRIAGE_PANEL_RIGHT = {
  mobile: "-100vw",
  desktop: "calc(min(132rem, 168vw) / -2)",
} as const;

export const HERO_TRIAGE_GLASS = {
  title: "rgba(255, 255, 255, 0.96)",
  breadcrumb: "rgba(255, 255, 255, 0.58)",
  body: "rgba(255, 255, 255, 0.68)",
  muted: "rgba(255, 255, 255, 0.42)",
  chipText: "rgba(255, 255, 255, 0.82)",
  status: "rgba(228, 236, 242, 0.78)",
  divider: "rgba(255, 255, 255, 0.1)",
  accent: "#E8A944",
  accentDeep: "#D2774C",
  panelShadow:
    "0 42px 100px rgba(18, 32, 38, 0.38), 0 14px 36px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
  widgetShadow:
    "0 18px 48px rgba(12, 24, 30, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
} as const;

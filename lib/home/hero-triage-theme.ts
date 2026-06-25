import type { CSSProperties } from "react";

import {
  HERO_TRIAGE_CHIP_GRADIENT,
  HERO_TRIAGE_INNER_GLASS_TW,
  HERO_TRIAGE_INNER_GRADIENT,
  HERO_TRIAGE_OUTER_GLASS_TW,
  HERO_TRIAGE_PANE_GLASS_TW,
  HERO_TRIAGE_PANE_GRADIENT,
  HERO_TRIAGE_SELECTED_GRADIENT,
  HERO_TRIAGE_SHELL_GRADIENT,
} from "@/lib/home/hero-triage-preview-styles";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

export type HeroTriageTheme = "dark" | "light";

export type HeroTriageThemeConfig = {
  flat: boolean;
  colors: {
    shellBorder: string;
    glassBorder: string;
    navIcon: string;
    navActive: string;
    pillText: string;
    rowText: string;
    rowMuted: string;
    rowTime: string;
    divider: string;
    selectedMuted: string;
    badgeText: string;
    detailBody: string;
    detailMuted: string;
    selectedSubject: string;
    selectedPreview: string;
    selectedSender: string;
    selectedTime: string;
    sendButtonText: string;
  };
  shellGradient: string;
  innerGradient: string;
  paneGradient: string;
  chipGradient: string;
  selectedGradient: string;
  selectedBorder: string;
  outerGlassTw: string;
  innerGlassTw: string;
  paneGlassTw: string;
  insetShadow: string;
  senderBorder: string;
  paneStyle: (extra?: CSSProperties) => CSSProperties;
  chipStyle: (extra?: CSSProperties) => CSSProperties;
};

const DARK_INSET = "inset 0 1px 0 rgba(255,228,196,0.08)";

const DARK_COLORS = {
  shellBorder: "rgba(255,210,170,0.12)",
  glassBorder: "rgba(255,200,160,0.08)",
  navIcon: "rgba(255,236,205,0.42)",
  navActive: "rgba(255,248,240,0.92)",
  pillText: "rgba(255,240,220,0.82)",
  rowText: "rgba(255,236,205,0.56)",
  rowMuted: "rgba(255,228,196,0.38)",
  rowTime: "rgba(255,220,190,0.34)",
  divider: "rgba(255,200,160,0.07)",
  selectedMuted: "rgba(255,248,240,0.72)",
  badgeText: "rgba(255,236,205,0.56)",
  detailBody: "rgba(255,240,225,0.68)",
  detailMuted: "rgba(255,220,190,0.44)",
  selectedSubject: "rgba(255,255,255,0.92)",
  selectedPreview: "rgba(255,255,255,0.75)",
  selectedSender: "#FFFFFF",
  selectedTime: "rgba(255,248,240,0.72)",
  sendButtonText: "#FFFFFF",
} as const;

const LIGHT_COLORS = {
  shellBorder: "#E5E1DA",
  glassBorder: "#ECE8E1",
  navIcon: "rgba(30, 52, 58, 0.34)",
  navActive: JOIN_FORM_BEIGE.ink,
  pillText: "rgba(30, 52, 58, 0.76)",
  rowText: "rgba(30, 52, 58, 0.56)",
  rowMuted: "rgba(30, 52, 58, 0.4)",
  rowTime: "rgba(154, 143, 130, 0.88)",
  divider: "#EEEAE3",
  selectedMuted: "rgba(255, 255, 255, 0.78)",
  badgeText: "rgba(30, 52, 58, 0.52)",
  detailBody: "rgba(30, 52, 58, 0.74)",
  detailMuted: "rgba(154, 143, 130, 0.92)",
  selectedSubject: "#FFFFFF",
  selectedPreview: "rgba(255, 255, 255, 0.84)",
  selectedSender: "#FFFFFF",
  selectedTime: "rgba(255, 255, 255, 0.72)",
  sendButtonText: "#FFFFFF",
} as const;

export function getHeroTriageThemeConfig(theme: HeroTriageTheme): HeroTriageThemeConfig {
  if (theme === "light") {
    return {
      flat: true,
      colors: LIGHT_COLORS,
      shellGradient: "#FFFFFF",
      innerGradient: "#FFFFFF",
      paneGradient: "#FAFAF8",
      chipGradient: JOIN_FORM_BEIGE.field,
      selectedGradient: "#D2774C",
      selectedBorder: "#D2774C",
      outerGlassTw: "border border-[#EBE7E0]",
      innerGlassTw: "",
      paneGlassTw: "",
      insetShadow: "none",
      senderBorder: "transparent",
      paneStyle(extra) {
        return {
          background: "#FFFFFF",
          border: "none",
          boxShadow: "none",
          ...extra,
        };
      },
      chipStyle(extra) {
        return {
          background: JOIN_FORM_BEIGE.page,
          border: "none",
          boxShadow: "none",
          ...extra,
        };
      },
    };
  }

  return {
    flat: false,
    colors: DARK_COLORS,
    shellGradient: HERO_TRIAGE_SHELL_GRADIENT,
    innerGradient: HERO_TRIAGE_INNER_GRADIENT,
    paneGradient: HERO_TRIAGE_PANE_GRADIENT,
    chipGradient: HERO_TRIAGE_CHIP_GRADIENT,
    selectedGradient: HERO_TRIAGE_SELECTED_GRADIENT,
    selectedBorder: "rgba(255,220,180,0.14)",
    outerGlassTw: HERO_TRIAGE_OUTER_GLASS_TW,
    innerGlassTw: HERO_TRIAGE_INNER_GLASS_TW,
    paneGlassTw: HERO_TRIAGE_PANE_GLASS_TW,
    insetShadow: DARK_INSET,
    senderBorder: DARK_COLORS.glassBorder,
    paneStyle(extra) {
      return {
        background: HERO_TRIAGE_PANE_GRADIENT,
        border: `1px solid ${DARK_COLORS.glassBorder}`,
        boxShadow: DARK_INSET,
        ...extra,
      };
    },
    chipStyle(extra) {
      return {
        background: HERO_TRIAGE_CHIP_GRADIENT,
        border: `1px solid ${DARK_COLORS.glassBorder}`,
        boxShadow: DARK_INSET,
        ...extra,
      };
    },
  };
}

/** Join hero — wide panel clipped on right and bottom inside the orange box. */
export const JOIN_HERO_TRIAGE_PANEL = {
  top: "6%",
  right: "calc(min(54rem, 94%) / -2)",
  bottom: "-2rem",
  width: "min(54rem, 94%)",
} as const;

export const JOIN_HERO_TRIAGE_SCALE = 1.58;

/** Join iPhone hero — inbox UI anchored top-left, clipped at top/left like desktop at bottom/right. */
export const JOIN_MOBILE_HERO_TRIAGE_PANEL = {
  left: "-0.75rem",
  top: "-1rem",
  width: "112vw",
  outerHeight: "26rem",
  innerMinHeight: "28rem",
} as const;

export const JOIN_MOBILE_HERO_TRIAGE_SCALE = 1.14;

export type JoinHeroAiFeatureCardConfig = {
  label: string;
  title: string;
  rows: readonly string[];
  status?: string;
  placement: {
    top: string;
    right: string;
    scale: number;
    rotate: number;
    zIndex: number;
    transformOrigin?: string;
  };
};

/** Join desktop hero — two smaller AI feature panels overlapping the inbox preview. */
export const JOIN_HERO_AI_FEATURE_CARDS: readonly JoinHeroAiFeatureCardConfig[] = [
  {
    label: "Brain",
    title: "Bedside reasoning",
    status: "Live",
    rows: [
      "Cross-check meds and dizziness cues",
      "Flag orthostatic risk · low confidence",
      "Suggest cardio follow-up window",
    ],
    placement: {
      top: "11%",
      right: "36%",
      scale: 0.94,
      rotate: -2.5,
      zIndex: 3,
      transformOrigin: "bottom right",
    },
  },
  {
    label: "Finance",
    title: "Prior auth draft",
    status: "Draft ready",
    rows: [
      "Medical necessity — metformin titration",
      "Lab 03/12 · cited from chart",
      "Payer policy §4.2 · matched",
    ],
    placement: {
      top: "44%",
      right: "10%",
      scale: 0.9,
      rotate: 2,
      zIndex: 4,
      transformOrigin: "bottom right",
    },
  },
] as const;


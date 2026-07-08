import { DOE_HOME_HERO_COSMIC_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const COSMIC = DOE_HOME_HERO_COSMIC_PALETTE;

/** Violet-tinted shadows — orbs sit in nebula depth, not on top of it. */
const SHADOW_VIOLET = "#1E0F40";
const SHADOW_DEEP = "#140832";

/** Frost rims — cool highlights against the cosmic field. */
const RIM_FROST = "#F0E8FF";
const RIM_ICE = "#D8FCFF";

export type HeroDialOrbScheme = {
  label: string;
  colors: readonly [string, string, string];
  colorBack: string;
  /** Grain intensity — slight per-orb lift for separation on the dial. */
  intensity?: number;
};

/**
 * Cosmic nebula agent nodes — magenta / violet / cyan aurora on indigo.
 * Ordered bright ↔ deep around the ring so neighbors never share the same hue.
 */
export const HERO_DIAL_ORBS: readonly HeroDialOrbScheme[] = [
  {
    label: "Inbox Agent",
    colors: [SHADOW_VIOLET, "#FF5FE0", RIM_FROST],
    colorBack: COSMIC.back,
    intensity: 0.16,
  },
  {
    label: "Scheduling Agent",
    colors: [SHADOW_DEEP, "#52E8F5", RIM_ICE],
    colorBack: COSMIC.back,
    intensity: 0.15,
  },
  {
    label: "Labs Agent",
    colors: [SHADOW_VIOLET, "#7B58FF", "#E8DEFF"],
    colorBack: COSMIC.back,
    intensity: 0.17,
  },
  {
    label: "Referrals Agent",
    colors: [SHADOW_DEEP, "#FF78B8", "#FFE0F0"],
    colorBack: COSMIC.back,
    intensity: 0.15,
  },
  {
    label: "Live Appointment",
    colors: [SHADOW_VIOLET, "#B088FF", "#EDE4FF"],
    colorBack: COSMIC.back,
    intensity: 0.17,
  },
  {
    label: "Billing Agent",
    colors: [SHADOW_DEEP, "#3AD4E8", RIM_ICE],
    colorBack: COSMIC.back,
    intensity: 0.16,
  },
  {
    label: "Refill Agent",
    colors: [SHADOW_DEEP, "#F06AD4", "#FFD8F5"],
    colorBack: COSMIC.back,
    intensity: 0.15,
  },
] as const;

export const HERO_DIAL_ORB_COUNT = HERO_DIAL_ORBS.length;

export const HERO_DIAL_ORB_SHADER = {
  shape: "sphere" as const,
  softness: 0.52,
  intensity: 0.13,
  noise: 0,
  fit: "cover" as const,
  scale: 1.28,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  worldWidth: 0,
  worldHeight: 0,
  speed: 0,
} as const;

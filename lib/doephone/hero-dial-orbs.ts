import { DOE_HOME_HERO_FOREST_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const FOREST = DOE_HOME_HERO_FOREST_PALETTE;

/** Jungle-depth shadows — orbs sit in the understory, not on top of it. */
const SHADOW_JUNGLE = "#081E18";
const SHADOW_DEEP = "#051410";

/** Phosphor rims — pale mint highlights in the dark. */
const RIM_MINT = "#D8FFE8";
const RIM_GLOW = "#B8FFD8";

export type HeroDialOrbScheme = {
  label: string;
  colors: readonly [string, string, string];
  colorBack: string;
  /** Grain intensity — slight per-orb lift for separation on the dial. */
  intensity?: number;
};

/**
 * Bioluminescent forest agent nodes — neon lime / teal / phosphor on deep jungle.
 * Ordered bright ↔ deep around the ring so neighbors never share the same hue.
 */
export const HERO_DIAL_ORBS: readonly HeroDialOrbScheme[] = [
  {
    label: "Inbox Agent",
    colors: [SHADOW_JUNGLE, "#5AFFA8", RIM_MINT],
    colorBack: FOREST.back,
    intensity: 0.16,
  },
  {
    label: "Scheduling Agent",
    colors: [SHADOW_DEEP, "#2EE8C0", RIM_GLOW],
    colorBack: FOREST.back,
    intensity: 0.15,
  },
  {
    label: "Labs Agent",
    colors: [SHADOW_JUNGLE, "#A8FF60", "#EEFFD8"],
    colorBack: FOREST.back,
    intensity: 0.17,
  },
  {
    label: "Referrals Agent",
    colors: [SHADOW_DEEP, "#3AD8A0", "#D0FAE8"],
    colorBack: FOREST.back,
    intensity: 0.15,
  },
  {
    label: "Live Appointment",
    colors: [SHADOW_JUNGLE, "#68FF88", RIM_MINT],
    colorBack: FOREST.back,
    intensity: 0.17,
  },
  {
    label: "Billing Agent",
    colors: [SHADOW_DEEP, "#28C898", "#C8F5E8"],
    colorBack: FOREST.back,
    intensity: 0.16,
  },
  {
    label: "Refill Agent",
    colors: [SHADOW_DEEP, "#40E8B0", RIM_GLOW],
    colorBack: FOREST.back,
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

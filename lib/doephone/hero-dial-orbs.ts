import { DOE_HOME_HERO_REEF_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const REEF = DOE_HOME_HERO_REEF_PALETTE;

/** Reef-depth shadows — orbs sit in the water column, not on top of it. */
const SHADOW_REEF = "#043038";
const SHADOW_DEEP = "#052428";

/** Sunlit rims — warm foam and seafoam highlights. */
const RIM_FOAM = "#FFE8E0";
const RIM_SEAFOAM = "#D8FFF5";

export type HeroDialOrbScheme = {
  label: string;
  colors: readonly [string, string, string];
  colorBack: string;
  /** Grain intensity — slight per-orb lift for separation on the dial. */
  intensity?: number;
};

/**
 * Tropical reef agent nodes — coral / turquoise / anemone gold on deep teal.
 * Ordered bright ↔ deep around the ring so neighbors never share the same hue.
 */
export const HERO_DIAL_ORBS: readonly HeroDialOrbScheme[] = [
  {
    label: "Inbox Agent",
    colors: [SHADOW_REEF, "#FF8366", RIM_FOAM],
    colorBack: REEF.back,
    intensity: 0.16,
  },
  {
    label: "Scheduling Agent",
    colors: [SHADOW_DEEP, "#5EEDC8", RIM_SEAFOAM],
    colorBack: REEF.back,
    intensity: 0.15,
  },
  {
    label: "Labs Agent",
    colors: [SHADOW_REEF, "#FFC857", "#FFF4D8"],
    colorBack: REEF.back,
    intensity: 0.17,
  },
  {
    label: "Referrals Agent",
    colors: [SHADOW_DEEP, "#3DD6C4", "#D0FAF4"],
    colorBack: REEF.back,
    intensity: 0.15,
  },
  {
    label: "Live Appointment",
    colors: [SHADOW_REEF, "#FF9F6B", "#FFECD8"],
    colorBack: REEF.back,
    intensity: 0.17,
  },
  {
    label: "Billing Agent",
    colors: [SHADOW_DEEP, "#E85D4A", "#FFDED8"],
    colorBack: REEF.back,
    intensity: 0.16,
  },
  {
    label: "Refill Agent",
    colors: [SHADOW_DEEP, "#2ABFB4", "#C8F5F0"],
    colorBack: REEF.back,
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

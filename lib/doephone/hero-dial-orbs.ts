import { DOE_HOME_HERO_BLOSSOM_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const BLOSSOM = DOE_HOME_HERO_BLOSSOM_PALETTE;

/** Plum-depth shadows — orbs sit in twilight, not on top of it. */
const SHADOW_PLUM = "#241018";
const SHADOW_DEEP = "#1A0810";

/** Petal rims — soft blush highlights against the dark. */
const RIM_BLUSH = "#FFE8F2";
const RIM_PETAL = "#FFD8EC";

export type HeroDialOrbScheme = {
  label: string;
  colors: readonly [string, string, string];
  colorBack: string;
  /** Grain intensity — slight per-orb lift for separation on the dial. */
  intensity?: number;
};

/**
 * Cherry blossom agent nodes — sakura / blush / rose petal on deep plum.
 * Ordered bright ↔ deep around the ring so neighbors never share the same hue.
 */
export const HERO_DIAL_ORBS: readonly HeroDialOrbScheme[] = [
  {
    label: "Inbox Agent",
    colors: [SHADOW_PLUM, "#FF9EC8", "#FFE8F4"],
    colorBack: BLOSSOM.back,
    intensity: 0.16,
  },
  {
    label: "Scheduling Agent",
    colors: [SHADOW_DEEP, "#F078A8", "#FFD8E8"],
    colorBack: BLOSSOM.back,
    intensity: 0.15,
  },
  {
    label: "Labs Agent",
    colors: [SHADOW_PLUM, "#FFB8D8", "#FFF0F8"],
    colorBack: BLOSSOM.back,
    intensity: 0.17,
  },
  {
    label: "Referrals Agent",
    colors: [SHADOW_DEEP, "#E888B0", "#FFDCE8"],
    colorBack: BLOSSOM.back,
    intensity: 0.15,
  },
  {
    label: "Live Appointment",
    colors: [SHADOW_PLUM, "#FFA0C8", RIM_BLUSH],
    colorBack: BLOSSOM.back,
    intensity: 0.17,
  },
  {
    label: "Billing Agent",
    colors: [SHADOW_DEEP, "#D87098", "#FFD0E0"],
    colorBack: BLOSSOM.back,
    intensity: 0.16,
  },
  {
    label: "Refill Agent",
    colors: [SHADOW_DEEP, "#FF88B8", RIM_PETAL],
    colorBack: BLOSSOM.back,
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

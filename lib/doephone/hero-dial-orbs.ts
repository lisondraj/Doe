import { DOE_HOME_ORANGE_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const BRAND = DOE_HOME_ORANGE_PALETTE;

/** Shared rim lights — ties every sphere to hero sand / pill chrome. */
const RIM_CREAM = "#F2E6D0";
const RIM_PEACH = "#E8D8B8";

/** Teal-tinted shadows — orbs sit in hero depth, not on top of it. */
const SHADOW_TEAL = "#2A4848";
const SHADOW_DEEP = "#243C3C";

export type HeroDialOrbScheme = {
  label: string;
  colors: readonly [string, string, string];
  colorBack: string;
  /** Grain intensity — slight per-orb lift for separation on the dial. */
  intensity?: number;
};

/**
 * Care-coordination ember nodes — brand gold / orange / copper / rose on teal.
 * Ordered bright ↔ deep around the ring so neighbors never share the same temperature.
 */
export const HERO_DIAL_ORBS: readonly HeroDialOrbScheme[] = [
  {
    label: "Inbox Agent",
    colors: ["#A88028", BRAND.gold, "#FFF0B8"],
    colorBack: BRAND.back,
    intensity: 0.15,
  },
  {
    label: "Scheduling Agent",
    colors: ["#288878", "#50C8A8", "#C8FFF0"],
    colorBack: BRAND.back,
    intensity: 0.13,
  },
  {
    label: "Labs Agent",
    colors: ["#1870C8", "#48A8F8", "#C8ECFF"],
    colorBack: BRAND.back,
    intensity: 0.16,
  },
  {
    label: "Referrals Agent",
    colors: ["#7858A0", "#C090D8", "#F2D8FF"],
    colorBack: BRAND.back,
    intensity: 0.12,
  },
  {
    label: "Live Appointment",
    colors: ["#A84858", "#F09888", "#FFD8D8"],
    colorBack: BRAND.back,
    intensity: 0.15,
  },
  {
    label: "Billing Agent",
    colors: ["#3070A8", "#78B0E8", "#D8EEFF"],
    colorBack: BRAND.back,
    intensity: 0.13,
  },
  {
    label: "Refill Agent",
    colors: ["#A83098", "#E860D0", "#FFD8F8"],
    colorBack: BRAND.back,
    intensity: 0.14,
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

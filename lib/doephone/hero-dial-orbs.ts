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
    colors: [SHADOW_TEAL, "#EAC858", RIM_CREAM],
    colorBack: BRAND.back,
    intensity: 0.15,
  },
  {
    label: "Scheduling Agent",
    colors: [SHADOW_DEEP, "#E89060", "#F2E4CC"],
    colorBack: BRAND.back,
    intensity: 0.14,
  },
  {
    label: "Labs Agent",
    colors: [SHADOW_TEAL, BRAND.gold, RIM_CREAM],
    colorBack: BRAND.back,
    intensity: 0.16,
  },
  {
    label: "Referrals Agent",
    colors: [SHADOW_DEEP, "#D99864", "#F5E6D4"],
    colorBack: BRAND.back,
    intensity: 0.14,
  },
  {
    label: "Live Appointment",
    colors: [SHADOW_TEAL, "#E4AD5C", "#FCF0E4"],
    colorBack: BRAND.back,
    intensity: 0.16,
  },
  {
    label: "Billing Agent",
    colors: [SHADOW_DEEP, "#D68662", "#F5DDD4"],
    colorBack: BRAND.back,
    intensity: 0.15,
  },
  {
    label: "Refill Agent",
    colors: [SHADOW_DEEP, "#DE7850", "#F8E8DC"],
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

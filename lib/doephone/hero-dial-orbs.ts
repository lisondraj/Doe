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
    colors: ["#9A7830", BRAND.gold, "#F6E4B0"],
    colorBack: BRAND.back,
    intensity: 0.15,
  },
  {
    label: "Scheduling Agent",
    colors: ["#9A6838", BRAND.copper, "#F2D8B0"],
    colorBack: BRAND.back,
    intensity: 0.13,
  },
  {
    label: "Labs Agent",
    colors: ["#943E28", BRAND.orange, "#F0B898"],
    colorBack: BRAND.back,
    intensity: 0.16,
  },
  {
    label: "Referrals Agent",
    colors: ["#884838", BRAND.rose, "#E8C0A8"],
    colorBack: BRAND.back,
    intensity: 0.12,
  },
  {
    label: "Live Appointment",
    colors: ["#687888", "#88A8C8", "#C0D4E8"],
    colorBack: BRAND.back,
    intensity: 0.15,
  },
  {
    label: "Billing Agent",
    colors: ["#786878", "#C0A0B0", "#E4CCD4"],
    colorBack: BRAND.back,
    intensity: 0.13,
  },
  {
    label: "Refill Agent",
    colors: ["#588878", "#78B8A8", "#B8E4D4"],
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

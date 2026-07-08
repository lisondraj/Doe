import { DOE_HOME_HERO_SAPPHIRE_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const SAPPHIRE = DOE_HOME_HERO_SAPPHIRE_PALETTE;

/** Abyss-depth shadows — orbs sit in the trench, not on top of it. */
const SHADOW_ABYSS = "#0A1028";
const SHADOW_DEEP = "#060610";

/** Phosphor rims — pale blue highlights against the void. */
const RIM_SKY = "#D8E8FF";
const RIM_VIOLET = "#E0D8FF";

export type HeroDialOrbScheme = {
  label: string;
  colors: readonly [string, string, string];
  colorBack: string;
  /** Grain intensity — slight per-orb lift for separation on the dial. */
  intensity?: number;
};

/**
 * Midnight sapphire agent nodes — electric blue / violet / phosphor on deep navy.
 * Ordered bright ↔ deep around the ring so neighbors never share the same hue.
 */
export const HERO_DIAL_ORBS: readonly HeroDialOrbScheme[] = [
  {
    label: "Inbox Agent",
    colors: [SHADOW_ABYSS, "#5A88FF", RIM_SKY],
    colorBack: SAPPHIRE.back,
    intensity: 0.16,
  },
  {
    label: "Scheduling Agent",
    colors: [SHADOW_DEEP, "#7860E8", RIM_VIOLET],
    colorBack: SAPPHIRE.back,
    intensity: 0.15,
  },
  {
    label: "Labs Agent",
    colors: [SHADOW_ABYSS, "#68D0FF", "#D8F4FF"],
    colorBack: SAPPHIRE.back,
    intensity: 0.17,
  },
  {
    label: "Referrals Agent",
    colors: [SHADOW_DEEP, "#4880F0", "#D8E4FF"],
    colorBack: SAPPHIRE.back,
    intensity: 0.15,
  },
  {
    label: "Live Appointment",
    colors: [SHADOW_ABYSS, "#8098FF", "#E8EEFF"],
    colorBack: SAPPHIRE.back,
    intensity: 0.17,
  },
  {
    label: "Billing Agent",
    colors: [SHADOW_DEEP, "#5A48D8", RIM_VIOLET],
    colorBack: SAPPHIRE.back,
    intensity: 0.16,
  },
  {
    label: "Refill Agent",
    colors: [SHADOW_DEEP, "#58B8FF", RIM_SKY],
    colorBack: SAPPHIRE.back,
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

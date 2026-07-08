import { DOE_HOME_HERO_GLACIER_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const GLACIER = DOE_HOME_HERO_GLACIER_PALETTE;

/** Slate-depth shadows — orbs sit in the ice field, not on top of it. */
const SHADOW_SLATE = "#101E2C";
const SHADOW_DEEP = "#0A1420";

/** Frost rims — pale ice highlights against the abyss. */
const RIM_FROST = "#E8F4FC";
const RIM_ICE = "#D0ECFF";

export type HeroDialOrbScheme = {
  label: string;
  colors: readonly [string, string, string];
  colorBack: string;
  /** Grain intensity — slight per-orb lift for separation on the dial. */
  intensity?: number;
};

/**
 * Arctic glacier agent nodes — ice / steel / frost mint on deep slate.
 * Ordered bright ↔ deep around the ring so neighbors never share the same hue.
 */
export const HERO_DIAL_ORBS: readonly HeroDialOrbScheme[] = [
  {
    label: "Inbox Agent",
    colors: [SHADOW_SLATE, "#8CD4FF", RIM_FROST],
    colorBack: GLACIER.back,
    intensity: 0.16,
  },
  {
    label: "Scheduling Agent",
    colors: [SHADOW_DEEP, "#6BA8D8", RIM_ICE],
    colorBack: GLACIER.back,
    intensity: 0.15,
  },
  {
    label: "Labs Agent",
    colors: [SHADOW_SLATE, "#A0E8F0", "#E4FAFC"],
    colorBack: GLACIER.back,
    intensity: 0.17,
  },
  {
    label: "Referrals Agent",
    colors: [SHADOW_DEEP, "#B8E0FF", "#F0F8FF"],
    colorBack: GLACIER.back,
    intensity: 0.15,
  },
  {
    label: "Live Appointment",
    colors: [SHADOW_SLATE, "#58C8E8", "#D4F4FC"],
    colorBack: GLACIER.back,
    intensity: 0.17,
  },
  {
    label: "Billing Agent",
    colors: [SHADOW_DEEP, "#88B8D8", "#E4F0F8"],
    colorBack: GLACIER.back,
    intensity: 0.16,
  },
  {
    label: "Refill Agent",
    colors: [SHADOW_DEEP, "#4AACD8", "#C8E8F8"],
    colorBack: GLACIER.back,
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

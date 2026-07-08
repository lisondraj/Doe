import { DOE_HOME_HERO_DUSK_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const DUSK = DOE_HOME_HERO_DUSK_PALETTE;

/** Umber-depth shadows — orbs sit in the canyon, not on top of it. */
const SHADOW_UMBER = "#24180C";
const SHADOW_DEEP = "#1A1008";

/** Sand rims — warm dust highlights against the dark. */
const RIM_SAND = "#F5E6D0";
const RIM_BLUSH = "#F8E0D4";

export type HeroDialOrbScheme = {
  label: string;
  colors: readonly [string, string, string];
  colorBack: string;
  /** Grain intensity — slight per-orb lift for separation on the dial. */
  intensity?: number;
};

/**
 * Desert dusk agent nodes — terracotta / sand gold / dusty peach on deep umber.
 * Ordered bright ↔ deep around the ring so neighbors never share the same hue.
 */
export const HERO_DIAL_ORBS: readonly HeroDialOrbScheme[] = [
  {
    label: "Inbox Agent",
    colors: [SHADOW_UMBER, "#E8A878", "#F8ECD8"],
    colorBack: DUSK.back,
    intensity: 0.16,
  },
  {
    label: "Scheduling Agent",
    colors: [SHADOW_DEEP, "#C46848", "#F0D8CC"],
    colorBack: DUSK.back,
    intensity: 0.15,
  },
  {
    label: "Labs Agent",
    colors: [SHADOW_UMBER, "#D4A858", "#F5EBD0"],
    colorBack: DUSK.back,
    intensity: 0.17,
  },
  {
    label: "Referrals Agent",
    colors: [SHADOW_DEEP, "#D08068", "#F5DDD4"],
    colorBack: DUSK.back,
    intensity: 0.15,
  },
  {
    label: "Live Appointment",
    colors: [SHADOW_UMBER, "#E0B060", "#FAF0D8"],
    colorBack: DUSK.back,
    intensity: 0.17,
  },
  {
    label: "Billing Agent",
    colors: [SHADOW_DEEP, "#B85C40", "#EDD4C8"],
    colorBack: DUSK.back,
    intensity: 0.16,
  },
  {
    label: "Refill Agent",
    colors: [SHADOW_DEEP, "#C87850", "#F0E0D0"],
    colorBack: DUSK.back,
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

/** Beige-band carousel — zoom past umber rim, soften edge, match sand backdrop. */
export const HERO_DIAL_ORB_CAROUSEL_SHADER = {
  ...HERO_DIAL_ORB_SHADER,
  scale: 1.5,
  softness: 0.62,
} as const;

export const HERO_DIAL_ORB_CAROUSEL_COLOR_BACK = RIM_SAND;

/** Drop umber shadow stop so the sphere edge stays warm on sand, not black. */
export function heroDialOrbCarouselScheme(scheme: HeroDialOrbScheme): HeroDialOrbScheme {
  const [, mid, light] = scheme.colors;
  return {
    ...scheme,
    colorBack: HERO_DIAL_ORB_CAROUSEL_COLOR_BACK,
    colors: [mid, mid, light],
  };
}

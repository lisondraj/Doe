import {
  HERO_DIAL_ORBS,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";

const BACK = "#1A1208";
const SHADOW = "#24180C";
const SHADOW_DEEP = "#151008";

/**
 * /doehealth hero dial orbs — gold / amber spheres aligned to page chrome
 * (mail button, titles, brown-band accents) instead of terracotta dusk mids.
 */
export const DOEHEALTH_HERO_DIAL_ORBS: readonly HeroDialOrbScheme[] = [
  {
    label: HERO_DIAL_ORBS[0].label,
    colors: [SHADOW, "#D4A574", "#F5EBD0"],
    colorBack: BACK,
    intensity: 0.16,
  },
  {
    label: HERO_DIAL_ORBS[1].label,
    colors: [SHADOW_DEEP, "#B8845C", "#EFE0CC"],
    colorBack: BACK,
    intensity: 0.15,
  },
  {
    label: HERO_DIAL_ORBS[2].label,
    colors: [SHADOW, "#E8C08E", "#FAF0D8"],
    colorBack: BACK,
    intensity: 0.17,
  },
  {
    label: HERO_DIAL_ORBS[3].label,
    colors: [SHADOW_DEEP, "#C9985C", "#F2E4C8"],
    colorBack: BACK,
    intensity: 0.15,
  },
  {
    label: HERO_DIAL_ORBS[4].label,
    colors: [SHADOW, "#E0B060", "#F8ECD4"],
    colorBack: BACK,
    intensity: 0.17,
  },
  {
    label: HERO_DIAL_ORBS[5].label,
    colors: [SHADOW_DEEP, "#A87448", "#E8D8C0"],
    colorBack: BACK,
    intensity: 0.16,
  },
  {
    label: HERO_DIAL_ORBS[6].label,
    colors: [SHADOW_DEEP, "#CBA06A", "#F0E2C8"],
    colorBack: BACK,
    intensity: 0.15,
  },
] as const;

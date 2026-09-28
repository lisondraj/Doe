import type { HeroDialOrbScheme } from "@/lib/doephone/hero-dial-orbs";

const BACK = "#1A1208";
const SHADOW = "#24180C";
const SHADOW_DEEP = "#151008";

/** Focused hero pill copy — one personalized model per orb on /doehealth. */
export const DOEHEALTH_HERO_DIAL_ORB_LABELS = [
  "Dr. Chen's Model",
  "Dr. Jones' Model",
  "Dr. Patel's Model",
  "Dr. Williams' Model",
  "Dr. Garcia's Model",
  "Dr. Kim's Model",
  "Dr. Rivera's Model",
] as const;

/**
 * /doehealth hero dial orbs — gold / amber spheres aligned to page chrome
 * (mail button, titles, brown-band accents) instead of terracotta dusk mids.
 */
export const DOEHEALTH_HERO_DIAL_ORBS: readonly HeroDialOrbScheme[] = [
  {
    label: DOEHEALTH_HERO_DIAL_ORB_LABELS[0],
    colors: [SHADOW, "#D4A574", "#F5EBD0"],
    colorBack: BACK,
    intensity: 0.16,
  },
  {
    label: DOEHEALTH_HERO_DIAL_ORB_LABELS[1],
    colors: [SHADOW_DEEP, "#B8845C", "#EFE0CC"],
    colorBack: BACK,
    intensity: 0.15,
  },
  {
    label: DOEHEALTH_HERO_DIAL_ORB_LABELS[2],
    colors: [SHADOW, "#E8C08E", "#FAF0D8"],
    colorBack: BACK,
    intensity: 0.17,
  },
  {
    label: DOEHEALTH_HERO_DIAL_ORB_LABELS[3],
    colors: [SHADOW_DEEP, "#C9985C", "#F2E4C8"],
    colorBack: BACK,
    intensity: 0.15,
  },
  {
    label: DOEHEALTH_HERO_DIAL_ORB_LABELS[4],
    colors: [SHADOW, "#E0B060", "#F8ECD4"],
    colorBack: BACK,
    intensity: 0.17,
  },
  {
    label: DOEHEALTH_HERO_DIAL_ORB_LABELS[5],
    colors: [SHADOW_DEEP, "#A87448", "#E8D8C0"],
    colorBack: BACK,
    intensity: 0.16,
  },
  {
    label: DOEHEALTH_HERO_DIAL_ORB_LABELS[6],
    colors: [SHADOW_DEEP, "#CBA06A", "#F0E2C8"],
    colorBack: BACK,
    intensity: 0.15,
  },
] as const;

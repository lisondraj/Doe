import { INTRODUCING_FABRIC_PATH } from "@/lib/blog/introducing-fabric-article";
import { INTRODUCING_PULSE_PATH } from "@/lib/blog/introducing-pulse-article";
import { DOEHEALTH_HERO_HEADLINE_ENTRIES } from "@/lib/doehealth/doehealth-hero-carousel";

/** Hero headline copy for the doehealth.care landing (/doehealth). */
export const DOEHEALTH_HERO_HEADLINE = {
  line1: "Design your own",
  line2: "clinical intelligence.",
  className: "doehealth-hero-headline",
  readMorePrefix: "Introducing",
  readMoreLinks: [
    { label: "Pulse", href: INTRODUCING_PULSE_PATH },
    { label: "Fabric", href: INTRODUCING_FABRIC_PATH },
  ],
  /** Rotates through the founder's memo, Float, and safe-deployment titles alongside this one. */
  entries: DOEHEALTH_HERO_HEADLINE_ENTRIES,
} as const;

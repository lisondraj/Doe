import { INTRODUCING_CANVAS_PATH } from "@/lib/blog/introducing-canvas-article";
import { INTRODUCING_PULSE_PATH } from "@/lib/blog/introducing-pulse-article";

/** Hero headline copy for the doehealth.care landing (/doehealth). */
export const DOEHEALTH_HERO_HEADLINE = {
  line1: "The future of",
  line2: "healthcare is here.",
  className: "doehealth-hero-headline",
  readMorePrefix: "Introducing",
  readMoreLinks: [
    { label: "Pulse", href: INTRODUCING_PULSE_PATH },
    { label: "Canvas", href: INTRODUCING_CANVAS_PATH },
  ],
} as const;

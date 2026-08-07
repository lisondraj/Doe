import { BROADER_DOE_VISION_PATH } from "@/lib/blog/broader-doe-vision-article";
import { INTRODUCING_FABRIC_PATH } from "@/lib/blog/introducing-fabric-article";
import { INTRODUCING_FLOAT_PATH } from "@/lib/blog/introducing-float-article";
import { INTRODUCING_GENOME_PATH } from "@/lib/blog/introducing-genome-article";
import { INTRODUCING_PULSE_PATH } from "@/lib/blog/introducing-pulse-article";
import { INTELLIGENCE_FOR_EVERY_CLINIC_PATH } from "@/lib/blog/intelligence-for-every-clinic-article";

export type DoeHomeHeroHeadlineEntry = {
  line1: string;
  line2?: string;
  /** Extra headline class — e.g. single-line product intro sizing. */
  headlineClassName?: string;
  readMorePrefix?: string;
  readMoreLinks: readonly { label: string; href: string }[];
};

/** Dwell time per hero headline entry — long enough to read a two-line title plus a link. */
export const DOEHEALTH_HERO_HEADLINE_ROTATE_MS = 9_000;

/** Crossfade duration — keep in sync with `.doehealth-hero-copy-carousel` CSS. */
export const DOEHEALTH_HERO_HEADLINE_CROSSFADE_MS = 550;

/** /doehealth hero — rotates the title + "introducing" style link beneath it. */
export const DOEHEALTH_HERO_HEADLINE_ENTRIES: readonly DoeHomeHeroHeadlineEntry[] = [
  {
    line1: "Design your",
    line2: "clinical intelligence",
    readMorePrefix: "Introducing",
    readMoreLinks: [
      { label: "Pulse", href: INTRODUCING_PULSE_PATH },
      { label: "Fabric", href: INTRODUCING_FABRIC_PATH },
    ],
  },
  {
    line1: "Read the",
    line2: "Founder's Memo",
    readMoreLinks: [{ label: "The Broader Doe Vision", href: BROADER_DOE_VISION_PATH }],
  },
  {
    line1: "Introducing Float",
    headlineClassName: "doehealth-hero-headline--single-line",
    readMoreLinks: [{ label: "Read more", href: INTRODUCING_FLOAT_PATH }],
  },
  {
    line1: "Blended Intelligence",
    headlineClassName: "doehealth-hero-headline--single-line",
    readMoreLinks: [{ label: "Read our proposal", href: INTELLIGENCE_FOR_EVERY_CLINIC_PATH }],
  },
  {
    line1: "Introducing Genome",
    headlineClassName: "doehealth-hero-headline--single-line",
    readMoreLinks: [{ label: "Read more", href: INTRODUCING_GENOME_PATH }],
  },
] as const satisfies readonly DoeHomeHeroHeadlineEntry[];

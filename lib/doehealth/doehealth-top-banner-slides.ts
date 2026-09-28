import { INTRODUCING_GENOME_PATH } from "@/lib/blog/introducing-genome-article";

export type DoeHealthTopBannerSlide = {
  message: string;
  linkLabel: string;
  linkHref: string;
};

export const DOEHEALTH_TOP_BANNER_ROTATE_MS = 10_000;

/** Crossfade duration — keep in sync with `.doehealth-top-banner--carousel` CSS. */
export const DOEHEALTH_TOP_BANNER_CROSSFADE_MS = 480;

/** /doehealth home — single static strip message (no rotation). */
export const DOEHEALTH_TOP_BANNER_SLIDES = [
  {
    message: "Personalized Intelligence for Every Clinic",
    linkLabel: "Genome",
    linkHref: INTRODUCING_GENOME_PATH,
  },
] as const satisfies readonly DoeHealthTopBannerSlide[];

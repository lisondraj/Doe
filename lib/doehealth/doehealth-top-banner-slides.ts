import { INTRODUCING_FABRIC_PATH } from "@/lib/blog/introducing-fabric-article";
import { INTRODUCING_GENOME_PATH } from "@/lib/blog/introducing-genome-article";
import { INTRODUCING_PULSE_PATH } from "@/lib/blog/introducing-pulse-article";

export type DoeHealthTopBannerSlide = {
  message: string;
  linkLabel: string;
  linkHref: string;
};

export const DOEHEALTH_TOP_BANNER_ROTATE_MS = 10_000;

/** Crossfade duration — keep in sync with `.doehealth-top-banner--carousel` CSS. */
export const DOEHEALTH_TOP_BANNER_CROSSFADE_MS = 480;

export const DOEHEALTH_TOP_BANNER_SLIDES = [
  {
    message: "Learn more about Doe's vision",
    linkLabel: "Read more",
    linkHref: "/about",
  },
  {
    message: "Personal intelligence for every clinic",
    linkLabel: "Genome",
    linkHref: INTRODUCING_GENOME_PATH,
  },
  {
    message: "Introducing Front-Desk Voice Agents",
    linkLabel: "Learn more",
    linkHref: INTRODUCING_PULSE_PATH,
  },
  {
    message: "Introducing Our Agentic Design Fabric",
    linkLabel: "Learn more",
    linkHref: INTRODUCING_FABRIC_PATH,
  },
] as const satisfies readonly DoeHealthTopBannerSlide[];

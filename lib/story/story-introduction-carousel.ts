import {
  STORY_CONTACT_EMAIL,
  STORY_CONTACT_LINKEDIN_HANDLE,
  STORY_CONTACT_LINKEDIN_URL,
  STORY_FUNDRAISE_AMOUNT,
  STORY_FUNDRAISE_INSTRUMENT,
  STORY_FUNDRAISE_ROUND,
  STORY_FUNDRAISE_RUNWAY_DURATION,
} from "@/lib/story/story-copy";
import { STORY_MEET_DOE_POSTERS } from "@/lib/story/story-shader-posters";

export type StoryIntroductionCarouselSlideLayout = "hero" | "stack" | "statement" | "contact";

export type StoryIntroductionCarouselSlide = {
  id: string;
  layout: StoryIntroductionCarouselSlideLayout;
  lines: readonly string[];
  posterSrc: string;
  ariaLabel: string;
  /** Contact slide only — parallel links for each line when provided. */
  links?: readonly string[];
};

export const STORY_INTRODUCTION_CAROUSEL_SLIDE_COUNT = 6;

/** Genome centered on load — slide 0 (Doe) peeks on the left. */
export const STORY_INTRODUCTION_CAROUSEL_INITIAL_SLIDE_INDEX = 1;

export const STORY_INTRODUCTION_CAROUSEL_SLIDES: readonly StoryIntroductionCarouselSlide[] = [
  {
    id: "doe",
    layout: "hero",
    lines: ["Doe"],
    posterSrc: STORY_MEET_DOE_POSTERS[0],
    ariaLabel: "Doe",
  },
  {
    id: "genome",
    layout: "hero",
    lines: ["Genome"],
    posterSrc: STORY_MEET_DOE_POSTERS[0],
    ariaLabel: "Genome",
  },
  {
    id: "products",
    layout: "stack",
    lines: ["Float", "Fabric", "Pulse"],
    posterSrc: STORY_MEET_DOE_POSTERS[2],
    ariaLabel: "Float, Fabric, and Pulse",
  },
  {
    id: "fundraising",
    layout: "statement",
    lines: [`${STORY_FUNDRAISE_ROUND} · $${STORY_FUNDRAISE_AMOUNT}`, `${STORY_FUNDRAISE_INSTRUMENT} · ${STORY_FUNDRAISE_RUNWAY_DURATION} runway`],
    posterSrc: STORY_MEET_DOE_POSTERS[1],
    ariaLabel: "Fundraising details",
  },
  {
    id: "architecture",
    layout: "statement",
    lines: ["Clinic-private compute", "Federated intelligence"],
    posterSrc: STORY_MEET_DOE_POSTERS[3],
    ariaLabel: "Technical architecture",
  },
  {
    id: "contact",
    layout: "contact",
    lines: [STORY_CONTACT_EMAIL, STORY_CONTACT_LINKEDIN_HANDLE],
    links: [`mailto:${STORY_CONTACT_EMAIL}`, STORY_CONTACT_LINKEDIN_URL],
    posterSrc: STORY_MEET_DOE_POSTERS[0],
    ariaLabel: "Contact",
  },
] as const;

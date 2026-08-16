export { STORY_DEFAULT_TAB, storyTabHeaderLabel } from "@/lib/story/story-nav";
export type { StoryTabId } from "@/lib/story/story-nav";

export const STORY_MEET_DOE_MODAL_TITLE = "Doe";

export const STORY_MEET_DOE_MODAL_STORAGE_KEY = "story-meet-doe-modal-dismissed-v3";

/** Dev toggle — always show on /story load; set false before shipping. */
export const STORY_MEET_DOE_MODAL_ALWAYS_SHOW = true;

export function storyMeetDoeModalShouldShow() {
  if (STORY_MEET_DOE_MODAL_ALWAYS_SHOW) return true;

  if (typeof window === "undefined") return false;

  try {
    return sessionStorage.getItem(STORY_MEET_DOE_MODAL_STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
}

export const STORY_MEET_DOE_MODAL_SLIDE_LINES: readonly (readonly string[])[] = [
  [STORY_MEET_DOE_MODAL_TITLE],
  ["We're bringing personalized", "intelligence to every clinic."],
  ["Genome", "Pulse", "Fabric", "Float"],
  ["Learn more", "about our story"],
] as const;

export const STORY_MEET_DOE_MODAL_SLIDE_COUNT = STORY_MEET_DOE_MODAL_SLIDE_LINES.length;

export const STORY_MEET_DOE_MODAL_BODY =
  "Welcome to our investor story — clinical intelligence built for the teams who deliver care.";

export const STORY_FUNDRAISE_ROUND = "Pre-Seed";

export const STORY_FUNDRAISE_AMOUNT = "1.5M";

export const STORY_FUNDRAISE_INSTRUMENT = "SAFE";

export const STORY_FUNDRAISE_RUNWAY_LABEL = "Runway";

export const STORY_FUNDRAISE_RUNWAY_DURATION = "18 months";

export const STORY_GOALS_AT_SEED_ARR_AMOUNT = "$200K";

export const STORY_GOALS_AT_SEED_ARR_META = "By Spring 2028";

export const STORY_GOALS_AT_SEED_ARR_LABEL = "Annualized Run Rate";

export const STORY_CONTACT_EMAIL = "james@doe.care";

export const STORY_CONTACT_LINKEDIN_HANDLE = "in/jameslisondra";

export const STORY_CONTACT_LINKEDIN_URL = "https://www.linkedin.com/in/jameslisondra";

export const STORY_INTRODUCTION_HEADLINE = "Meet Doe";

export const STORY_INTRODUCTION_BODY_LEAD =
  "This is our investor story deck. It introduces who we are, what we are building, and how we see the path ahead. We update it as the company evolves, so you always have our latest thinking in one place. You can contact ";

export const STORY_INTRODUCTION_BODY_TAIL =
  " at any time with questions or to go deeper on anything here.";

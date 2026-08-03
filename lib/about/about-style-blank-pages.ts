import { HIRING_PATH, PITCHDECK_PATH, WAITLIST_PATH } from "@/lib/site-domains";

/** About-style placeholder pages — nav, banner, footer; blank center stage. */
export const ABOUT_STYLE_BLANK_PAGE_PATHS = [WAITLIST_PATH, HIRING_PATH, PITCHDECK_PATH] as const;

export type AboutStyleBlankPagePath = (typeof ABOUT_STYLE_BLANK_PAGE_PATHS)[number];

export function isAboutStyleBlankPagePath(pathname: string): boolean {
  return (ABOUT_STYLE_BLANK_PAGE_PATHS as readonly string[]).includes(pathname);
}

export const ABOUT_STYLE_BLANK_PAGE_LABELS: Record<AboutStyleBlankPagePath, string> = {
  [WAITLIST_PATH]: "Waitlist",
  [HIRING_PATH]: "Hiring",
  [PITCHDECK_PATH]: "Pitch deck",
};

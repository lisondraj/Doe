import { INTRODUCING_CANVAS_PATH } from "@/lib/blog/introducing-canvas-article";
import { INTRODUCING_PULSE_PATH } from "@/lib/blog/introducing-pulse-article";
import { DOE_MISSION_PATH } from "@/lib/blog/doe-mission-article";
import { ABOUT_PATH } from "@/lib/site-domains";

/** Routes that share /about iPhone chrome, typography, and bootstrap behavior. */
export const ABOUT_STYLE_PAGE_PATHS = [
  ABOUT_PATH,
  DOE_MISSION_PATH,
  INTRODUCING_PULSE_PATH,
  INTRODUCING_CANVAS_PATH,
] as const;

export function isAboutStylePagePath(pathname: string): boolean {
  return (ABOUT_STYLE_PAGE_PATHS as readonly string[]).includes(pathname);
}

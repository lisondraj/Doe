import { ABOUT_STYLE_BLANK_PAGE_PATHS } from "@/lib/about/about-style-blank-pages";
import { BLOG_LANDING_PATH } from "@/lib/blog/blog-landing-posts";
import { INTRODUCING_FABRIC_PATH } from "@/lib/blog/introducing-fabric-article";
import { INTRODUCING_PULSE_PATH } from "@/lib/blog/introducing-pulse-article";
import { DOE_MISSION_PATH } from "@/lib/blog/doe-mission-article";
import { ABOUT_PATH } from "@/lib/site-domains";

/** Routes that share /about iPhone chrome, typography, and bootstrap behavior. */
export const ABOUT_STYLE_PAGE_PATHS = [
  ABOUT_PATH,
  BLOG_LANDING_PATH,
  DOE_MISSION_PATH,
  INTRODUCING_PULSE_PATH,
  INTRODUCING_FABRIC_PATH,
  ...ABOUT_STYLE_BLANK_PAGE_PATHS,
] as const;

export function isAboutStylePagePath(pathname: string): boolean {
  return (ABOUT_STYLE_PAGE_PATHS as readonly string[]).includes(pathname);
}

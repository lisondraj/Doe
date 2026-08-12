import { ABOUT_STYLE_BLANK_PAGE_PATHS } from "@/lib/about/about-style-blank-pages";
import { BLOG_LANDING_PATH } from "@/lib/blog/blog-landing-posts";
import { BLENDED_INTELLIGENCE_PATH } from "@/lib/blog/blended-intelligence-article";
import { INTRODUCING_FABRIC_PATH } from "@/lib/blog/introducing-fabric-article";
import { INTRODUCING_FLOAT_PATH } from "@/lib/blog/introducing-float-article";
import { INTRODUCING_GENOME_PATH } from "@/lib/blog/introducing-genome-article";
import { GENOME_IS_BUILT_FOR_YOU_PATH } from "@/lib/blog/genome-is-built-for-you-article";
import { INTELLIGENCE_FOR_EVERY_CLINIC_PATH } from "@/lib/blog/intelligence-for-every-clinic-article";
import { INTRODUCING_PULSE_PATH } from "@/lib/blog/introducing-pulse-article";
import { PULSE_AMBIENT_PATH } from "@/lib/blog/pulse-ambient-article";
import { PULSE_CALL_HISTORY_PATH } from "@/lib/blog/pulse-call-history-article";
import { DOE_MISSION_PATH } from "@/lib/blog/doe-mission-article";
import { ABOUT_PATH, JOIN_PATH, PARTNERS_PATH, PREMED_PATH } from "@/lib/site-domains";
import { resolvePremedAwarePath } from "@/lib/premed/premed-path";

/** Routes that share /about iPhone chrome, typography, and bootstrap behavior. */
export const ABOUT_STYLE_PAGE_PATHS = [
  ABOUT_PATH,
  JOIN_PATH,
  PARTNERS_PATH,
  PREMED_PATH,
  BLOG_LANDING_PATH,
  DOE_MISSION_PATH,
  INTRODUCING_PULSE_PATH,
  INTRODUCING_FABRIC_PATH,
  INTRODUCING_FLOAT_PATH,
  INTRODUCING_GENOME_PATH,
  BLENDED_INTELLIGENCE_PATH,
  GENOME_IS_BUILT_FOR_YOU_PATH,
  INTELLIGENCE_FOR_EVERY_CLINIC_PATH,
  PULSE_CALL_HISTORY_PATH,
  PULSE_AMBIENT_PATH,
  ...ABOUT_STYLE_BLANK_PAGE_PATHS,
] as const;

export function isAboutStylePagePath(pathname: string, host?: string): boolean {
  const resolved = resolvePremedAwarePath(pathname, host);
  return (ABOUT_STYLE_PAGE_PATHS as readonly string[]).includes(resolved);
}

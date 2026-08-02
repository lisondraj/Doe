import { BROADER_DOE_VISION_PATH } from "@/lib/blog/broader-doe-vision-article";
import { ABOUT_PATH } from "@/lib/site-domains";

/** Routes that share /about iPhone chrome, typography, and bootstrap behavior. */
export const ABOUT_STYLE_PAGE_PATHS = [ABOUT_PATH, BROADER_DOE_VISION_PATH] as const;

export function isAboutStylePagePath(pathname: string): boolean {
  return (ABOUT_STYLE_PAGE_PATHS as readonly string[]).includes(pathname);
}

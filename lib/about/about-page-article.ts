import { getBlogArticle } from "@/lib/blog/articles";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export const ABOUT_PAGE_ARTICLE_SLUG = "ambient-documentation-at-the-bedside";

export const ABOUT_PAGE_ARTICLE =
  getBlogArticle(ABOUT_PAGE_ARTICLE_SLUG) ??
  (() => {
    throw new Error("Missing about page article");
  })();

/** /about hero — same gradient + dot grid as desktop home section 2 (Agents panel). */
export const ABOUT_PAGE_HERO_BACKDROP: WorkflowCarouselDesignBackdrop =
  DOEPHONE_COMMUNICATION_SLIDES.find((slide) => slide.id === "agents")?.backdrop ??
  (() => {
    throw new Error("Missing agents communication slide backdrop");
  })();

/** Denser dot grid on /about hero (desktop + iPhone). */
export const ABOUT_PAGE_HERO_PATTERN_SCALE = 0.68;

/** @deprecated Use ABOUT_PAGE_HERO_BACKDROP */
export const ABOUT_DESKTOP_HERO_BACKDROP = ABOUT_PAGE_HERO_BACKDROP;

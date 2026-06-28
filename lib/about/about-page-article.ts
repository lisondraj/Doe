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

/** iPhone /about byline — shown between subheading and hero. */
export const ABOUT_PAGE_MOBILE_BYLINE = "By James & Matthew Lisondra";

export const ABOUT_PAGE_MOBILE_DATE = "June 28, 2026";

/** Desktop /about section two — shortened intro beside beige panel. */
export const ABOUT_DESKTOP_SECTION_2_INTRO =
  "Physicians in the United States and Canada entered medicine to care for people, not to spend their days inside payer portals, inbox queues, and after-hours charting. Administrative work now consumes a growing share of every clinic week, pulling clinicians away from patients on both sides of the border.";

/** Desktop /about section three — co-founder bios beside beige panel. */
export const ABOUT_DESKTOP_FOUNDERS_PARAGRAPHS = [
  "Brothers James and Matthew Lisondra co-founded Doe to pair clinical depth with technical execution in health tech.",
  "James holds an MD from the University of Ottawa with experience in clinical medicine and healthcare delivery. Matthew holds a PhD from the University of Toronto with backgrounds in physics, robotics, AI, and computer science.",
] as const;

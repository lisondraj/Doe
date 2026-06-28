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

function getAboutSectionTwoArticleBlocks() {
  const intro = ABOUT_PAGE_ARTICLE.body[0];
  const stats = ABOUT_PAGE_ARTICLE.body[1];
  const barChart = ABOUT_PAGE_ARTICLE.body[3];
  const pieChart = ABOUT_PAGE_ARTICLE.body[4];
  const quote = ABOUT_PAGE_ARTICLE.body.find((block) => block.type === "quote");

  if (
    intro?.type !== "p" ||
    stats?.type !== "ul" ||
    barChart?.type !== "bar-chart" ||
    pieChart?.type !== "pie-chart" ||
    quote?.type !== "quote"
  ) {
    throw new Error("About page section two article blocks are out of order");
  }

  return { intro, stats, barChart, pieChart, quote };
}

const aboutSectionTwoArticle = getAboutSectionTwoArticleBlocks();

/** /about section two — intro beside beige panel (from article body). */
export const ABOUT_DESKTOP_SECTION_2_INTRO = aboutSectionTwoArticle.intro.text;

/** /about section two — stat bullets before the clinic-hour pie chart (from article body). */
export const ABOUT_DESKTOP_SECTION_2_BULLETS = aboutSectionTwoArticle.stats.items;

/** /about section two — clinic-hour pie chart (from article body). */
export const ABOUT_SECTION_2_PIE_CHART = {
  title: aboutSectionTwoArticle.pieChart.title,
  caption: aboutSectionTwoArticle.pieChart.caption,
  citation: aboutSectionTwoArticle.pieChart.citation,
  slices: aboutSectionTwoArticle.pieChart.slices,
};

/** /about section two — weekly admin bar chart (from article body). */
export const ABOUT_SECTION_2_BAR_CHART = {
  title: aboutSectionTwoArticle.barChart.title,
  caption: aboutSectionTwoArticle.barChart.caption,
  citation: aboutSectionTwoArticle.barChart.citation,
  bars: aboutSectionTwoArticle.barChart.bars,
};

/** iPhone /about — shared caption under pie + bar charts. */
export const ABOUT_SECTION_2_CHARTS_CAPTION = `${aboutSectionTwoArticle.pieChart.caption} ${aboutSectionTwoArticle.barChart.caption}`;

export const ABOUT_SECTION_2_CHARTS_CITATION = aboutSectionTwoArticle.pieChart.citation;

/** iPhone /about — founders pull quote (from article body). */
export const ABOUT_MOBILE_FOUNDERS_QUOTE = {
  text: aboutSectionTwoArticle.quote.text,
  attribution: aboutSectionTwoArticle.quote.attribution,
};

/** iPhone /about — assistant headline above first beige panel / FAQ. */
export const ABOUT_MOBILE_ASSISTANT_HEADLINE_LINES = ["Personal assistant", "for every doctor."] as const;

/** iPhone /about — founders section headline below FAQ. */
export const ABOUT_MOBILE_FOUNDERS_HEADLINE_LINES = ["Two brothers.", "two fields"] as const;

/** Desktop /about section three — co-founder bios beside beige panel. */
export const ABOUT_DESKTOP_FOUNDERS_PARAGRAPHS = [
  "Brothers James and Matthew Lisondra co-founded Doe to pair clinical depth with technical execution in health tech.",
  "James holds an MD from the University of Ottawa with experience in clinical medicine and healthcare delivery. Matthew holds a PhD from the University of Toronto with backgrounds in physics, robotics, AI, and computer science.",
] as const;

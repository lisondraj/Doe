import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import { ArticlePieChart } from "@/components/blog/ArticlePieChart";
import {
  ABOUT_DESKTOP_CHART_CITATION_TW,
  ABOUT_DESKTOP_CHART_JOINT_CAPTION_TW,
  ABOUT_DESKTOP_PIE_CHART_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import {
  ABOUT_SECTION_2_BAR_CHART,
  ABOUT_SECTION_2_PIE_CHART,
} from "@/lib/about/about-page-article";

/** Desktop /about — clinic-hour pie beside the first beige panel. */
export function AboutDesktopStatCharts() {
  return (
    <div className="about-stat-charts shrink-0 space-y-6 md:space-y-7">
      <ArticlePieChart
        title={ABOUT_SECTION_2_PIE_CHART.title}
        slices={ABOUT_SECTION_2_PIE_CHART.slices}
        layout="desktop"
        embedded
        compact
        showCaption={false}
        showCitation={false}
        titleClassName={ABOUT_DESKTOP_PIE_CHART_TITLE_TW}
        theme="about"
      />

      <div>
        <p className={ABOUT_DESKTOP_CHART_JOINT_CAPTION_TW}>{ABOUT_SECTION_2_PIE_CHART.caption}</p>
        <p className={ABOUT_DESKTOP_CHART_CITATION_TW}>{ABOUT_SECTION_2_PIE_CHART.citation}</p>
      </div>
    </div>
  );
}

/** Desktop /about — weekly admin hours, placed under the TAM chart. */
export function AboutDesktopAdminHoursChart() {
  return (
    <div className="about-stat-charts shrink-0 space-y-4 md:space-y-5">
      <ArticleBarChart
        title={ABOUT_SECTION_2_BAR_CHART.title}
        bars={ABOUT_SECTION_2_BAR_CHART.bars}
        layout="desktop"
        embedded
        showCaption={false}
        showCitation={false}
        titleClassName={ABOUT_DESKTOP_PIE_CHART_TITLE_TW}
        theme="about"
      />

      <div>
        <p className={ABOUT_DESKTOP_CHART_JOINT_CAPTION_TW}>{ABOUT_SECTION_2_BAR_CHART.caption}</p>
        <p className={ABOUT_DESKTOP_CHART_CITATION_TW}>{ABOUT_SECTION_2_BAR_CHART.citation}</p>
      </div>
    </div>
  );
}

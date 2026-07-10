import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import { ArticlePieChart } from "@/components/blog/ArticlePieChart";
import {
  ABOUT_DESKTOP_CHART_CITATION_TW,
  ABOUT_DESKTOP_CHART_JOINT_CAPTION_TW,
  ABOUT_DESKTOP_PIE_CHART_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import {
  ABOUT_SECTION_2_BAR_CHART,
  ABOUT_SECTION_2_CHARTS_CAPTION,
  ABOUT_SECTION_2_CHARTS_CITATION,
  ABOUT_SECTION_2_PIE_CHART,
} from "@/lib/about/about-page-article";

/** Desktop /about — pie and bar charts with a shared caption block. */
export function AboutDesktopStatCharts() {
  return (
    <div className="about-stat-charts min-h-0">
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

      <div className="mt-6 md:mt-7">
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
      </div>

      <p className={ABOUT_DESKTOP_CHART_JOINT_CAPTION_TW}>{ABOUT_SECTION_2_CHARTS_CAPTION}</p>
      <p className={ABOUT_DESKTOP_CHART_CITATION_TW}>{ABOUT_SECTION_2_CHARTS_CITATION}</p>
    </div>
  );
}

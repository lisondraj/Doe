import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import { ArticlePieChart } from "@/components/blog/ArticlePieChart";
import {
  ABOUT_MOBILE_CHART_CITATION_TW,
  ABOUT_MOBILE_CHART_JOINT_CAPTION_TW,
  ABOUT_MOBILE_PIE_CHART_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import {
  ABOUT_SECTION_2_BAR_CHART,
  ABOUT_SECTION_2_CHARTS_CAPTION,
  ABOUT_SECTION_2_CHARTS_CITATION,
  ABOUT_SECTION_2_PIE_CHART,
} from "@/lib/about/about-page-article";

/** iPhone /about — pie and bar charts with a shared caption block. */
export function AboutMobileStatCharts() {
  return (
    <div>
      <ArticlePieChart
        title={ABOUT_SECTION_2_PIE_CHART.title}
        slices={ABOUT_SECTION_2_PIE_CHART.slices}
        layout="mobile"
        embedded
        showCaption={false}
        showCitation={false}
        titleClassName={ABOUT_MOBILE_PIE_CHART_TITLE_TW}
      />

      <div className="mt-8 iphone-page:mt-10">
        <ArticleBarChart
          title={ABOUT_SECTION_2_BAR_CHART.title}
          bars={ABOUT_SECTION_2_BAR_CHART.bars}
          layout="mobile"
          embedded
          showCaption={false}
          showCitation={false}
        />
      </div>

      <p className={ABOUT_MOBILE_CHART_JOINT_CAPTION_TW}>{ABOUT_SECTION_2_CHARTS_CAPTION}</p>
      <p className={ABOUT_MOBILE_CHART_CITATION_TW}>{ABOUT_SECTION_2_CHARTS_CITATION}</p>
    </div>
  );
}

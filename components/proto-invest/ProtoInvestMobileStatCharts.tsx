import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import { ArticlePieChart } from "@/components/blog/ArticlePieChart";
import {
  PROTO_INVEST_CHART_CAPTION_TW,
  PROTO_INVEST_CHART_CITATION_TW,
  PROTO_INVEST_CHART_TITLE_TW,
} from "@/lib/proto-invest/proto-invest-layout-styles";
import {
  ABOUT_SECTION_2_BAR_CHART,
  ABOUT_SECTION_2_CHARTS_CAPTION,
  ABOUT_SECTION_2_CHARTS_CITATION,
  ABOUT_SECTION_2_PIE_CHART,
} from "@/lib/about/about-page-article";

/** /proto-invest — pie and bar charts with shared caption (dark-theme CSS overrides). */
export function ProtoInvestMobileStatCharts() {
  return (
    <div className="proto-invest-chart-zone">
      <ArticlePieChart
        title={ABOUT_SECTION_2_PIE_CHART.title}
        slices={ABOUT_SECTION_2_PIE_CHART.slices}
        layout="mobile"
        embedded
        showCaption={false}
        showCitation={false}
        titleClassName={PROTO_INVEST_CHART_TITLE_TW}
        theme="dark"
      />

      <div className="mt-8 iphone-page:mt-10">
        <ArticleBarChart
          title={ABOUT_SECTION_2_BAR_CHART.title}
          bars={ABOUT_SECTION_2_BAR_CHART.bars}
          layout="mobile"
          embedded
          showCaption={false}
          showCitation={false}
          titleClassName={PROTO_INVEST_CHART_TITLE_TW}
          theme="dark"
        />
      </div>

      <p className={PROTO_INVEST_CHART_CAPTION_TW}>{ABOUT_SECTION_2_CHARTS_CAPTION}</p>
      <p className={PROTO_INVEST_CHART_CITATION_TW}>{ABOUT_SECTION_2_CHARTS_CITATION}</p>
    </div>
  );
}

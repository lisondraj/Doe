import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import { ArticlePieChart } from "@/components/blog/ArticlePieChart";
import {
  PROTO_INVEST_CHART_CAPTION_TW,
  PROTO_INVEST_CHART_CITATION_TW,
  PROTO_INVEST_CHART_TITLE_TW,
} from "@/lib/proto-invest/proto-invest-layout-styles";
import {
  PROTO_INVEST_BAR_CHART,
  PROTO_INVEST_CHARTS_CAPTION,
  PROTO_INVEST_CHARTS_CITATION,
  PROTO_INVEST_PIE_CHART,
} from "@/lib/proto-invest/proto-invest-content";

/** /proto-invest — pie and bar charts with shared caption (dark-theme CSS overrides). */
export function ProtoInvestMobileStatCharts() {
  return (
    <div className="proto-invest-chart-zone">
      <ArticlePieChart
        title={PROTO_INVEST_PIE_CHART.title}
        slices={PROTO_INVEST_PIE_CHART.slices}
        layout="mobile"
        embedded
        showCaption={false}
        showCitation={false}
        titleClassName={PROTO_INVEST_CHART_TITLE_TW}
        theme="proto"
      />

      <div className="mt-8 iphone-page:mt-10">
        <ArticleBarChart
          title={PROTO_INVEST_BAR_CHART.title}
          bars={PROTO_INVEST_BAR_CHART.bars}
          layout="mobile"
          embedded
          showCaption={false}
          showCitation={false}
          titleClassName={PROTO_INVEST_CHART_TITLE_TW}
          theme="proto"
        />
      </div>

      <p className={PROTO_INVEST_CHART_CAPTION_TW}>{PROTO_INVEST_CHARTS_CAPTION}</p>
      <p className={PROTO_INVEST_CHART_CITATION_TW}>{PROTO_INVEST_CHARTS_CITATION}</p>
    </div>
  );
}

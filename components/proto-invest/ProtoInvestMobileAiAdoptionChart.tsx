import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import {
  PROTO_INVEST_CHART_CAPTION_TW,
  PROTO_INVEST_CHART_CITATION_TW,
  PROTO_INVEST_CHART_TITLE_TW,
} from "@/lib/proto-invest/proto-invest-layout-styles";
import {
  PROTO_INVEST_AI_ADOPTION_CAPTION,
  PROTO_INVEST_AI_ADOPTION_CHART,
  PROTO_INVEST_AI_ADOPTION_CITATION,
} from "@/lib/proto-invest/proto-invest-content";

/** /proto-invest — AI adoption horizontal bars. */
export function ProtoInvestMobileAiAdoptionChart() {
  return (
    <div className="proto-invest-chart-zone mt-10 iphone-page:mt-12">
      <ArticleBarChart
        title={PROTO_INVEST_AI_ADOPTION_CHART.title}
        bars={PROTO_INVEST_AI_ADOPTION_CHART.bars}
        layout="mobile"
        embedded
        showCaption={false}
        showCitation={false}
        titleClassName={PROTO_INVEST_CHART_TITLE_TW}
        theme="proto"
      />

      <p className={PROTO_INVEST_CHART_CAPTION_TW}>{PROTO_INVEST_AI_ADOPTION_CAPTION}</p>
      <p className={PROTO_INVEST_CHART_CITATION_TW}>{PROTO_INVEST_AI_ADOPTION_CITATION}</p>
    </div>
  );
}

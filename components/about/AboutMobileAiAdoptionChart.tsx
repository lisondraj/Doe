import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import {
  ABOUT_MOBILE_CHART_CITATION_TW,
  ABOUT_MOBILE_CHART_JOINT_CAPTION_TW,
  ABOUT_MOBILE_PIE_CHART_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_MOBILE_AI_ADOPTION_CHART } from "@/lib/about/about-page-article";

/** iPhone /about — horizontal bars for AI adoption by clinical task (Canada + U.S.). */
export function AboutMobileAiAdoptionChart() {
  return (
    <div className="mt-10 iphone-page:mt-12">
      <ArticleBarChart
        title={ABOUT_MOBILE_AI_ADOPTION_CHART.title}
        bars={ABOUT_MOBILE_AI_ADOPTION_CHART.bars}
        layout="mobile"
        embedded
        showCaption={false}
        showCitation={false}
        titleClassName={ABOUT_MOBILE_PIE_CHART_TITLE_TW}
      />

      <p className={ABOUT_MOBILE_CHART_JOINT_CAPTION_TW}>{ABOUT_MOBILE_AI_ADOPTION_CHART.caption}</p>
      <p className={ABOUT_MOBILE_CHART_CITATION_TW}>{ABOUT_MOBILE_AI_ADOPTION_CHART.citation}</p>
    </div>
  );
}

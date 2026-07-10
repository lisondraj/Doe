import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import {
  ABOUT_DESKTOP_CHART_CITATION_TW,
  ABOUT_DESKTOP_CHART_JOINT_CAPTION_TW,
  ABOUT_DESKTOP_PIE_CHART_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_MOBILE_AI_ADOPTION_CHART } from "@/lib/about/about-page-article";

/** Desktop /about — AI adoption bars (Canada + U.S.). */
export function AboutDesktopAiAdoptionChart() {
  return (
    <div className="about-stat-charts min-h-0">
      <ArticleBarChart
        title={ABOUT_MOBILE_AI_ADOPTION_CHART.title}
        bars={ABOUT_MOBILE_AI_ADOPTION_CHART.bars}
        layout="desktop"
        embedded
        showCaption={false}
        showCitation={false}
        titleClassName={ABOUT_DESKTOP_PIE_CHART_TITLE_TW}
        theme="about"
      />

      <p className={ABOUT_DESKTOP_CHART_JOINT_CAPTION_TW}>{ABOUT_MOBILE_AI_ADOPTION_CHART.caption}</p>
      <p className={ABOUT_DESKTOP_CHART_CITATION_TW}>{ABOUT_MOBILE_AI_ADOPTION_CHART.citation}</p>
    </div>
  );
}

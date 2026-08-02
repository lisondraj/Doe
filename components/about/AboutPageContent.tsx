import { AboutMobileBeigePanel } from "@/components/about/AboutMobileBeigePanel";
import { AboutMobileFaqTabs } from "@/components/about/AboutMobileFaqTabs";
import { AboutMobileQuote } from "@/components/about/AboutMobileQuote";
import { AboutMobileStatCharts } from "@/components/about/AboutMobileStatCharts";
import { AboutMobileAiAdoptionChart } from "@/components/about/AboutMobileAiAdoptionChart";
import { AboutMobileTamChart } from "@/components/about/AboutMobileTamChart";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import {
  ABOUT_DESKTOP_SCROLL_BODY_TW,
  ABOUT_DESKTOP_SCROLL_HERO_BOX_TW,
  ABOUT_DESKTOP_SCROLL_SECTION_GAP,
  ABOUT_DESKTOP_SCROLL_SECTION_HEADLINE_TW,
  ABOUT_DESKTOP_DESCRIPTION_TW,
  ABOUT_DESKTOP_SCROLL_TITLE_TW,
  ABOUT_HERO_HEADLINE_WRAP,
  ABOUT_MOBILE_BODY_TW,
  ABOUT_MOBILE_CONTENT_GAP,
  ABOUT_MOBILE_SECTION_HEADLINE_TW,
  ABOUT_MOBILE_LIST_GAP,
  ABOUT_MOBILE_SECTION_GAP,
  ABOUT_PAGE_HERO_AFTER_BYLINE,
  ABOUT_PAGE_HERO_BEFORE_ARTICLE,
  ABOUT_PAGE_HERO_BOX_TW,
  ABOUT_PAGE_HERO_HEADLINE_PT,
  ABOUT_PAGE_MOBILE_BYLINE_GAP,
  ABOUT_PAGE_MOBILE_BYLINE_TW,
  ABOUT_PAGE_DESCRIPTION_TW,
  ABOUT_PAGE_SUBHEADING,
  ABOUT_PAGE_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import {
  ABOUT_DESKTOP_FOUNDERS_PARAGRAPHS,
  ABOUT_DESKTOP_SECTION_2_BULLETS,
  ABOUT_DESKTOP_SECTION_2_INTRO,
  ABOUT_MOBILE_ASSISTANT_HEADLINE_LINES,
  ABOUT_MOBILE_FOUNDERS_HEADLINE_LINES,
  ABOUT_MOBILE_FOUNDERS_QUOTE,
  ABOUT_PAGE_HERO_BACKDROP,
  ABOUT_PAGE_MOBILE_BYLINE,
  ABOUT_PAGE_MOBILE_DATE,
} from "@/lib/about/about-page-article";
import { ABOUT_IPHONE_SHADER_CHART_SECONDARY } from "@/lib/home/doe-page-colors";

type AboutPageContentProps = {
  layout?: "mobile" | "desktop";
};

/** Shared /about scroll sections — iPhone layout source of truth for mobile + desktop. */
export function AboutPageContent({ layout = "mobile" }: AboutPageContentProps) {
  const isDesktop = layout === "desktop";
  const [foundersOne, foundersTwo] = ABOUT_DESKTOP_FOUNDERS_PARAGRAPHS;

  const titleTw = isDesktop ? ABOUT_DESKTOP_SCROLL_TITLE_TW : ABOUT_PAGE_TITLE_TW;
  const descriptionTw = isDesktop ? ABOUT_DESKTOP_DESCRIPTION_TW : ABOUT_PAGE_DESCRIPTION_TW;
  const sectionHeadlineTw = isDesktop ? ABOUT_DESKTOP_SCROLL_SECTION_HEADLINE_TW : ABOUT_MOBILE_SECTION_HEADLINE_TW;
  const bodyTw = isDesktop ? ABOUT_DESKTOP_SCROLL_BODY_TW : ABOUT_MOBILE_BODY_TW;
  const sectionGap = isDesktop ? ABOUT_DESKTOP_SCROLL_SECTION_GAP : ABOUT_MOBILE_SECTION_GAP;
  const heroBoxTw = isDesktop ? ABOUT_DESKTOP_SCROLL_HERO_BOX_TW : ABOUT_PAGE_HERO_BOX_TW;

  return (
    <div className="about-page-content">
      <div className={`${ABOUT_HERO_HEADLINE_WRAP} ${ABOUT_PAGE_HERO_HEADLINE_PT}`}>
        <h1 className={titleTw}>
          <span className="block">Doe is on a mission</span>
          <span className="block">to redefine healthcare.</span>
        </h1>

        <p className={`${descriptionTw} max-w-[36ch]`}>{ABOUT_PAGE_SUBHEADING}</p>
      </div>

      <p className={`${ABOUT_PAGE_MOBILE_BYLINE_TW} ${ABOUT_PAGE_MOBILE_BYLINE_GAP}`}>
        {ABOUT_PAGE_MOBILE_BYLINE}
        <span className="mx-2" aria-hidden>
          ·
        </span>
        {ABOUT_PAGE_MOBILE_DATE}
      </p>

      <div className={`${ABOUT_PAGE_HERO_AFTER_BYLINE} ${ABOUT_PAGE_HERO_BEFORE_ARTICLE}`}>
        <BlogHeroVisual
          backdrop={ABOUT_PAGE_HERO_BACKDROP}
          variant="hero"
          boxClassName={heroBoxTw}
          gapClassName=""
          useAboutHeroDuskShader
        />
      </div>

      <div className={sectionGap}>
        <div className={ABOUT_MOBILE_CONTENT_GAP}>
          <p className={bodyTw}>{ABOUT_DESKTOP_SECTION_2_INTRO}</p>
          <ul className={`${ABOUT_MOBILE_LIST_GAP} list-none pl-0`}>
            {ABOUT_DESKTOP_SECTION_2_BULLETS.map((item) => (
              <li key={item} className={`flex items-start gap-3 ${bodyTw}`}>
                <span
                  className="mt-[0.35em] h-[0.45em] w-[0.45em] shrink-0 rounded-full"
                  style={{ backgroundColor: ABOUT_IPHONE_SHADER_CHART_SECONDARY }}
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <AboutMobileStatCharts />

        <h2 className={sectionHeadlineTw}>
          <span className="block">{ABOUT_MOBILE_ASSISTANT_HEADLINE_LINES[0]}</span>
          <span className="block">{ABOUT_MOBILE_ASSISTANT_HEADLINE_LINES[1]}</span>
        </h2>

        <AboutMobileBeigePanel graphic={0} />

        <AboutMobileFaqTabs />

        <AboutMobileTamChart />

        <AboutMobileAiAdoptionChart />

        <h2 className={sectionHeadlineTw}>
          <span className="block">{ABOUT_MOBILE_FOUNDERS_HEADLINE_LINES[0]}</span>
          <span className="block">{ABOUT_MOBILE_FOUNDERS_HEADLINE_LINES[1]}</span>
        </h2>

        <div className={ABOUT_MOBILE_CONTENT_GAP}>
          <p className={bodyTw}>{foundersOne}</p>
          <p className={bodyTw}>{foundersTwo}</p>
        </div>

        <AboutMobileQuote
          text={ABOUT_MOBILE_FOUNDERS_QUOTE.text}
          attribution={ABOUT_MOBILE_FOUNDERS_QUOTE.attribution}
        />

        <AboutMobileBeigePanel graphic={1} />
      </div>
    </div>
  );
}

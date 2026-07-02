"use client";

import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { ProtoInvestGraphicPanel } from "@/components/proto-invest/ProtoInvestGraphicPanel";
import { ProtoInvestMobileAiAdoptionChart } from "@/components/proto-invest/ProtoInvestMobileAiAdoptionChart";
import { ProtoInvestMobileFaqTabs } from "@/components/proto-invest/ProtoInvestMobileFaqTabs";
import { ProtoInvestMobileQuote } from "@/components/proto-invest/ProtoInvestMobileQuote";
import { ProtoInvestMobileStatCharts } from "@/components/proto-invest/ProtoInvestMobileStatCharts";
import { ProtoInvestMobileTamChart } from "@/components/proto-invest/ProtoInvestMobileTamChart";
import { ABOUT_PAGE_MOBILE_BYLINE, ABOUT_PAGE_MOBILE_DATE } from "@/lib/about/about-page-article";
import { ABOUT_PAGE_SUBHEADING_LINES } from "@/lib/about/about-layout-styles";
import {
  PROTO_INVEST_BODY_TW,
  PROTO_INVEST_BYLINE_GAP,
  PROTO_INVEST_BYLINE_TW,
  PROTO_INVEST_BULLET_TW,
  PROTO_INVEST_CONTENT_GAP,
  PROTO_INVEST_CONTENT_PT,
  PROTO_INVEST_HERO_AFTER_BYLINE,
  PROTO_INVEST_HERO_BEFORE_ARTICLE,
  PROTO_INVEST_HERO_BOX_TW,
  PROTO_INVEST_HERO_HEADLINE_PT,
  PROTO_INVEST_HERO_HEADLINE_WRAP,
  PROTO_INVEST_LIST_GAP,
  PROTO_INVEST_MAIN_PB,
  PROTO_INVEST_PAGE_INSET_X,
  PROTO_INVEST_SECTION_GAP,
  PROTO_INVEST_SECTION_HEADLINE_TW,
  PROTO_INVEST_SUBHEADING_TW,
  PROTO_INVEST_TITLE_TW,
} from "@/lib/proto-invest/proto-invest-layout-styles";
import {
  PROTO_INVEST_FOUNDERS_HEADLINE_LINES,
  PROTO_INVEST_FOUNDERS_PARAGRAPHS,
  PROTO_INVEST_FOUNDERS_QUOTE,
  PROTO_INVEST_INTRO,
  PROTO_INVEST_PRODUCT_HEADLINE_LINES,
  PROTO_INVEST_STAT_BULLETS,
} from "@/lib/proto-invest/proto-invest-content";
import { PROTO_HERO_BACKDROP } from "@/lib/proto/proto-hero-backdrop";

/** /proto-invest — Proto hiring platform investor article in proto dark styling. */
export function ProtoInvestMobileContent() {
  const [foundersOne, foundersTwo] = PROTO_INVEST_FOUNDERS_PARAGRAPHS;

  return (
    <main className={`proto-invest-main w-full ${PROTO_INVEST_CONTENT_PT} ${PROTO_INVEST_MAIN_PB} ${PROTO_INVEST_PAGE_INSET_X}`}>
      <div className={`${PROTO_INVEST_HERO_HEADLINE_WRAP} ${PROTO_INVEST_HERO_HEADLINE_PT}`}>
        <h1 className={PROTO_INVEST_TITLE_TW}>
          <span className="block">Proto is changing the</span>
          <span className="block">way we hire talent.</span>
        </h1>

        <p className={PROTO_INVEST_SUBHEADING_TW}>
          <span className="block">{ABOUT_PAGE_SUBHEADING_LINES[0]}</span>
          <span className="block">{ABOUT_PAGE_SUBHEADING_LINES[1]}</span>
        </p>
      </div>

      <p className={`${PROTO_INVEST_BYLINE_TW} ${PROTO_INVEST_BYLINE_GAP}`}>
        {ABOUT_PAGE_MOBILE_BYLINE}
        <span className="mx-2" aria-hidden>
          ·
        </span>
        {ABOUT_PAGE_MOBILE_DATE}
      </p>

      <div className={`${PROTO_INVEST_HERO_AFTER_BYLINE} ${PROTO_INVEST_HERO_BEFORE_ARTICLE}`}>
        <BlogHeroVisual
          backdrop={PROTO_HERO_BACKDROP}
          variant="hero"
          boxClassName={PROTO_INVEST_HERO_BOX_TW}
          gapClassName=""
        />
      </div>

      <div className={PROTO_INVEST_SECTION_GAP}>
        <div className={PROTO_INVEST_CONTENT_GAP}>
          <p className={PROTO_INVEST_BODY_TW}>{PROTO_INVEST_INTRO}</p>
          <ul className={`${PROTO_INVEST_LIST_GAP} list-none pl-0`}>
            {PROTO_INVEST_STAT_BULLETS.map((item) => (
              <li key={item} className={`flex items-start gap-3 ${PROTO_INVEST_BODY_TW}`}>
                <span className={PROTO_INVEST_BULLET_TW} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ProtoInvestMobileStatCharts />

        <h2 className={PROTO_INVEST_SECTION_HEADLINE_TW}>
          <span className="block">{PROTO_INVEST_PRODUCT_HEADLINE_LINES[0]}</span>
          <span className="block">{PROTO_INVEST_PRODUCT_HEADLINE_LINES[1]}</span>
        </h2>

        <ProtoInvestGraphicPanel graphic={0} />

        <ProtoInvestMobileFaqTabs />

        <ProtoInvestMobileTamChart />

        <ProtoInvestMobileAiAdoptionChart />

        <h2 className={PROTO_INVEST_SECTION_HEADLINE_TW}>
          <span className="block">{PROTO_INVEST_FOUNDERS_HEADLINE_LINES[0]}</span>
          <span className="block">{PROTO_INVEST_FOUNDERS_HEADLINE_LINES[1]}</span>
        </h2>

        <div className={PROTO_INVEST_CONTENT_GAP}>
          <p className={PROTO_INVEST_BODY_TW}>{foundersOne}</p>
          <p className={PROTO_INVEST_BODY_TW}>{foundersTwo}</p>
        </div>

        <ProtoInvestMobileQuote
          text={PROTO_INVEST_FOUNDERS_QUOTE.text}
          attribution={PROTO_INVEST_FOUNDERS_QUOTE.attribution}
        />

        <ProtoInvestGraphicPanel graphic={1} />
      </div>
    </main>
  );
}

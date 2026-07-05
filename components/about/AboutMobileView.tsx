"use client";

import { useLayoutEffect } from "react";

import { AboutMobileBeigePanel } from "@/components/about/AboutMobileBeigePanel";
import { AboutMobileFaqTabs } from "@/components/about/AboutMobileFaqTabs";
import { AboutMobileQuote } from "@/components/about/AboutMobileQuote";
import { AboutMobileStatCharts } from "@/components/about/AboutMobileStatCharts";
import { AboutMobileAiAdoptionChart } from "@/components/about/AboutMobileAiAdoptionChart";
import { AboutMobileTamChart } from "@/components/about/AboutMobileTamChart";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import {
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
  ABOUT_PAGE_SUBHEADING_LINES,
  ABOUT_PAGE_SUBHEADING_TW,
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
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

/** iPhone /about — mission hero plus section copy, pie chart, FAQ, and founder bios. */
export function AboutMobileView() {
  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);

  useLayoutEffect(() => {
    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }
  }, []);

  const [foundersOne, foundersTwo] = ABOUT_DESKTOP_FOUNDERS_PARAGRAPHS;

  return (
    <BlogMobileShell
      showJoinCta={false}
      ctaLayout="main-home"
      logoLink
      showMenu={false}
      footerLinksDisabled
      shellMinHeightClass="min-h-[var(--doe-section-band-vh,var(--app-vh,100lvh))]"
    >
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <div className={`${ABOUT_HERO_HEADLINE_WRAP} ${ABOUT_PAGE_HERO_HEADLINE_PT}`}>
          <h1 className={ABOUT_PAGE_TITLE_TW}>
            <span className="block">Doe is on a mission</span>
            <span className="block">to redefine healthcare.</span>
          </h1>

          <p className={ABOUT_PAGE_SUBHEADING_TW}>
            <span className="block">{ABOUT_PAGE_SUBHEADING_LINES[0]}</span>
            <span className="block">{ABOUT_PAGE_SUBHEADING_LINES[1]}</span>
          </p>
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
            boxClassName={ABOUT_PAGE_HERO_BOX_TW}
            gapClassName=""
            useHomeHeroShader
          />
        </div>

        <div className={ABOUT_MOBILE_SECTION_GAP}>
          <div className={ABOUT_MOBILE_CONTENT_GAP}>
            <p className={ABOUT_MOBILE_BODY_TW}>{ABOUT_DESKTOP_SECTION_2_INTRO}</p>
            <ul className={`${ABOUT_MOBILE_LIST_GAP} list-none pl-0`}>
              {ABOUT_DESKTOP_SECTION_2_BULLETS.map((item) => (
                <li key={item} className={`flex items-start gap-3 ${ABOUT_MOBILE_BODY_TW}`}>
                  <span
                    className="mt-[0.35em] h-[0.45em] w-[0.45em] shrink-0 rounded-full bg-[#9A8F82]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <AboutMobileStatCharts />

          <h2 className={ABOUT_MOBILE_SECTION_HEADLINE_TW}>
            <span className="block">{ABOUT_MOBILE_ASSISTANT_HEADLINE_LINES[0]}</span>
            <span className="block">{ABOUT_MOBILE_ASSISTANT_HEADLINE_LINES[1]}</span>
          </h2>

          <AboutMobileBeigePanel graphic={0} />

          <AboutMobileFaqTabs />

          <AboutMobileTamChart />

          <AboutMobileAiAdoptionChart />

          <h2 className={ABOUT_MOBILE_SECTION_HEADLINE_TW}>
            <span className="block">{ABOUT_MOBILE_FOUNDERS_HEADLINE_LINES[0]}</span>
            <span className="block">{ABOUT_MOBILE_FOUNDERS_HEADLINE_LINES[1]}</span>
          </h2>

          <div className={ABOUT_MOBILE_CONTENT_GAP}>
            <p className={ABOUT_MOBILE_BODY_TW}>{foundersOne}</p>
            <p className={ABOUT_MOBILE_BODY_TW}>{foundersTwo}</p>
          </div>

          <AboutMobileQuote
            text={ABOUT_MOBILE_FOUNDERS_QUOTE.text}
            attribution={ABOUT_MOBILE_FOUNDERS_QUOTE.attribution}
          />

          <AboutMobileBeigePanel graphic={1} />
        </div>
      </main>
    </BlogMobileShell>
  );
}

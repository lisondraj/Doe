"use client";

import { AboutDesktopAiAdoptionChart } from "@/components/about/AboutDesktopAiAdoptionChart";
import { AboutDesktopFaqTabs } from "@/components/about/AboutDesktopFaqTabs";
import {
  AboutDesktopBulletList,
  AboutDesktopParagraph,
  AboutDesktopQuote,
  AboutDesktopSectionHeadline,
} from "@/components/about/AboutDesktopArticleBlocks";
import { AboutDesktopNav } from "@/components/about/AboutDesktopNav";
import { AboutDesktopSplitSection } from "@/components/about/AboutDesktopSplitSection";
import { AboutDesktopStatCharts } from "@/components/about/AboutDesktopStatCharts";
import { AboutDesktopTamChart } from "@/components/about/AboutDesktopTamChart";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { AboutDesktopContactSection } from "@/components/about/AboutDesktopContactSection";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import {
  ABOUT_DESKTOP_CONTENT_STACK_GAP,
  ABOUT_DESKTOP_HERO_AFTER_BYLINE,
  ABOUT_DESKTOP_HERO_BOX_TW,
  ABOUT_DESKTOP_HERO_BYLINE_OUTSIDE_GAP,
  ABOUT_DESKTOP_HERO_BYLINE_OUTSIDE_TW,
  ABOUT_DESKTOP_HERO_WRAP,
  ABOUT_HERO_HEADLINE_WRAP,
  ABOUT_DESKTOP_SECTION_1_H,
  ABOUT_DESKTOP_SECTION_1_LAYOUT,
  ABOUT_DESKTOP_HERO_HEADLINE_TOP,
  ABOUT_DESKTOP_SECTION_2_CONTENT_GAP,
  ABOUT_DESKTOP_SQUARE_PANEL_TW,
  ABOUT_DESKTOP_SUBHEADING_TW,
  ABOUT_DESKTOP_TITLE_TW,
  ABOUT_PAGE_SUBHEADING_LINES,
} from "@/lib/about/about-layout-styles";
import {
  ABOUT_PAGE_ARTICLE,
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
import type { ArticleBlock } from "@/lib/blog/articles";

function getAboutDesktopArticleSections(body: readonly ArticleBlock[]) {
  const productCopy = body.slice(5, 8);

  if (productCopy.length !== 3 || !productCopy.every((block) => block.type === "p")) {
    throw new Error("About page article layout blocks are out of order");
  }

  return {
    productParagraphs: productCopy.map((block) => (block.type === "p" ? block.text : "")),
  };
}

/** Desktop /about — hero plus four alternating beige-panel bands, then footer. */
export function AboutDesktopView() {
  const sections = getAboutDesktopArticleSections(ABOUT_PAGE_ARTICLE.body);
  const [productTwo, productThree] = sections.productParagraphs.slice(1);
  const [foundersOne, foundersTwo] = ABOUT_DESKTOP_FOUNDERS_PARAGRAPHS;

  return (
    <div className="about-desktop-root relative overflow-x-hidden bg-[#faf0d8]" data-doeforvc-view="desktop">
      <div className="relative z-[40] overflow-x-clip overflow-y-visible">
        <section className={ABOUT_DESKTOP_SECTION_1_H}>
          <div className={ABOUT_DESKTOP_SECTION_1_LAYOUT}>
            <div
              className={`${ABOUT_HERO_HEADLINE_WRAP} min-w-0 px-[var(--desktop-page-inset-x,2.5rem)] ${ABOUT_DESKTOP_HERO_HEADLINE_TOP}`}
            >
              <h1 className={ABOUT_DESKTOP_TITLE_TW}>
                <span className="block">Doe is on a mission</span>
                <span className="block">to redefine healthcare.</span>
              </h1>

              <p className={ABOUT_DESKTOP_SUBHEADING_TW}>
                <span className="block">{ABOUT_PAGE_SUBHEADING_LINES[0]}</span>
                <span className="block">{ABOUT_PAGE_SUBHEADING_LINES[1]}</span>
              </p>

              <p
                className={`${ABOUT_DESKTOP_HERO_BYLINE_OUTSIDE_TW} ${ABOUT_DESKTOP_HERO_BYLINE_OUTSIDE_GAP}`}
              >
                {ABOUT_PAGE_MOBILE_BYLINE}
                <span className="mx-2" aria-hidden>
                  ·
                </span>
                {ABOUT_PAGE_MOBILE_DATE}
              </p>
            </div>

            <div
              className={`${ABOUT_DESKTOP_HERO_WRAP} ${ABOUT_DESKTOP_HERO_AFTER_BYLINE} min-h-0 px-[var(--desktop-page-inset-x,2.5rem)]`}
            >
              <BlogHeroVisual
                backdrop={ABOUT_PAGE_HERO_BACKDROP}
                variant="hero"
                boxClassName={ABOUT_DESKTOP_HERO_BOX_TW}
                gapClassName=""
                useHomeHeroDuskShader
              />
            </div>
          </div>
        </section>

        <AboutDesktopNav />
      </div>

      <div className="relative z-10">
        <main>
          <AboutDesktopSplitSection boxSide="right" graphic={0} textFill boxBleedToMargin>
            <div className={`about-desktop-content-panel ${ABOUT_DESKTOP_SQUARE_PANEL_TW} min-h-0`}>
              <div className="about-desktop-section-scroll flex h-full min-h-0 flex-col justify-center gap-6 md:gap-7">
                <AboutDesktopSectionHeadline lines={ABOUT_MOBILE_ASSISTANT_HEADLINE_LINES} />
                <div className={`flex flex-col ${ABOUT_DESKTOP_SECTION_2_CONTENT_GAP}`}>
                  <AboutDesktopParagraph text={ABOUT_DESKTOP_SECTION_2_INTRO} />
                  <AboutDesktopBulletList items={ABOUT_DESKTOP_SECTION_2_BULLETS} />
                </div>
                <AboutDesktopStatCharts />
              </div>
            </div>
          </AboutDesktopSplitSection>

          <AboutDesktopSplitSection boxSide="right" graphic={2} textFill boxBleedToMargin>
            <AboutDesktopFaqTabs />
          </AboutDesktopSplitSection>

          <AboutDesktopSplitSection boxSide="left" graphic={1} boxBleedToMargin>
            <div className="about-desktop-section-scroll flex min-h-0 flex-col justify-center gap-8 md:gap-9 lg:gap-10">
              <AboutDesktopTamChart />
              <AboutDesktopAiAdoptionChart />
            </div>
          </AboutDesktopSplitSection>

          <AboutDesktopSplitSection boxSide="left" graphic={3}>
            <div
              className={`about-desktop-section-scroll flex min-h-0 flex-col justify-center ${ABOUT_DESKTOP_CONTENT_STACK_GAP}`}
            >
              <AboutDesktopSectionHeadline lines={ABOUT_MOBILE_FOUNDERS_HEADLINE_LINES} />
              <AboutDesktopParagraph text={foundersOne} />
              <AboutDesktopParagraph text={foundersTwo} />
              <AboutDesktopQuote
                text={ABOUT_MOBILE_FOUNDERS_QUOTE.text}
                attribution={ABOUT_MOBILE_FOUNDERS_QUOTE.attribution}
              />
              <AboutDesktopParagraph text={productTwo} />
              <AboutDesktopParagraph text={productThree} />
            </div>
          </AboutDesktopSplitSection>
        </main>

        <AboutDesktopContactSection />

        <HomeFooter linksDisabled shaderTheme="dusk" />
      </div>
    </div>
  );
}

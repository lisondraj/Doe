"use client";

import { AboutDesktopFaqTabs } from "@/components/about/AboutDesktopFaqTabs";
import {
  AboutDesktopBulletList,
  AboutDesktopParagraph,
} from "@/components/about/AboutDesktopArticleBlocks";
import { AboutDesktopNav } from "@/components/about/AboutDesktopNav";
import { AboutDesktopSplitSection } from "@/components/about/AboutDesktopSplitSection";
import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import { ArticlePieChart } from "@/components/blog/ArticlePieChart";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { AboutDesktopContactSection } from "@/components/about/AboutDesktopContactSection";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import {
  ABOUT_DESKTOP_CONTENT_STACK_GAP,
  ABOUT_DESKTOP_HERO_BOX_TW,
  ABOUT_DESKTOP_HERO_WRAP,
  ABOUT_HERO_HEADLINE_WRAP,
  ABOUT_DESKTOP_SECTION_1_H,
  ABOUT_DESKTOP_SECTION_1_LAYOUT,
  ABOUT_DESKTOP_HERO_BYLINE_TW,
  ABOUT_DESKTOP_HERO_BYLINE_WRAP_TW,
  ABOUT_DESKTOP_HERO_DATE_TW,
  ABOUT_DESKTOP_HERO_HEADLINE_TOP,
  ABOUT_DESKTOP_SECTION_2_STACK,
  ABOUT_DESKTOP_SECTION_2_CONTENT_GAP,
  ABOUT_DESKTOP_SQUARE_PANEL_TW,
  ABOUT_DESKTOP_SUBHEADING_TW,
  ABOUT_DESKTOP_TITLE_TW,
  ABOUT_PAGE_SUBHEADING_LINES,
} from "@/lib/about/about-layout-styles";
import {
  ABOUT_PAGE_ARTICLE,
  ABOUT_DESKTOP_FOUNDERS_PARAGRAPHS,
  ABOUT_DESKTOP_SECTION_2_INTRO,
  ABOUT_DESKTOP_SECTION_2_BULLETS,
  ABOUT_PAGE_HERO_BACKDROP,
  ABOUT_PAGE_MOBILE_BYLINE,
  ABOUT_PAGE_MOBILE_DATE,
} from "@/lib/about/about-page-article";
import type { ArticleBlock } from "@/lib/blog/articles";

function getAboutDesktopArticleSections(body: readonly ArticleBlock[]) {
  const intro = body[0];
  const stats = body[1];
  const burden = body[2];
  const barChart = body[3];
  const pieChart = body[4];
  const productCopy = body.slice(5, 8);
  const quote = body.find((block) => block.type === "quote");

  if (
    intro?.type !== "p" ||
    stats?.type !== "ul" ||
    burden?.type !== "p" ||
    barChart?.type !== "bar-chart" ||
    pieChart?.type !== "pie-chart" ||
    productCopy.length !== 3 ||
    !productCopy.every((block) => block.type === "p") ||
    quote?.type !== "quote"
  ) {
    throw new Error("About page article layout blocks are out of order");
  }

  return {
    intro,
    stats,
    burden,
    barChart,
    pieChart,
    productParagraphs: productCopy.map((block) => (block.type === "p" ? block.text : "")),
    quote,
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
            </div>

            <div className={`${ABOUT_DESKTOP_HERO_WRAP} min-h-0 px-[var(--desktop-page-inset-x,2.5rem)]`}>
              <BlogHeroVisual
                backdrop={ABOUT_PAGE_HERO_BACKDROP}
                variant="hero"
                boxClassName={ABOUT_DESKTOP_HERO_BOX_TW}
                gapClassName=""
                useHomeHeroDuskShader
              >
                <div className={ABOUT_DESKTOP_HERO_BYLINE_WRAP_TW}>
                  <p className={ABOUT_DESKTOP_HERO_BYLINE_TW}>{ABOUT_PAGE_MOBILE_BYLINE}</p>
                  <p className={ABOUT_DESKTOP_HERO_DATE_TW}>{ABOUT_PAGE_MOBILE_DATE}</p>
                </div>
              </BlogHeroVisual>
            </div>
          </div>
        </section>

        <AboutDesktopNav />
      </div>

      <div className="relative z-10">
        <main>
          <AboutDesktopSplitSection boxSide="right" graphic={0} textFill boxBleedToMargin>
            <div className={`${ABOUT_DESKTOP_SQUARE_PANEL_TW} min-h-0`}>
              <div className={ABOUT_DESKTOP_SECTION_2_STACK}>
                <div
                  className={`flex min-h-0 flex-1 flex-col justify-center ${ABOUT_DESKTOP_SECTION_2_CONTENT_GAP}`}
                >
                  <AboutDesktopParagraph text={ABOUT_DESKTOP_SECTION_2_INTRO} />
                  <AboutDesktopBulletList items={ABOUT_DESKTOP_SECTION_2_BULLETS} />
                </div>
                <ArticlePieChart
                  title={sections.pieChart.title}
                  caption={sections.pieChart.caption}
                  citation={sections.pieChart.citation}
                  slices={sections.pieChart.slices}
                  layout="desktop"
                  embedded
                  compact
                  theme="about"
                />
              </div>
            </div>
          </AboutDesktopSplitSection>

          <AboutDesktopSplitSection boxSide="left" graphic={1} boxBleedToMargin>
            <div className={`flex flex-col ${ABOUT_DESKTOP_CONTENT_STACK_GAP}`}>
              <AboutDesktopParagraph text={foundersOne} />
              <AboutDesktopParagraph text={foundersTwo} />
            </div>
          </AboutDesktopSplitSection>

          <AboutDesktopSplitSection boxSide="right" graphic={2} textFill boxBleedToMargin>
            <AboutDesktopFaqTabs />
          </AboutDesktopSplitSection>

          <AboutDesktopSplitSection boxSide="left" graphic={3}>
            <div className={`flex flex-col ${ABOUT_DESKTOP_CONTENT_STACK_GAP}`}>
              <ArticleBarChart
                title={sections.barChart.title}
                caption={sections.barChart.caption}
                citation={sections.barChart.citation}
                bars={sections.barChart.bars}
                layout="desktop"
                embedded
                theme="about"
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

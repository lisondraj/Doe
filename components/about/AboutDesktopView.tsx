"use client";

import { AboutDesktopFaqTabs } from "@/components/about/AboutDesktopFaqTabs";
import {
  AboutDesktopParagraph,
} from "@/components/about/AboutDesktopArticleBlocks";
import { AboutDesktopNav } from "@/components/about/AboutDesktopNav";
import { AboutDesktopSplitSection } from "@/components/about/AboutDesktopSplitSection";
import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import { ArticlePieChart } from "@/components/blog/ArticlePieChart";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { DesktopRouteLayout } from "@/components/DesktopRouteLayout";
import { AboutDesktopContactSection } from "@/components/about/AboutDesktopContactSection";
import {
  ABOUT_DESKTOP_CONTENT_STACK_GAP,
  ABOUT_DESKTOP_HERO_BOX_TW,
  ABOUT_DESKTOP_HERO_WRAP,
  ABOUT_HERO_HEADLINE_WRAP,
  ABOUT_DESKTOP_PAGE_INSET,
  ABOUT_DESKTOP_SECTION_1_H,
  ABOUT_DESKTOP_SECTION_1_LAYOUT,
  ABOUT_DESKTOP_SECTION_H,
  ABOUT_DESKTOP_HERO_BYLINE_TW,
  ABOUT_DESKTOP_HERO_BYLINE_WRAP_TW,
  ABOUT_DESKTOP_HERO_DATE_TW,
  ABOUT_DESKTOP_HERO_HEADLINE_TOP,
  ABOUT_DESKTOP_SECTION_2_STACK,
  ABOUT_DESKTOP_SQUARE_PANEL_TW,
  ABOUT_DESKTOP_SUBHEADING_TW,
  ABOUT_DESKTOP_TITLE_TW,
  ABOUT_PAGE_SUBHEADING_LINES,
} from "@/lib/about/about-layout-styles";
import {
  ABOUT_PAGE_ARTICLE,
  ABOUT_DESKTOP_FOUNDERS_PARAGRAPHS,
  ABOUT_DESKTOP_SECTION_2_INTRO,
  ABOUT_PAGE_HERO_BACKDROP,
  ABOUT_PAGE_HERO_PATTERN_SCALE,
  ABOUT_PAGE_MOBILE_BYLINE,
  ABOUT_PAGE_MOBILE_DATE,
} from "@/lib/about/about-page-article";
import type { ArticleBlock } from "@/lib/blog/articles";
import { lora } from "@/lib/home/fonts";

const DESKTOP_FOOTER_GRADIENT = `
  radial-gradient(circle at center, #D49D4F 0%, #D2774C 18%, #BF593D 32%, #C88A5F 45%, #7B5C4B 55%, #8B6F47 65%, #6D5B41 72%, #5C4A3A 78%, #4A3D32 85%, #1E343A 95%, rgba(30, 52, 58, 0.6) 100%),
  radial-gradient(ellipse 60% 60% at 0% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  radial-gradient(ellipse 60% 60% at 100% 0%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  radial-gradient(ellipse 60% 60% at 0% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  radial-gradient(ellipse 60% 60% at 100% 100%, #5C4A3A 0%, rgba(92, 74, 58, 0.8) 50%, transparent 80%),
  linear-gradient(to right, #1E343A 0%, rgba(30, 52, 58, 0.8) 15%, transparent 25%),
  linear-gradient(to left, #1E343A 0%, rgba(30, 52, 58, 0.8) 15%, transparent 25%)
`;

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
    <DesktopRouteLayout>
      <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#F7F6F3]" data-doeforvc-view="desktop">
        <AboutDesktopNav />

        <main>
          <section className={`${ABOUT_DESKTOP_SECTION_1_H} ${ABOUT_DESKTOP_SECTION_1_LAYOUT}`}>
            <div className={`${ABOUT_HERO_HEADLINE_WRAP} min-w-0 ${ABOUT_DESKTOP_HERO_HEADLINE_TOP}`}>
              <h1 className={ABOUT_DESKTOP_TITLE_TW}>
                <span className="block">Doe is on a mission</span>
                <span className="block">to redefine healthcare.</span>
              </h1>

              <p className={ABOUT_DESKTOP_SUBHEADING_TW}>
                <span className="block">{ABOUT_PAGE_SUBHEADING_LINES[0]}</span>
                <span className="block">{ABOUT_PAGE_SUBHEADING_LINES[1]}</span>
              </p>
            </div>

            <div className={ABOUT_DESKTOP_HERO_WRAP}>
              <BlogHeroVisual
                backdrop={ABOUT_PAGE_HERO_BACKDROP}
                variant="hero"
                boxClassName={ABOUT_DESKTOP_HERO_BOX_TW}
                gapClassName=""
                patternScale={ABOUT_PAGE_HERO_PATTERN_SCALE}
              >
                <div className={ABOUT_DESKTOP_HERO_BYLINE_WRAP_TW}>
                  <p className={ABOUT_DESKTOP_HERO_BYLINE_TW}>{ABOUT_PAGE_MOBILE_BYLINE}</p>
                  <p className={ABOUT_DESKTOP_HERO_DATE_TW}>{ABOUT_PAGE_MOBILE_DATE}</p>
                </div>
              </BlogHeroVisual>
            </div>
          </section>

          <AboutDesktopSplitSection boxSide="right" graphic={0} textFill>
            <div className={`${ABOUT_DESKTOP_SQUARE_PANEL_TW} min-h-0`}>
              <div className={ABOUT_DESKTOP_SECTION_2_STACK}>
                <div className="flex min-h-0 flex-1 flex-col justify-center">
                  <AboutDesktopParagraph text={ABOUT_DESKTOP_SECTION_2_INTRO} />
                </div>
                <ArticlePieChart
                  title={sections.pieChart.title}
                  caption={sections.pieChart.caption}
                  citation={sections.pieChart.citation}
                  slices={sections.pieChart.slices}
                  layout="desktop"
                  embedded
                  compact
                />
              </div>
            </div>
          </AboutDesktopSplitSection>

          <AboutDesktopSplitSection boxSide="left" graphic={1}>
            <div className={`flex flex-col ${ABOUT_DESKTOP_CONTENT_STACK_GAP}`}>
              <AboutDesktopParagraph text={foundersOne} />
              <AboutDesktopParagraph text={foundersTwo} />
            </div>
          </AboutDesktopSplitSection>

          <AboutDesktopSplitSection boxSide="right" graphic={2} textFill>
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
              />
              <AboutDesktopParagraph text={productTwo} />
              <AboutDesktopParagraph text={productThree} />
            </div>
          </AboutDesktopSplitSection>
        </main>

        <AboutDesktopContactSection />

        <footer
          className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-20"
          style={{ background: DESKTOP_FOOTER_GRADIENT }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
              opacity: 1,
              mixBlendMode: "overlay",
            }}
            aria-hidden
          />
          <div className={`relative z-10 flex items-center justify-between ${ABOUT_DESKTOP_PAGE_INSET}`}>
            <h2 className={`text-4xl font-normal text-white ${lora.className}`}>Doe</h2>
          </div>
        </footer>
      </div>
    </DesktopRouteLayout>
  );
}

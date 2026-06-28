"use client";

import {
  AboutDesktopBulletList,
  AboutDesktopParagraph,
  AboutDesktopParagraphStack,
} from "@/components/about/AboutDesktopArticleBlocks";
import { AboutDesktopNav } from "@/components/about/AboutDesktopNav";
import { renderArticleBlock } from "@/components/blog/ArticleBodyBlocks";
import { ArticleBarChart } from "@/components/blog/ArticleBarChart";
import { ArticlePieChart } from "@/components/blog/ArticlePieChart";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { DesktopRouteLayout } from "@/components/DesktopRouteLayout";
import {
  ABOUT_DESKTOP_ARTICLE_MAX_W,
  ABOUT_DESKTOP_HERO_BOX_TW,
  ABOUT_DESKTOP_HERO_WRAP,
  ABOUT_DESKTOP_PAGE_INSET,
  ABOUT_DESKTOP_SECTION_1_PT,
  ABOUT_DESKTOP_SECTION_GRID,
  ABOUT_DESKTOP_SECTION_H,
  ABOUT_DESKTOP_STACK_GAP,
  ABOUT_DESKTOP_SUBHEADING_TW,
  ABOUT_DESKTOP_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_PAGE_ARTICLE, ABOUT_DESKTOP_HERO_BACKDROP } from "@/lib/about/about-page-article";
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
  const remainder = body.slice(8);

  if (
    intro?.type !== "p" ||
    stats?.type !== "ul" ||
    burden?.type !== "p" ||
    barChart?.type !== "bar-chart" ||
    pieChart?.type !== "pie-chart" ||
    productCopy.length !== 3 ||
    !productCopy.every((block) => block.type === "p")
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
    remainder,
  };
}

/** Desktop /about — three full-height bands, then remaining article body. */
export function AboutDesktopView() {
  const sections = getAboutDesktopArticleSections(ABOUT_PAGE_ARTICLE.body);

  return (
    <DesktopRouteLayout>
      <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#F7F6F3]" data-doeforvc-view="desktop">
        <AboutDesktopNav />

        <main className="pb-16 md:pb-20">
          <section
            className={`${ABOUT_DESKTOP_SECTION_H} ${ABOUT_DESKTOP_SECTION_1_PT} flex flex-col justify-center ${ABOUT_DESKTOP_PAGE_INSET}`}
          >
            <h1 className={ABOUT_DESKTOP_TITLE_TW}>
              <span className="block">Doe is on a mission</span>
              <span className="block">to redefine healthcare.</span>
            </h1>

            <p className={ABOUT_DESKTOP_SUBHEADING_TW}>
              We intend to register as a Delaware corporation and are actively raising a pre-seed round.
            </p>

            <div className={ABOUT_DESKTOP_HERO_WRAP}>
              <BlogHeroVisual
                backdrop={ABOUT_DESKTOP_HERO_BACKDROP}
                variant="hero"
                boxClassName={ABOUT_DESKTOP_HERO_BOX_TW}
                gapClassName=""
              />
            </div>
          </section>

          <section className={`${ABOUT_DESKTOP_SECTION_H} flex items-center ${ABOUT_DESKTOP_PAGE_INSET}`}>
            <div className={ABOUT_DESKTOP_SECTION_GRID}>
              <div className={`flex flex-col ${ABOUT_DESKTOP_STACK_GAP}`}>
                <AboutDesktopParagraph text={sections.intro.text} />
                <AboutDesktopBulletList items={sections.stats.items} />
                <AboutDesktopParagraph text={sections.burden.text} />
              </div>

              <ArticleBarChart
                title={sections.barChart.title}
                caption={sections.barChart.caption}
                citation={sections.barChart.citation}
                bars={sections.barChart.bars}
                layout="desktop"
                embedded
              />
            </div>
          </section>

          <section className={`${ABOUT_DESKTOP_SECTION_H} flex items-center ${ABOUT_DESKTOP_PAGE_INSET}`}>
            <div className={ABOUT_DESKTOP_SECTION_GRID}>
              <ArticlePieChart
                title={sections.pieChart.title}
                caption={sections.pieChart.caption}
                citation={sections.pieChart.citation}
                slices={sections.pieChart.slices}
                layout="desktop"
                embedded
              />

              <AboutDesktopParagraphStack paragraphs={sections.productParagraphs} />
            </div>
          </section>

          <div className={`${ABOUT_DESKTOP_PAGE_INSET} pt-12 md:pt-14`}>
            <div className={`${ABOUT_DESKTOP_ARTICLE_MAX_W} article-body text-left`}>
              {sections.remainder.map((block, index) => renderArticleBlock(block, index, "desktop"))}
            </div>
          </div>
        </main>

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

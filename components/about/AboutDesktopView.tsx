"use client";

import { renderArticleBlock } from "@/components/blog/ArticleBodyBlocks";
import { BlogHeroVisual } from "@/components/blog/BlogHeroVisual";
import { AboutDesktopNav } from "@/components/about/AboutDesktopNav";
import { DesktopRouteLayout } from "@/components/DesktopRouteLayout";
import {
  ABOUT_DESKTOP_ARTICLE_MAX_W,
  ABOUT_DESKTOP_HERO_BOX_TW,
  ABOUT_DESKTOP_HERO_WRAP,
  ABOUT_DESKTOP_MAIN_PT,
  ABOUT_DESKTOP_PAGE_INSET,
  ABOUT_DESKTOP_SUBHEADING_TW,
  ABOUT_DESKTOP_TITLE_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_PAGE_ARTICLE } from "@/lib/about/about-page-article";
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

/** Desktop /about — mission headline, hero, and scaled article body. */
export function AboutDesktopView() {
  return (
    <DesktopRouteLayout>
      <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#F7F6F3]" data-doeforvc-view="desktop">
        <AboutDesktopNav />

        <main className={`${ABOUT_DESKTOP_MAIN_PT} pb-16 md:pb-20`}>
          <div className={ABOUT_DESKTOP_PAGE_INSET}>
            <h1 className={ABOUT_DESKTOP_TITLE_TW}>
              <span className="block">Doe is on a mission</span>
              <span className="block">to redefine healthcare.</span>
            </h1>

            <p className={ABOUT_DESKTOP_SUBHEADING_TW}>
              We intend to register as a Delaware corporation and are actively raising a pre-seed round.
            </p>

            <div className={ABOUT_DESKTOP_HERO_WRAP}>
              <BlogHeroVisual
                backdrop={ABOUT_PAGE_ARTICLE.backdrop}
                variant="hero"
                boxClassName={ABOUT_DESKTOP_HERO_BOX_TW}
                gapClassName=""
              />
            </div>

            <div className={`article-body text-left ${ABOUT_DESKTOP_ARTICLE_MAX_W}`}>
              {ABOUT_PAGE_ARTICLE.body.map((block, index) => renderArticleBlock(block, index, "desktop"))}
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

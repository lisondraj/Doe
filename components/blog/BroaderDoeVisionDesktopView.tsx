"use client";

import { AboutDesktopNav } from "@/components/about/AboutDesktopNav";
import { AboutStyleArticleDesktopToc } from "@/components/blog/AboutStyleArticleDesktopToc";
import { AboutStyleArticleFloatingToc } from "@/components/blog/AboutStyleArticleFloatingToc";
import { BroaderDoeVisionPageContent } from "@/components/blog/BroaderDoeVisionPageContent";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { ABOUT_STYLE_TOP_BANNER } from "@/lib/about/about-style-phone-shell-props";
import "@/lib/about/about-doehealth-iphone.css";
import { ABOUT_DESKTOP_SCROLL_MAIN_TW } from "@/lib/about/about-layout-styles";
import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";
import "@/lib/doehealth/doehealth-landing.css";

type BroaderDoeVisionDesktopViewProps = {
  tocItems: readonly AboutStyleArticleTocItem[];
};

/** Desktop /about — Broader Doe Vision scroll column with side margins. */
export function BroaderDoeVisionDesktopView({ tocItems }: BroaderDoeVisionDesktopViewProps) {
  return (
    <div
      className="about-desktop-root doe-desktop-root doe-desktop-root--doehealth relative overflow-x-hidden bg-[#1b1410]"
      data-doeforvc-view="desktop"
    >
      <DoeHealthTopBanner {...ABOUT_STYLE_TOP_BANNER} />

      <AboutDesktopNav />

      <main className={`about-desktop-main ${ABOUT_DESKTOP_SCROLL_MAIN_TW}`}>
        <div
          className={`about-desktop-article-layout${tocItems.length > 0 ? "" : " about-desktop-article-layout--no-toc"}`}
        >
          {tocItems.length > 0 ? <AboutStyleArticleDesktopToc items={tocItems} /> : null}
          <div className="about-desktop-content broader-doe-desktop-content">
            <BroaderDoeVisionPageContent tocItems={tocItems} />
          </div>
        </div>
      </main>

      <AboutStyleArticleFloatingToc items={tocItems} />

      <HomeFooter linksDisabled shaderTheme="dusk" />
    </div>
  );
}

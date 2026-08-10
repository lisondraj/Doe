"use client";

import { AboutStyleArticleDesktopToc } from "@/components/blog/AboutStyleArticleDesktopToc";
import { AboutStyleArticleFloatingToc } from "@/components/blog/AboutStyleArticleFloatingToc";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { PremedDesktopNav } from "@/components/premed/PremedDesktopNav";
import { PremedPageContent } from "@/components/premed/PremedPageContent";
import { ABOUT_DESKTOP_SCROLL_MAIN_TW } from "@/lib/about/about-layout-styles";
import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";
import { PREMED_TOP_BANNER } from "@/lib/premed/premed-copy";
import "@/lib/about/about-doehealth-iphone.css";
import "@/lib/doehealth/doehealth-landing.css";

type PremedDesktopViewProps = {
  tocItems: readonly AboutStyleArticleTocItem[];
};

/** Desktop /premed — Broader Doe Vision scroll column with disabled outbound links. */
export function PremedDesktopView({ tocItems }: PremedDesktopViewProps) {
  const hasDesktopToc = tocItems.length > 0;

  return (
    <div
      className={`about-desktop-root doe-desktop-root doe-desktop-root--doehealth relative bg-[#1b1410]${hasDesktopToc ? " about-desktop-root--article-toc" : " overflow-x-hidden"}`}
      data-doeforvc-view="desktop"
    >
      <DoeHealthTopBanner {...PREMED_TOP_BANNER} />

      <PremedDesktopNav />

      <main className={`about-desktop-main ${ABOUT_DESKTOP_SCROLL_MAIN_TW}`}>
        <div
          className={`about-desktop-article-layout${tocItems.length > 0 ? "" : " about-desktop-article-layout--no-toc"}`}
        >
          {tocItems.length > 0 ? <AboutStyleArticleDesktopToc items={tocItems} /> : null}
          <div className="about-desktop-content broader-doe-desktop-content">
            <PremedPageContent tocItems={tocItems} />
          </div>
        </div>
      </main>

      <AboutStyleArticleFloatingToc items={tocItems} />

      <HomeFooter linksDisabled shaderTheme="dusk" showIncorporationLines />
    </div>
  );
}

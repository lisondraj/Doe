"use client";

import type { ReactNode } from "react";

import { AboutDesktopNav } from "@/components/about/AboutDesktopNav";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { ABOUT_STYLE_TOP_BANNER } from "@/lib/about/about-style-phone-shell-props";
import "@/lib/about/about-doehealth-iphone.css";
import { ABOUT_DESKTOP_SCROLL_MAIN_TW } from "@/lib/about/about-layout-styles";
import "@/lib/doehealth/doehealth-landing.css";

type AboutStyleArticleDesktopViewProps = {
  children: ReactNode;
};

/** Desktop /about-style longform article shell. */
export function AboutStyleArticleDesktopView({ children }: AboutStyleArticleDesktopViewProps) {
  return (
    <div
      className="about-desktop-root doe-desktop-root doe-desktop-root--doehealth relative overflow-x-hidden bg-[#1b1410]"
      data-doeforvc-view="desktop"
    >
      <DoeHealthTopBanner {...ABOUT_STYLE_TOP_BANNER} />

      <AboutDesktopNav />

      <main className={`about-desktop-main ${ABOUT_DESKTOP_SCROLL_MAIN_TW}`}>
        <div className="about-desktop-content broader-doe-desktop-content">{children}</div>
      </main>

      <HomeFooter linksDisabled shaderTheme="dusk" />
    </div>
  );
}

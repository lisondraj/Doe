"use client";

import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { CampusAmbassadorDesktopNav } from "@/components/join/CampusAmbassadorDesktopNav";
import { CampusAmbassadorPageContent } from "@/components/join/CampusAmbassadorPageContent";
import { ABOUT_DESKTOP_SCROLL_MAIN_TW } from "@/lib/about/about-layout-styles";
import { CAMPUS_AMBASSADOR_TOP_BANNER } from "@/lib/join/campus-ambassador-copy";
import "@/lib/about/about-doehealth-iphone.css";
import "@/lib/doehealth/doehealth-landing.css";
import "@/lib/join/campus-ambassador-page.css";
import "@/lib/premed/premed-page.css";

/** Desktop /join on doe.care — campus ambassador program (premed-style brown band). */
export function CampusAmbassadorDesktopView() {
  return (
    <div
      className="about-desktop-root doe-desktop-root doe-desktop-root--doehealth relative overflow-x-hidden bg-[#1b1410]"
      data-doeforvc-view="desktop"
    >
      <DoeHealthTopBanner {...CAMPUS_AMBASSADOR_TOP_BANNER} />

      <CampusAmbassadorDesktopNav />

      <main className={`about-desktop-main campus-ambassador-page-main ${ABOUT_DESKTOP_SCROLL_MAIN_TW}`}>
        <div className="about-desktop-article-layout about-desktop-article-layout--no-toc">
          <div className="about-desktop-content broader-doe-desktop-content">
            <CampusAmbassadorPageContent />
          </div>
        </div>
      </main>

      <HomeFooter linksDisabled shaderTheme="dusk" showIncorporationLines />
    </div>
  );
}

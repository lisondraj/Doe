"use client";

import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { BLOG_DUSK_FOOTER_BACKDROP } from "@/lib/blog/blog-about-shader-backdrops";
import { ClinicalPartnersDesktopNav } from "@/components/partners/ClinicalPartnersDesktopNav";
import { ClinicalPartnersPageContent } from "@/components/partners/ClinicalPartnersPageContent";
import { ABOUT_DESKTOP_SCROLL_MAIN_TW } from "@/lib/about/about-layout-styles";
import { CLINICAL_PARTNERS_TOP_BANNER } from "@/lib/partners/clinical-partners-copy";
import "@/lib/about/about-doehealth-iphone.css";
import "@/lib/doehealth/doehealth-landing.css";
import "@/lib/join/campus-ambassador-page.css";
import "@/lib/premed/premed-page.css";

/** Desktop /partners on doe.care — clinical partners program (premed-style brown band). */
export function ClinicalPartnersDesktopView() {
  return (
    <div
      className="about-desktop-root doe-desktop-root doe-desktop-root--doehealth relative overflow-x-hidden bg-[#1b1410]"
      data-doeforvc-view="desktop"
    >
      <DoeHealthTopBanner {...CLINICAL_PARTNERS_TOP_BANNER} />

      <ClinicalPartnersDesktopNav />

      <main className={`about-desktop-main campus-ambassador-page-main ${ABOUT_DESKTOP_SCROLL_MAIN_TW}`}>
        <div className="about-desktop-article-layout about-desktop-article-layout--no-toc">
          <div className="about-desktop-content broader-doe-desktop-content">
            <ClinicalPartnersPageContent />
          </div>
        </div>
      </main>

      <HomeFooter
        linksDisabled
        shaderTheme="dusk"
        showIncorporationLines
        backdropImageSrc={BLOG_DUSK_FOOTER_BACKDROP}
      />
    </div>
  );
}

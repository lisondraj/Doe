"use client";

import { AboutDesktopNav } from "@/components/about/AboutDesktopNav";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import "@/lib/about/about-doehealth-iphone.css";
import {
  ABOUT_DESKTOP_CONTENT_MAX_W,
  ABOUT_DESKTOP_SCROLL_MAIN_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import "@/lib/doehealth/doehealth-landing.css";

/** Desktop /about — same scroll layout and brown/gold chrome as iPhone. */
export function AboutDesktopView() {
  return (
    <div
      className="about-desktop-root doe-desktop-root--doehealth relative overflow-x-hidden bg-[#1b1410]"
      data-doeforvc-view="desktop"
    >
      <div className="relative z-[40] overflow-x-clip overflow-y-visible">
        <DoeHealthTopBanner
          message="Doe is gearing up to raise pre-seed!"
          linkLabel="Contact us"
          linkHref={`mailto:${ABOUT_CONTACT_EMAIL}`}
        />

        <AboutDesktopNav />
      </div>

      <main className={`about-desktop-main ${ABOUT_DESKTOP_SCROLL_MAIN_TW}`}>
        <div className={`about-desktop-content ${ABOUT_DESKTOP_CONTENT_MAX_W}`}>
          <AboutPageContent layout="desktop" />
        </div>
      </main>

      <HomeFooter linksDisabled shaderTheme="dusk" />
    </div>
  );
}

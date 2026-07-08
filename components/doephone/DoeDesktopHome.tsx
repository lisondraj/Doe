"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { DoePhoneHomeFeatureStack } from "@/components/doephone/DoePhoneHomeFeatureStack";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { DesktopNavActionRow } from "@/components/nav/DesktopNavActionRow";
import {
  DOE_DESKTOP_NAV_LOGO_TW,
  DOE_DESKTOP_PAGE_INSET_X,
} from "@/lib/doephone/doe-desktop-layout-styles";
import { DOEPHONE_BEIGE_SECTION } from "@/lib/doephone/section-styles";
import {
  DOE_HOME_DUSK_BORDER,
  DOE_HOME_DUSK_INK,
  DOE_HOME_DUSK_SURFACE,
  DOE_HOME_DUSK_SURFACE_RAISED,
} from "@/lib/home/doe-page-colors";
import { lora } from "@/lib/home/fonts";

/** Desktop home — light Doe layout mirroring /proto, driven by the iPhone home content. */
export function DoeDesktopHome({
  logoLink = true,
  navActionLinksEnabled = true,
}: {
  logoLink?: boolean;
  navActionLinksEnabled?: boolean;
} = {}) {
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setNavSolid(window.scrollY > window.innerHeight * 0.72);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="doe-desktop-root relative overflow-x-hidden bg-[var(--doe-page-surface,#EDE8DF)]">
      <div className="relative z-[40] overflow-x-clip overflow-y-visible">
        <DoePhoneHeroSection variant="desktop" iphoneBackdrop />

        <nav
          className="fixed top-0 left-0 right-0 z-[50] transition-[background-color,border-color] duration-300 ease-out"
          style={{
            backgroundColor: navSolid ? DOE_HOME_DUSK_SURFACE : "transparent",
            borderBottom: navSolid ? `1px solid ${DOE_HOME_DUSK_BORDER}` : "1px solid transparent",
          }}
          aria-label="Primary"
        >
          <div className={`flex items-center justify-between py-6 ${DOE_DESKTOP_PAGE_INSET_X}`}>
            {logoLink ? (
              <Link
                href="/"
                className={`${lora.className} ${DOE_DESKTOP_NAV_LOGO_TW}`}
                style={{
                  color: navSolid ? DOE_HOME_DUSK_INK : "#ffffff",
                  textShadow: navSolid ? "none" : "0 1px 3px rgba(0, 0, 0, 0.28)",
                }}
              >
                Doe
              </Link>
            ) : (
              <span
                className={`${lora.className} ${DOE_DESKTOP_NAV_LOGO_TW}`}
                style={{
                  color: navSolid ? DOE_HOME_DUSK_INK : "#ffffff",
                  textShadow: navSolid ? "none" : "0 1px 3px rgba(0, 0, 0, 0.28)",
                }}
              >
                Doe
              </span>
            )}

            <DesktopNavActionRow
              bg={navSolid ? DOE_HOME_DUSK_INK : "#1A1208"}
              fg={DOE_HOME_DUSK_SURFACE_RAISED}
              shadow="0 2px 6px rgba(26, 18, 8, 0.18)"
              divider="rgba(245, 230, 208, 0.24)"
              linksEnabled={navActionLinksEnabled}
            />
          </div>
        </nav>
      </div>

      <div className="relative z-10">
        <DoePhoneHomeFeatureStack shaderTheme="dusk" />

        <section className={DOEPHONE_BEIGE_SECTION} aria-label="Closing">
          <DoePhoneClosingSection />
        </section>

        <HomeFooter linksDisabled={!navActionLinksEnabled} shaderTheme="dusk" />
      </div>
    </div>
  );
}

"use client";

import { useLayoutEffect } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneCommunicationIntelligenceSection } from "@/components/doephone/DoePhoneCommunicationIntelligenceSection";
import { DoePhoneCommunicationSection } from "@/components/doephone/DoePhoneCommunicationSection";
import { DoePhoneCustomizationSection } from "@/components/doephone/DoePhoneCustomizationSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { DoePhoneIntegrationsSection } from "@/components/doephone/DoePhoneIntegrationsSection";
import { ProtoCommunicationStack } from "@/components/proto/ProtoCommunicationStack";
import { ProtoFooter } from "@/components/proto/ProtoFooter";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import {
  DOEPHONE_BEIGE_SECTION,
  DOEPHONE_MAIN_PAGE_BEIGE_SECTION,
  DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { useDesignersStaticNav } from "@/lib/designers/use-designers-static-nav";
import { PROTO_FONT_CLASS, PROTO_NAV_LOGO_FONT_CLASS } from "@/lib/proto/proto-font";
import { PROTO_INVEST_PATH } from "@/lib/site-domains";

export function DoePhoneMobileView({ variant = "home" }: { variant?: "home" | "proto" }) {
  const isProto = variant === "proto";

  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);
  const staticNav = useDesignersStaticNav();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.setAttribute("data-doeforvc-always-phone", "true");
    html.removeAttribute("data-layout");
    html.setAttribute("data-doephone-pinching", "true");
    body.classList.add("doephone-route");

    if (isProto) {
      html.setAttribute("data-proto-page", "true");
      body.classList.add("proto-route");
    }

    if (variant === "home") {
      html.setAttribute("data-home-page", "true");
    }

    if (isProto || variant === "home") {
      try {
        sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
      } catch {
        /* ignore */
      }
    }

    return () => {
      html.removeAttribute("data-doephone-pinching");
      body.classList.remove("doephone-route");
      if (isProto) {
        html.removeAttribute("data-proto-page");
        body.classList.remove("proto-route");
      }
      if (variant === "home") {
        html.removeAttribute("data-home-page");
      }
    };
  }, [isProto, variant]);

  return (
    <div
      className={`doephone-mobile-root relative z-0 min-h-[var(--app-vh,100lvh)] overflow-x-hidden ${
        isProto ? `bg-[#121819] ${PROTO_FONT_CLASS}` : "bg-[var(--doe-page-surface,#EDE8DF)]"
      }`}
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav
        pinchSafe
        showMenu={false}
        ctaLayout="main-home"
        showJoinCta={false}
        brandName={isProto ? "Proto" : "Doe"}
        brandFontClass={isProto ? PROTO_NAV_LOGO_FONT_CLASS : undefined}
        homeHref={isProto ? "/proto" : "/"}
        navChromeTheme={isProto ? "dark" : "light"}
        logoLink={isProto ? true : !staticNav}
        navActionLinksEnabled={isProto ? true : !staticNav}
        investorsHref={isProto ? PROTO_INVEST_PATH : undefined}
        frostedScrollNav
        frostedScrollPastHero
      />

      <DoePhoneHeroSection variant="mobile" proto={isProto} />

      {isProto ? (
        <ProtoCommunicationStack />
      ) : (
        <>
          <section className={DOEPHONE_MAIN_PAGE_BEIGE_SECTION} aria-label="Labs">
            <DoePhoneCommunicationSection />
          </section>

          <DoePhoneCommunicationIntelligenceSection />
        </>
      )}

      {isProto ? (
        <ProtoFooter />
      ) : (
        <>
          <section className={DOEPHONE_MAIN_PAGE_BEIGE_SECTION} aria-label="Customization">
            <DoePhoneCustomizationSection />
          </section>

          <DoePhoneIntegrationsSection sectionClassName={DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION} />

          <section className={DOEPHONE_BEIGE_SECTION} aria-label="Closing">
            <DoePhoneClosingSection />
          </section>

          <HomeFooter />
        </>
      )}
    </div>
  );
}

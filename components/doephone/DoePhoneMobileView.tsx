"use client";

import { useLayoutEffect, type ReactNode } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { DoePhoneHomeFeatureStack } from "@/components/doephone/DoePhoneHomeFeatureStack";
import { ProtoCommunicationStack } from "@/components/proto/ProtoCommunicationStack";
import { ProtoFooter } from "@/components/proto/ProtoFooter";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { preloadShaderNoiseTexture } from "@/lib/doephone/shader-noise-texture";
import {
  DOEPHONE_BEIGE_SECTION,
} from "@/lib/doephone/section-styles";
import { DOE_HOME_DUSK_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { useDesignersStaticNav } from "@/lib/designers/use-designers-static-nav";
import { PROTO_FONT_CLASS, PROTO_NAV_LOGO_FONT_CLASS } from "@/lib/proto/proto-font";
import { PROTO_INVEST_PATH } from "@/lib/site-domains";

export type DoeHomeHeroHeadline = {
  line1?: string;
  line2?: string;
  className?: string;
  fitToContainer?: boolean;
};

export function DoePhoneMobileView({
  variant = "home",
  heroHeadline,
  afterHero,
  shaderBeforeCardSlideIds,
  disableCarouselInteractions,
}: {
  variant?: "home" | "proto";
  heroHeadline?: DoeHomeHeroHeadline;
  afterHero?: ReactNode;
  shaderBeforeCardSlideIds?: readonly string[];
  disableCarouselInteractions?: boolean;
}) {
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
      applyPhoneOverflowChrome(DOE_HOME_DUSK_OVERFLOW_SURFACE);
      preloadShaderNoiseTexture();
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
      className={`doephone-mobile-root relative z-0 min-h-[var(--doe-section-band-vh,var(--app-vh,100lvh))] overflow-x-hidden ${
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
        frostedScrollPastHero={isProto}
        frostedNavAlwaysPunched={variant === "home"}
      />

      <DoePhoneHeroSection
        variant="mobile"
        proto={isProto}
        heroLine1={heroHeadline?.line1}
        heroLine2={heroHeadline?.line2}
        heroHeadlineClassName={heroHeadline?.className}
        heroHeadlineFitToContainer={heroHeadline?.fitToContainer}
        disableHeroOrbInteractions={disableCarouselInteractions}
      />

      {afterHero}

      {isProto ? (
        <ProtoCommunicationStack />
      ) : (
        <DoePhoneHomeFeatureStack
          shaderTheme="dusk"
          shaderBeforeCardSlideIds={shaderBeforeCardSlideIds}
          disableCarouselInteractions={disableCarouselInteractions}
        />
      )}

      {isProto ? (
        <ProtoFooter />
      ) : (
        <>
          <section id="doe-vision" className={DOEPHONE_BEIGE_SECTION} aria-label="Closing">
            <DoePhoneClosingSection disableCarouselInteractions={disableCarouselInteractions} />
          </section>

          <HomeFooter shaderTheme="dusk" />
        </>
      )}
    </div>
  );
}

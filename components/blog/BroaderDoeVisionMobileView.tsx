"use client";

import { useLayoutEffect } from "react";

import { BroaderDoeVisionPageContent } from "@/components/blog/BroaderDoeVisionPageContent";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { ABOUT_CONTACT_EMAIL, ABOUT_TOP_BANNER_LINK_LABEL, ABOUT_TOP_BANNER_MESSAGE } from "@/lib/about/about-contact";
import "@/lib/about/about-doehealth-iphone.css";
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";
import "@/lib/doehealth/doehealth-landing.css";
import { applyPhoneLayoutViewportMeta, applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { ABOUT_BROWN_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

/** iPhone blog entry — mirrors /about shell and typography. */
export function BroaderDoeVisionMobileView() {
  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-about-page", "true");
    html.removeAttribute("data-home-page");
    html.setAttribute("data-doeforvc-always-phone", "true");
    html.removeAttribute("data-layout");
    applyPhoneLayoutViewportMeta();
    applyPhoneOverflowChrome(ABOUT_BROWN_OVERFLOW_SURFACE);

    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }

    return () => {
      html.removeAttribute("data-about-page");
      html.removeAttribute("data-doeforvc-always-phone");
    };
  }, []);

  return (
    <BlogMobileShell
      showJoinCta={false}
      ctaLayout="main-home"
      logoLink
      showMenu={false}
      footerLinksDisabled
      shellMinHeightClass="min-h-[var(--doe-section-band-vh,var(--app-vh,100lvh))]"
      frostedScrollNav
      frostedNavAlwaysPunched
      footerShaderTheme="dusk"
      topBanner={
        <DoeHealthTopBanner
          message={ABOUT_TOP_BANNER_MESSAGE}
          linkLabel={ABOUT_TOP_BANNER_LINK_LABEL}
          linkHref={`mailto:${ABOUT_CONTACT_EMAIL}?subject=Contact%20Us`}
        />
      }
      rootClassName="doephone-mobile-root--doehealth"
      navShowMailIcon
      navShowInvestorsCta={false}
    >
      <main className={`w-full ${BLOG_CONTENT_PT}`}>
        <BroaderDoeVisionPageContent />
      </main>
    </BlogMobileShell>
  );
}

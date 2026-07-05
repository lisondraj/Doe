"use client";

import { useLayoutEffect } from "react";

import type { ReactNode } from "react";

import DoeIphoneSiteNav, { type SiteNavCtaLayout } from "@/components/DoeIphoneSiteNav";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { BLOG_FOOTER_GAP, BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";

type BlogMobileShellProps = {
  children: ReactNode;
  homeHref?: string;
  joinHref?: string;
  showJoinCta?: boolean;
  showApplyScrollCta?: boolean;
  logoLink?: boolean;
  footerLinksDisabled?: boolean;
  showMenu?: boolean;
  ctaLayout?: SiteNavCtaLayout;
  /** Override shell min-height — join uses locked `--app-vh`. */
  shellMinHeightClass?: string;
  showFooter?: boolean;
  frostedScrollNav?: boolean;
  frostedScrollPastHero?: boolean;
};

export function BlogMobileShell({
  children,
  homeHref = "/",
  joinHref,
  showJoinCta = true,
  showApplyScrollCta = false,
  logoLink = true,
  footerLinksDisabled = false,
  showMenu = true,
  ctaLayout = "single",
  shellMinHeightClass = "min-h-[100svh]",
  showFooter = true,
  frostedScrollNav = false,
  frostedScrollPastHero = false,
}: BlogMobileShellProps) {
  return (
    <div
      className={`blog-mobile-root${frostedScrollNav ? " doephone-mobile-root" : ""} relative z-0 overflow-x-hidden bg-[#F7F6F3] ${shellMinHeightClass}`}
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav
        pinchSafe
        homeHref={homeHref}
        joinHref={joinHref}
        showJoinCta={showJoinCta}
        showApplyScrollCta={showApplyScrollCta}
        logoLink={logoLink}
        showMenu={showMenu}
        ctaLayout={ctaLayout}
        frostedScrollNav={frostedScrollNav}
        frostedScrollPastHero={frostedScrollPastHero}
      />
      <div className={`blog-page-root relative z-0 ${BLOG_PAGE_INSET_X} ${showFooter ? BLOG_FOOTER_GAP : ""}`}>
        {children}
      </div>
      {showFooter ? <HomeFooter linksDisabled={footerLinksDisabled} /> : null}
    </div>
  );
}

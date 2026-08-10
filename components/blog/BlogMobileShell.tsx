"use client";

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
  frostedNavAlwaysPunched?: boolean;
  footerShaderTheme?: "default" | "dusk";
  footerShowIncorporationLines?: boolean;
  /** Optional fixed strip above the nav (e.g. doehealth top banner). */
  topBanner?: ReactNode;
  /** Extra root classes — e.g. `doephone-mobile-root--doehealth` for gold chrome. */
  rootClassName?: string;
  navShowMailIcon?: boolean;
  navShowInvestorsCta?: boolean;
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
  frostedNavAlwaysPunched = false,
  footerShaderTheme = "default",
  footerShowIncorporationLines = false,
  topBanner = null,
  rootClassName = "",
  navShowMailIcon = true,
  navShowInvestorsCta = true,
}: BlogMobileShellProps) {
  return (
    <>
      {topBanner}
      <div
        className={`blog-mobile-root${frostedScrollNav ? " doephone-mobile-root" : ""}${rootClassName ? ` ${rootClassName}` : ""} relative z-0 overflow-x-hidden bg-[var(--doe-page-surface,#EDE8DF)] ${shellMinHeightClass}`}
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
          frostedNavAlwaysPunched={frostedNavAlwaysPunched}
          navShowMailIcon={navShowMailIcon}
          navShowInvestorsCta={navShowInvestorsCta}
        />
        <div className={`blog-page-root relative z-0 ${BLOG_PAGE_INSET_X} ${showFooter ? BLOG_FOOTER_GAP : ""}`}>
          {children}
        </div>
        {showFooter ? (
          <HomeFooter
            linksDisabled={footerLinksDisabled}
            shaderTheme={footerShaderTheme}
            showIncorporationLines={footerShowIncorporationLines}
          />
        ) : null}
      </div>
    </>
  );
}

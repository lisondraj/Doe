"use client";

import type { ReactNode } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { BLOG_FOOTER_GAP, BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";

type BlogMobileShellProps = {
  children: ReactNode;
  homeHref?: string;
  joinHref?: string;
  showJoinCta?: boolean;
  logoLink?: boolean;
  footerLinksDisabled?: boolean;
  showMenu?: boolean;
  /** Override shell min-height — join uses locked `--app-vh`. */
  shellMinHeightClass?: string;
};

export function BlogMobileShell({
  children,
  homeHref = "/",
  joinHref,
  showJoinCta = true,
  logoLink = true,
  footerLinksDisabled = false,
  showMenu = true,
  shellMinHeightClass = "min-h-[100svh]",
}: BlogMobileShellProps) {
  return (
    <div
      className={`blog-mobile-root relative z-0 overflow-x-hidden bg-[#F7F6F3] ${shellMinHeightClass}`}
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav
        pinchSafe
        homeHref={homeHref}
        joinHref={joinHref}
        showJoinCta={showJoinCta}
        logoLink={logoLink}
        showMenu={showMenu}
      />
      <div className={`blog-page-root relative z-0 ${BLOG_PAGE_INSET_X} ${BLOG_FOOTER_GAP}`}>
        {children}
      </div>
      <HomeFooter linksDisabled={footerLinksDisabled} />
    </div>
  );
}

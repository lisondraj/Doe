"use client";

import type { ReactNode } from "react";
import { useLayoutEffect } from "react";

import { AboutStyleArticleFloatingChrome } from "@/components/blog/AboutStyleArticleFloatingChrome";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { ABOUT_STYLE_PHONE_SHELL_PROPS, ABOUT_STYLE_TOP_BANNER } from "@/lib/about/about-style-phone-shell-props";
import "@/lib/about/about-doehealth-iphone.css";
import { AboutStyleArticleAudioPlayerProvider } from "@/lib/blog/about-style-article-audio-player-context";
import { BROADER_DOE_VISION_CONTENT_PT } from "@/lib/blog/broader-doe-vision-layout-styles";
import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";
import "@/lib/doehealth/doehealth-landing.css";
import { applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { ABOUT_BROWN_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

type AboutStyleArticleMobileViewProps = {
  children: ReactNode;
  tocItems?: readonly AboutStyleArticleTocItem[];
  currentSlug?: string;
};

/** iPhone /about-style longform article shell. */
export function AboutStyleArticleMobileView({
  children,
  tocItems = [],
  currentSlug,
}: AboutStyleArticleMobileViewProps) {
  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);

  useLayoutEffect(() => {
    applyPhoneOverflowChrome(ABOUT_BROWN_OVERFLOW_SURFACE);

    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <AboutStyleArticleAudioPlayerProvider>
      <BlogMobileShell
        {...ABOUT_STYLE_PHONE_SHELL_PROPS}
        topBanner={<DoeHealthTopBanner {...ABOUT_STYLE_TOP_BANNER} />}
      >
        <main className={`w-full ${BROADER_DOE_VISION_CONTENT_PT}`}>{children}</main>
      </BlogMobileShell>
      <AboutStyleArticleFloatingChrome tocItems={tocItems} currentSlug={currentSlug} />
    </AboutStyleArticleAudioPlayerProvider>
  );
}

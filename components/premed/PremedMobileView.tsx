"use client";

import { useLayoutEffect } from "react";

import { AboutStyleArticleFloatingChrome } from "@/components/blog/AboutStyleArticleFloatingChrome";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { PremedPageContent } from "@/components/premed/PremedPageContent";
import { ABOUT_STYLE_PHONE_SHELL_PROPS } from "@/lib/about/about-style-phone-shell-props";
import { AboutStyleArticleAudioPlayerProvider } from "@/lib/blog/about-style-article-audio-player-context";
import { BROADER_DOE_VISION_CONTENT_PT } from "@/lib/blog/broader-doe-vision-layout-styles";
import type { AboutStyleArticleTocItem } from "@/lib/blog/about-style-article-toc";
import { PREMED_TOP_BANNER } from "@/lib/premed/premed-copy";
import "@/lib/about/about-doehealth-iphone.css";
import "@/lib/doehealth/doehealth-landing.css";
import "@/lib/premed/premed-page.css";
import { applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { ABOUT_BROWN_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

type PremedMobileViewProps = {
  tocItems: readonly AboutStyleArticleTocItem[];
};

/** iPhone /premed — Broader Doe Vision article layout with disabled outbound links. */
export function PremedMobileView({ tocItems }: PremedMobileViewProps) {
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
        footerShowIncorporationLines
        topBanner={<DoeHealthTopBanner {...PREMED_TOP_BANNER} />}
      >
        <main className={`w-full ${BROADER_DOE_VISION_CONTENT_PT}`}>
          <PremedPageContent tocItems={tocItems} />
        </main>
      </BlogMobileShell>
      <AboutStyleArticleFloatingChrome
        tocItems={tocItems}
        currentSlug="the-broader-doe-vision"
        hideBlogNav
      />
    </AboutStyleArticleAudioPlayerProvider>
  );
}

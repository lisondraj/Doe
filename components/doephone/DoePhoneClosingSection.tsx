"use client";

import { DoePhoneClosingBlogCarousel } from "@/components/doephone/DoePhoneClosingBlogCarousel";
import { DoePhoneClosingFeatureStack } from "@/components/doephone/DoePhoneClosingFeatureStack";
import { DoePhoneClosingFundraiseCallout } from "@/components/doephone/DoePhoneClosingFundraiseCallout";
import { DoePhoneScrollRevealContent } from "@/components/doephone/DoePhoneScrollRevealLift";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import {
  DOEPHONE_DISPLAY_WEIGHT_TW,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
  DOEPHONE_SECTION_TITLE_PB,
  DOEPHONE_SECTION_TITLE_PT,
} from "@/lib/doephone/section-styles";
import { doephoneHomeScrollRevealStyleVars } from "@/lib/doephone/section-reveal-timing";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import { useDoePhoneSectionReveal } from "@/lib/doephone/use-doe-phone-section-reveal";
import { suisseIntl } from "@/lib/home/fonts";
import { useLayoutEffect, useState, type CSSProperties } from "react";

/** Closing beige section — stacked posts on iPhone; carousel + fundraise on desktop. */
export function DoePhoneClosingSection() {
  const { ref: revealRef, revealed } = useDoePhoneSectionReveal(0.18, {
    rootMargin: "0px 0px 8% 0px",
  });
  const [isDesktop, setIsDesktop] = useState(() => readBootstrappedDoePhoneVariant() === "desktop");

  useLayoutEffect(() => {
    setIsDesktop(readBootstrappedDoePhoneVariant() === "desktop");
    const sync = () => setIsDesktop(resolveDoePhoneVariant() === "desktop");
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!isDesktop) {
    return (
      <div
        ref={revealRef}
        className="flex h-full min-h-0 flex-col"
        style={doephoneHomeScrollRevealStyleVars() as CSSProperties}
      >
        <div className={`shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
          <DoePhoneScrollRevealContent revealed={revealed} segment="title">
            <DoePhoneSectionTitle line1="More about" line2="the Doe vision." suppressReveal />
          </DoePhoneScrollRevealContent>
        </div>

        <div
          className={`shrink-0 ${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${DOEPHONE_SECTION_TITLE_PB}`}
        >
          <DoePhoneScrollRevealContent revealed={revealed} segment="carousel">
            <DoePhoneClosingFeatureStack />
          </DoePhoneScrollRevealContent>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={revealRef}
      className="home-closing-section flex h-full min-h-0 flex-1 flex-col"
      style={doephoneHomeScrollRevealStyleVars() as CSSProperties}
    >
      <div className="home-closing-section__layout flex min-h-0 flex-1 flex-col">
        <DoePhoneScrollRevealContent
          revealed={revealed}
          segment="title"
          className={`home-closing-section__title-wrap shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT} layout-desktop:px-0 layout-desktop:pt-0`}
        >
          <h2
            className={`home-feature-card-section__title home-feature-card-section__title--closing home-feature-card-section__title--feature-lead m-0 text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] text-[#1E343A] ${suisseIntl.className}`}
          >
            <span className="block">More about</span>
            <span className="block">the Doe vision</span>
          </h2>
        </DoePhoneScrollRevealContent>

        <DoePhoneScrollRevealContent
          revealed={revealed}
          segment="carousel"
          className="home-closing-section__carousel-wrap flex min-h-0 flex-1 flex-col"
        >
          <DoePhoneClosingBlogCarousel />
        </DoePhoneScrollRevealContent>

        <DoePhoneScrollRevealContent
          revealed={revealed}
          segment="menu"
          className={`home-closing-section__fundraise-wrap shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PB} layout-desktop:px-0 layout-desktop:pb-0`}
        >
          <DoePhoneClosingFundraiseCallout />
        </DoePhoneScrollRevealContent>
      </div>
    </div>
  );
}

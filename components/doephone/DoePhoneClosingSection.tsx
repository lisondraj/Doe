"use client";

import { DoePhoneClosingBlogCarousel } from "@/components/doephone/DoePhoneClosingBlogCarousel";
import { DoePhoneClosingFundraiseCallout } from "@/components/doephone/DoePhoneClosingFundraiseCallout";
import { DoePhoneScrollRevealContent } from "@/components/doephone/DoePhoneScrollRevealLift";
import {
  DOEPHONE_DISPLAY_WEIGHT_TW,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_PB,
  DOEPHONE_SECTION_TITLE_PT,
} from "@/lib/doephone/section-styles";
import { doephoneHomeScrollRevealStyleVars, doephoneHomeSectionRevealObserverOptions } from "@/lib/doephone/section-reveal-timing";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import { useDoePhoneSectionReveal } from "@/lib/doephone/use-doe-phone-section-reveal";
import { suisseIntl } from "@/lib/home/fonts";
import { useLayoutEffect, useState, type CSSProperties } from "react";

function ClosingSectionTitle() {
  return (
    <h2
      className={`home-closing-section__title home-feature-card-section__title home-feature-card-section__title--closing home-feature-card-section__title--feature-lead m-0 text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] text-[#1E343A] ${suisseIntl.className}`}
    >
      <span className="block">More about</span>
      <span className="block">the Doe vision</span>
    </h2>
  );
}

/** Closing beige section — title, blog carousel, fundraise note (phone + desktop). */
export function DoePhoneClosingSection() {
  const bootVariant = readBootstrappedDoePhoneVariant();
  const revealObserver = doephoneHomeSectionRevealObserverOptions(bootVariant);
  const { ref: revealRef, revealed } = useDoePhoneSectionReveal(revealObserver.threshold, {
    rootMargin: revealObserver.rootMargin,
  });
  const [variant, setVariant] = useState<DoePhoneVariant>(() => bootVariant);

  useLayoutEffect(() => {
    setVariant(readBootstrappedDoePhoneVariant());
    const sync = () => setVariant(resolveDoePhoneVariant());
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div
      ref={revealRef}
      className={`home-closing-section home-closing-section--${variant} flex h-full min-h-0 flex-1 flex-col`}
      style={doephoneHomeScrollRevealStyleVars(variant) as CSSProperties}
    >
      <div className="home-closing-section__layout flex min-h-0 flex-1 flex-col">
        <DoePhoneScrollRevealContent
          revealed={revealed}
          segment="title"
          className={`home-closing-section__title-wrap shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT} layout-desktop:px-0 layout-desktop:pt-0`}
        >
          <ClosingSectionTitle />
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

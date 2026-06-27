"use client";

import { DoePhoneCarouselMenu } from "@/components/doephone/DoePhoneCarouselMenu";
import {
  DoePhoneSectionCarousel,
  useDoePhoneSectionCarousel,
} from "@/components/doephone/DoePhoneSectionCarousel";
import {
  DOEPHONE_SECTION_CAROUSEL_HEIGHT,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_CONTENT_CENTER,
} from "@/lib/doephone/section-styles";
import {
  doePhoneSectionRevealSegmentClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";
import { doephoneSectionRevealStyleVars } from "@/lib/doephone/section-reveal-timing";
import { useState, type CSSProperties } from "react";

/** Second beige section — carousel slide and 3×2 feature menu. */
export function DoePhoneCommunicationSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollRef, loopScrollIndices, menuInject, selectSlide, handleScroll } = useDoePhoneSectionCarousel(
    activeSlide,
    setActiveSlide,
  );
  const { ref: sectionRef, revealed } = useDoePhoneSectionReveal();

  return (
    <div
      ref={sectionRef}
      className={DOEPHONE_SECTION_CONTENT_CENTER}
      style={doephoneSectionRevealStyleVars() as CSSProperties}
    >
      <div className={DOEPHONE_SECTION_CAROUSEL_INSET_X}>
        <div
          className={`w-full ${DOEPHONE_SECTION_CAROUSEL_HEIGHT} ${doePhoneSectionRevealSegmentClass("carousel", revealed)}`}
        >
          <DoePhoneSectionCarousel
            scrollRef={scrollRef}
            loopScrollIndices={loopScrollIndices}
            menuInject={menuInject}
            activeIndex={activeSlide}
            onScroll={handleScroll}
          />
        </div>

        <div className={`${DOEPHONE_SECTION_CAROUSEL_MENU_GAP} ${doePhoneSectionRevealSegmentClass("menu", revealed)}`}>
          <DoePhoneCarouselMenu activeIndex={activeSlide} onSelect={selectSlide} />
        </div>
      </div>
    </div>
  );
}

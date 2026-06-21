"use client";

import { DoePhoneCarouselMenu } from "@/components/doephone/DoePhoneCarouselMenu";
import {
  DoePhoneSectionCarousel,
  useDoePhoneSectionCarousel,
} from "@/components/doephone/DoePhoneSectionCarousel";
import { DoePhoneSectionPlus, DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import {
  DOEPHONE_SECTION_CAROUSEL_HEIGHT,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
  DOEPHONE_SECTION_TITLE_PB,
  DOEPHONE_SECTION_TITLE_PT,
} from "@/lib/doephone/section-styles";
import { useState } from "react";

/** Section 2 — Communication title, carousel, and feature menu. */
export function DoePhoneCommunicationSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollRef, loopScrollIndices, menuInject, selectSlide, handleScroll } = useDoePhoneSectionCarousel(
    activeSlide,
    setActiveSlide,
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
        <DoePhoneSectionTitle
          line1="Communication"
          line2={
            <>
              <DoePhoneSectionPlus />
              Intelligence.
            </>
          }
        />
      </div>

      <div
        className={`shrink-0 ${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${DOEPHONE_SECTION_TITLE_PB}`}
      >
        <div className={`w-full ${DOEPHONE_SECTION_CAROUSEL_HEIGHT}`}>
          <DoePhoneSectionCarousel
            scrollRef={scrollRef}
            loopScrollIndices={loopScrollIndices}
            menuInject={menuInject}
            activeIndex={activeSlide}
            onScroll={handleScroll}
          />
        </div>

        <div className={DOEPHONE_SECTION_CAROUSEL_MENU_GAP}>
          <DoePhoneCarouselMenu activeIndex={activeSlide} onSelect={selectSlide} />
        </div>
      </div>
    </div>
  );
}

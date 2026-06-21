"use client";

import { useRef, useState } from "react";

import { DoePhoneCarouselMenu } from "@/components/doephone/DoePhoneCarouselMenu";
import {
  DoePhoneSectionCarousel,
  scrollDoePhoneCarouselTo,
} from "@/components/doephone/DoePhoneSectionCarousel";
import { DoePhoneSectionPlus, DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import {
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_PT_STACKED,
} from "@/lib/doephone/section-styles";

/** Section 2 — Communication title, carousel, and feature menu. */
export function DoePhoneCommunicationSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselScrollRef = useRef<HTMLDivElement>(null);

  const selectSlide = (index: number) => {
    setActiveSlide(index);
    scrollDoePhoneCarouselTo(carouselScrollRef, index);
  };

  return (
    <div className={`flex h-full min-h-0 flex-col ${DOEPHONE_SECTION_CONTENT_INSET}`}>
      <div className={`shrink-0 ${DOEPHONE_SECTION_TITLE_PT_STACKED}`}>
        <DoePhoneSectionTitle
          line1="Communication"
          line2={
            <>
              <DoePhoneSectionPlus />
              intelligence.
            </>
          }
        />
      </div>

      <div className="mt-[clamp(1.1rem,0.85rem+1.05vmin,1.55rem)] flex min-h-0 flex-1 flex-col">
        <div className="h-2/3 min-h-0 shrink-0">
          <DoePhoneSectionCarousel
            scrollRef={carouselScrollRef}
            activeIndex={activeSlide}
            onActiveIndexChange={setActiveSlide}
          />
        </div>

        <div className="mt-[clamp(0.65rem,0.5rem+0.55vmin,0.9rem)] shrink-0 pb-[clamp(0.5rem,0.38rem+0.45vmin,0.75rem)]">
          <DoePhoneCarouselMenu activeIndex={activeSlide} onSelect={selectSlide} />
        </div>
      </div>
    </div>
  );
}

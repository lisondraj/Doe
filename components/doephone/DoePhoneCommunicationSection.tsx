"use client";

import { DoePhoneSectionCarousel } from "@/components/doephone/DoePhoneSectionCarousel";
import { DoePhoneSectionPlus, DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { DOEPHONE_SECTION_CAROUSEL_PAD } from "@/lib/doephone/section-styles";

/** Section 2 — Communication title + five-card carousel band. */
export function DoePhoneCommunicationSection() {
  return (
    <div className={`flex h-full min-h-0 flex-col ${DOEPHONE_SECTION_CAROUSEL_PAD}`}>
      <div className="shrink-0 pt-[max(0.25rem,calc(env(safe-area-inset-top,0px)+5svh))]">
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
        <DoePhoneSectionCarousel />
      </div>
    </div>
  );
}

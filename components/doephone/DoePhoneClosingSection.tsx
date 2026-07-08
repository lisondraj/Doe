"use client";

import { DoePhoneClosingFeatureStack } from "@/components/doephone/DoePhoneClosingFeatureStack";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import {
  DESKTOP_FULLSCREEN_SECTION_TITLE_PT,
  DESKTOP_FULLSCREEN_SECTION_TITLE_TW,
  DOEPHONE_DESKTOP_PAGE_INSET_X,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
  DOEPHONE_SECTION_TITLE_PB,
  DOEPHONE_SECTION_TITLE_PT,
} from "@/lib/doephone/section-styles";

/** Closing beige section — title and stacked feature cards. */
export function DoePhoneClosingSection({
  variant = "mobile",
}: {
  variant?: "mobile" | "desktop";
}) {
  const isDesktop = variant === "desktop";
  const contentInset = isDesktop ? DOEPHONE_DESKTOP_PAGE_INSET_X : DOEPHONE_SECTION_CONTENT_INSET;
  const titlePt = isDesktop ? DESKTOP_FULLSCREEN_SECTION_TITLE_PT : DOEPHONE_SECTION_TITLE_PT;
  const carouselInset = isDesktop ? DOEPHONE_DESKTOP_PAGE_INSET_X : DOEPHONE_SECTION_CAROUSEL_INSET_X;
  const titleGap = isDesktop ? "mt-10 md:mt-12 lg:mt-14" : DOEPHONE_SECTION_TITLE_CAROUSEL_GAP;
  const titlePb = isDesktop ? "pb-10 md:pb-14 lg:pb-16 xl:pb-20" : DOEPHONE_SECTION_TITLE_PB;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`shrink-0 ${contentInset} ${titlePt}`}>
        <DoePhoneSectionTitle
          line1="More about"
          line2="the Doe vision."
          color={isDesktop ? "text-[#1A1208]" : "text-[#1E343A]"}
          copyClassName={isDesktop ? DESKTOP_FULLSCREEN_SECTION_TITLE_TW : undefined}
        />
      </div>

      <div className={`shrink-0 ${titleGap} ${carouselInset} ${titlePb}`}>
        <DoePhoneClosingFeatureStack variant={variant} />
      </div>
    </div>
  );
}

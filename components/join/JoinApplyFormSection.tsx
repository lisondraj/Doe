"use client";

import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { JoinApplyForm } from "@/components/join/JoinApplyForm";
import { JoinInternTrackReveal } from "@/components/join/JoinInternTrackReveal";
import {
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
} from "@/lib/doephone/section-styles";
import {
  JOIN_APPLY_SECTION_ID,
  JOIN_DESKTOP_APPLY_FOOTER_PAD,
  JOIN_DESKTOP_APPLY_SCROLL_MARGIN,
  JOIN_DESKTOP_APPLY_SECTION_MIN,
  JOIN_DESKTOP_APPLY_TITLE_CARD_GAP,
  JOIN_DESKTOP_APPLY_TITLE_TOP_PAD,
  JOIN_DESKTOP_CONTENT,
  JOIN_DESKTOP_TRACK_ROW_GAP,
  JOIN_MOBILE_APPLY_FOOTER_PAD,
  JOIN_MOBILE_APPLY_SCROLL_MARGIN,
  JOIN_MOBILE_APPLY_SECTION,
} from "@/lib/join/join-layout";

export function JoinApplyFormSection({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        id={JOIN_APPLY_SECTION_ID}
        className={`flex w-full flex-col justify-center ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP} ${JOIN_MOBILE_APPLY_SECTION} ${JOIN_MOBILE_APPLY_FOOTER_PAD} ${JOIN_MOBILE_APPLY_SCROLL_MARGIN}`}
        aria-label="Internship application"
      >
        <JoinInternTrackReveal variant="mobile" className="flex w-full flex-col justify-center">
          <DoePhoneSectionTitle line1="Build your" line2="applicant card." />
        </JoinInternTrackReveal>
        <div className={`${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} w-full`}>
          <JoinInternTrackReveal variant="mobile" className="w-full">
            <JoinApplyForm variant="mobile" />
          </JoinInternTrackReveal>
        </div>
      </section>
    );
  }

  return (
    <section
      id={JOIN_APPLY_SECTION_ID}
      className={`flex w-full flex-col justify-center ${JOIN_DESKTOP_TRACK_ROW_GAP} ${JOIN_DESKTOP_APPLY_SECTION_MIN} ${JOIN_DESKTOP_APPLY_FOOTER_PAD} ${JOIN_DESKTOP_APPLY_SCROLL_MARGIN}`}
      aria-label="Internship application"
    >
      <div className={`${JOIN_DESKTOP_CONTENT} ${JOIN_DESKTOP_APPLY_TITLE_TOP_PAD}`}>
        <JoinInternTrackReveal variant="desktop" className="flex w-full flex-col justify-center">
          <DoePhoneSectionTitle line1="Build your" line2="applicant card." />
        </JoinInternTrackReveal>
        <div className={`${JOIN_DESKTOP_APPLY_TITLE_CARD_GAP} w-full`}>
          <JoinInternTrackReveal variant="desktop" className="w-full">
            <JoinApplyForm variant="desktop" />
          </JoinInternTrackReveal>
        </div>
      </div>
    </section>
  );
}

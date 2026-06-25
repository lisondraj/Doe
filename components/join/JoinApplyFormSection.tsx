"use client";

import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { JoinApplyForm } from "@/components/join/JoinApplyForm";
import { JoinInternTrackReveal } from "@/components/join/JoinInternTrackReveal";
import {
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
} from "@/lib/doephone/section-styles";
import {
  JOIN_DESKTOP_APPLY_FOOTER_PAD,
  JOIN_DESKTOP_APPLY_SECTION_MIN,
  JOIN_DESKTOP_CONTENT,
  JOIN_DESKTOP_TRACK_ROW_GAP,
  JOIN_MOBILE_APPLY_SECTION,
  JOIN_MOBILE_APPLY_SECTION_PAD,
  JOIN_MOBILE_APPLY_TITLE_CARD_GAP,
} from "@/lib/join/join-layout";

export function JoinApplyFormSection({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        className={`flex w-full flex-col justify-center ${JOIN_MOBILE_APPLY_SECTION} ${JOIN_MOBILE_APPLY_SECTION_PAD}`}
        aria-label="Internship application"
      >
        <JoinInternTrackReveal
          variant="mobile"
          className="flex w-full shrink-0 flex-col justify-center"
        >
          <DoePhoneSectionTitle line1="Build your" line2="applicant card." />
          <div className={`${JOIN_MOBILE_APPLY_TITLE_CARD_GAP} w-full shrink-0`}>
            <JoinApplyForm variant="mobile" />
          </div>
        </JoinInternTrackReveal>
      </section>
    );
  }

  return (
    <section
      className={`flex w-full flex-col justify-center ${JOIN_DESKTOP_TRACK_ROW_GAP} ${JOIN_DESKTOP_APPLY_SECTION_MIN} ${JOIN_DESKTOP_APPLY_FOOTER_PAD}`}
      aria-label="Internship application"
    >
      <div className={JOIN_DESKTOP_CONTENT}>
        <JoinInternTrackReveal variant="desktop" className="flex w-full flex-col justify-center">
          <DoePhoneSectionTitle line1="Build your" line2="applicant card." />
          <div className={`${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} w-full`}>
            <JoinApplyForm variant="desktop" />
          </div>
        </JoinInternTrackReveal>
      </div>
    </section>
  );
}

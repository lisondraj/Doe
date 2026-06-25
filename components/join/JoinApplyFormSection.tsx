"use client";

import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { JoinApplyForm } from "@/components/join/JoinApplyForm";
import { JoinInternTrackReveal } from "@/components/join/JoinInternTrackReveal";
import {
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
} from "@/lib/doephone/section-styles";
import { JOIN_DESKTOP_CONTENT, JOIN_MOBILE_APPLY_SECTION } from "@/lib/join/join-layout";

export function JoinApplyFormSection({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        className={`flex w-full flex-col justify-center ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP} ${JOIN_MOBILE_APPLY_SECTION}`}
        aria-label="Internship application"
      >
        <JoinInternTrackReveal variant="mobile" className="flex w-full flex-col py-10 iphone-page:py-12">
          <DoePhoneSectionTitle line1="Build your" line2="applicant card" />
          <div className={`${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} w-full`}>
            <JoinApplyForm variant="mobile" />
          </div>
        </JoinInternTrackReveal>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#F7F6F3] py-14" aria-label="Internship application">
      <div className={JOIN_DESKTOP_CONTENT}>
        <JoinApplyForm variant="desktop" />
      </div>
    </section>
  );
}

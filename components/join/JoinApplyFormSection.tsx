"use client";

import { JoinApplyForm } from "@/components/join/JoinApplyForm";
import { DOEPHONE_SECTION_CAROUSEL_MENU_GAP } from "@/lib/doephone/section-styles";
import { JOIN_DESKTOP_CONTENT, JOIN_MOBILE_APPLY_SECTION } from "@/lib/join/join-layout";

export function JoinApplyFormSection({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        className={`flex w-full flex-col ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP} ${JOIN_MOBILE_APPLY_SECTION}`}
        aria-label="Internship application"
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-8 iphone-page:py-10">
          <JoinApplyForm variant="mobile" />
        </div>
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

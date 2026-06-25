"use client";

import { JoinApplyForm } from "@/components/join/JoinApplyForm";
import { JoinInternTrackReveal } from "@/components/join/JoinInternTrackReveal";
import { BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_MENU_GAP } from "@/lib/doephone/section-styles";
import { JOIN_DESKTOP_CONTENT, JOIN_MOBILE_APPLY_SECTION } from "@/lib/join/join-layout";
import { suisseIntl } from "@/lib/home/fonts";

const JOIN_APPLY_TITLE_TW = `mb-6 text-center font-normal leading-[1.06] tracking-[-0.028em] text-[#1E343A] text-[clamp(2rem,1.65rem+1.55vmin,2.55rem)] iphone-page:mb-7 iphone-page:text-[clamp(2.35rem,1.92rem+2.1vmin,3.05rem)] ${suisseIntl.className}`;

export function JoinApplyFormSection({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        className={`flex w-full flex-col justify-center ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP} ${JOIN_MOBILE_APPLY_SECTION} ${BLOG_PAGE_INSET_X}`}
        aria-label="Internship application"
      >
        <JoinInternTrackReveal variant="mobile" className="flex w-full flex-col items-center py-10 iphone-page:py-12">
          <h2 className={JOIN_APPLY_TITLE_TW}>
            <span className="block">Build your</span>
            <span className="block">applicant card</span>
          </h2>
          <JoinApplyForm variant="mobile" />
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

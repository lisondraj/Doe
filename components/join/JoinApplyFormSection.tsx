"use client";

import { JoinApplyForm } from "@/components/join/JoinApplyForm";
import { BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_MENU_GAP } from "@/lib/doephone/section-styles";
import { JOIN_DESKTOP_CONTENT, JOIN_MOBILE_APPLY_SECTION } from "@/lib/join/join-layout";

export function JoinApplyFormSection({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        className={`flex w-full flex-col justify-center bg-[#F7F6F3] ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP} ${JOIN_MOBILE_APPLY_SECTION}`}
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
        aria-label="Internship application"
      >
        <div className={`${BLOG_PAGE_INSET_X} flex w-full flex-1 flex-col justify-center py-10 iphone-page:py-12`}>
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

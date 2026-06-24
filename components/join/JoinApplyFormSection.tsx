"use client";

import { JoinApplyForm } from "@/components/join/JoinApplyForm";
import { BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_MENU_GAP } from "@/lib/doephone/section-styles";
import { JOIN_DESKTOP_CONTENT, JOIN_MOBILE_APPLY_SECTION } from "@/lib/join/join-layout";

export function JoinApplyFormSection({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        className={`flex w-full flex-col ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP} ${JOIN_MOBILE_APPLY_SECTION} ${BLOG_PAGE_INSET_X}`}
        aria-label="Internship application"
      >
        <div className="w-full pt-8 pb-10 iphone-page:pt-10 iphone-page:pb-12">
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

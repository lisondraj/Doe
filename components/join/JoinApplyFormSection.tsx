"use client";

import { JoinApplyForm } from "@/components/join/JoinApplyForm";
import { BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";
import { JOIN_DESKTOP_CONTENT } from "@/lib/join/join-layout";

export function JoinApplyFormSection({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        className="w-full bg-[#F7F6F3] py-12 iphone-page:py-14"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
        aria-label="Internship application"
      >
        <div className={BLOG_PAGE_INSET_X}>
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

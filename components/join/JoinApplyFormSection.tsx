"use client";

import { JoinApplyForm } from "@/components/join/JoinApplyForm";
import { BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_VIEWPORT_SECTION } from "@/lib/doephone/section-styles";
import { JOIN_DESKTOP_CONTENT, JOIN_DESKTOP_VIEWPORT_SPACER } from "@/lib/join/join-layout";

export function JoinApplyFormSection({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        className={`${DOEPHONE_VIEWPORT_SECTION} flex flex-col bg-[#F7F6F3]`}
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
        aria-label="Internship application"
      >
        <div className={`flex min-h-0 flex-1 flex-col ${BLOG_PAGE_INSET_X} py-[clamp(2.5rem,2rem+2vmin,3.5rem)]`}>
          <JoinApplyForm />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${JOIN_DESKTOP_VIEWPORT_SPACER} flex w-full flex-col bg-[#F7F6F3]`}
      aria-label="Internship application"
    >
      <div
        className={`${JOIN_DESKTOP_CONTENT} flex min-h-0 flex-1 flex-col py-16`}
      >
        <div className="mx-auto flex w-full max-w-xl min-h-0 flex-1 flex-col">
          <JoinApplyForm />
        </div>
      </div>
    </section>
  );
}

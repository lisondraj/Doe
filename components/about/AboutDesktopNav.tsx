"use client";

import { JOIN_DESKTOP_CONTENT } from "@/lib/join/join-layout";
import { scrollToJoinApplySection } from "@/lib/join/join-apply-scroll";
import { lora } from "@/lib/home/fonts";

/** Beige desktop nav for /about — separate from /join for future layout changes. */
export function AboutDesktopNav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#E6E6E6]"
      style={{ backgroundColor: "#F7F6F3" }}
      aria-label="Site"
    >
      <div className={`${JOIN_DESKTOP_CONTENT} flex items-center justify-between py-6`}>
        <h1 className={`text-4xl font-normal text-black ${lora.className}`}>Doe</h1>

        <button
          type="button"
          onClick={scrollToJoinApplySection}
          className="rounded-lg bg-black px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
        >
          Apply
        </button>
      </div>
    </nav>
  );
}

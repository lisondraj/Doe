"use client";

import { JoinApplyForm } from "@/components/join/JoinApplyForm";
import { JOIN_DESKTOP_CONTENT, JOIN_MOBILE_APPLY_SECTION } from "@/lib/join/join-layout";
import { DOEPHONE_SECTION_CAROUSEL_MENU_GAP } from "@/lib/doephone/section-styles";
import { BLOG_LANDING_HERO_CORNER_PAD } from "@/lib/blog/blog-layout-styles";
import { lora } from "@/lib/home/fonts";

const JOIN_APPLY_LORA_SIZE =
  "text-[clamp(2.35rem,8vw,3.55rem)] iphone-page:text-[clamp(2.5rem,1.9rem+3.4vmin,4.15rem)]";

export function JoinApplyFormSection({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        className={`flex w-full flex-col ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP} ${JOIN_MOBILE_APPLY_SECTION}`}
        aria-label="Internship application"
      >
        {/* Carousel: grows to fill available space, stays vertically centered */}
        <div className="flex flex-1 flex-col justify-center py-6 iphone-page:py-8">
          <JoinApplyForm variant="mobile" />
        </div>

        {/* Lora headline anchored at the bottom — mirrors hero card style */}
        <p
          className={`font-normal leading-[1.04] tracking-[-0.035em] text-[#1E343A] ${JOIN_APPLY_LORA_SIZE} ${BLOG_LANDING_HERO_CORNER_PAD} ${lora.className}`}
          style={{ paddingTop: 0 }}
        >
          <span className="block">Redefine care</span>
          <span className="block">with us.</span>
        </p>
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

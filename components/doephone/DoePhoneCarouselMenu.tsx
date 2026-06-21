"use client";

import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { suisseIntl } from "@/lib/home/fonts";

export function DoePhoneCarouselMenu({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="grid w-full grid-cols-4 grid-rows-2 gap-[clamp(0.35rem,0.28rem+0.45vmin,0.55rem)]"
      role="tablist"
      aria-label="Communication feature slides"
    >
      {DOEPHONE_COMMUNICATION_SLIDES.map((slide, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`doephone-comm-slide-${slide.id}`}
            className={`flex min-h-[clamp(2.65rem,2.2rem+1.85vmin,3.35rem)] items-center justify-center rounded-[clamp(0.45rem,0.38rem+0.32vmin,0.58rem)] border px-1 text-center transition-colors active:opacity-80 ${suisseIntl.className} text-[clamp(0.62rem,0.54rem+0.38vmin,0.74rem)] font-light leading-[1.15] tracking-[-0.02em] ${
              active
                ? "border-[#1E343A] bg-[#1E343A] text-white"
                : "border-[#E0DDD6] bg-white text-[#1E343A] hover:border-[#C8C4BC]"
            }`}
            onClick={() => onSelect(index)}
          >
            {slide.menuLabel}
          </button>
        );
      })}
    </div>
  );
}

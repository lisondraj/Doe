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
      className="grid w-full grid-cols-4 grid-rows-2 gap-[clamp(0.45rem,0.35rem+0.55vmin,0.68rem)] iphone-page:gap-[clamp(0.5rem,0.38rem+0.62vmin,0.75rem)]"
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
            className={`flex min-h-[clamp(3.15rem,2.65rem+2.15vmin,4.05rem)] items-center justify-center rounded-[clamp(0.5rem,0.42rem+0.35vmin,0.65rem)] border px-[clamp(0.28rem,0.2rem+0.35vmin,0.45rem)] text-center transition-colors active:opacity-80 ${suisseIntl.className} text-[clamp(0.76rem,0.66rem+0.48vmin,0.9rem)] iphone-page:text-[clamp(0.82rem,0.7rem+0.55vmin,0.98rem)] font-light leading-[1.12] tracking-[-0.02em] ${
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

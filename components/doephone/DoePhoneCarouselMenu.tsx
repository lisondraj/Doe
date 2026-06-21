"use client";

import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { suisseIntl } from "@/lib/home/fonts";

function menuLabelLines(label: string): [string] | [string, string] {
  const space = label.indexOf(" ");
  if (space === -1) return [label];
  return [label.slice(0, space), label.slice(space + 1)];
}

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
        const lines = menuLabelLines(slide.menuLabel);

        return (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`doephone-comm-slide-${slide.id}`}
            className={`flex min-h-[clamp(3.85rem,3.25rem+2.65vmin,5rem)] items-center justify-center rounded-[clamp(0.5rem,0.42rem+0.35vmin,0.65rem)] border px-[clamp(0.22rem,0.16rem+0.28vmin,0.38rem)] py-[clamp(0.35rem,0.28rem+0.35vmin,0.5rem)] text-center transition-colors active:opacity-80 ${suisseIntl.className} font-light tracking-[-0.02em] ${
              active
                ? "border-[#1E343A] bg-[#1E343A] text-white"
                : "border-[#E0DDD6] bg-white text-[#1E343A] hover:border-[#C8C4BC]"
            }`}
            onClick={() => onSelect(index)}
          >
            <span className="flex flex-col items-center justify-center gap-[0.08em] leading-[1.08] text-[clamp(0.95rem,0.84rem+0.55vmin,1.12rem)] iphone-page:text-[clamp(1.02rem,0.9rem+0.62vmin,1.2rem)]">
              <span>{lines[0]}</span>
              {lines[1] ? <span>{lines[1]}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

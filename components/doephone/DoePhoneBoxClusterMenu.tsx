"use client";

import { DOEPHONE_BOX_CLUSTER_PRESETS } from "@/lib/doephone/section-box-cluster-backdrops";
import { DOE_BRAND_GRADIENT_LINE } from "@/lib/doephone/section-styles";
import { suisseIntl } from "@/lib/home/fonts";

export function DoePhoneBoxClusterMenu({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="grid w-full grid-cols-4 gap-[clamp(0.58rem,0.45rem+0.65vmin,0.88rem)] iphone-page:gap-[clamp(0.65rem,0.5rem+0.72vmin,0.95rem)]"
      role="tablist"
      aria-label="Practice feature views"
    >
      {DOEPHONE_BOX_CLUSTER_PRESETS.map((preset, index) => {
        const active = index === activeIndex;

        return (
          <button
            key={preset.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`doephone-box-cluster-${preset.id}`}
            className={`relative flex min-h-[clamp(4.35rem,3.65rem+2.85vmin,5.65rem)] flex-col items-center justify-center overflow-hidden rounded-[clamp(0.42rem,0.35rem+0.28vmin,0.55rem)] px-[clamp(0.32rem,0.24rem+0.38vmin,0.48rem)] py-[clamp(0.58rem,0.46rem+0.45vmin,0.78rem)] pb-[clamp(0.82rem,0.66rem+0.58vmin,1.05rem)] text-center transition-[background-color,color] duration-200 ${suisseIntl.className} font-medium tracking-[-0.02em] ${
              active
                ? "bg-[#E3E1DB] text-[#1E343A]"
                : "bg-[#1E343A]/[0.06] text-[#1E343A]/35"
            }`}
            onClick={() => onSelect(index)}
          >
            <span className="leading-[1.08] text-[clamp(1.28rem,1.1rem+0.85vmin,1.58rem)] iphone-page:text-[clamp(1.34rem,1.16rem+0.92vmin,1.66rem)]">
              {preset.menuLabel}
            </span>
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-[3px] transition-opacity duration-200 ${
                active ? "opacity-100" : "opacity-0"
              }`}
              style={{ background: DOE_BRAND_GRADIENT_LINE }}
            />
          </button>
        );
      })}
    </div>
  );
}

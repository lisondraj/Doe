"use client";

import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";

/** Same shell tint as `DoeSchedulesAppMock` framed chrome (`bg-[#F4F4F5])` — fills frame edges around the white UI */
const MOCK_FRAME_BG = "#F4F4F5";

/**
 * Scaled schedule grid + sidebar — same UI as `/doebuildnew` (`DoeSchedulesAppMock`), tuned for the marketing hero.
 */
function HeroSchedulesMockScaled() {
  return (
    <div className="relative h-[min(360px,44vh)] w-full overflow-visible iphone-page:h-[min(380px,46vh)] sm:h-[min(460px,50vh)] md:h-[min(540px,54vh)] lg:h-[min(620px,58vh)] xl:h-[min(700px,62vh)]">
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-0">
        <div
          className="max-w-full origin-bottom scale-[0.44] iphone-page:scale-[0.48] sm:scale-[0.58] md:scale-[0.76] lg:scale-[0.92] xl:scale-[1.02] 2xl:scale-[1.08]"
          style={{ width: 920, height: 580 }}
        >
          <DoeSchedulesAppMock variant="hero" />
        </div>
      </div>
    </div>
  );
}

/**
 * Hero: tight rounded frame (off-white chrome) + live schedule mock from `/doebuildnew`.
 */
export function DoeHeroScheduleShowcase() {
  return (
    <div
      className="relative mx-auto box-border flex w-full max-w-[min(100%,68rem)] items-end justify-center overflow-hidden rounded-[clamp(1rem,2.4vw,1.5rem)] p-[clamp(0.35rem,0.9vw,0.55rem)] ring-1 ring-neutral-900/[0.07] shadow-none"
      style={{ backgroundColor: MOCK_FRAME_BG }}
    >
      <div
        className="w-full overflow-hidden rounded-[clamp(0.72rem,1.9vw,1.1rem)]"
        style={{ backgroundColor: MOCK_FRAME_BG }}
      >
        <HeroSchedulesMockScaled />
      </div>
    </div>
  );
}

"use client";

import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";

/**
 * Scaled schedule grid + sidebar — same UI as `/doebuildnew` (`DoeSchedulesAppMock`), tuned for the marketing hero.
 */
function HeroSchedulesMockScaled() {
  return (
    <div className="relative h-[min(440px,52vh)] w-full overflow-visible iphone-page:h-[min(460px,54vh)] sm:h-[min(520px,58vh)] md:h-[min(620px,62vh)] lg:h-[min(720px,68vh)] xl:h-[min(800px,71vh)] 2xl:h-[min(860px,73vh)]">
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-0">
        <div
          className="max-w-full origin-bottom scale-[0.58] iphone-page:scale-[0.64] sm:scale-[0.78] md:scale-[0.98] lg:scale-[1.14] xl:scale-[1.26] 2xl:scale-[1.34]"
          style={{ width: 920, height: 580 }}
        >
          <DoeSchedulesAppMock variant="hero" />
        </div>
      </div>
    </div>
  );
}

/**
 * Hero: white frame (matches mock), generous corner radius, minimal inset — live schedule mock from `/doebuildnew`.
 */
export function DoeHeroScheduleShowcase() {
  return (
    <div
      className="relative mx-auto box-border flex w-full max-w-[min(100%,80rem)] items-end justify-center overflow-hidden rounded-[clamp(1.35rem,3.2vw,2.45rem)] border border-neutral-900/[0.06] bg-white p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-1"
    >
      <div className="w-full overflow-hidden rounded-[clamp(1.05rem,2.55vw,2.05rem)] bg-white">
        <HeroSchedulesMockScaled />
      </div>
    </div>
  );
}

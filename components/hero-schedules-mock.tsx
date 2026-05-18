"use client";

import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";

/** Schedules product mock for the marketing hero — white rounded frame matching app chrome. */
export function HeroSchedulesMock() {
  return (
    <div
      className="relative w-full max-w-[min(100%,56rem)] overflow-hidden rounded-[clamp(1.15rem,3.25vw,1.85rem)] bg-white ring-1 ring-black/[0.06]"
      aria-hidden
    >
      <div className="relative h-[clamp(16.5rem,50vh,28.5rem)] w-full overflow-hidden">
        <div className="absolute left-0 top-0 h-[640px] w-[1100px] origin-top-left scale-[0.34] iphone-page:scale-[0.3] sm:scale-[0.4] md:scale-[0.46] lg:scale-[0.52]">
          <DoeSchedulesAppMock variant="hero" />
        </div>
      </div>
    </div>
  );
}

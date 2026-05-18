"use client";

import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";

/**
 * Marketing hero: same interactive Schedule UI mock as `/doebuildnew`, scaled to the hero frame.
 */
export function DoeHeroScheduleMock() {
  return (
    <div className="relative h-[min(280px,36vh)] w-full overflow-hidden iphone-page:h-[min(300px,38vh)] sm:h-[min(380px,42vh)] md:h-[min(460px,48vh)] lg:h-[min(540px,52vh)] xl:h-[min(580px,56vh)]">
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-0">
        <div
          className="max-w-full origin-bottom scale-[0.34] iphone-page:scale-[0.38] sm:scale-[0.46] md:scale-60 lg:scale-75 xl:scale-90 2xl:scale-[0.96]"
          style={{ width: 920, height: 580 }}
        >
          <DoeSchedulesAppMock variant="hero" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { DoePhoneBuildWorkflowPrompt } from "@/components/doephone/DoePhoneBuildWorkflowPrompt";
import { DOEPHONE_SECTION_CAROUSEL_INSET_X } from "@/lib/doephone/section-styles";
import {
  doePhoneSectionRevealSegmentClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";
import { useEffect, useState } from "react";

/** Workflow AI input — bottom of the every-specialty section. */
export function DoePhoneHomeSpecialtyWorkflowInput() {
  const { ref, revealed } = useDoePhoneSectionReveal();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div
      ref={ref}
      className={`home-feature-specialties__workflow-input relative z-[2] shrink-0 ${DOEPHONE_SECTION_CAROUSEL_INSET_X} pb-[clamp(1.35rem,0.85rem+1.75vmin,2.15rem)] layout-desktop:absolute layout-desktop:bottom-0 layout-desktop:right-0 layout-desktop:z-[30] layout-desktop:w-[clamp(28rem,42vw,44rem)] layout-desktop:max-w-full layout-desktop:pb-6 layout-desktop:pl-0 layout-desktop:pr-10 md:layout-desktop:pr-20 lg:layout-desktop:pr-28 xl:layout-desktop:pr-36 ${doePhoneSectionRevealSegmentClass("input", revealed)}`}
    >
      <div className="build-workflow-ui-scale">
        <DoePhoneBuildWorkflowPrompt size={isDesktop ? "desktop" : "large"} />
      </div>
    </div>
  );
}

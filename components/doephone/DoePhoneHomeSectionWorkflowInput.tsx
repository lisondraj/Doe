"use client";

import { DoePhoneBuildWorkflowPrompt } from "@/components/doephone/DoePhoneBuildWorkflowPrompt";
import { DOEPHONE_SECTION_CAROUSEL_INSET_X } from "@/lib/doephone/section-styles";
import { useEffect, useState } from "react";

/** Workflow AI input — bottom of a home section band. */
export function DoePhoneHomeSectionWorkflowInput() {
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
      className={`home-feature-section__workflow-input relative z-[20] w-full shrink-0 ${DOEPHONE_SECTION_CAROUSEL_INSET_X} pb-[clamp(1.35rem,0.85rem+1.75vmin,2.15rem)] layout-desktop:absolute layout-desktop:bottom-0 layout-desktop:right-0 layout-desktop:z-[30] layout-desktop:w-[clamp(28rem,42vw,44rem)] layout-desktop:max-w-full layout-desktop:pb-6 layout-desktop:pl-0 layout-desktop:pr-10 md:layout-desktop:pr-20 lg:layout-desktop:pr-28 xl:layout-desktop:pr-36`}
    >
      <div className="build-workflow-ui-scale">
        <DoePhoneBuildWorkflowPrompt size={isDesktop ? "desktop" : "large"} />
      </div>
    </div>
  );
}

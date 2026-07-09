"use client";

import { DoePhoneBuildWorkflowPrompt } from "@/components/doephone/DoePhoneBuildWorkflowPrompt";
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
    <div className="home-feature-section__workflow-input relative z-[20] w-full shrink-0">
      <div className="build-workflow-ui-scale">
        <DoePhoneBuildWorkflowPrompt
          size={isDesktop ? "desktop" : "large"}
          bodyClassName="home-feature-workflow-prompt__body"
          promptText="Build a refill request voice agent that verifies the patient, checks the active med list, and routes eligible refills to the pharmacy or others to the front desk."
        />
      </div>
    </div>
  );
}

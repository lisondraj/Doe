"use client";

import {
  DoePhoneAmbientPromptCard,
  PromptTag,
} from "@/components/doephone/DoePhoneAmbientPromptCard";

/** Shared New Workflow prompt — Build band and specialty section. */
export function DoePhoneBuildWorkflowPrompt({
  layout = "section",
  size = "large",
  bodyClassName,
  fourLineLayout = false,
}: {
  layout?: "carousel" | "section";
  size?: "default" | "large" | "desktop";
  bodyClassName?: string;
  fourLineLayout?: boolean;
}) {
  const promptBody = fourLineLayout ? (
    <>
      <span className="block">
        Show me which patients have been enrolled in <PromptTag label="Clinical Trial #473" />
      </span>
      <span className="block">
        from my EMR, compile results in <PromptTag label="Excel" /> and
      </span>
      <span className="block">
        integrate data from <PromptTag label="OpenEvidence" /> and email to
      </span>
      <span className="block">
        <PromptTag label="Melissa Alvarez" />
      </span>
    </>
  ) : (
    <>
      Show me which patients have been enrolled in <PromptTag label="Clinical Trial #473" /> from my EMR,
      compile results in <PromptTag label="Excel" /> and integrate data from{" "}
      <PromptTag label="OpenEvidence" /> and email to <PromptTag label="Melissa Alvarez" />
    </>
  );

  return (
    <DoePhoneAmbientPromptCard
      headerLabel="New Workflow"
      layout={layout}
      toolIcons="workflow"
      size={size}
      bodyClassName={bodyClassName}
    >
      {promptBody}
    </DoePhoneAmbientPromptCard>
  );
}

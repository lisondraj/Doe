"use client";

import {
  DoePhoneAmbientPromptCard,
  PromptTag,
  WorkflowMentionAt,
} from "@/components/doephone/DoePhoneAmbientPromptCard";

/** Shared New Workflow prompt — Build section and carousel swaps. */
export function DoePhoneBuildWorkflowPrompt({
  layout = "section",
  size = "desktop",
}: {
  layout?: "carousel" | "section";
  size?: "default" | "large" | "desktop";
}) {
  return (
    <DoePhoneAmbientPromptCard
      headerLabel="New Workflow"
      layout={layout}
      toolIcons="workflow"
      size={size}
    >
      Show me which patients have been enrolled in <PromptTag label="Clinical Trial #473" /> from my EMR,
      compile results in <PromptTag label="Excel" /> and integrate data from{" "}
      <PromptTag label="OpenEvidence" /> + email to <WorkflowMentionAt />
    </DoePhoneAmbientPromptCard>
  );
}

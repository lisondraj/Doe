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
      <span className="home-feature-workflow-prompt__line">
        Build me a voice agent that schedules appointments in
      </span>
      <span className="home-feature-workflow-prompt__line">
        <PromptTag label="Google Calendar" /> emails my receptionist <PromptTag label="Andrea Tu" />
      </span>
      <span className="home-feature-workflow-prompt__line">
        and <PromptTag label="calls the patient" /> 2 days before to confirm.
      </span>
    </>
  ) : (
    <>
      Build me a voice agent that schedules appointments in <PromptTag label="Google Calendar" /> emails my
      receptionist <PromptTag label="Andrea Tu" /> and <PromptTag label="calls the patient" /> 2 days before to
      confirm.
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

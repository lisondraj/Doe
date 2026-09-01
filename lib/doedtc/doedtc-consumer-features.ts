/**
 * Consumer-facing Doe capabilities for onboarding copy.
 * Each bullet is a daily example; `tools` must stay in sync with DOEDTC_AGENT_TOOLS.
 */
export const DOE_DTC_CONSUMER_FEATURES = [
  {
    line: "I woke up with a sore throat — stay with me and walk through what it might be",
    tools: ["log_symptoms", "run_assessment"],
  },
  {
    line: "Remind me to take my Ozempic at 8 tonight, or ping me in 5 seconds",
    tools: ["schedule_text"],
  },
  {
    line: "Add my son Simon, or make sure the kids take a bath",
    tools: ["log_family_member", "start_habit_workflow"],
  },
  {
    line: "I started a new inhaler, or I have a refill next Wednesday",
    tools: ["add_medication", "log_appointment"],
  },
  {
    line: "Track my days without smoking, water, or calories",
    tools: ["create_profile_artifact", "log_artifact_entry"],
  },
  {
    line: "Prepare a summary for my doctor",
    tools: ["create_preparation"],
  },
  {
    line: "How do I take Ozempic?",
    tools: ["create_guide"],
  },
  {
    line: "Look up asthma on Mayo, or screenshot the page",
    tools: ["start_browser_task", "browser_snapshot", "browser_computer"],
  },
  {
    line: "Is my Whoop connected?",
    tools: ["read_profile", "send_profile_link"],
  },
  {
    line: "Send a Listen link for my appointment",
    tools: ["start_listen"],
  },
] as const;

export function buildDoeDtcAllSetMessage(): string {
  const bullets = DOE_DTC_CONSUMER_FEATURES.map((feature) => `- ${feature.line}`).join("\n");
  return [
    "All set. Here's what you can text me:",
    "",
    bullets,
    "",
    "Ask anytime to see your profile. You'll get a link like the one below.",
  ].join("\n");
}

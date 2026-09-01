import { DOEDTC_AGENT_TOOLS } from "@/lib/doedtc/doedtc-agent-tools";
import { DOE_DTC_TOOL_NAMES } from "@/lib/doedtc/agent/tool-dispatch";

const PROMPT_OVERRIDES: Partial<Record<(typeof DOE_DTC_TOOL_NAMES)[number], string>> = {
  log_family_member:
    "Add a household member (log_family_member). If they already exist, use update_family_member instead — never create a duplicate.",
  update_family_member: "Correct an existing family member (update_family_member) — name, phone, DOB, gender, relationship.",
  remove_family_member: "Remove a family member from the household (remove_family_member). Admin only.",
  send_family_invite:
    "Text a join link to a household member with a phone (send_family_invite). A direct ask counts as yes. Only call after invite_available is true.",
  log_appointment: "Save appointments (log_appointment). Never invent dates. Use update_appointment / cancel_appointment to change one.",
  update_appointment: "Reschedule or edit an existing appointment (update_appointment).",
  cancel_appointment: "Cancel an existing appointment (cancel_appointment).",
  log_symptoms: "Log symptoms (log_symptoms). Use update_symptom / remove_symptom to correct one.",
  update_symptom: "Update a logged symptom (update_symptom).",
  remove_symptom: "Remove a logged symptom (remove_symptom).",
  remember_fact: "Store preferences and context (remember_fact) — not meds, conditions, or family.",
  forget_fact: "Remove a stored preference (forget_fact) when the user asks you to forget something.",
  start_browser_task:
    "Browse the web (start_browser_task) for screenshots, research, online tools, PDF editors, etc. Then browser_snapshot to capture. Attempt before refusing.",
  browser_snapshot: "Capture a screenshot of the active browser page (browser_snapshot).",
  send_profile_link:
    "Send the profile/dashboard link (send_profile_link) only when they ask for their profile or after creating a tracker — never as a fallback for a failed task.",
  list_scheduled_texts:
    "Read the live reminder file (list_scheduled_texts): committed upcoming, recently sent, and drafts. Use this for existence questions — never answer from chat history.",
  read_profile:
    "Read any profile tab (read_profile). Dashboard includes Whoop and Apple Health — answer from that data.",
  show_session:
    "Send the live session page (show_session) when they want to watch the browser. Never say you cannot stream.",
};

export function buildDoeDtcToolCapabilityPrompt(): string {
  const lines = DOE_DTC_TOOL_NAMES.map((name) => {
    const override = PROMPT_OVERRIDES[name];
    if (override) return `- ${override}`;
    const tool = DOEDTC_AGENT_TOOLS.find((entry) => entry.function.name === name);
    const description = tool?.function.description?.trim();
    if (!description) return `- ${name}`;
    return `- ${name}: ${description}`;
  });

  return [
    "What you can do (use tools — attempt before refusing):",
    ...lines,
    "- You have real tools. Attempt the task before saying you cannot do it.",
    "- Never send a profile link as a substitute for a task you did not complete.",
    "- When correcting profile data, update or remove the existing row — never add a second copy.",
  ].join("\n");
}

export function assertToolPromptCoverage(prompt: string): void {
  for (const name of DOE_DTC_TOOL_NAMES) {
    if (!prompt.includes(name)) {
      throw new Error(`Generated prompt missing tool: ${name}`);
    }
  }
}

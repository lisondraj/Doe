import { Agent } from "@openai/agents";

import { createDoeDtcSdkTools } from "@/lib/doedtc/agent/tools";
import { doeReplyOutputGuardrail } from "@/lib/doedtc/agent/guardrails";
import { DoeReplySchema, resolveDoeDtcAgentModel, type DoeDtcRunContext } from "@/lib/doedtc/agent/types";

const HEALTH_TOOLS = new Set([
  "log_symptoms",
  "run_assessment",
  "log_appointment",
  "log_family_member",
  "send_family_invite",
  "add_medication",
  "update_medication",
  "remove_medication",
  "add_condition",
  "update_condition",
  "remove_condition",
  "create_profile_artifact",
  "update_profile_artifact",
  "log_artifact_entry",
  "share_artifact",
  "unshare_artifact",
  "update_artifact_entry",
  "remove_artifact_entry",
  "create_preparation",
  "read_profile",
  "remember_fact",
  "submit_ticket",
  "revoke_household_access",
]);

const GUIDE_TOOLS = new Set([
  "create_guide",
  "save_guide",
  "update_guide",
  "list_guides",
  "send_guide_link",
]);

const SCHEDULING_TOOLS = new Set([
  "propose_scheduled_text",
  "schedule_text",
  "cancel_scheduled_text",
  "list_scheduled_texts",
  "propose_accountability",
  "start_accountability",
  "propose_habit_workflow",
  "start_habit_workflow",
  "cancel_habit_workflow",
  "invite_accountability_partner",
  "log_accountability_checkin",
  "withdraw_accountability",
  "pause_accountability",
  "resume_accountability",
]);

const BROWSER_TOOLS = new Set([
  "start_browser_task",
  "browser_navigate",
  "browser_act",
  "browser_computer",
  "browser_snapshot",
  "request_vault",
  "request_live_login",
  "show_session",
  "request_commit",
  "start_listen",
  "send_profile_link",
]);

function subsetTools(ctx: DoeDtcRunContext, allowed: Set<string>) {
  return createDoeDtcSdkTools(ctx).filter((entry) => allowed.has(entry.name));
}

export function createDoeSpecialistAgents(ctx: DoeDtcRunContext & { instructions: string }) {
  const healthRecord = new Agent<DoeDtcRunContext>({
    name: "healthRecord",
    instructions: "Handle symptoms, assessments, meds, conditions, appointments, family, and profile reads.",
    tools: subsetTools(ctx, HEALTH_TOOLS),
  });

  const guides = new Agent<DoeDtcRunContext>({
    name: "guides",
    instructions: "Create, update, save, and send visual how-to guides.",
    tools: subsetTools(ctx, GUIDE_TOOLS),
  });

  const scheduling = new Agent<DoeDtcRunContext>({
    name: "scheduling",
    instructions: "Schedule texts, accountability pacts, and habit workflows.",
    tools: subsetTools(ctx, SCHEDULING_TOOLS),
  });

  const browser = new Agent<DoeDtcRunContext>({
    name: "browser",
    instructions: "Run Kernel browser tasks, snapshots, vault, listen links, and profile links.",
    tools: subsetTools(ctx, BROWSER_TOOLS),
  });

  const manager = new Agent<DoeDtcRunContext>({
    name: "Doe",
    instructions: ctx.instructions,
    model: resolveDoeDtcAgentModel(),
    outputType: DoeReplySchema,
    outputGuardrails: [doeReplyOutputGuardrail],
    tools: [
      healthRecord.asTool({ toolName: "health_record", toolDescription: "Health chart reads and writes." }),
      guides.asTool({ toolName: "guides", toolDescription: "Visual guide authoring." }),
      scheduling.asTool({ toolName: "scheduling", toolDescription: "Reminders, accountability, and habit workflows." }),
      browser.asTool({ toolName: "browser", toolDescription: "Web research and browser automation." }),
    ],
  });

  return { manager, healthRecord, guides, scheduling, browser };
}

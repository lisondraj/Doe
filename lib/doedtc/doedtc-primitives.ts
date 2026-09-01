/** Primitive verbs the agent composes. Code enforces; tools map to Linq, Kernel SDK, Mem0 SDK, and Supabase. */

export type DoePrimitiveBackend = "linq" | "kernel" | "mem0" | "supabase";

export type DoePrimitiveVerb =
  | "message.send"
  | "message.schedule"
  | "message.await_reply"
  | "habit.recurring"
  | "profile.read"
  | "profile.write"
  | "health.chart"
  | "health.assess"
  | "results.log"
  | "tracker.create"
  | "tracker.log"
  | "tracker.share"
  | "guide.author"
  | "visit.prepare"
  | "visit.listen"
  | "visit.recall"
  | "household.add"
  | "household.invite"
  | "household.revoke"
  | "browser.research"
  | "browser.act"
  | "browser.commit"
  | "memory.remember"
  | "memory.recall"
  | "feedback.submit"
  | "imessage.texture";

export type DoePrimitive = {
  verb: DoePrimitiveVerb;
  backends: readonly DoePrimitiveBackend[];
  tools: readonly string[];
};

export const DOE_PRIMITIVES: readonly DoePrimitive[] = [
  {
    verb: "message.send",
    backends: ["linq"],
    tools: ["schedule_text"],
  },
  {
    verb: "message.schedule",
    backends: ["linq", "supabase"],
    tools: ["schedule_text", "propose_scheduled_text", "list_scheduled_texts", "cancel_scheduled_text"],
  },
  {
    verb: "message.await_reply",
    backends: ["linq", "supabase"],
    tools: [
      "start_habit_workflow",
      "propose_habit_workflow",
      "start_workflow",
      "propose_workflow",
      "cancel_habit_workflow",
    ],
  },
  {
    verb: "habit.recurring",
    backends: ["linq", "supabase"],
    tools: [
      "start_habit_workflow",
      "propose_habit_workflow",
      "start_workflow",
      "propose_workflow",
      "cancel_habit_workflow",
      "start_accountability",
      "propose_accountability",
      "invite_accountability_partner",
      "log_accountability_checkin",
      "withdraw_accountability",
      "pause_accountability",
      "resume_accountability",
    ],
  },
  {
    verb: "profile.read",
    backends: ["supabase"],
    tools: ["read_profile", "send_profile_link", "list_guides", "list_scheduled_texts"],
  },
  {
    verb: "profile.write",
    backends: ["supabase"],
    tools: [
      "log_symptoms",
      "update_symptom",
      "remove_symptom",
      "add_medication",
      "update_medication",
      "remove_medication",
      "add_condition",
      "update_condition",
      "remove_condition",
      "log_appointment",
      "update_appointment",
      "cancel_appointment",
      "log_family_member",
      "update_family_member",
      "remove_family_member",
    ],
  },
  {
    verb: "health.chart",
    backends: ["supabase"],
    tools: [
      "log_symptoms",
      "update_symptom",
      "remove_symptom",
      "add_medication",
      "update_medication",
      "remove_medication",
      "add_condition",
      "update_condition",
      "remove_condition",
      "log_appointment",
      "update_appointment",
      "cancel_appointment",
      "read_profile",
    ],
  },
  {
    verb: "health.assess",
    backends: ["supabase"],
    tools: ["run_assessment"],
  },
  {
    verb: "results.log",
    backends: ["supabase"],
    tools: ["log_result", "remove_result"],
  },
  {
    verb: "tracker.create",
    backends: ["supabase"],
    tools: ["create_profile_artifact", "update_profile_artifact"],
  },
  {
    verb: "tracker.log",
    backends: ["supabase"],
    tools: ["log_artifact_entry", "update_artifact_entry", "remove_artifact_entry"],
  },
  {
    verb: "tracker.share",
    backends: ["supabase"],
    tools: ["share_artifact", "unshare_artifact"],
  },
  {
    verb: "guide.author",
    backends: ["supabase"],
    tools: ["create_guide", "save_guide", "update_guide", "send_guide_link", "list_guides"],
  },
  {
    verb: "visit.prepare",
    backends: ["supabase"],
    tools: ["create_preparation"],
  },
  {
    verb: "visit.listen",
    backends: ["supabase"],
    tools: ["start_listen"],
  },
  {
    verb: "visit.recall",
    backends: ["supabase"],
    tools: ["read_listen_session"],
  },
  {
    verb: "household.add",
    backends: ["supabase"],
    tools: ["log_family_member", "update_family_member", "remove_family_member"],
  },
  {
    verb: "household.invite",
    backends: ["linq", "supabase"],
    tools: ["send_family_invite"],
  },
  {
    verb: "household.revoke",
    backends: ["supabase"],
    tools: ["revoke_household_access"],
  },
  {
    verb: "browser.research",
    backends: ["kernel"],
    tools: ["start_browser_task", "browser_navigate", "browser_snapshot"],
  },
  {
    verb: "browser.act",
    backends: ["kernel"],
    tools: ["browser_act", "browser_computer"],
  },
  {
    verb: "browser.commit",
    backends: ["kernel"],
    tools: ["request_commit", "request_vault", "request_live_login", "show_session"],
  },
  {
    verb: "memory.remember",
    backends: ["mem0"],
    tools: ["remember_fact", "forget_fact"],
  },
  {
    verb: "memory.recall",
    backends: ["mem0"],
    tools: ["read_profile"],
  },
  {
    verb: "feedback.submit",
    backends: ["supabase"],
    tools: ["submit_ticket"],
  },
  {
    verb: "imessage.texture",
    backends: ["linq"],
    tools: ["react_to_message", "use_thread_reply", "send_profile_link"],
  },
] as const;

export const DOE_AGENT_PRIMITIVES_PROMPT = `Primitives (compose these — do not invent a new feature per ask):
- message.schedule → schedule_text (timers, one-shot). Persist immediately, confirm now, fire later — never block the confirmation on the reminder. Body is the thing to remember, not “I’ll remind you”. Not for daily habits.
- message.await_reply + habit.recurring → start_habit_workflow or start_workflow (composed graph for multi-step nag).
- habit.recurring → start_accountability when partner/cadence/privacy matters; else start_habit_workflow or start_workflow.
- health.chart → read_profile + log/update/remove on symptoms, meds, conditions, appointments.
- health.assess → run_assessment when they ask what it might be — not a definitive diagnosis.
- results.log → log_result / remove_result for labs and imaging they report.
- tracker.create / tracker.log / tracker.share → create_profile_artifact once, then log_artifact_entry; share_artifact only on explicit ask.
- guide.author → create_guide (link first), save_guide after yes, update_guide to edit/archive/unsave.
- visit.prepare → create_preparation for doctor/refill summary. visit.listen → start_listen. visit.recall → read_listen_session.
- household.add / household.invite / household.revoke → family chart, send_family_invite, revoke_household_access.
- browser.research → start_browser_task. browser.act → browser_act or browser_computer. browser.commit → request_commit then CONFIRM.
- memory.remember / memory.recall → remember_fact / forget_fact; recall also from Mem0 memories in prompt.
- feedback.submit → submit_ticket for bugs or product feedback.
- imessage.texture → skip react_to_message on routine turns; use_thread_reply sparingly; send_profile_link only when they ask for a profile/tracker link.`;

export function toolsForPrimitive(verb: DoePrimitiveVerb): readonly string[] {
  return DOE_PRIMITIVES.find((row) => row.verb === verb)?.tools ?? [];
}

export function backendsForPrimitive(verb: DoePrimitiveVerb): readonly DoePrimitiveBackend[] {
  return DOE_PRIMITIVES.find((row) => row.verb === verb)?.backends ?? [];
}

export function primitiveToolNames(): string[] {
  return Array.from(new Set(DOE_PRIMITIVES.flatMap((row) => [...row.tools])));
}

export function primitiveCoverageForTool(toolName: string): DoePrimitiveVerb[] {
  return DOE_PRIMITIVES.filter((row) => row.tools.includes(toolName)).map((row) => row.verb);
}

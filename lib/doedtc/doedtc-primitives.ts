/** Primitive verbs the agent composes. Code enforces; tools map to Linq, Kernel SDK, Mem0 SDK, and Supabase. */

export type DoePrimitiveBackend = "linq" | "kernel" | "mem0" | "supabase";

export type DoePrimitiveVerb =
  | "message.send"
  | "message.schedule"
  | "message.await_reply"
  | "habit.recurring"
  | "profile.read"
  | "profile.write"
  | "browser.research"
  | "browser.act"
  | "browser.commit"
  | "memory.remember"
  | "memory.recall";

export type DoePrimitive = {
  verb: DoePrimitiveVerb;
  backends: readonly DoePrimitiveBackend[];
  tools: readonly string[];
};

export const DOE_PRIMITIVES: readonly DoePrimitive[] = [
  {
    verb: "message.send",
    backends: ["linq"],
    tools: [],
  },
  {
    verb: "message.schedule",
    backends: ["linq", "supabase"],
    tools: ["schedule_text", "propose_scheduled_text", "list_scheduled_texts", "cancel_scheduled_text"],
  },
  {
    verb: "message.await_reply",
    backends: ["linq", "supabase"],
    tools: ["start_habit_workflow", "propose_habit_workflow", "cancel_habit_workflow"],
  },
  {
    verb: "habit.recurring",
    backends: ["linq", "supabase"],
    tools: [
      "start_habit_workflow",
      "propose_habit_workflow",
      "cancel_habit_workflow",
      "start_accountability",
      "propose_accountability",
    ],
  },
  {
    verb: "profile.read",
    backends: ["supabase"],
    tools: ["read_profile", "send_profile_link"],
  },
  {
    verb: "profile.write",
    backends: ["supabase"],
    tools: [
      "log_symptoms",
      "add_medication",
      "add_condition",
      "log_family_member",
      "log_appointment",
      "create_profile_artifact",
      "log_artifact_entry",
    ],
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
    tools: ["request_commit"],
  },
  {
    verb: "memory.remember",
    backends: ["mem0"],
    tools: ["remember_fact"],
  },
  {
    verb: "memory.recall",
    backends: ["mem0"],
    tools: [],
  },
] as const;

export const DOE_AGENT_PRIMITIVES_PROMPT = `Primitives (compose these — do not invent a new feature per ask):
- message.schedule → schedule_text (timers, one-shot later). Inline if under ~45 seconds.
- message.await_reply + habit.recurring → start_habit_workflow (daily send → wait for yes/no → notify on miss).
- profile.read / profile.write → read_profile and the matching write tools.
- browser.research → start_browser_task (Kernel residential proxy). browser.act → browser_act or browser_computer (Kernel computer SDK) when selectors fail or you have x/y.
- browser.commit → request_commit then CONFIRM for writes.
- memory.remember / memory.recall → remember_fact; recall is automatic from Mem0.`;

export function toolsForPrimitive(verb: DoePrimitiveVerb): readonly string[] {
  return DOE_PRIMITIVES.find((row) => row.verb === verb)?.tools ?? [];
}

export function backendsForPrimitive(verb: DoePrimitiveVerb): readonly DoePrimitiveBackend[] {
  return DOE_PRIMITIVES.find((row) => row.verb === verb)?.backends ?? [];
}

export function primitiveToolNames(): string[] {
  return Array.from(new Set(DOE_PRIMITIVES.flatMap((row) => [...row.tools])));
}

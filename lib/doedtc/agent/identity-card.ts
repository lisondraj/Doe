import type { DoeDtcOpenLoopContext, DoeDtcOpenLoopRow, DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";

const ACTIVE_LOOP_STATUSES = new Set(["open", "waiting_user", "waiting_tool"]);

function openLoopContext(row: DoeDtcOpenLoopRow): DoeDtcOpenLoopContext {
  return (row.context_json ?? {}) as DoeDtcOpenLoopContext;
}

function lastOpenConcern(openLoops: DoeDtcOpenLoopRow[] | undefined): string | null {
  if (!openLoops?.length) return null;
  const active = openLoops.filter((row) => ACTIVE_LOOP_STATUSES.has(row.status));
  for (const row of active) {
    const ctx = openLoopContext(row);
    if (ctx.concern?.trim()) return ctx.concern.trim();
    if (row.goal?.trim()) return row.goal.trim();
  }
  return null;
}

function preferenceLines(memories: string[] | undefined): string | null {
  if (!memories?.length) return null;
  const prefs = memories
    .map((row) => row.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 3);
  return prefs.length ? `- Prefs: ${prefs.join("; ")}` : null;
}

export function formatIdentityCard(params: {
  snapshot: DoeDtcProfileSnapshot;
  openLoops?: DoeDtcOpenLoopRow[];
  durableMemories?: string[];
}): string {
  const viewerName = params.snapshot.user.full_name?.trim() || "Unknown";
  const householdNames = params.snapshot.household.members
    .filter((row) => row.full_name?.trim())
    .map((row) => `${row.full_name} (${row.relationship})`);
  const meds =
    params.snapshot.medications.slice(0, 10).join(", ") || "None listed";
  const conditions =
    params.snapshot.conditions.slice(0, 10).join(", ") || "None listed";
  const concern = lastOpenConcern(params.openLoops);

  return [
    "Identity (always true — use these names, never invent):",
    `- Viewer: ${viewerName}`,
    householdNames.length
      ? `- Household: ${householdNames.join("; ")}`
      : "- Household: none set up",
    `- Active meds: ${meds}`,
    `- Active conditions: ${conditions}`,
    preferenceLines(params.durableMemories),
    concern ? `- Last open concern: ${concern}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatIdentityCardBlock(card: string): string {
  const trimmed = card.trim();
  return trimmed ? `\n${trimmed}\n` : "";
}

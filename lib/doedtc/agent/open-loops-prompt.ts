import type { DoeDtcOpenLoopRow } from "@/lib/doedtc/doedtc-types";

const ACTIVE_LOOP_STATUSES = new Set(["open", "waiting_user", "waiting_tool"]);

export function formatOpenLoopsBlock(openLoops: DoeDtcOpenLoopRow[]): string {
  const active = openLoops.filter((row) => ACTIVE_LOOP_STATUSES.has(row.status));
  if (active.length === 0) {
    return "Open loops: none.";
  }

  return [
    "Open loops (unfinished jobs — continue these; do not forget):",
    ...active.map((row) => {
      const wake = row.next_wake_at ? ` | wake ${row.next_wake_at}` : "";
      return `- [${row.status}] ${row.goal}${wake} | id: ${row.id}`;
    }),
  ].join("\n");
}

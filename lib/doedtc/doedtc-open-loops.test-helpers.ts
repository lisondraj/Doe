import type { DoeDtcOpenLoopRow } from "@/lib/doedtc/doedtc-types";

/** Test-only export mirroring private template helper. */
export function templateOpenLoopReplyForTest(loop: DoeDtcOpenLoopRow): string | null {
  const ctx = (loop.context_json ?? {}) as {
    kind?: string;
    member_name?: string;
    symptom?: string;
  };
  if (ctx.kind === "unwell_follow_up") {
    const name = ctx.member_name?.trim() || "they";
    const symptom = ctx.symptom?.trim();
    if (symptom) {
      return `Hey — how's ${name} doing? Still dealing with ${symptom}?`;
    }
    return `Hey — how's ${name} feeling today?`;
  }
  if (ctx.kind === "appointment_reminder") {
    return "Quick heads up — you have an appointment coming up soon. Want me to help with anything before then?";
  }
  if (ctx.kind === "lab_follow_up") {
    return "Hey — saw those lab results on your chart. Want help making sense of them or planning next steps?";
  }
  return null;
}

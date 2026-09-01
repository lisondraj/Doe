import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseDoePlan } from "@/lib/doedtc/agent/plan-schema";

describe("DoePlan schema", () => {
  it("accepts scalar tool args used by OpenAI structured output", () => {
    const plan = parseDoePlan({
      intent: "Log a headache",
      action: "act_now",
      immediate: [{ tool: "log_symptoms", args: { raw_text: "headache", severity: "moderate" } }],
      workflow: null,
      reply: "Logged it.",
      specialist: "healthRecord",
    });
    assert.ok(plan);
    assert.equal(plan?.immediate[0]?.tool, "log_symptoms");
  });

  it("rejects unknown nested values in immediate args so the manager can take over", () => {
    const plan = parseDoePlan({
      intent: "Check-in",
      action: "act_now",
      immediate: [{ tool: "start_workflow", args: { graph: { nested: true } } }],
      workflow: null,
      reply: "On it.",
      specialist: "scheduling",
    });
    assert.equal(plan, null);
  });

  it("can construct OpenAI Agents with plan and reply output types", async () => {
    const { Agent } = await import("@openai/agents");
    const { DoePlanSchema } = await import("@/lib/doedtc/agent/plan-schema");
    const { DoeReplySchema } = await import("@/lib/doedtc/agent/types");
    assert.doesNotThrow(() => {
      new Agent({ name: "DoePlanner", instructions: "plan", outputType: DoePlanSchema });
    });
    assert.doesNotThrow(() => {
      new Agent({ name: "Doe", instructions: "reply", outputType: DoeReplySchema });
    });
  });
});

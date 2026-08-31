import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { linqReactionPayload } from "@/lib/doedtc/linq";
import { partitionDoeDtcToolCalls, isSerialDoeDtcTool } from "@/lib/doedtc/agent/tool-parallel";

describe("linqReactionPayload", () => {
  it("builds remove payload for like", () => {
    assert.deepEqual(linqReactionPayload("👍", "remove"), {
      operation: "remove",
      type: "like",
    });
  });

  it("builds custom add payload for checkmark", () => {
    assert.deepEqual(linqReactionPayload("✅", "add"), {
      operation: "add",
      type: "custom",
      custom_emoji: "✅",
    });
  });
});

describe("partitionDoeDtcToolCalls", () => {
  it("keeps browser tools serial", () => {
    assert.equal(isSerialDoeDtcTool("start_browser_task"), true);
    assert.equal(isSerialDoeDtcTool("log_symptoms"), false);

    const calls = [
      { function: { name: "log_symptoms" } },
      { function: { name: "start_browser_task" } },
      { function: { name: "remember_fact" } },
    ];
    const partitioned = partitionDoeDtcToolCalls(calls);
    assert.deepEqual(partitioned.parallelIndexes, [0, 2]);
    assert.deepEqual(partitioned.serialIndexes, [1]);
    assert.equal(partitioned.ordered.length, 3);
  });
});

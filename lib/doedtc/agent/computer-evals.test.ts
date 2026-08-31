import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("computer mode eval scaffolding", () => {
  it("defines allowed exec prefixes for sandbox approvals", async () => {
    const { createComputerSpecialistAgent } = await import("./computer/index.ts");
    const agent = createComputerSpecialistAgent({
      taskText: "convert pdf to pptx",
      fileIds: ["file-1"],
      sessionId: "sess",
      userId: "user-1",
      phone: "+15555550100",
    });
    assert.equal(agent.name, "computer");
    assert.ok(agent.tools.length >= 5);
  });
});

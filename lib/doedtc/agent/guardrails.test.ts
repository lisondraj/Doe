import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { assertDoeReplyVoice, doeReplyOutputGuardrail } from "@/lib/doedtc/agent/guardrails";

describe("doe reply voice guardrail", () => {
  it("flags URLs and markdown without depending on regex lastIndex", () => {
    assert.equal(
      assertDoeReplyVoice({ reply: "See https://doe.care/join", send: [], reaction: null, threadReply: false }),
      "Reply contains a URL.",
    );
    assert.equal(
      assertDoeReplyVoice({ reply: "See https://doe.care/join", send: [], reaction: null, threadReply: false }),
      "Reply contains a URL.",
    );
    assert.equal(
      assertDoeReplyVoice({ reply: "This is **bold**.", send: [], reaction: null, threadReply: false }),
      "Reply contains markdown formatting.",
    );
  });

  it("never trips the output wire — a tripwire aborts the turn with 'Something broke on my side'", async () => {
    const result = await doeReplyOutputGuardrail.execute({
      agentOutput: { reply: "See https://doe.care/join", send: [], reaction: null, threadReply: false },
      agent: {} as never,
      context: {} as never,
    } as never);
    assert.equal(result.tripwireTriggered, false);
  });
});

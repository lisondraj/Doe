import assert from "node:assert/strict";
import test from "node:test";

import {
  extractInboundReplyToMessageId,
  extractInboundText,
} from "@/lib/doedtc/doedtc-messaging";

test("extractInboundReplyToMessageId reads webhook reply_to", () => {
  assert.equal(
    extractInboundReplyToMessageId({
      data: {
        message: {
          id: "msg-in",
          reply_to: { message_id: "msg-parent", part_index: 0 },
          parts: [{ type: "text", value: "Can u help me abstain" }],
        },
      },
    }),
    "msg-parent",
  );
  assert.equal(
    extractInboundReplyToMessageId({
      data: {
        reply_to: { message_id: "msg-parent-2" },
        parts: [{ type: "text", value: "Give me strategies" }],
      },
    }),
    "msg-parent-2",
  );
});

test("extractInboundText still reads plain inbound bodies", () => {
  assert.equal(
    extractInboundText({
      data: {
        parts: [{ type: "text", value: "Plan the next 3 weeks" }],
      },
    }),
    "Plan the next 3 weeks",
  );
});

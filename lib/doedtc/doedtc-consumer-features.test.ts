import assert from "node:assert/strict";
import test from "node:test";

import { DOEDTC_AGENT_TOOLS } from "@/lib/doedtc/doedtc-agent";
import {
  DOE_DTC_CONSUMER_FEATURES,
  buildDoeDtcAllSetMessage,
} from "@/lib/doedtc/doedtc-consumer-features";
import { DOEDTC_LINQ } from "@/lib/doedtc/doedtc-copy";

test("all-set message lists consumer features without markdown or symptom-anytime copy", () => {
  const message = DOEDTC_LINQ.allSetMessage;
  assert.equal(message, buildDoeDtcAllSetMessage());
  assert.match(message, /^All set\. Here's what you can text me:\n\n-/);
  assert.match(message, /Ask anytime to see your profile/);
  assert.match(message, /link like the one below/);
  assert.doesNotMatch(message, /\*\*/);
  assert.doesNotMatch(message, /symptoms anytime/i);
  for (const feature of DOE_DTC_CONSUMER_FEATURES) {
    assert.match(message, new RegExp(`^- ${feature.line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
  }
});

test("consumer feature bullets stay wired to live agent tools", () => {
  const toolNames = new Set(DOEDTC_AGENT_TOOLS.map((tool) => tool.function.name));
  for (const feature of DOE_DTC_CONSUMER_FEATURES) {
    for (const tool of feature.tools) {
      assert.ok(toolNames.has(tool), `${feature.line} references missing tool ${tool}`);
    }
  }
});

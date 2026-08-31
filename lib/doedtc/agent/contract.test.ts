import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DOE_DTC_TURN_RESULT_FIELDS } from "./types.ts";

describe("DoeDtcAgentTurnResult contract", () => {
  it("defines all fields consumed by doedtc-messaging", () => {
    assert.equal(DOE_DTC_TURN_RESULT_FIELDS.length, 19);
    assert.deepEqual([...DOE_DTC_TURN_RESULT_FIELDS], [
      "replyText",
      "careUrl",
      "listenUrl",
      "profileUrl",
      "feedbackUrl",
      "prepareUrl",
      "guideUrl",
      "artifactShareUrl",
      "workUrl",
      "screenshotUrl",
      "vaultUrl",
      "liveViewUrl",
      "sessionUrl",
      "reactionEmoji",
      "replyToInbound",
      "browserNeedsConfirm",
      "browserJobDispatched",
      "assessmentRan",
      "preservePendingOffer",
    ]);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  askedForPrivateAppLink,
  applyDeliverablePolicyToTurnState,
  inferAppLinkOptions,
  interpretDeliverableAsk,
  shouldHonorStructuredSend,
} from "@/lib/doedtc/agent/deliverable-policy";
import { remainingOutboundThinkMs as pacingMs } from "@/lib/doedtc/doedtc-outbound-pacing";
import { shouldAllowProfileLink } from "@/lib/doedtc/agent/turn-integrity";
import { replyClaimsAction } from "@/lib/doedtc/agent/honesty";

describe("deliverable ask detection", () => {
  it("treats profile/tracker link asks as private app links", () => {
    assert.equal(askedForPrivateAppLink("Send me my profile link"), true);
    assert.equal(askedForPrivateAppLink("send link of my weight tracker"), true);
    assert.equal(askedForPrivateAppLink("can you text me the weight tracker url"), true);
  });

  it("does not treat routine health or logging turns as link asks", () => {
    assert.equal(askedForPrivateAppLink("I have a headache"), false);
    assert.equal(askedForPrivateAppLink("Log 3 glasses of water today"), false);
    assert.equal(askedForPrivateAppLink("Remind me ozempic in 10 seconds"), false);
    assert.equal(askedForPrivateAppLink("Yes save it to my profile"), false);
  });

  it("classifies listen/share separately from profile", () => {
    const listen = interpretDeliverableAsk("I want to record my doctor visit");
    assert.equal(listen.has("listen"), true);
    assert.equal(listen.has("profile"), false);

    const share = interpretDeliverableAsk("share a public link to my weight tracker");
    assert.equal(share.has("share"), true);
  });

  it("infers tracker deep-link options from inbound + artifacts", () => {
    const options = inferAppLinkOptions({
      inboundText: "send me the link of my weight tracker",
      snapshot: {
        artifacts: [
          {
            id: "art-1",
            title: "Weight tracker",
            archived_at: null,
          },
        ],
      } as Pick<import("@/lib/doedtc/doedtc-types").DoeDtcProfileSnapshot, "artifacts">,
    });
    assert.equal(options.tab, "trackers");
    assert.equal(options.artifact, "art-1");
  });
});

describe("profile link gate", () => {
  it("rejects profile links after assessments or other deliverables", () => {
    assert.equal(
      shouldAllowProfileLink({
        inboundText: "I have a headache since this morning",
        state: { assessmentRan: true, guideUrl: "https://example.com/g", prepareUrl: undefined, artifactShareUrl: undefined },
        profileLinkCalls: 0,
      }),
      false,
    );
  });

  it("allows a private app link when the user asked for one", () => {
    assert.equal(
      shouldAllowProfileLink({
        inboundText: "send me my weight tracker",
        state: { assessmentRan: false, guideUrl: undefined, prepareUrl: undefined, artifactShareUrl: undefined },
        profileLinkCalls: 0,
      }),
      true,
    );
  });
});

describe("structured send and leftover URLs", () => {
  it("ignores unsolicited profile send[] entries", () => {
    assert.equal(shouldHonorStructuredSend("profile", "I have a headache", []), false);
    assert.equal(shouldHonorStructuredSend("profile", "send me my profile", []), true);
  });

  it("strips leaked profile URLs when the user did not ask and no producing tool ran", () => {
    const turnState = { profileUrl: "https://doe.care/app?t=x" };
    applyDeliverablePolicyToTurnState({
      inboundText: "I have a headache",
      turnState,
      toolsExecuted: [{ name: "run_assessment", ok: true }],
    });
    assert.equal(turnState.profileUrl, undefined);
  });

  it("keeps a tracker URL produced by send_profile_link", () => {
    const turnState = { profileUrl: "https://doe.care/app?t=x&tab=trackers" };
    applyDeliverablePolicyToTurnState({
      inboundText: "send me my weight tracker",
      turnState,
      toolsExecuted: [{ name: "send_profile_link", ok: true }],
    });
    assert.equal(turnState.profileUrl, "https://doe.care/app?t=x&tab=trackers");
  });
});

describe("honesty send claims", () => {
  it("does not treat I'll-check replies as profile-send claims", () => {
    assert.equal(
      replyClaimsAction(
        "I'll take a look at your profile and get back to you.",
        /\b(send(?:ing)?|here'?s|share)\b.{0,48}\b(profile|dashboard)\b|\b(profile|dashboard)\b.{0,24}\b(link|url)\b/i,
      ),
      false,
    );
  });

  it("treats explicit send-the-link replies as claims", () => {
    assert.equal(
      replyClaimsAction(
        "Sending your weight tracker link now.",
        /\b(send(?:ing)?|here'?s|share)\b.{0,48}\b(tracker|weight)\b|\b(tracker|weight)\b.{0,24}\b(link|url)\b/i,
      ),
      true,
    );
  });
});

describe("outbound pacing", () => {
  it("holds a fast turn for a human beat and skips when the model already took time", () => {
    const remainingFast = pacingMs({
      startedAtMs: 1_000,
      nowMs: 1_050,
      replyText: "Got it — I'll text you in a few seconds.",
    });
    assert.ok(remainingFast >= 800);

    const remainingSlow = pacingMs({
      startedAtMs: 1_000,
      nowMs: 5_000,
      replyText: "Got it — I'll text you in a few seconds.",
    });
    assert.equal(remainingSlow, 0);
  });
});

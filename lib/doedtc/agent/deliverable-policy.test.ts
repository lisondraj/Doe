import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  askedForPrivateAppLink,
  applyDeliverablePolicyToTurnState,
  inferAppLinkOptions,
  interpretBuildIntent,
  interpretDeliverableAsk,
  isShortDeliverableFollowUp,
  looksLikeChartRead,
  looksLikeChartWrite,
  isExplicitChartWriteAsk,
  isIncidentalChartWrite,
  resolveDeliverableInboundText,
  shouldHonorStructuredSend,
} from "@/lib/doedtc/agent/deliverable-policy";
import { remainingOutboundThinkMs as pacingMs } from "@/lib/doedtc/doedtc-outbound-pacing";
import { shouldAllowProfileLink } from "@/lib/doedtc/agent/turn-integrity";
import { replyClaimsAction } from "@/lib/doedtc/agent/honesty";

describe("deliverable ask detection", () => {
  it("treats profile/tracker/labs location asks as private app links", () => {
    assert.equal(askedForPrivateAppLink("Send me my profile link"), true);
    assert.equal(askedForPrivateAppLink("send link of my weight tracker"), true);
    assert.equal(askedForPrivateAppLink("can you text me the weight tracker url"), true);
    assert.equal(askedForPrivateAppLink("Where is my weight tracker"), true);
    assert.equal(askedForPrivateAppLink("I need my tracker"), true);
    assert.equal(askedForPrivateAppLink("show me my tracker"), true);
    assert.equal(askedForPrivateAppLink("Where are my labs"), true);
    assert.equal(askedForPrivateAppLink("show me my lab results"), true);
    assert.equal(askedForPrivateAppLink("Where's my chart"), true);
  });

  it("does not treat routine health or logging turns as link asks", () => {
    assert.equal(askedForPrivateAppLink("I have a headache"), false);
    assert.equal(askedForPrivateAppLink("Log 3 glasses of water today"), false);
    assert.equal(askedForPrivateAppLink("Remind me ozempic in 10 seconds"), false);
    assert.equal(askedForPrivateAppLink("Yes save it to my profile"), false);
    assert.equal(askedForPrivateAppLink("I need to take ozempic"), false);
    assert.equal(askedForPrivateAppLink("add metformin to my chart"), false);
    assert.equal(askedForPrivateAppLink("I take metformin"), false);
    assert.equal(askedForPrivateAppLink("My A1C was 6.2 last week"), false);
    assert.equal(askedForPrivateAppLink("What were my lab results"), false);
  });

  it("classifies chart writes separately from location asks", () => {
    assert.equal(looksLikeChartWrite("add metformin to my chart"), true);
    assert.equal(looksLikeChartWrite("I take metformin"), true);
    assert.equal(looksLikeChartWrite("My A1C was 6.2 last week"), true);
    assert.equal(looksLikeChartWrite("Yes save it to my profile"), true);
    assert.equal(looksLikeChartWrite("Where are my labs"), false);
    assert.equal(looksLikeChartWrite("What were my lab results"), false);
    assert.equal(looksLikeChartWrite("I have a headache"), false);
    assert.equal(looksLikeChartWrite("im taking my viagra tomorrow"), false);
    assert.equal(looksLikeChartWrite("I take metformin"), true);
    assert.equal(looksLikeChartRead("What were my lab results"), true);
    assert.equal(looksLikeChartRead("what's on my chart"), true);
    assert.equal(looksLikeChartRead("Where are my labs"), false);
    assert.equal(looksLikeChartRead("add metformin to my chart"), false);
    assert.equal(isExplicitChartWriteAsk("add metformin to my chart"), true);
    assert.equal(isExplicitChartWriteAsk("add my daughter"), true);
    assert.equal(isIncidentalChartWrite("Sarah is my child actually"), true);
    assert.equal(isIncidentalChartWrite("She said she's been going thru it with her boyfriend"), true);
    assert.equal(isIncidentalChartWrite("add metformin to my chart"), false);
  });

  it("classifies how-to as build-guide when no matching guide exists", () => {
    assert.equal(interpretBuildIntent({ inboundText: "how do I take ozempic" }), "guide");
    assert.equal(interpretBuildIntent({ inboundText: "I don't know how to inject this" }), "guide");
    assert.equal(
      interpretBuildIntent({
        inboundText: "how do I take ozempic",
        snapshot: { artifacts: [], guides: [{ id: "g1", title: "Ozempic shots", topic: "ozempic" }] } as never,
      }),
      null,
    );
  });

  it("classifies track-my with no artifact as build-tracker", () => {
    assert.equal(interpretBuildIntent({ inboundText: "help me track my shots" }), "tracker");
    assert.equal(interpretBuildIntent({ inboundText: "track my water" }), "tracker");
    assert.equal(
      interpretBuildIntent({
        inboundText: "track my water",
        snapshot: {
          artifacts: [{ id: "a1", title: "Water", archived_at: null }],
          guides: [],
        } as never,
      }),
      null,
    );
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

  it("infers results tab for labs wording", () => {
    const options = inferAppLinkOptions({
      inboundText: "Where are my lab results",
      snapshot: { artifacts: [] } as never,
    });
    assert.equal(options.tab, "results");
  });

  it("binds short follow-ups to the last deliverable ask", () => {
    assert.equal(isShortDeliverableFollowUp("?"), true);
    assert.equal(isShortDeliverableFollowUp("send it"), true);
    assert.equal(
      resolveDeliverableInboundText({
        inboundText: "?",
        priorInboundBodies: ["Where's my profile", "Thanks"],
      }),
      "Where's my profile",
    );
    assert.equal(
      resolveDeliverableInboundText({
        inboundText: "I have a headache",
        priorInboundBodies: ["Where's my profile"],
      }),
      "I have a headache",
    );
    assert.equal(
      resolveDeliverableInboundText({
        inboundText: "?",
        priorInboundBodies: ["Where's my profile"],
        lastOutboundBody: "https://doe.care/app?t=x",
      }),
      "?",
    );
    assert.equal(
      resolveDeliverableInboundText({
        inboundText: "?",
        priorInboundBodies: ["Where's my profile"],
        lastOutboundBody: "You can view your profile details here",
      }),
      "Where's my profile",
    );
    assert.equal(
      resolveDeliverableInboundText({
        inboundText: "send it",
        priorInboundBodies: ["Where's my profile"],
        lastOutboundBody: "https://doe.care/app?t=x",
      }),
      "Where's my profile",
    );
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
    assert.equal(
      shouldAllowProfileLink({
        inboundText: "Where is my weight tracker",
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
    assert.equal(
      shouldHonorStructuredSend("profile", "add metformin to my chart", [
        { name: "add_medication", ok: true },
      ]),
      true,
    );
    assert.equal(
      shouldHonorStructuredSend("profile", "Sarah is my child actually", [
        { name: "log_family_member", ok: true },
      ]),
      false,
    );
    assert.equal(
      shouldHonorStructuredSend("profile", "here are my labs [attachments: file-1]", [
        { name: "log_result", ok: true },
      ]),
      true,
    );
  });

  it("honors structured guide send when they asked or built", () => {
    assert.equal(shouldHonorStructuredSend("guide", "how do I take ozempic", []), true);
    assert.equal(
      shouldHonorStructuredSend("guide", "thanks", [{ name: "create_guide", ok: true }]),
      true,
    );
    assert.equal(shouldHonorStructuredSend("guide", "I have a headache", []), false);
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

  it("strips a profile card after an incidental family add", () => {
    const turnState = { profileUrl: "https://doe.care/app?t=x&tab=family" };
    applyDeliverablePolicyToTurnState({
      inboundText: "Sarah is my child actually",
      turnState,
      toolsExecuted: [{ name: "log_family_member", ok: true }],
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

  it("keeps a chart tab URL after a successful write", () => {
    const turnState = { profileUrl: "https://doe.care/app?t=x&tab=conditions" };
    applyDeliverablePolicyToTurnState({
      inboundText: "add metformin to my chart",
      turnState,
      toolsExecuted: [{ name: "add_medication", ok: true }],
    });
    assert.equal(turnState.profileUrl, "https://doe.care/app?t=x&tab=conditions");
  });

  it("keeps the labs tab after results land even without an explicit write ask", () => {
    const turnState = { profileUrl: "https://doe.care/app?t=x&tab=results" };
    applyDeliverablePolicyToTurnState({
      inboundText: "here are my labs [attachments: file-1]",
      turnState,
      toolsExecuted: [{ name: "log_result", ok: true }],
    });
    assert.equal(turnState.profileUrl, "https://doe.care/app?t=x&tab=results");
  });

  it("keeps the labs tab after a parsed photo is auto-committed", () => {
    const turnState = {
      profileUrl: "https://doe.care/app?t=x&tab=results",
      documentParse: {
        auto_committed: true,
        write_results: [{ tool: "log_result", ok: true }],
      },
    };
    applyDeliverablePolicyToTurnState({
      inboundText: "[attachments: file-1]",
      turnState,
      toolsExecuted: [{ name: "parse_document", ok: true }],
    });
    assert.equal(turnState.profileUrl, "https://doe.care/app?t=x&tab=results");
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
      replyText: "Got it. I'll text you in a few seconds.",
    });
    assert.ok(remainingFast >= 800);

    const remainingSlow = pacingMs({
      startedAtMs: 1_000,
      nowMs: 5_000,
      replyText: "Got it. I'll text you in a few seconds.",
    });
    assert.equal(remainingSlow, 0);
  });
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  inboundDelegatesToAgent,
  inferTrackerTitleFromContext,
  replyInventsAbstainStereotype,
  resolveAgentInboundText,
  shouldSuppressChartWriteProbe,
  stripInventedAbstainStereotype,
  userMentionedAbstainStereotype,
} from "@/lib/doedtc/agent/agent-inbound";

const abstainThread = {
  priorInboundBodies: ["To help me abstain", "Specific actions u decide"],
  lastOutboundBody:
    "I set up an abstinence tracker with daily check-ins. Tap the link when you're ready.",
};

test("delegation phrases count as act_now inbound", () => {
  assert.equal(inboundDelegatesToAgent("Specific actions u decide"), true);
  assert.equal(inboundDelegatesToAgent("you decide"), true);
  assert.equal(inboundDelegatesToAgent("Remind me at 5"), false);
});

test("resolveAgentInboundText keeps abstain topic on delegation and send link", () => {
  const delegated = resolveAgentInboundText({
    inboundText: "Specific actions u decide",
    ...abstainThread,
  });
  assert.match(delegated, /continuing:/i);
  assert.match(delegated, /abstain/i);

  const sendLink = resolveAgentInboundText({
    inboundText: "Send link",
    ...abstainThread,
  });
  assert.match(sendLink, /continuing:/i);
  assert.match(sendLink, /abstain/i);
  assert.doesNotMatch(sendLink, /^Send link$/i);
});

test("inferTrackerTitleFromContext uses abstinence not alcohol when object is missing", () => {
  assert.equal(
    inferTrackerTitleFromContext({
      inboundText: "To help me abstain",
      priorInboundBodies: [],
    }),
    "Abstinence tracker",
  );
  assert.equal(
    inferTrackerTitleFromContext({
      inboundText: "track my alcohol use",
      priorInboundBodies: [],
    }),
    "alcohol use tracker",
  );
});

test("stereotype helpers detect invented abstain targets", () => {
  assert.equal(userMentionedAbstainStereotype("help me quit alcohol"), true);
  assert.equal(userMentionedAbstainStereotype("help me abstain"), false);
  assert.equal(
    replyInventsAbstainStereotype({
      replyText: "I set up your alcohol abstinence tracker.",
      inboundText: "To help me abstain",
      priorInboundBodies: ["To help me abstain"],
    }),
    true,
  );
  assert.equal(
    stripInventedAbstainStereotype("Daily alcohol abstinence check-ins are ready."),
    "Daily abstinence check-ins are ready.",
  );
});

test("shouldSuppressChartWriteProbe on send-link and delegation follow-ups", () => {
  const inboundText = resolveAgentInboundText({
    inboundText: "Send link",
    ...abstainThread,
  });

  assert.equal(
    shouldSuppressChartWriteProbe({
      inboundText,
      probe: "What do you want to track?",
      priorInboundBodies: abstainThread.priorInboundBodies,
      lastOutboundBody: abstainThread.lastOutboundBody,
      rawInboundText: "Send link",
    }),
    true,
  );

  assert.equal(
    shouldSuppressChartWriteProbe({
      inboundText: "add a med",
      probe: "Which medication should I add?",
    }),
    false,
  );
});

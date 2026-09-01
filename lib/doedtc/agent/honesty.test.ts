import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildRefusalRetrySystemMessage,
  looksLikeRefusal,
  reconcileReplyClaims,
  replyClaimsAction,
  shouldRetryEmptyRefusal,
  SCHEDULED_TEXT_CLAIM,
  toolSucceeded,
} from "@/lib/doedtc/agent/honesty";
import { resolveDeliverableInboundText } from "@/lib/doedtc/agent/deliverable-policy";
import {
  assertToolPromptCoverage,
  buildDoeDtcToolCapabilityPrompt,
} from "@/lib/doedtc/agent/tool-prompt-registry";
import { buildDoeDtcAgentSystemPrompt } from "@/lib/doedtc/doedtc-agent";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

describe("agent honesty invariants", () => {
  it("detects generic refusals", () => {
    assert.equal(looksLikeRefusal("I can't take a screenshot directly."), true);
    assert.equal(looksLikeRefusal("You might try visiting Google.com in your browser."), true);
    assert.equal(looksLikeRefusal("I couldn't read the document you sent."), true);
    assert.equal(looksLikeRefusal("Sent Simon an invite."), false);
  });

  it("blocks empty-tool refusals on action turns only", () => {
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I can't edit PDFs directly.",
        toolsExecuted: [],
      }),
      true,
    );
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I can't edit PDFs directly.",
        toolsExecuted: [],
        turnMode: "conversation",
      }),
      true,
    );
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I can't edit PDFs directly.",
        toolsExecuted: [],
        turnMode: "distress",
      }),
      false,
    );
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I can't edit PDFs directly.",
        toolsExecuted: [{ name: "start_browser_task", ok: true }],
      }),
      false,
    );
  });

  it("retries deliverable stalls even when the reply is not a classic refusal", () => {
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "You can view your profile details here, but",
        toolsExecuted: [],
        turnMode: "conversation",
        inboundText: "Where's my profile",
      }),
      true,
    );
  });

  it("auto-sends profile link when the ask matched and the model only described", async () => {
    const user = {
      id: "user-1",
      care_token: "care-token",
    } as import("@/lib/doedtc/doedtc-types").DoeDtcUserRow;

    const reconciled = await reconcileReplyClaims({
      user,
      inboundText: "Where's my profile",
      replyText: "You can view your profile details here, but",
      state: { toolsExecuted: [] } as never,
      toolsExecuted: [],
      snapshot: { artifacts: [], guides: [] } as never,
    });

    assert.ok(reconciled.profileUrl);
    assert.match(reconciled.profileUrl!, /care-token/);
  });

  it("continues profile-link sends after a short follow-up", async () => {
    const user = {
      id: "user-1",
      care_token: "care-token",
    } as DoeDtcUserRow;

    const inboundText = resolveDeliverableInboundText({
      inboundText: "?",
      priorInboundBodies: ["Where's my profile"],
    });

    const reconciled = await reconcileReplyClaims({
      user,
      inboundText,
      replyText: "Your profile is in the app.",
      state: { toolsExecuted: [] } as never,
      toolsExecuted: [],
      snapshot: { artifacts: [], guides: [] } as never,
    });

    assert.ok(reconciled.profileUrl);
  });

  it("does not auto-send profile link for unrelated health asks", async () => {
    const user = {
      id: "user-1",
      care_token: "care-token",
    } as DoeDtcUserRow;

    const reconciled = await reconcileReplyClaims({
      user,
      inboundText: "I have a headache",
      replyText: "That sounds rough. How long has it been going on?",
      state: { toolsExecuted: [] } as never,
      toolsExecuted: [],
      snapshot: { artifacts: [], guides: [] } as never,
    });

    assert.equal(reconciled.profileUrl, undefined);
  });

  it("does not auto-send a link after a chart write", async () => {
    const user = {
      id: "user-1",
      care_token: "care-token",
    } as DoeDtcUserRow;

    const reconciled = await reconcileReplyClaims({
      user,
      inboundText: "add metformin to my chart",
      replyText: "Added metformin to your chart.",
      state: { toolsExecuted: [] } as never,
      toolsExecuted: [{ name: "add_medication", ok: true }],
      snapshot: { artifacts: [], guides: [] } as never,
    });

    assert.equal(reconciled.profileUrl, undefined);
  });

  it("auto-sends results tab for a labs location ask", async () => {
    const user = {
      id: "user-1",
      care_token: "care-token",
    } as DoeDtcUserRow;

    const reconciled = await reconcileReplyClaims({
      user,
      inboundText: "Where are my labs",
      replyText: "You can view them in the app.",
      state: { toolsExecuted: [] } as never,
      toolsExecuted: [],
      snapshot: { artifacts: [], guides: [] } as never,
    });

    assert.ok(reconciled.profileUrl);
    assert.match(reconciled.profileUrl!, /tab=results/);
  });

  it("retries empty-tool browser stalls including wasn't-able wording", () => {
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText:
          "I wasn't able to complete that search right now. Could you let me know what specific information about asthma you're looking for?",
        toolsExecuted: [],
        inboundText: "Can u goto google search up asthma and what link is first provided",
      }),
      true,
    );
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I can help with that.",
        toolsExecuted: [],
        inboundText: "screenshot google.com",
      }),
      true,
    );
  });

  it("retries empty-tool document read refusals", () => {
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I couldn't read the document you sent.",
        toolsExecuted: [],
        inboundText: "[attachments: file-1]",
      }),
      true,
    );
  });

  it("retries empty-tool I'll-send-later claims, but not status asks", () => {
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I'm working on it, I'll send in a minute",
        toolsExecuted: [],
        inboundText: "screenshot kaiser",
      }),
      true,
    );
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I'm working on it, I'll send in a minute",
        toolsExecuted: [{ name: "start_browser_task", ok: true }],
        inboundText: "screenshot kaiser",
      }),
      false,
    );
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I'm working on the Kaiser screenshot and a reminder for Maya.",
        toolsExecuted: [],
        inboundText: "what are you working on",
      }),
      false,
    );
  });

  it("retries empty-tool stalls on chart writes and chart reads", () => {
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I can help with that.",
        toolsExecuted: [],
        inboundText: "add metformin to my chart",
      }),
      true,
    );
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I can help with that.",
        toolsExecuted: [],
        inboundText: "What were my lab results",
      }),
      true,
    );
  });

  it("builds a refusal retry nudge", () => {
    assert.match(buildRefusalRetrySystemMessage("screenshot google.com"), /start_browser_task/);
    assert.match(buildRefusalRetrySystemMessage("[attachments: file-1]"), /parse_document/);
    assert.match(buildRefusalRetrySystemMessage("[attachments: file-1]"), /household/);
  });

  it("matches invite claims", () => {
    assert.equal(
      replyClaimsAction("I'll send invites to Simon. They'll get a link in a moment.", /\b(send(?:ing)? invites?)/i),
      true,
    );
  });

  it("tracks successful tools", () => {
    assert.equal(toolSucceeded([{ name: "send_family_invite", ok: true }], "send_family_invite"), true);
    assert.equal(toolSucceeded([{ name: "send_family_invite", ok: false }], "send_family_invite"), false);
  });
});

describe("tool capability prompt", () => {
  it("includes every registered tool", () => {
    const prompt = buildDoeDtcToolCapabilityPrompt();
    assertToolPromptCoverage(prompt);
  });

  it("covers tools in the full system prompt", () => {
    const prompt = buildDoeDtcAgentSystemPrompt({
      user: {
        id: "user-1",
        phone: "+15555550100",
        email: null,
        care_token: "token",
        onboarding_token: null,
        onboarding_token_expires_at: null,
        linq_from_number: null,
        status: "active",
        full_name: "Test User",
        why_doe: null,
        gender: null,
        country: null,
        date_of_birth: null,
        linq_chat_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as DoeDtcUserRow,
      medications: [],
      conditions: [],
      transcript: "",
      symptomLog: "None",
      assessmentHistory: "None",
      appointmentLog: "None",
      relevantMemories: "None",
      playbookNotes: "None",
      pendingBlock: "",
      familyLog: "None",
      householdLog: "None",
      accountabilityLog: "None",
      scheduledLog: "None",
      workflowsLog: "None",
      guidesLog: "None",
      recentAttachmentsLog: "None yet.",
      profileOverview: "dashboard",
      nowLabel: "Mon 9:00 AM",
    });
    assertToolPromptCoverage(prompt);
    assert.match(prompt, /Do not use prior bubbles/);
    assert.match(prompt, /do not repeat your last Doe message/i);
    assert.match(prompt, /propose_scheduled_text is a draft/);
    assert.match(prompt, /never answer from chat history/);
    assert.match(prompt, /Reply to this message now/);
    assert.match(prompt, /Never say you are working on it/);
    assert.match(prompt, /Never recite a capabilities menu/);
    assert.match(prompt, /Never lead a sick or worried turn with logging/);
    assert.doesNotMatch(prompt, /What you can do \(use tools/);
  });

  it("treats I've set a reminder as a schedule claim, not only in N seconds", () => {
    assert.equal(SCHEDULED_TEXT_CLAIM.test("I've set a reminder for Fred's appointment tomorrow."), true);
    assert.equal(SCHEDULED_TEXT_CLAIM.test("I'll text you tomorrow morning."), true);
    assert.equal(SCHEDULED_TEXT_CLAIM.test("I can set this if you want."), false);
  });
});

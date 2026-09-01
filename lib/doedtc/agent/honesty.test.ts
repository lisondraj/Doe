import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildRefusalRetrySystemMessage,
  looksLikeRefusal,
  replyClaimsAction,
  shouldRetryEmptyRefusal,
  toolSucceeded,
} from "@/lib/doedtc/agent/honesty";
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
    assert.equal(looksLikeRefusal("Sent Simon an invite."), false);
  });

  it("blocks empty-tool refusals", () => {
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
        toolsExecuted: [{ name: "send_profile_link", ok: true }],
      }),
      true,
    );
    assert.equal(
      shouldRetryEmptyRefusal({
        replyText: "I can't edit PDFs directly.",
        toolsExecuted: [{ name: "start_browser_task", ok: true }],
      }),
      false,
    );
  });

  it("builds a refusal retry nudge", () => {
    assert.match(buildRefusalRetrySystemMessage("screenshot google.com"), /start_browser_task/);
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
      profileOverview: "dashboard",
      nowLabel: "Mon 9:00 AM",
    });
    assertToolPromptCoverage(prompt);
    assert.match(prompt, /Do not use prior bubbles/);
    assert.match(prompt, /propose_scheduled_text is a draft/);
  });
});

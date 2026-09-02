import assert from "node:assert/strict";
import test from "node:test";

import { formatIdentityCard } from "@/lib/doedtc/agent/identity-card";
import { formatOpenLoopsBlock } from "@/lib/doedtc/agent/open-loops-prompt";
import { templateOpenLoopReplyForTest } from "@/lib/doedtc/doedtc-open-loops.test-helpers";
import { classifyAgentAction, inboundAlreadyAsked } from "@/lib/doedtc/doedtc-agent-policy";
import type { DoeDtcOpenLoopRow, DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";

function baseSnapshot(overrides: Partial<DoeDtcProfileSnapshot> = {}): DoeDtcProfileSnapshot {
  return {
    user: {
      id: "user-1",
      full_name: "Jamie",
      email: "jamie@example.com",
      phone: "+15551234567",
      why_doe: null,
      gender: null,
      country: null,
      date_of_birth: null,
      medical_deferred: false,
      care_token: "care-token",
    },
    medications: ["Ozempic"],
    conditions: ["Asthma"],
    familyMembers: [],
    appointments: [],
    listenSessions: [],
    results: [],
    lockerItems: [],
    healthConnections: [],
    shareCodes: [],
    symptoms: [],
    assessments: [],
    artifacts: [],
    artifactEntries: [],
    tickets: [],
    household: {
      household: null,
      members: [
        {
          id: "member-1",
          household_id: "hh-1",
          user_id: null,
          full_name: "Emma",
          relationship: "child",
          role: "member",
          status: "active",
          phone: null,
          date_of_birth: "2018-01-01",
          gender: null,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      consents: [],
      memberAccess: [],
      isAdmin: false,
      viewerMemberId: null,
      viewerConsent: null,
      viewerMember: null,
    },
    accountabilityPacts: [],
    scheduledTexts: [],
    workflows: [],
    guides: [],
    ...overrides,
  };
}

test("formatIdentityCard includes viewer, household names, meds, and last concern", () => {
  const openLoops: DoeDtcOpenLoopRow[] = [
    {
      id: "loop-1",
      user_id: "user-1",
      goal: "Check on Emma's fever",
      status: "open",
      last_action: null,
      next_wake_at: "2026-09-03T14:00:00Z",
      context_json: { concern: "Emma's fever", member_name: "Emma" },
      browser_job_id: null,
      source: "care_seed",
      created_at: "2026-09-02T00:00:00Z",
      updated_at: "2026-09-02T00:00:00Z",
    },
  ];
  const card = formatIdentityCard({
    snapshot: baseSnapshot(),
    openLoops,
    durableMemories: ["Prefers texts after 8pm"],
  });
  assert.match(card, /Viewer: Jamie/);
  assert.match(card, /Emma \(child\)/);
  assert.match(card, /Ozempic/);
  assert.match(card, /Asthma/);
  assert.match(card, /Emma's fever/);
  assert.match(card, /Prefers texts after 8pm/);
});

test("formatOpenLoopsBlock lists active loops with ids", () => {
  const block = formatOpenLoopsBlock([
    {
      id: "loop-1",
      user_id: "user-1",
      goal: "Find a pediatrician",
      status: "waiting_tool",
      last_action: "browser task started",
      next_wake_at: null,
      context_json: { kind: "browser_job" },
      browser_job_id: "job-1",
      source: "agent",
      created_at: "2026-09-02T00:00:00Z",
      updated_at: "2026-09-02T00:00:00Z",
    },
  ]);
  assert.match(block, /Find a pediatrician/);
  assert.match(block, /loop-1/);
});

test("template open loop reply for unwell follow-up uses member name", () => {
  const text = templateOpenLoopReplyForTest({
    id: "loop-1",
    user_id: "user-1",
    goal: "Check on Emma's fever",
    status: "open",
    last_action: null,
    next_wake_at: null,
    context_json: {
      kind: "unwell_follow_up",
      member_name: "Emma",
      symptom: "fever",
    },
    browser_job_id: null,
    source: "care_seed",
    created_at: "2026-09-02T00:00:00Z",
    updated_at: "2026-09-02T00:00:00Z",
  });
  assert.match(text!, /Emma/);
  assert.match(text!, /fever/);
});

test("classifyAgentAction defaults to act_now for clear self-reminder asks", () => {
  assert.equal(
    classifyAgentAction({
      inboundText: "remind me to take ozempic tomorrow at 8am",
      textsThirdParty: false,
      missingSlot: false,
      irreversible: false,
    }),
    "act_now",
  );
  assert.equal(inboundAlreadyAsked("remind me to take ozempic tomorrow at 8am"), true);
});

test("classifyAgentAction stays confirm_once for irreversible actions", () => {
  assert.equal(
    classifyAgentAction({
      inboundText: "invite my wife to the household",
      textsThirdParty: false,
      missingSlot: false,
      irreversible: true,
    }),
    "confirm_once",
  );
});

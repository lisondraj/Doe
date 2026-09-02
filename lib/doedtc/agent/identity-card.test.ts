import assert from "node:assert/strict";
import test from "node:test";

import { formatIdentityCard } from "@/lib/doedtc/agent/identity-card";
import type { DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";

test("identity card never omits household when members exist", () => {
  const snapshot: DoeDtcProfileSnapshot = {
    user: {
      id: "u1",
      full_name: "Alex",
      email: null,
      phone: "+15551234567",
      why_doe: null,
      gender: null,
      country: null,
      date_of_birth: null,
      medical_deferred: false,
      care_token: null,
    },
    medications: [],
    conditions: [],
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
          id: "m1",
          household_id: "h1",
          user_id: null,
          full_name: "Emma",
          relationship: "child",
          role: "member",
          status: "active",
          phone: null,
          date_of_birth: null,
          gender: null,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      consents: [],
    },
    accountabilityPacts: [],
    scheduledTexts: [],
    workflows: [],
    guides: [],
  };

  const card = formatIdentityCard({ snapshot, openLoops: [] });
  assert.match(card, /Emma \(child\)/);
  assert.doesNotMatch(card, /\bHas\b/);
});

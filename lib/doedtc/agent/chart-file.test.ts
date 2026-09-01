import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildChartFile,
  memberExistsOnChart,
  reconcileReplyWithChartFile,
  replyClaimsAppointmentLogged,
} from "@/lib/doedtc/agent/chart-file";
import type { DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";

function minimalSnapshot(
  overrides: Partial<DoeDtcProfileSnapshot> = {},
): DoeDtcProfileSnapshot {
  return {
    user: { id: "u1", full_name: "Alex" } as DoeDtcProfileSnapshot["user"],
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
    household: { household: null, members: [], consents: [] },
    accountabilityPacts: [],
    scheduledTexts: [],
    guides: [],
    workflows: [],
    ...overrides,
  } as DoeDtcProfileSnapshot;
}

describe("chart file", () => {
  it("builds committed chart views from snapshot", () => {
    const file = buildChartFile({
      snapshot: minimalSnapshot({
        appointments: [
          {
            id: "a1",
            user_id: "u1",
            title: "Dentist",
            starts_at: null,
            timing_note: "next Tuesday",
            location: null,
            notes: "For Fred",
            created_at: new Date().toISOString(),
          },
        ],
        household: {
          household: null,
          members: [
            {
              id: "m1",
              household_id: "h1",
              full_name: "Fred",
              user_id: null,
              phone: null,
              status: "pending",
              relationship: "child",
              role: "member",
              gender: "male",
              created_at: "",
              updated_at: "",
            },
          ],
          consents: [],
        },
      }),
    });
    assert.equal(file.appointments.length, 1);
    assert.equal(file.household.length, 1);
    assert.equal(memberExistsOnChart(file.household, "Fred"), true);
  });

  it("rewrites unbacked appointment claim when Fred not on chart", () => {
    const file = buildChartFile({ snapshot: minimalSnapshot() });
    const reply = reconcileReplyWithChartFile({
      inboundText: "Book Fred's appointment",
      replyText: "I've logged Fred's dentist appointment.",
      file,
      subjectName: "Fred",
      logAppointmentSucceeded: false,
      logFamilyMemberSucceeded: false,
      logArtifactEntrySucceeded: false,
    });
    assert.match(reply, /Fred isn't on the household/i);
    assert.doesNotMatch(reply, /I've logged/i);
  });

  it("rewrites unbacked appointment claim when nothing saved", () => {
    const file = buildChartFile({ snapshot: minimalSnapshot() });
    const reply = reconcileReplyWithChartFile({
      inboundText: "log my appointment",
      replyText: "I've saved your appointment.",
      file,
      subjectName: null,
      logAppointmentSucceeded: false,
      logFamilyMemberSucceeded: false,
      logArtifactEntrySucceeded: false,
    });
    assert.match(reply, /haven't saved/i);
  });

  it("detects appointment logged claims", () => {
    assert.equal(replyClaimsAppointmentLogged("I've logged Fred's dentist appointment."), true);
    assert.equal(replyClaimsAppointmentLogged("Got it."), false);
  });
});

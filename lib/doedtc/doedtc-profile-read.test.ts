import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { extractLabQueryFromText, formatResultsTab } from "@/lib/doedtc/doedtc-results-read";
import type { DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";

function snapshotWithResults(
  results: DoeDtcProfileSnapshot["results"],
): DoeDtcProfileSnapshot {
  return {
    user: {
      id: "user-1",
      phone: "+10000000000",
      status: "active",
      care_token: "tok",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    },
    medications: [],
    conditions: [],
    appointments: [],
    results,
    symptoms: [],
    lockerItems: [],
    shareCodes: [],
    listenSessions: [],
    artifacts: [],
    guides: [],
    accountabilityPacts: [],
    scheduledTexts: [],
    workflows: [],
    tickets: [],
    healthConnections: [],
    household: { household: null, members: [], consents: [] },
  } as DoeDtcProfileSnapshot;
}

describe("profile results read", () => {
  it("extracts liver and numbers queries from inbound text", () => {
    assert.equal(extractLabQueryFromText("what were my LFTs"), "liver");
    assert.equal(extractLabQueryFromText("what were the numbers"), "labs");
    assert.equal(extractLabQueryFromText("my A1C history"), "a1c");
  });

  it("groups prior draws under each test when formatting results tab", () => {
    const content = formatResultsTab(snapshotWithResults([
        {
          id: "alt-new",
          user_id: "user-1",
          title: "ALT",
          resulted_at: "2026-08-08",
          source: "LifeLabs",
          summary: "78 U/L · ref 7–56",
          value: "78",
          unit: "U/L",
          reference_range: "7–56",
          flag: "high",
          created_at: "2026-08-08T12:00:00.000Z",
        },
        {
          id: "alt-old",
          user_id: "user-1",
          title: "ALT",
          resulted_at: "2026-02-12",
          source: "LifeLabs",
          summary: "32 U/L · ref 7–56",
          value: "32",
          unit: "U/L",
          reference_range: "7–56",
          flag: null,
          created_at: "2026-02-12T12:00:00.000Z",
        },
    ]));
    assert.match(content, /ALT \| date: 2026-08-08/);
    assert.match(content, /prior: .*ALT/);
    assert.match(content, /78 U\/L/);
  });

  it("filters liver rows when query is liver", () => {
    const content = formatResultsTab(snapshotWithResults([
        {
          id: "alt",
          user_id: "user-1",
          title: "ALT",
          resulted_at: "2026-08-08",
          source: null,
          summary: "78 U/L",
          value: "78",
          unit: "U/L",
          reference_range: "7–56",
          flag: "high",
          created_at: "2026-08-08T12:00:00.000Z",
        },
        {
          id: "tsh",
          user_id: "user-1",
          title: "TSH",
          resulted_at: "2026-08-08",
          source: null,
          summary: "2.1 mIU/L",
          value: "2.1",
          unit: "mIU/L",
          reference_range: "0.4–4.0",
          flag: null,
          created_at: "2026-08-08T12:00:00.000Z",
        },
    ]), { query: "liver" });
    assert.match(content, /ALT/);
    assert.doesNotMatch(content, /TSH/);
  });
});

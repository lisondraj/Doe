import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  extractChartMentions,
  inferPrimaryIntent,
  isPlausiblePersonName,
  resolveActionSlots,
} from "@/lib/doedtc/agent/action-slots";
import type { HouseholdMemberLike } from "@/lib/doedtc/doedtc-household-policy";

function member(
  overrides: Partial<HouseholdMemberLike> & Pick<HouseholdMemberLike, "id" | "full_name">,
): HouseholdMemberLike {
  return {
    user_id: null,
    phone: null,
    status: "pending",
    relationship: "child",
    role: "member",
    gender: null,
    ...overrides,
  };
}

const parent = member({
  id: "admin",
  full_name: "Alex",
  user_id: "parent-1",
  status: "active",
  relationship: "other",
  role: "admin",
});

describe("action slots", () => {
  it("extracts lowercase names for book Fred an appointment", () => {
    const found = extractChartMentions({
      inboundText: "book fred an appointment",
      members: [parent],
      viewerUserId: "parent-1",
    });
    assert.deepEqual(found.unknownNames, ["Fred"]);
  });

  it("does not treat demonstratives or objects after log/save as people", () => {
    assert.equal(isPlausiblePersonName("These"), false);
    assert.equal(isPlausiblePersonName("this"), false);
    assert.equal(isPlausiblePersonName("them"), false);
    assert.equal(isPlausiblePersonName("LFT"), false);
    assert.equal(isPlausiblePersonName("Fred"), true);
    for (const inbound of ["Log these", "log this", "save that", "add those", "log it", "save the results"]) {
      const found = extractChartMentions({
        inboundText: inbound,
        members: [parent],
        viewerUserId: "parent-1",
      });
      assert.deepEqual(found.unknownNames, [], inbound);
    }
  });

  it("infers log_appointment for Book Fred's appointment", () => {
    assert.equal(
      inferPrimaryIntent({ inboundText: "Book Fred's appointment" }),
      "log_appointment",
    );
  });

  it("surfaces not-on-chart and no-phone blockers for unknown Fred", () => {
    const slots = resolveActionSlots({
      inboundText: "Book Fred's appointment",
      viewerUserId: "parent-1",
      members: [parent],
      artifacts: [],
      guides: [],
    });
    assert.equal(slots.intent, "log_appointment");
    assert.equal(slots.subjectName, "Fred");
    assert.ok(slots.blockers.some((row) => row.slot === "on_chart"));
    assert.ok(slots.blockers.some((row) => row.slot === "phone"));
    assert.match(slots.blockers.find((row) => row.slot === "on_chart")?.userFacing ?? "", /isn't on the household/i);
    assert.equal(slots.missingSlot, true);
    assert.equal(slots.actionClass, "confirm_once");
  });

  it("surfaces phone blocker for pending member without phone", () => {
    const fred = member({ id: "m-fred", full_name: "Fred", gender: "male" });
    const slots = resolveActionSlots({
      inboundText: "Book Fred's dentist appointment next Tuesday",
      viewerUserId: "parent-1",
      members: [parent, fred],
    });
    assert.ok(slots.blockers.some((row) => row.slot === "phone"));
    assert.match(slots.blockers.find((row) => row.slot === "phone")?.userFacing ?? "", /don't have a number/i);
  });

  it("infers browse for a Google search ask", () => {
    assert.equal(
      inferPrimaryIntent({
        inboundText: "Can u goto google search up asthma and what link is first provided",
      }),
      "browse",
    );
    const slots = resolveActionSlots({
      inboundText: "Can u goto google search up asthma and what link is first provided",
      viewerUserId: "parent-1",
      members: [parent],
    });
    assert.equal(slots.intent, "browse");
    assert.equal(slots.turnMode.mode, "action");
    assert.equal(slots.actionClass, "act_now");
  });

  it("prefers browse over a leftover attachment on a Google screenshot ask", () => {
    assert.equal(
      inferPrimaryIntent({
        inboundText: "Goto google ss the homepage and send the photo here\n[attachments: file-1]",
      }),
      "browse",
    );
  });

  it("infers parse_document when inbound has attachments", () => {
    assert.equal(
      inferPrimaryIntent({ inboundText: "[attachments: file-1]" }),
      "parse_document",
    );
  });

  it("surfaces parse_document steering for photo inbound", () => {
    const slots = resolveActionSlots({
      inboundText: "[attachments: file-1]",
      viewerUserId: "parent-1",
      members: [parent],
      artifacts: [],
      guides: [],
    });
    assert.equal(slots.intent, "parse_document");
    assert.ok(slots.blockers.some((row) => row.tool === "parse_document"));
  });

  it("allows act_now for joined member with appointment timing", () => {
    const fred = member({
      id: "m-fred",
      full_name: "Fred",
      user_id: "fred-1",
      status: "active",
      phone: "+15550001",
    });
    const slots = resolveActionSlots({
      inboundText: "Log Fred's dentist appointment next Tuesday",
      viewerUserId: "parent-1",
      members: [parent, fred],
    });
    assert.equal(slots.blockers.some((row) => row.slot === "on_chart"), false);
    assert.equal(slots.blockers.some((row) => row.blocksPrimary), false);
  });

  it("does not invent Has from my kid has a fever", () => {
    assert.equal(isPlausiblePersonName("Has"), false);
    assert.equal(isPlausiblePersonName("has"), false);
    const found = extractChartMentions({
      inboundText: "my kid has a fever",
      members: [parent],
      viewerUserId: "parent-1",
    });
    assert.deepEqual(found.unknownNames, []);
    const slots = resolveActionSlots({
      inboundText: "my kid has a fever",
      viewerUserId: "parent-1",
      members: [parent],
    });
    assert.equal(slots.blockers.some((row) => row.tool === "log_family_member"), false);
    assert.doesNotMatch(slots.promptBlock, /Named but not on chart: Has/i);
  });

  it("resolves my kid to the one child on the chart", () => {
    const simon = member({ id: "m-simon", full_name: "Simon", gender: "male" });
    const found = extractChartMentions({
      inboundText: "my kid has a fever",
      members: [parent, simon],
      viewerUserId: "parent-1",
    });
    assert.equal(found.mentioned.length, 1);
    assert.equal(found.mentioned[0]?.full_name, "Simon");
  });

  it("extracts Simon from my son Simon has a fever", () => {
    const found = extractChartMentions({
      inboundText: "my son Simon has a fever",
      members: [parent],
      viewerUserId: "parent-1",
    });
    assert.deepEqual(found.unknownNames, ["Simon"]);
  });

  it("does not treat remind-me-to-verb as a household person", () => {
    const selfAsks = [
      "Can you remind me to buy groceries?",
      "remind me to take my meds",
      "text me to pick up milk",
      "ping me to call the dentist",
      "remind me about the dry cleaning",
      "can you remind me to get eggs",
    ];
    for (const inbound of selfAsks) {
      const found = extractChartMentions({
        inboundText: inbound,
        members: [parent],
        viewerUserId: "parent-1",
      });
      assert.deepEqual(found.unknownNames, [], inbound);

      const slots = resolveActionSlots({
        inboundText: inbound,
        viewerUserId: "parent-1",
        members: [parent],
      });
      assert.equal(slots.intent, "schedule_text", inbound);
      assert.equal(slots.blockers.some((row) => row.slot === "on_chart"), false, inbound);
      assert.equal(slots.blockers.some((row) => row.tool === "log_family_member"), false, inbound);
    }

    const other = extractChartMentions({
      inboundText: "remind Sam to take his meds",
      members: [parent],
      viewerUserId: "parent-1",
    });
    assert.deepEqual(other.unknownNames, ["Sam"]);
  });

  it("detects reminder body missing slot", () => {
    const slots = resolveActionSlots({
      inboundText: "remind me in 5 seconds",
      viewerUserId: "parent-1",
      members: [parent],
    });
    assert.equal(slots.intent, "schedule_text");
    assert.ok(slots.blockers.some((row) => row.slot === "body"));
  });

  it("planner confirm_once when Fred blockers open", async () => {
    const { inferPlanActionFromInbound } = await import("@/lib/doedtc/agent/planner-run");
    assert.equal(
      inferPlanActionFromInbound("Book Fred's appointment", [parent], "parent-1"),
      "confirm_once",
    );
  });
});

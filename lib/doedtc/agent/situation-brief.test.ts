import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildSituationBrief,
  extractChartMentions,
  formatSituationBriefBlock,
} from "@/lib/doedtc/agent/situation-brief";
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

describe("chart mentions", () => {
  it("matches household names and unknown possessives", () => {
    const maya = member({ id: "m-maya", full_name: "Maya", gender: "female", user_id: "maya-1", status: "active" });
    const found = extractChartMentions({
      inboundText: "Remind Maya to take a bath",
      members: [parent, maya],
      viewerUserId: "parent-1",
    });
    assert.equal(found.mentioned[0]?.full_name, "Maya");
    assert.deepEqual(found.unknownNames, []);

    const unknown = extractChartMentions({
      inboundText: "Log Riley's dentist appointment next Tuesday",
      members: [parent, maya],
      viewerUserId: "parent-1",
    });
    assert.deepEqual(unknown.unknownNames, ["Riley"]);
  });
});

describe("situation brief gaps", () => {
  it("offers log_family_member for an unconnected child plus appointment", () => {
    const brief = buildSituationBrief({
      inboundText: "Log Riley's dentist appointment next Tuesday",
      viewerUserId: "parent-1",
      members: [parent],
      artifacts: [],
      guides: [],
    });
    assert.equal(brief.opportunity?.kind, "add_family_member");
    assert.equal(brief.opportunity?.tool, "log_family_member");
    assert.equal(brief.opportunity?.memberName, "Riley");
    assert.match(formatSituationBriefBlock(brief), /Situation \(do not recite\)/);
  });

  it("offers the other sibling after a daughter habit when a son is on the chart", () => {
    const maya = member({
      id: "m-maya",
      full_name: "Maya",
      gender: "female",
      user_id: "maya-1",
      status: "active",
      phone: "+15550001",
    });
    const simon = member({
      id: "m-simon",
      full_name: "Simon",
      gender: "male",
      user_id: "simon-1",
      status: "active",
      phone: "+15550002",
    });
    const brief = buildSituationBrief({
      inboundText: "Remind Maya to take a bath every night",
      viewerUserId: "parent-1",
      members: [parent, maya, simon],
      artifacts: [],
      guides: [],
    });
    assert.equal(brief.opportunity?.kind, "sibling_offer");
    assert.equal(brief.opportunity?.siblingName, "Simon");
    assert.match(brief.opportunity?.promptLine ?? "", /same for them/);
    assert.match(brief.opportunity?.promptLine ?? "", /Never auto-start a second workflow/);
  });

  it("does not auto-offer siblings when they already named the group", () => {
    const maya = member({ id: "m-maya", full_name: "Maya", gender: "female", user_id: "u-m", status: "active" });
    const simon = member({ id: "m-simon", full_name: "Simon", gender: "male", user_id: "u-s", status: "active" });
    const brief = buildSituationBrief({
      inboundText: "Make sure the kids take a bath",
      viewerUserId: "parent-1",
      members: [parent, maya, simon],
    });
    assert.notEqual(brief.opportunity?.kind, "sibling_offer");
  });

  it("routes how-to with no matching guide to create_guide", () => {
    const brief = buildSituationBrief({
      inboundText: "how do I take ozempic",
      viewerUserId: "parent-1",
      members: [parent],
      artifacts: [],
      guides: [],
    });
    assert.equal(brief.opportunity?.kind, "build_guide");
    assert.equal(brief.opportunity?.tool, "create_guide");
  });

  it("sends an existing tracker for where-is asks", () => {
    const brief = buildSituationBrief({
      inboundText: "Where is my weight tracker",
      viewerUserId: "parent-1",
      members: [parent],
      artifacts: [{ id: "art-1", title: "Weight tracker", archived_at: null }],
      guides: [],
    });
    assert.equal(brief.opportunity?.kind, "send_existing");
    assert.equal(brief.opportunity?.tool, "send_profile_link");
  });

  it("builds a tracker when they ask where it is and none exists", () => {
    const brief = buildSituationBrief({
      inboundText: "Where is my weight tracker",
      viewerUserId: "parent-1",
      members: [parent],
      artifacts: [],
      guides: [],
    });
    assert.equal(brief.opportunity?.kind, "build_tracker");
  });

  it("offers invite after a write for a pending child with a phone", () => {
    const riley = member({
      id: "m-riley",
      full_name: "Riley",
      phone: "+15550909",
      gender: "female",
    });
    const brief = buildSituationBrief({
      inboundText: "Log Riley's dentist appointment next Tuesday",
      viewerUserId: "parent-1",
      members: [parent, riley],
    });
    assert.equal(brief.opportunity?.kind, "invite_pending_member");
    assert.equal(brief.opportunity?.tool, "send_family_invite");
  });

  it("caps at one opportunity", () => {
    const maya = member({
      id: "m-maya",
      full_name: "Maya",
      phone: "+15550001",
      gender: "female",
    });
    const simon = member({
      id: "m-simon",
      full_name: "Simon",
      gender: "male",
    });
    const brief = buildSituationBrief({
      inboundText: "Log Maya's appointment and remind her about the bath, also how do I take ozempic",
      viewerUserId: "parent-1",
      members: [parent, maya, simon],
    });
    assert.ok(brief.opportunity);
    assert.equal(brief.promptBlock.includes("One opportunity"), true);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  appointmentNotesForProxy,
  householdMemberState,
  inboundLooksLikeHabitOrReminder,
  inboundLooksLikeProfileWrite,
  routeHouseholdSubject,
  type HouseholdMemberLike,
} from "@/lib/doedtc/doedtc-household-policy";

function member(overrides: Partial<HouseholdMemberLike> & Pick<HouseholdMemberLike, "id" | "full_name">): HouseholdMemberLike {
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

describe("household member state", () => {
  it("classifies joined, pending+phone, pending no phone, unknown", () => {
    assert.equal(
      householdMemberState(member({ id: "j", full_name: "Jo", user_id: "u1", status: "active" })),
      "joined",
    );
    assert.equal(
      householdMemberState(member({ id: "p", full_name: "Pat", phone: "+15551212" })),
      "pending_phone",
    );
    assert.equal(householdMemberState(member({ id: "n", full_name: "NoPhone" })), "pending_no_phone");
    assert.equal(householdMemberState(null), "unknown");
  });
});

describe("household action routing", () => {
  const viewer = "parent-user";

  it("joined members: act on them, no invite", () => {
    const joined = member({
      id: "m-maya",
      full_name: "Maya",
      user_id: "maya-user",
      status: "active",
      phone: "+15550001",
    });
    const habit = routeHouseholdSubject({
      viewerUserId: viewer,
      inboundText: "Remind Maya to take a bath",
      action: "remind_habit",
      member: joined,
    });
    assert.equal(habit.primaryTool.includes("schedule_text"), true);
    assert.equal(habit.offer, null);
    assert.equal(habit.proxyToParent, false);

    const invite = routeHouseholdSubject({
      viewerUserId: viewer,
      inboundText: "invite Maya",
      action: "invite",
      member: joined,
    });
    assert.match(invite.nextStep, /already has Doe/i);
  });

  it("pending + phone: habits text them; writes proxy and offer invite", () => {
    const pending = member({
      id: "m-riley",
      full_name: "Riley",
      phone: "+15550002",
    });
    const habit = routeHouseholdSubject({
      viewerUserId: viewer,
      inboundText: "text Riley at 7 about homework",
      action: "remind_habit",
      member: pending,
    });
    assert.equal(habit.proxyToParent, false);
    assert.match(habit.nextStep, /Text Riley/);

    const write = routeHouseholdSubject({
      viewerUserId: viewer,
      inboundText: "log Riley's dentist appointment",
      action: "profile_write",
      member: pending,
    });
    assert.equal(write.proxyToParent, true);
    assert.equal(write.subjectUserId, viewer);
    assert.equal(write.offer?.tool, "send_family_invite");
    assert.equal(write.offer?.confirm, "confirm_once");
  });

  it("pending no phone: habits go to parent; writes proxy or ask phone; never invent SMS", () => {
    const pending = member({ id: "m-leo", full_name: "Leo" });
    const habit = routeHouseholdSubject({
      viewerUserId: viewer,
      inboundText: "make sure Leo showers daily",
      action: "remind_habit",
      member: pending,
    });
    assert.equal(habit.proxyToParent, true);
    assert.match(habit.nextStep, /Do not invent SMS/);

    const write = routeHouseholdSubject({
      viewerUserId: viewer,
      inboundText: "log Leo's appointment tomorrow",
      action: "profile_write",
      member: pending,
    });
    assert.equal(write.proxyToParent, true);
    assert.equal(write.offer?.tool, "update_family_member");
    assert.match(write.nextStep, /phone number/);
  });

  it("unknown name asks to add them", () => {
    const route = routeHouseholdSubject({
      viewerUserId: viewer,
      inboundText: "log an appointment for Riley",
      action: "profile_write",
      member: null,
    });
    assert.equal(route.state, "unknown");
    assert.equal(route.primaryTool, "log_family_member");
    assert.equal(route.neverAutoTextUnmentioned, true);
  });

  it("invite confirm_once unless they already asked to invite", () => {
    const pending = member({
      id: "m-riley",
      full_name: "Riley",
      phone: "+15550002",
    });
    const offered = routeHouseholdSubject({
      viewerUserId: viewer,
      inboundText: "Riley has a dentist visit Tuesday",
      action: "profile_write",
      member: pending,
    });
    assert.equal(offered.offer?.confirm, "confirm_once");

    const asked = routeHouseholdSubject({
      viewerUserId: viewer,
      inboundText: "please invite Riley to join",
      action: "invite",
      member: pending,
    });
    assert.equal(asked.offer?.confirm, "act_now");
  });
});

describe("intent sniffers", () => {
  it("detects habit vs appointment writes", () => {
    assert.equal(inboundLooksLikeHabitOrReminder("Remind Maya to take a bath every night"), true);
    assert.equal(inboundLooksLikeProfileWrite("Log Riley's dentist appointment next Tuesday"), true);
    assert.equal(inboundLooksLikeProfileWrite("add metformin to my chart"), true);
    assert.equal(inboundLooksLikeProfileWrite("I take metformin"), true);
    assert.equal(inboundLooksLikeProfileWrite("I always forget things after an appointment"), false);
    assert.equal(inboundLooksLikeProfileWrite("where is my tracker"), false);
    assert.equal(inboundLooksLikeProfileWrite("Where are my labs"), false);
  });
});

describe("parent-proxied appointment notes", () => {
  it("tags the pending member on the parent row", () => {
    assert.equal(
      appointmentNotesForProxy({ notes: "Pediatric", proxied: true, memberName: "Riley" }),
      "Pediatric — For Riley (not joined yet)",
    );
    assert.equal(appointmentNotesForProxy({ notes: "keep", proxied: false, memberName: "Riley" }), "keep");
  });
});

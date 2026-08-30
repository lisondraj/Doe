import assert from "node:assert/strict";
import test from "node:test";

import {
  ensureFutureSendAt,
  formatScheduledSendAtLabel,
  isPendingOfferText,
  isScheduleOfferText,
  parseScheduledSendAt,
} from "@/lib/doedtc/doedtc-scheduled";
import { parseAffirmation, parseDecline } from "@/lib/doedtc/doedtc-pending";
import { canScheduleForHouseholdMember } from "@/lib/doedtc/doedtc-scheduled-db";
import { sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";
import type { DoeDtcHouseholdConsentRow, DoeDtcHouseholdMemberRow, DoeDtcHouseholdRow } from "@/lib/doedtc/doedtc-types";

test("parseScheduledSendAt accepts ISO datetime", () => {
  const when = parseScheduledSendAt("2026-09-01T08:00:00.000Z");
  assert.equal(when.toISOString(), "2026-09-01T08:00:00.000Z");
});

test("parseScheduledSendAt accepts in N hours", () => {
  const from = new Date("2026-08-30T12:00:00.000Z");
  const when = parseScheduledSendAt("in 2 hours", from);
  assert.equal(when.toISOString(), "2026-08-30T14:00:00.000Z");
});

test("parseScheduledSendAt accepts in 5 seconds", () => {
  const from = new Date("2026-08-30T12:00:00.000Z");
  const when = parseScheduledSendAt("in 5 seconds", from);
  assert.equal(when.toISOString(), "2026-08-30T12:00:05.000Z");
});

test("isScheduleOfferText detects reminder offers", () => {
  assert.equal(isScheduleOfferText("Do you want me to text you at 8am?"), true);
  assert.equal(isScheduleOfferText("Logged your shot."), false);
});

test("parseScheduledSendAt interprets naive ISO in America/New_York as wall clock", () => {
  const when = parseScheduledSendAt("2026-08-30T08:00", new Date(), "America/New_York");
  assert.equal(when.toISOString(), "2026-08-30T12:00:00.000Z");
});

test("parseScheduledSendAt rolls at 8am forward when local time already passed", () => {
  const from = new Date("2026-08-30T13:39:00.000Z");
  const when = parseScheduledSendAt("at 8am", from, "America/New_York");
  assert.equal(when.toISOString(), "2026-08-31T12:00:00.000Z");
});

test("ensureFutureSendAt rolls same local clock forward one day", () => {
  const from = new Date("2026-08-30T13:39:00.000Z");
  const sendAt = parseScheduledSendAt("today at 8am", from, "America/New_York");
  const future = ensureFutureSendAt(sendAt, from, "America/New_York");
  assert.equal(future.toISOString(), "2026-08-31T12:00:00.000Z");
});

test("parseAffirmation and parseDecline detect confirmation replies", () => {
  assert.equal(parseAffirmation("yes"), true);
  assert.equal(parseAffirmation("schedule it"), true);
  assert.equal(parseAffirmation("no thanks"), false);
  assert.equal(parseDecline("nevermind"), true);
  assert.equal(parseDecline("yes"), false);
});

test("isPendingOfferText covers schedule and save offers", () => {
  assert.equal(isPendingOfferText("Want me to save this to your profile?"), true);
  assert.equal(isPendingOfferText("Do you want me to text you at 8am?"), true);
});

test("sanitizeDoeDtcReplyText preserves pending offer when requested", () => {
  const cleaned = sanitizeDoeDtcReplyText("Want me to text you tomorrow at 8?", {
    keepCloserRate: 0,
    preservePendingOffer: true,
  });
  assert.match(cleaned.toLowerCase(), /text you/);
});

test("formatScheduledSendAtLabel returns readable text", () => {
  const label = formatScheduledSendAtLabel(new Date("2026-08-30T12:00:00.000Z"), "UTC");
  assert.ok(label.length > 0);
});

test("canScheduleForHouseholdMember requires canView for joined members", () => {
  const household: DoeDtcHouseholdRow = {
    id: "h1",
    admin_user_id: "admin-user",
    created_at: "",
    updated_at: "",
  };
  const members: DoeDtcHouseholdMemberRow[] = [
    {
      id: "admin-m",
      household_id: "h1",
      user_id: "admin-user",
      full_name: "Parent",
      relationship: "other",
      phone: null,
      date_of_birth: null,
      role: "admin",
      status: "active",
      created_at: "",
      updated_at: "",
    },
    {
      id: "adult-m",
      household_id: "h1",
      user_id: "adult-user",
      full_name: "Alex",
      relationship: "other",
      phone: "+15551234567",
      date_of_birth: "1990-01-01",
      role: "member",
      status: "active",
      created_at: "",
      updated_at: "",
    },
  ];
  const consents: DoeDtcHouseholdConsentRow[] = [
    {
      id: "c1",
      user_id: "adult-user",
      household_id: "h1",
      share_health: "none",
      allow_edits: "none",
      share_member_ids: [],
      edit_member_ids: [],
      access_revoked_at: null,
      created_at: "",
      updated_at: "",
    },
  ];
  assert.equal(
    canScheduleForHouseholdMember({
      household,
      members,
      consents,
      viewerUserId: "admin-user",
      member: members[1]!,
    }),
    false,
  );
});

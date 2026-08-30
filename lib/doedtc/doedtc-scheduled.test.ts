import assert from "node:assert/strict";
import test from "node:test";

import {
  formatScheduledSendAtLabel,
  isScheduleOfferText,
  parseScheduledSendAt,
} from "@/lib/doedtc/doedtc-scheduled";
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

test("isScheduleOfferText detects reminder offers", () => {
  assert.equal(isScheduleOfferText("Do you want me to text you at 8am?"), true);
  assert.equal(isScheduleOfferText("Logged your shot."), false);
});

test("sanitizeDoeDtcReplyText preserves schedule offer when requested", () => {
  const cleaned = sanitizeDoeDtcReplyText("Want me to text you tomorrow at 8?", {
    keepCloserRate: 0,
    preserveScheduleOffer: true,
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

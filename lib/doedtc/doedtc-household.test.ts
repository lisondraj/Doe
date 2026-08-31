import assert from "node:assert/strict";
import test from "node:test";

import {
  canEditMemberProfile,
  canViewMemberProfile,
  isHouseholdMemberAdult,
} from "@/lib/doedtc/doedtc-household";
import type {
  DoeDtcHouseholdConsentRow,
  DoeDtcHouseholdMemberRow,
  DoeDtcHouseholdRow,
} from "@/lib/doedtc/doedtc-types";

function yearsAgo(years: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().slice(0, 10);
}

const household: DoeDtcHouseholdRow = {
  id: "h1",
  admin_user_id: "admin-user",
  created_at: "",
  updated_at: "",
};

function member(overrides: Partial<DoeDtcHouseholdMemberRow>): DoeDtcHouseholdMemberRow {
  return {
    id: "m1",
    household_id: "h1",
    user_id: "user-1",
    full_name: "Member",
    relationship: "other",
    phone: null,
    date_of_birth: null,
    gender: null,
    role: "member",
    status: "active",
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

test("isHouseholdMemberAdult is true at 18 and false under 18", () => {
  assert.equal(isHouseholdMemberAdult(yearsAgo(18)), true);
  assert.equal(isHouseholdMemberAdult(yearsAgo(10)), false);
  assert.equal(isHouseholdMemberAdult(null), false);
});

test("admin can view and edit a minor child without consent", () => {
  const members = [
    member({ id: "admin-m", user_id: "admin-user", role: "admin", full_name: "Parent" }),
    member({
      id: "child-m",
      user_id: "child-user",
      relationship: "child",
      full_name: "Kid",
      date_of_birth: yearsAgo(10),
    }),
  ];
  const params = {
    household,
    members,
    consents: [] as DoeDtcHouseholdConsentRow[],
    viewerUserId: "admin-user",
    subjectUserId: "child-user",
  };
  assert.equal(canViewMemberProfile(params), true);
  assert.equal(canEditMemberProfile(params), true);
});

test("admin cannot view an 18+ child without consent", () => {
  const members = [
    member({ id: "admin-m", user_id: "admin-user", role: "admin", full_name: "Parent" }),
    member({
      id: "child-m",
      user_id: "adult-child",
      relationship: "child",
      full_name: "Simon",
      date_of_birth: yearsAgo(19),
    }),
  ];
  const params = {
    household,
    members,
    consents: [] as DoeDtcHouseholdConsentRow[],
    viewerUserId: "admin-user",
    subjectUserId: "adult-child",
  };
  assert.equal(canViewMemberProfile(params), false);
  assert.equal(canEditMemberProfile(params), false);
});

test("certain-member consent allows only listed household members", () => {
  const members = [
    member({ id: "admin-m", user_id: "admin-user", role: "admin", full_name: "Parent" }),
    member({ id: "sib-m", user_id: "sib-user", relationship: "sibling", full_name: "Sib" }),
    member({
      id: "adult-m",
      user_id: "adult-child",
      relationship: "child",
      full_name: "Simon",
      date_of_birth: yearsAgo(19),
    }),
  ];
  const consents: DoeDtcHouseholdConsentRow[] = [
    {
      id: "c1",
      user_id: "adult-child",
      household_id: "h1",
      share_health: "certain",
      allow_edits: "none",
      share_member_ids: ["admin-m"],
      edit_member_ids: [],
      access_revoked_at: null,
      created_at: "",
      updated_at: "",
    },
  ];
  assert.equal(
    canViewMemberProfile({
      household,
      members,
      consents,
      viewerUserId: "admin-user",
      subjectUserId: "adult-child",
    }),
    true,
  );
  assert.equal(
    canViewMemberProfile({
      household,
      members,
      consents,
      viewerUserId: "sib-user",
      subjectUserId: "adult-child",
    }),
    false,
  );
  assert.equal(
    canEditMemberProfile({
      household,
      members,
      consents,
      viewerUserId: "admin-user",
      subjectUserId: "adult-child",
    }),
    false,
  );
});

test("minor revoke blocks admin view even without prior consent row", () => {
  const members = [
    member({ id: "admin-m", user_id: "admin-user", role: "admin", full_name: "Parent" }),
    member({
      id: "child-m",
      user_id: "child-user",
      relationship: "child",
      full_name: "Kid",
      date_of_birth: yearsAgo(10),
    }),
  ];
  const consents: DoeDtcHouseholdConsentRow[] = [
    {
      id: "c1",
      user_id: "child-user",
      household_id: "h1",
      share_health: "none",
      allow_edits: "none",
      share_member_ids: [],
      edit_member_ids: [],
      access_revoked_at: new Date().toISOString(),
      created_at: "",
      updated_at: "",
    },
  ];
  assert.equal(
    canViewMemberProfile({
      household,
      members,
      consents,
      viewerUserId: "admin-user",
      subjectUserId: "child-user",
    }),
    false,
  );
});

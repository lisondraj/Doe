import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { applyDoeDtcPreviewAction, createDoeDtcPreviewSnapshot } from "@/lib/doedtc/doedtc-preview-snapshot";
import { buildDoeDtcOnboardingFacts } from "@/lib/doedtc/doedtc-profile-facts";
import { normalizeDoeDtcGender } from "@/lib/doedtc/doedtc-types";

describe("profile write helpers", () => {
  it("accepts loose gender labels from the agent", () => {
    assert.equal(normalizeDoeDtcGender("female"), "female");
    assert.equal(normalizeDoeDtcGender("Male"), "male");
    assert.equal(normalizeDoeDtcGender("non_binary"), "nonbinary");
    assert.equal(normalizeDoeDtcGender("non-binary"), "nonbinary");
    assert.equal(normalizeDoeDtcGender("prefer_not_to_say"), "prefer_not");
    assert.equal(normalizeDoeDtcGender("prefer not"), "prefer_not");
    assert.equal(normalizeDoeDtcGender("unknown"), null);
  });

  it("builds onboarding facts for supabase-backed Get Started fields", () => {
    const facts = buildDoeDtcOnboardingFacts({
      fullName: "James Lisondra",
      email: "james@doe.care",
      dateOfBirth: "1994-03-12",
      gender: "male",
      country: "CA",
      medications: ["Ozempic"],
      conditions: ["Asthma"],
      familyMembers: [
        {
          fullName: "Simon",
          relationship: "child",
          gender: "male",
          dateOfBirth: "2016-08-30",
        },
      ],
      medicalDeferred: false,
    });

    assert.ok(facts.some((fact) => fact.includes("James Lisondra")));
    assert.ok(facts.some((fact) => fact.includes("Canada")));
    assert.ok(facts.some((fact) => fact.includes("Ozempic")));
    assert.ok(facts.some((fact) => fact.includes("Simon") && fact.includes("child")));
  });

  it("applies dashboard about edits in the profile preview", () => {
    const next = applyDoeDtcPreviewAction(createDoeDtcPreviewSnapshot(), "update_profile", {
      fullName: "Alex Doe",
      email: "alex@doe.care",
      dateOfBirth: "1990-01-02",
      gender: "female",
      country: "US",
      whyDoe: "Care for family",
    });

    assert.equal(next.user.full_name, "Alex Doe");
    assert.equal(next.user.email, "alex@doe.care");
    assert.equal(next.user.date_of_birth, "1990-01-02");
    assert.equal(next.user.gender, "female");
    assert.equal(next.user.country, "US");
    assert.equal(next.user.why_doe, "Care for family");
    const admin = next.household.members.find((member) => member.role === "admin");
    assert.equal(admin?.full_name, "Alex Doe");
    assert.equal(admin?.date_of_birth, "1990-01-02");
    assert.equal(admin?.gender, "female");
  });
});

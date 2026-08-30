import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeBrowserUrl,
  resolveResearchBrowseTarget,
} from "@/lib/doedtc/doedtc-browser-allowlist";
import { toUserSafeBrowserError } from "@/lib/doedtc/doedtc-browser";
import { sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";
import { extractInboundMessageId } from "@/lib/doedtc/doedtc-messaging";
import { linqReactionPayload } from "@/lib/doedtc/linq";
import { formatDoeDtcIntegrations, formatDoeDtcProfileTab } from "@/lib/doedtc/doedtc-profile-read";
import {
  normalizeDoeDtcFamilyRelationship,
  resolveDoeDtcFamilyMemberName,
} from "@/lib/doedtc/doedtc-family-relationship";

test("resolveResearchBrowseTarget accepts direct URLs", () => {
  const result = resolveResearchBrowseTarget({
    url: "https://www.cdc.gov/flu",
    intent: "flu season",
  });
  assert.ok(!("ok" in result));
  if ("ok" in result) return;
  assert.equal(result.host, "cdc.gov");
  assert.match(result.targetUrl, /cdc\.gov\/flu/);
});

test("resolveResearchBrowseTarget accepts any non-denied host", () => {
  const result = resolveResearchBrowseTarget({
    url: "https://example.com",
    intent: "health info",
  });
  assert.ok(!("ok" in result));
  if ("ok" in result) return;
  assert.equal(result.host, "example.com");
  assert.match(result.targetUrl, /^https:\/\/example\.com\/?$/);
});

test("resolveResearchBrowseTarget resolves mayo search asthma", () => {
  const result = resolveResearchBrowseTarget({
    url: "mayo",
    intent: "search asthma",
  });
  assert.ok(!("ok" in result));
  if ("ok" in result) return;
  assert.equal(result.host, "mayoclinic.org");
  assert.match(result.targetUrl, /mayoclinic\.org\/search\/search-results\?q=asthma/);
});

test("resolveResearchBrowseTarget turns google type mayo into a Google search", () => {
  for (const params of [
    { url: "google", intent: "type mayo" },
    { url: "google.com", intent: "type mayo" },
    { url: "https://www.google.com", intent: "type mayo and SS result" },
    { url: "google", intent: "goto google type mayo and SS result" },
    { url: "", intent: "open browser goto google type mayo" },
  ]) {
    const result = resolveResearchBrowseTarget(params);
    assert.ok(!("ok" in result), JSON.stringify(params));
    if ("ok" in result) return;
    assert.equal(result.host, "google.com");
    assert.match(result.targetUrl, /google\.com\/search\?q=mayo/);
  }
});

test("resolveResearchBrowseTarget uses google for topic-only queries", () => {
  const result = resolveResearchBrowseTarget({
    url: "",
    intent: "asthma triggers",
  });
  assert.ok(!("ok" in result));
  if ("ok" in result) return;
  assert.equal(result.host, "google.com");
  assert.match(result.targetUrl, /search\?q=/);
});

test("normalizeBrowserUrl preserves path and query without scheme", () => {
  const normalized = normalizeBrowserUrl("mayoclinic.org/search/search-results?q=asthma");
  assert.equal(normalized.host, "mayoclinic.org");
  assert.match(normalized.targetUrl, /search-results\?q=asthma/);
});

test("toUserSafeBrowserError maps kernel errors", () => {
  assert.match(
    toUserSafeBrowserError("Browser automation is not configured."),
    /isn't available right now/i,
  );
  assert.match(
    toUserSafeBrowserError("That site is not allowed."),
    /can't open that site/i,
  );
});

test("sanitizeDoeDtcReplyText strips URLs from replies", () => {
  const cleaned = sanitizeDoeDtcReplyText("Here is the link https://example.com/foo");
  assert.ok(!cleaned.includes("https://"));
});

test("sanitizeDoeDtcReplyText usually strips feel-free closers", () => {
  const cleaned = sanitizeDoeDtcReplyText(
    "Got it. Feel free to let me know if you have any questions.",
    { keepCloserRate: 0 },
  );
  assert.equal(cleaned, "Got it");
});

test("sanitizeDoeDtcReplyText does not leave a trailing comma", () => {
  assert.equal(
    sanitizeDoeDtcReplyText("Got it, let me know if you have any questions.", { keepCloserRate: 0 }),
    "Got it",
  );
  assert.equal(sanitizeDoeDtcReplyText("I logged that,"), "I logged that");
});

test("sanitizeDoeDtcReplyText strips markdown formatting", () => {
  assert.equal(
    sanitizeDoeDtcReplyText("Your **Ozempic** dose is logged.", { keepCloserRate: 0 }),
    "Your Ozempic dose is logged.",
  );
  assert.equal(
    sanitizeDoeDtcReplyText("Use `profile` to view it.", { keepCloserRate: 0 }),
    "Use profile to view it.",
  );
});

test("sanitizeDoeDtcReplyText strips want-me-to closers", () => {
  assert.equal(
    sanitizeDoeDtcReplyText("Logged your shot. Want me to add a reminder too?", { keepCloserRate: 0 }),
    "Logged your shot",
  );
  assert.equal(
    sanitizeDoeDtcReplyText("Done. Let me know.", { keepCloserRate: 0 }),
    "Done",
  );
});

test("extractInboundMessageId reads current and legacy Linq payloads", () => {
  assert.equal(
    extractInboundMessageId({ data: { id: "v2-message-id", parts: [] } }),
    "v2-message-id",
  );
  assert.equal(
    extractInboundMessageId({ data: { message: { id: "legacy-message-id" } } }),
    "legacy-message-id",
  );
});

test("linqReactionPayload adds tapbacks and custom emoji", () => {
  assert.deepEqual(linqReactionPayload("👍"), { operation: "add", type: "like" });
  assert.deepEqual(linqReactionPayload("🙏"), {
    operation: "add",
    type: "custom",
    custom_emoji: "🙏",
  });
});

test("normalizeDoeDtcFamilyRelationship maps son and daughter to child", () => {
  assert.equal(normalizeDoeDtcFamilyRelationship("son"), "child");
  assert.equal(normalizeDoeDtcFamilyRelationship("daughter"), "child");
  assert.equal(normalizeDoeDtcFamilyRelationship("wife"), "partner");
});

test("resolveDoeDtcFamilyMemberName defaults unnamed children", () => {
  assert.equal(
    resolveDoeDtcFamilyMemberName({ fullName: "", relationship: "child" }),
    "Child",
  );
});

test("formatDoeDtcProfileTab reads Whoop from the dashboard tab", () => {
  const snapshot = {
    user: {
      id: "u1",
      full_name: "James",
      email: null,
      why_doe: null,
      medical_deferred: false,
      care_token: "t",
    },
    medications: [],
    conditions: [],
    familyMembers: [],
    appointments: [],
    listenSessions: [],
    results: [],
    lockerItems: [],
    healthConnections: [
      {
        id: "h1",
        user_id: "u1",
        provider: "whoop" as const,
        status: "disconnected" as const,
        created_at: "",
        updated_at: "",
      },
    ],
    shareCodes: [],
    symptoms: [],
    assessments: [],
    artifacts: [],
    artifactEntries: [],
    tickets: [],
  };
  const dashboard = formatDoeDtcProfileTab(snapshot, "dashboard");
  assert.match(dashboard, /Whoop: not connected/);
  assert.match(formatDoeDtcIntegrations(snapshot), /Whoop: not connected/);
});

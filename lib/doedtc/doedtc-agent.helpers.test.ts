import assert from "node:assert/strict";
import test from "node:test";

import { resolveResearchBrowseTarget } from "@/lib/doedtc/doedtc-browser-allowlist";
import { toUserSafeBrowserError } from "@/lib/doedtc/doedtc-browser";
import { sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";
import {
  normalizeDoeDtcFamilyRelationship,
  resolveDoeDtcFamilyMemberName,
} from "@/lib/doedtc/doedtc-family-relationship";

test("resolveResearchBrowseTarget accepts allowlisted hosts", () => {
  const result = resolveResearchBrowseTarget({
    url: "https://www.cdc.gov/flu",
    intent: "flu season",
  });
  assert.ok(!("ok" in result));
  if ("ok" in result) return;
  assert.equal(result.host, "cdc.gov");
  assert.match(result.targetUrl, /cdc\.gov\/flu/);
});

test("resolveResearchBrowseTarget rejects off-allowlist hosts", () => {
  const result = resolveResearchBrowseTarget({
    url: "https://example.com",
    intent: "health info",
  });
  assert.ok("ok" in result && result.ok === false);
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

test("toUserSafeBrowserError maps kernel and allowlist errors", () => {
  assert.match(
    toUserSafeBrowserError("Browser automation is not configured."),
    /isn't available right now/i,
  );
  assert.match(
    toUserSafeBrowserError("Research browsing is limited to approved health and reference sites."),
    /Mayo Clinic/i,
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

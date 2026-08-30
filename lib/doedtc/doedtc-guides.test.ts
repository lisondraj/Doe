import assert from "node:assert/strict";
import test from "node:test";

import {
  defaultBlocksForLayout,
  isGuideSaveOfferText,
  normalizeGuideBlocks,
  normalizeGuideLayout,
} from "@/lib/doedtc/doedtc-guides";
import { sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";

test("normalizeGuideLayout defaults unknown values to howto", () => {
  assert.equal(normalizeGuideLayout("unknown"), "howto");
  assert.equal(normalizeGuideLayout("checklist"), "checklist");
});

test("normalizeGuideBlocks drops unknown kinds and appends disclaimer", () => {
  const blocks = normalizeGuideBlocks([
    { id: "hero-1", kind: "hero", title: "Take Ozempic" },
    { id: "bad-1", kind: "not_real", title: "Skip me" },
  ]);
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0]?.kind, "hero");
  assert.equal(blocks[blocks.length - 1]?.kind, "disclaimer");
});

test("defaultBlocksForLayout includes disclaimer for howto", () => {
  const blocks = defaultBlocksForLayout("howto", "Ozempic guide", "take Ozempic properly");
  assert.ok(blocks.some((block) => block.kind === "steps"));
  assert.equal(blocks[blocks.length - 1]?.kind, "disclaimer");
});

test("isGuideSaveOfferText detects save-to-profile offers", () => {
  assert.equal(isGuideSaveOfferText("Want me to save this to your profile?"), true);
  assert.equal(isGuideSaveOfferText("Here is your guide."), false);
});

test("sanitizeDoeDtcReplyText preserves guide save offer when requested", () => {
  const cleaned = sanitizeDoeDtcReplyText("Want me to save this to your profile?", {
    keepCloserRate: 0,
    preservePendingOffer: true,
  });
  assert.match(cleaned.toLowerCase(), /save.*profile/);
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  defaultBlocksForLayout,
  defaultLayoutForTitle,
  formatPrimaryArtifactReading,
  normalizeArtifactBlocks,
  normalizeArtifactLayout,
  pickPrimaryNumericField,
} from "@/lib/doedtc/doedtc-artifacts";
import { doeDtcArtifactShareUrl } from "@/lib/doedtc/doedtc-copy";

test("normalizeArtifactLayout defaults unknown values to log", () => {
  assert.equal(normalizeArtifactLayout("unknown"), "log");
  assert.equal(normalizeArtifactLayout("series"), "series");
});

test("normalizeArtifactBlocks drops unknown kinds", () => {
  const blocks = normalizeArtifactBlocks([
    { id: "hero-1", kind: "hero", title: "Calories" },
    { id: "bad-1", kind: "not_real", title: "Skip me" },
    { id: "chart-1", kind: "chart", title: "Trend", fieldKey: "calories" },
  ]);
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0]?.kind, "hero");
  assert.equal(blocks[1]?.kind, "chart");
});

test("calorie title maps to series layout with chart block", () => {
  assert.equal(defaultLayoutForTitle("Calorie tracker"), "series");
  const fields = [
    { key: "calories", label: "Calories", type: "number" as const },
    { key: "notes", label: "Notes", type: "text" as const, optional: true },
  ];
  const blocks = defaultBlocksForLayout({
    layout: "series",
    title: "Calorie tracker",
    fields,
  });
  assert.ok(blocks.some((block) => block.kind === "chart"));
  assert.ok(blocks.some((block) => block.kind === "stats"));
  assert.equal(pickPrimaryNumericField(fields)?.key, "calories");
});

test("formatPrimaryArtifactReading prefers numeric value with unit", () => {
  const artifact = {
    config: {
      fields: [
        { key: "weight", label: "Weight (lb)", type: "number" as const },
        { key: "notes", label: "Notes", type: "text" as const, optional: true },
      ],
    },
  };
  assert.equal(formatPrimaryArtifactReading(artifact, { weight: 185, notes: "morning" }), "185 lb");
});

test("formatPrimaryArtifactReading falls back to first populated field", () => {
  const artifact = {
    config: {
      fields: [
        { key: "dose", label: "Dose", type: "select" as const, options: ["0.5 mg", "1 mg"] },
        { key: "site", label: "Site", type: "select" as const, options: ["abdomen"] },
      ],
    },
  };
  assert.equal(formatPrimaryArtifactReading(artifact, { dose: "1 mg", site: "abdomen" }), "1 mg");
});

test("doeDtcArtifactShareUrl uses dedicated artifact share param", () => {
  const url = new URL(doeDtcArtifactShareUrl("abc123share"));
  assert.match(url.pathname, /\/artifact$/);
  assert.equal(url.searchParams.get("s"), "abc123share");
  assert.equal(url.searchParams.get("t"), null);
});

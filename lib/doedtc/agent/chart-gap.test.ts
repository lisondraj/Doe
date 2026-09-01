import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  extractUnownedChartItems,
  looksLikeIncidentalChartMention,
} from "@/lib/doedtc/agent/chart-gap";
import { looksLikeChartWrite } from "@/lib/doedtc/agent/deliverable-policy";

describe("unowned chart items", () => {
  it("picks a named thing they are taking that is not on the chart", () => {
    const gaps = extractUnownedChartItems({
      inboundText: "im taking my viagra tomorrow",
      medications: [],
    });
    assert.equal(gaps.length, 1);
    assert.equal(gaps[0]?.kind, "medication");
    assert.equal(gaps[0]?.tool, "add_medication");
    assert.match(gaps[0]?.label ?? "", /viagra/i);
  });

  it("skips items already on the chart", () => {
    const gaps = extractUnownedChartItems({
      inboundText: "I'm taking my viagra tomorrow",
      medications: ["Viagra"],
    });
    assert.deepEqual(gaps, []);
  });

  it("does not treat generic containers as chart items", () => {
    const gaps = extractUnownedChartItems({
      inboundText: "I'm taking my shot tomorrow",
      medications: [],
    });
    assert.deepEqual(gaps, []);
  });

  it("does not treat timed taking as an immediate chart write", () => {
    assert.equal(looksLikeIncidentalChartMention("im taking my viagra tomorrow"), true);
    assert.equal(looksLikeChartWrite("im taking my viagra tomorrow"), false);
    assert.equal(looksLikeChartWrite("I take metformin"), true);
    assert.equal(looksLikeChartWrite("add metformin to my chart"), true);
  });
});

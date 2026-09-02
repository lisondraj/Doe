import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assessChartWrite,
  attachChartSectionLink,
  isVagueChartValue,
  mergeChartWriteFollowUp,
  tabForChartWrite,
} from "@/lib/doedtc/agent/chart-write";

describe("chart write completeness", () => {
  it("treats named meds and conditions as complete", () => {
    assert.equal(
      assessChartWrite({
        tool: "add_medication",
        args: { name: "Metformin" },
        inboundText: "add metformin",
      }).complete,
      true,
    );
    assert.equal(
      assessChartWrite({
        tool: "add_condition",
        args: { name: "Asthma" },
        inboundText: "I have asthma",
      }).complete,
      true,
    );
  });

  it("probes vague chart adds", () => {
    const med = assessChartWrite({
      tool: "add_medication",
      args: { name: "" },
      inboundText: "add a med to my chart",
    });
    assert.equal(med.complete, false);
    assert.match(med.probe, /which medication/i);

    const labs = assessChartWrite({
      tool: "log_result",
      args: {},
      inboundText: "log my labs",
    });
    assert.equal(labs.complete, false);
    assert.match(labs.probe, /which test/i);
    assert.ok(!/title/i.test(labs.probe));
  });

  it("does not probe document-backed lab saves", () => {
    const assessment = assessChartWrite({
      tool: "log_result",
      args: {},
      inboundText: "Log these",
      hasDocumentWrites: true,
    });
    assert.equal(assessment.complete, true);
  });

  it("accepts a reported A1C with value and date", () => {
    const assessment = assessChartWrite({
      tool: "log_result",
      args: {},
      inboundText: "My A1C was 6.2 last week",
    });
    assert.equal(assessment.complete, true);
  });

  it("merges a follow-up medication name", () => {
    const merged = mergeChartWriteFollowUp({
      tool: "add_medication",
      args: { chart_write: true },
      inboundText: "Metformin",
    });
    assert.equal(merged.name, "Metformin");
    assert.equal(merged.chart_write, undefined);
  });

  it("does not treat yes as a medication name", () => {
    const merged = mergeChartWriteFollowUp({
      tool: "add_medication",
      args: {},
      inboundText: "yes",
    });
    assert.equal(merged.name, undefined);
  });

  it("maps write tools to the tab that shows the change", () => {
    assert.equal(tabForChartWrite("add_medication"), "conditions");
    assert.equal(tabForChartWrite("log_result"), "results");
    assert.equal(tabForChartWrite("log_appointment"), "appointments");
    assert.equal(tabForChartWrite("log_family_member"), "family");
    assert.equal(tabForChartWrite("log_artifact_entry"), "trackers");
    assert.match(
      attachChartSectionLink({ careToken: "tok", tool: "log_result" }) ?? "",
      /tab=results/,
    );
  });

  it("treats placeholder words as vague", () => {
    assert.equal(isVagueChartValue("labs"), true);
    assert.equal(isVagueChartValue("a med"), true);
    assert.equal(isVagueChartValue("Metformin"), false);
  });
});

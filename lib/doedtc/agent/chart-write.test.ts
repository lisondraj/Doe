import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assessChartWrite,
  attachChartSectionLink,
  formatIncidentalChartWriteContinueBlock,
  isVagueChartValue,
  looksLikeChartWriteAckOnly,
  mergeChartWriteFollowUp,
  selectChartWriteResumeKind,
  tabForChartWrite,
  withChartWritePendingArgs,
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

  it("keeps going after incidental name fills, confirms explicit writes", () => {
    assert.equal(
      selectChartWriteResumeKind({
        originalInbound: "Sarah is my child actually",
        currentInbound: "Sarah Willcock",
      }),
      "continue",
    );
    assert.equal(
      selectChartWriteResumeKind({
        originalInbound: "add metformin to my chart",
        currentInbound: "Metformin",
      }),
      "confirm",
    );
    assert.equal(
      selectChartWriteResumeKind({
        originalInbound: "add my daughter",
        currentInbound: "Sarah Willcock",
      }),
      "confirm",
    );
    assert.equal(looksLikeChartWriteAckOnly("Added Sarah Willcock to your chart."), true);
    assert.equal(
      looksLikeChartWriteAckOnly("That's tough. I added Sarah so we can keep this going. Want a walk together later?"),
      false,
    );
    assert.match(
      formatIncidentalChartWriteContinueBlock({
        label: "Sarah Willcock",
        originalInbound: "Sarah is my child actually",
      }),
      /continue the original problem/i,
    );
    const pendingArgs = withChartWritePendingArgs({ relationship: "child" }, "Sarah is my child actually");
    assert.equal(pendingArgs.original_inbound, "Sarah is my child actually");
    assert.equal(pendingArgs.chart_write, true);
  });
});

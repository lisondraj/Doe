import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  allPromptSignalCombinations,
  assertRegistryComplete,
  assertToolPromptCoverage,
  buildDoeDtcToolCapabilityPrompt,
  buildDoeSpecialistToolCapabilityPrompt,
  toolsForSpecialist,
  TOOL_DOMAINS,
} from "@/lib/doedtc/agent/tool-prompt-registry";
import { buildDoePlannerSystemPrompt, buildDoeSpecialistSystemPrompt } from "@/lib/doedtc/doedtc-agent";
import { resolveDoeDtcAgentRuntime } from "@/lib/doedtc/agent/types";
import { DOE_DTC_TOOL_NAMES } from "@/lib/doedtc/agent/tool-dispatch";
import { DOEDTC_AGENT_TOOLS } from "@/lib/doedtc/doedtc-agent-tools";
import {
  classifyDataWrite,
  DOE_AGENT_RESOLUTION_POLICY,
} from "@/lib/doedtc/doedtc-agent-policy";
import {
  buildDoeAgentVoiceBlock,
  DOE_AGENT_FEW_SHOTS,
  DOE_AGENT_INSTINCTS,
} from "@/lib/doedtc/doedtc-agent-voice";
import {
  DOE_PRIMITIVES,
  primitiveCoverageForTool,
} from "@/lib/doedtc/doedtc-primitives";

describe("tool prompt registry", () => {
  it("maps every dispatch tool to a domain and override", () => {
    assertRegistryComplete();
    for (const name of DOE_DTC_TOOL_NAMES) {
      assert.ok(TOOL_DOMAINS[name], `missing domain: ${name}`);
    }
  });

  it("covers all tools under every signal combination", () => {
    for (const signals of allPromptSignalCombinations()) {
      const prompt = buildDoeDtcToolCapabilityPrompt(signals);
      assertToolPromptCoverage(prompt);
    }
  });

  it("specialist sets union to full dispatch surface", () => {
    const union = new Set<string>();
    for (const specialist of ["healthRecord", "guides", "scheduling", "browser"] as const) {
      for (const name of toolsForSpecialist(specialist)) {
        union.add(name);
      }
    }
    for (const name of DOE_DTC_TOOL_NAMES) {
      assert.ok(union.has(name), `tool missing from specialists: ${name}`);
    }
  });

  it("does not place start_listen under browser specialist", () => {
    assert.ok(toolsForSpecialist("healthRecord").has("start_listen"));
    assert.ok(!toolsForSpecialist("browser").has("start_listen"));
    assert.ok(toolsForSpecialist("healthRecord").has("read_listen_session"));
  });

  it("agent tool schemas include new gap tools", () => {
    const names = new Set(DOEDTC_AGENT_TOOLS.map((entry) => entry.function.name));
    assert.ok(names.has("log_result"));
    assert.ok(names.has("remove_result"));
    assert.ok(names.has("read_listen_session"));
    assert.ok(names.has("start_workflow"));
    assert.ok(names.has("propose_workflow"));
  });

  it("planner prompt omits full tool catalog; specialist prompt is narrower", () => {
    const params = {
      user: { full_name: "Sam", gender: null, country: null, date_of_birth: null } as never,
      medications: [],
      conditions: [],
      transcript: "",
      symptomLog: "None",
      assessmentHistory: "None",
      appointmentLog: "None",
      relevantMemories: "None",
      playbookNotes: "None",
      pendingBlock: "",
      familyLog: "None",
      householdLog: "None",
      accountabilityLog: "None",
      scheduledLog: "None",
      workflowsLog: "None",
      guidesLog: "None",
      profileOverview: "Overview",
      nowLabel: "Mon 7pm",
    };
    const planner = buildDoePlannerSystemPrompt(params);
    const scheduling = buildDoeSpecialistSystemPrompt("scheduling", params);
    const full = buildDoeDtcToolCapabilityPrompt();
    assert.doesNotMatch(planner, /browser_navigate/);
    assert.match(scheduling, /start_workflow/);
    assert.ok(full.length > scheduling.length);
    assert.ok(buildDoeSpecialistToolCapabilityPrompt("browser").includes("browser_navigate"));
  });

  it("defaults agent runtime to sdk", () => {
    const previous = process.env.DOEDTC_AGENT_RUNTIME;
    delete process.env.DOEDTC_AGENT_RUNTIME;
    assert.equal(resolveDoeDtcAgentRuntime(), "sdk");
    process.env.DOEDTC_AGENT_RUNTIME = "legacy";
    assert.equal(resolveDoeDtcAgentRuntime(), "legacy");
    if (previous === undefined) delete process.env.DOEDTC_AGENT_RUNTIME;
    else process.env.DOEDTC_AGENT_RUNTIME = previous;
  });
});

describe("primitives coverage", () => {
  it("maps every dispatch tool to at least one primitive", () => {
    for (const name of DOE_DTC_TOOL_NAMES) {
      const verbs = primitiveCoverageForTool(name);
      assert.ok(verbs.length > 0, `no primitive for tool: ${name}`);
    }
  });

  it("includes gap tools on results and visit primitives", () => {
    const results = DOE_PRIMITIVES.find((row) => row.verb === "results.log");
    assert.ok(results?.tools.includes("log_result"));
    const recall = DOE_PRIMITIVES.find((row) => row.verb === "visit.recall");
    assert.ok(recall?.tools.includes("read_listen_session"));
  });
});

describe("policy and voice upgrades", () => {
  it("classifies correction language as update", () => {
    assert.equal(classifyDataWrite("Actually it's Metformin not Metforman"), "update");
    assert.equal(classifyDataWrite("Delete my last water entry"), "remove");
    assert.equal(classifyDataWrite("I have a headache"), "create");
  });

  it("includes resolution policy and instincts in voice block", () => {
    assert.match(DOE_AGENT_RESOLUTION_POLICY, /never ask for symptom_id/i);
    assert.match(DOE_AGENT_INSTINCTS, /read_listen_session/i);
    const block = buildDoeAgentVoiceBlock();
    assert.match(block, /Instincts:/);
    assert.match(DOE_AGENT_FEW_SHOTS, /take a bath/);
    assert.match(DOE_AGENT_FEW_SHOTS, /Maya and Leo/);
    assert.match(DOE_AGENT_FEW_SHOTS, /take my meds/);
    assert.match(DOE_AGENT_FEW_SHOTS, /5 seconds/);
    assert.match(DOE_AGENT_FEW_SHOTS, /log_artifact_entry/);
    assert.match(DOE_AGENT_FEW_SHOTS, /create_guide/);
    assert.match(DOE_AGENT_FEW_SHOTS, /read_listen_session/);
    assert.doesNotMatch(DOE_AGENT_FEW_SHOTS, /accountability pack/i);
    assert.doesNotMatch(DOE_AGENT_FEW_SHOTS, /I can't directly/i);
  });
});

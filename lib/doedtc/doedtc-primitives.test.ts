import assert from "node:assert/strict";
import test from "node:test";

import { DOEDTC_AGENT_TOOLS } from "@/lib/doedtc/doedtc-agent";
import {
  DOE_PRIMITIVES,
  backendsForPrimitive,
  primitiveToolNames,
  toolsForPrimitive,
} from "@/lib/doedtc/doedtc-primitives";

test("primitives map to live agent tools", () => {
  const toolNames = new Set(DOEDTC_AGENT_TOOLS.map((tool) => tool.function.name));
  for (const name of primitiveToolNames()) {
    assert.ok(toolNames.has(name), `primitive tool missing from agent: ${name}`);
  }
});

test("habit.recurring uses Linq and Supabase, not a shower feature", () => {
  assert.deepEqual([...backendsForPrimitive("habit.recurring")], ["linq", "supabase"]);
  assert.ok(toolsForPrimitive("habit.recurring").includes("start_habit_workflow"));
  assert.ok(!DOE_PRIMITIVES.some((row) => /shower|bath|timer/.test(row.verb)));
});

test("browser.act uses Kernel SDK computer tool", () => {
  assert.deepEqual([...backendsForPrimitive("browser.act")], ["kernel"]);
  assert.ok(toolsForPrimitive("browser.act").includes("browser_computer"));
});

test("memory primitives use Mem0", () => {
  assert.deepEqual([...backendsForPrimitive("memory.remember")], ["mem0"]);
  assert.deepEqual([...backendsForPrimitive("memory.recall")], ["mem0"]);
});

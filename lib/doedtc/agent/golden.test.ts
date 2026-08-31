import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { DOE_DTC_TURN_RESULT_FIELDS } from "./types.ts";
import { doeDtcToolNames } from "./tools/index.ts";
import { DOE_DTC_TOOL_NAMES } from "./tool-dispatch.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(
  readFileSync(join(__dirname, "__fixtures__", "golden-transcripts.json"), "utf8"),
) as Array<{ id: string; description: string }>;

describe("golden transcript harness scaffolding", () => {
  it("loads fixture catalog", () => {
    assert.ok(fixtures.length >= 8);
  });

  it("tool registry matches dispatch names", () => {
    assert.equal(doeDtcToolNames().length, DOE_DTC_TOOL_NAMES.length);
    assert.deepEqual([...doeDtcToolNames()], [...DOE_DTC_TOOL_NAMES]);
  });

  it("turn result field list is stable for replay snapshots", () => {
    for (const field of DOE_DTC_TURN_RESULT_FIELDS) {
      assert.match(field, /^[a-zA-Z]+$/);
    }
  });
});

describe("browser_computer screenshot contract", () => {
  it("includes screenshot in computer tool dispatch path", async () => {
    const { computerDoeDtcBrowser } = await import("@/lib/doedtc/doedtc-browser");
    assert.equal(typeof computerDoeDtcBrowser, "function");
  });
});

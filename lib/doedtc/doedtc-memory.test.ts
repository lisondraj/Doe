import assert from "node:assert/strict";
import test from "node:test";

import { formatMem0Block } from "@/lib/doedtc/doedtc-memory";

test("formatMem0Block omits empty memories instead of claiming none exist", () => {
  assert.equal(formatMem0Block([]), "");
  assert.match(formatMem0Block(["Name is Alex."]), /Name is Alex/);
});

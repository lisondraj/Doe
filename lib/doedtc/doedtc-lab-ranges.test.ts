import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  lookupCatalogLabRange,
  normalizeLabResultFields,
} from "@/lib/doedtc/doedtc-lab-ranges";

describe("lab range catalog", () => {
  it("fills missing ALT range from catalog after extraction", () => {
    const normalized = normalizeLabResultFields({
      title: "ALT",
      value: "78",
      unit: "U/L",
    });
    assert.equal(normalized.value, "78");
    assert.equal(normalized.referenceRange, "7–56");
    assert.equal(normalized.rangeSource, "catalog");
    assert.match(normalized.summary ?? "", /ref 7–56/);
  });

  it("keeps printed range over catalog", () => {
    const normalized = normalizeLabResultFields({
      title: "ALT",
      value: "32",
      unit: "U/L",
      range: "<40",
    });
    assert.equal(normalized.referenceRange, "<40");
    assert.equal(normalized.rangeSource, "document");
  });

  it("looks up common analytes", () => {
    assert.equal(lookupCatalogLabRange("HbA1c")?.range, "<5.7");
    assert.equal(lookupCatalogLabRange("TSH")?.unit, "mIU/L");
  });
});

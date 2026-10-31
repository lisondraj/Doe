import assert from "node:assert/strict";
import { test } from "node:test";

import { gtmStats, matchesFilter, parseFilter } from "./gtm-filters";
import { GTM_TABLES, type GtmRow } from "./gtm-tables";

const table = GTM_TABLES.clinics_other;
const row = (data: Record<string, string>, extra: Partial<GtmRow> = {}): GtmRow => ({
  id: Math.random().toString(36),
  created_at: "2026-10-31T00:00:00Z",
  entry_date: "2026-10-31",
  report_date: null,
  data,
  page: null,
  status: null,
  import_batch: null,
  ...extra,
});
const rows = [
  row({ organization: "A", country: "Canada", email: "a@gmail.com", city: "Toronto" }, { status: "Sent" }),
  row({ organization: "B", country: "Canada" }, { entry_date: "2026-10-30" }),
  row({ organization: "C", country: "US", email: "c@clinic.com" }, { report_date: "2026-10-01" }),
];
const run = (f: unknown) => rows.filter((r) => matchesFilter(table, r, parseFilter(table, f))).map((r) => r.data.organization);

test("by value, emptiness and email", () => {
  assert.deepEqual(run({ conditions: [{ field: "country", op: "equals", value: "canada" }] }), ["A", "B"]);
  assert.deepEqual(run({ conditions: [{ field: "_email", op: "not_empty" }] }), ["A", "C"]);
  assert.deepEqual(run({ conditions: [{ field: "_email", op: "empty" }] }), ["B"]);
  assert.deepEqual(run({ conditions: [{ field: "country", op: "equals", value: "Canada" }, { field: "_email", op: "empty" }] }), ["B"]);
  assert.deepEqual(run({ match: "any", conditions: [{ field: "city", op: "contains", value: "tor" }, { field: "country", op: "equals", value: "US" }] }), ["A", "C"]);
  assert.deepEqual(run({ conditions: [{ field: "city", op: "not_contains", value: "tor" }] }), ["B", "C"]);
  assert.deepEqual(run({ conditions: [{ field: "organization", op: "in", values: ["a", "C"] }] }), ["A", "C"]);
  assert.deepEqual(run({ conditions: [{ field: "_status", op: "empty" }] }), ["B", "C"]);
  assert.deepEqual(run({ conditions: [{ field: "_entry_date", op: "before", value: "2026-10-30" }] }), ["B"]);
  assert.deepEqual(run({ conditions: [{ field: "_report_date", op: "not_empty" }] }), ["C"]);
  assert.deepEqual(run({ conditions: [{ field: "_any", op: "contains", value: "clinic.com" }] }), ["C"]);
});

test("ignores bad and half-filled conditions", () => {
  assert.deepEqual(run("not json"), ["A", "B", "C"]);
  assert.deepEqual(run({ conditions: [{ field: "nope", op: "equals", value: "x" }, { field: "city", op: "contains", value: "" }] }), ["A", "B", "C"]);
});

test("report counts every column", () => {
  const s = gtmStats(table, rows, 10);
  assert.equal(s.matching, 3);
  assert.equal(s.total, 10);
  assert.equal(s.withEmail, 2);
  const country = s.columns.find((c) => c.key === "country")!;
  assert.deepEqual(country.values, [{ value: "Canada", count: 2 }, { value: "US", count: 1 }]);
  assert.equal(s.columns.find((c) => c.key === "email")!.domains![0]!.count, 1);
  assert.equal(s.columns.length, table.columns.length);
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  groupLabsByDrawDate,
  groupLabsByTitle,
  labTitleKey,
  resultedDateKey,
  toResultView,
} from "@/lib/doedtc/doedtc-results-view";
import type { DoeDtcResultRow } from "@/lib/doedtc/doedtc-types";

function lab(partial: Partial<DoeDtcResultRow> & Pick<DoeDtcResultRow, "id" | "title" | "resulted_at">) {
  return toResultView({
    user_id: "user-1",
    source: "LifeLabs",
    summary: "7.8 % · <6.5",
    created_at: "2026-08-08T12:00:00.000Z",
    kind: "lab",
    ...partial,
  });
}

describe("lab latest vs sets", () => {
  it("normalizes titles so the same test groups together", () => {
    assert.equal(labTitleKey("HbA1c"), labTitleKey("hba1c"));
    assert.equal(labTitleKey("  ALT  "), "alt");
  });

  it("reads a calendar date from date-only or datetime values", () => {
    assert.equal(resultedDateKey("2026-08-08"), "2026-08-08");
    assert.equal(resultedDateKey("2026-08-08T15:30:00.000Z").startsWith("2026-08-"), true);
  });

  it("keeps only the newest result per test and lists older ones as history", () => {
    const series = groupLabsByTitle([
      lab({ id: "old", title: "HbA1c", resulted_at: "2025-11-03", summary: "8.2 % · <6.5" }),
      lab({ id: "mid", title: "hba1c", resulted_at: "2026-02-12", summary: "6.9 % · <6.5" }),
      lab({ id: "new", title: "HbA1c", resulted_at: "2026-08-08", summary: "7.8 % · <6.5" }),
      lab({ id: "tsh", title: "TSH", resulted_at: "2026-08-08", summary: "6.8 mIU/L · 0.4–4.0" }),
    ]);

    assert.equal(series.length, 2);
    const a1c = series.find((row) => row.key === "hba1c");
    assert.ok(a1c);
    assert.equal(a1c!.latest.id, "new");
    assert.deepEqual(
      a1c!.history.map((row) => row.id),
      ["new", "mid", "old"],
    );
  });

  it("prefers structured columns over legacy summary parsing", () => {
    const view = toResultView({
      id: "alt",
      user_id: "user-1",
      title: "ALT",
      resulted_at: "2026-08-08",
      source: "LifeLabs",
      summary: "legacy summary",
      value: "78",
      unit: "U/L",
      reference_range: "7–56",
      flag: "high",
      created_at: "2026-08-08T12:00:00.000Z",
    });
    assert.deepEqual(view.reading, { value: "78", unit: "U/L", range: "7–56" });
    assert.equal(view.flag, "high");
  });

  it("groups labs that arrived on the same day into one set", () => {
    const groups = groupLabsByDrawDate([
      lab({ id: "aug-a1c", title: "HbA1c", resulted_at: "2026-08-08" }),
      lab({ id: "aug-tsh", title: "TSH", resulted_at: "2026-08-08" }),
      lab({ id: "feb-a1c", title: "HbA1c", resulted_at: "2026-02-12" }),
    ]);

    assert.equal(groups.length, 2);
    assert.equal(groups[0]?.dateKey, "2026-08-08");
    assert.equal(groups[0]?.labs.length, 2);
    assert.equal(groups[0]?.source, "LifeLabs");
    assert.equal(groups[1]?.dateKey, "2026-02-12");
    assert.equal(groups[1]?.labs.length, 1);
  });
});

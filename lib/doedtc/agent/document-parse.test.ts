import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  mapLabPanelToLogResultWrites,
  normalizeDocumentParseResult,
  sanitizeDocumentParseSummary,
  shouldAutoCommitDocumentParse,
} from "@/lib/doedtc/agent/document-parse";

describe("document parse", () => {
  it("maps lab panel analytes to log_result writes", () => {
    const writes = mapLabPanelToLogResultWrites({
      resultedAt: "2026-08-15",
      analytes: [
        { title: "A1C", summary: "7.8 % · <6.5" },
        { title: "Glucose", summary: "102 mg/dL" },
      ],
    });
    assert.equal(writes.length, 2);
    assert.equal(writes[0]?.tool, "log_result");
    assert.equal(writes[0]?.args.title, "A1C");
    assert.equal(writes[0]?.args.summary, "7.8 % · <6.5");
    assert.equal(writes[0]?.args.resulted_at, "2026-08-15");
  });

  it("sanitizes parser summaries without em dashes", () => {
    assert.equal(
      sanitizeDocumentParseSummary("Looks like your lab panel — I can log it"),
      "Looks like your lab panel - I can log it",
    );
  });

  it("normalizes structured parse JSON", () => {
    const parsed = normalizeDocumentParseResult({
      kind: "lab_panel",
      confidence: 0.91,
      summary: "Lab panel from August",
      writes: [{ tool: "log_result", args: { title: "A1C", resulted_at: "2026-08-15" } }],
    });
    assert.equal(parsed.kind, "lab_panel");
    assert.equal(parsed.writes.length, 1);
    assert.doesNotMatch(parsed.summary, /\u2014/);
  });

  it("auto-commits high-confidence attachment turns with empty caption", () => {
    assert.equal(
      shouldAutoCommitDocumentParse({
        parse: {
          kind: "lab_panel",
          confidence: 0.9,
          summary: "Lab panel",
          writes: [{ tool: "log_result", args: { title: "A1C", resulted_at: "2026-08-15" } }],
        },
        inboundText: "[attachments: file-1]",
        attachmentTurn: true,
      }),
      true,
    );
  });

  it("does not auto-commit low-confidence other documents", () => {
    assert.equal(
      shouldAutoCommitDocumentParse({
        parse: {
          kind: "other",
          confidence: 0.4,
          summary: "Not sure what this is",
          writes: [],
        },
        inboundText: "[attachments: file-2]",
        attachmentTurn: true,
      }),
      false,
    );
  });
});

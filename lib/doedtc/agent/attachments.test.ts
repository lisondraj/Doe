import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  enrichTranscriptBodiesForAgent,
  formatDoeDtcFileLogLine,
  inboundHasAttachments,
  parseInboundAttachmentIds,
  replaceInboundAttachmentMarkers,
  stripEmDash,
} from "@/lib/doedtc/agent/attachments";
import type { DoeDtcFileRow } from "@/lib/doedtc/doedtc-files-db";

function file(overrides: Partial<DoeDtcFileRow> & Pick<DoeDtcFileRow, "id">): DoeDtcFileRow {
  return {
    user_id: "user-1",
    blob_url: "https://example.com/blob",
    mime: "image/jpeg",
    filename: "labs.jpg",
    bytes: 1000,
    source: "inbound",
    job_id: null,
    created_at: "2026-09-01T12:00:00.000Z",
    ...overrides,
  };
}

describe("attachments", () => {
  it("parses inbound attachment ids", () => {
    assert.deepEqual(parseInboundAttachmentIds("[attachments: abc, def]"), ["abc", "def"]);
    assert.deepEqual(parseInboundAttachmentIds("plain text"), []);
  });

  it("detects attachment turns", () => {
    assert.equal(inboundHasAttachments("[attachments: abc]"), true);
    assert.equal(inboundHasAttachments("[attachment]"), true);
    assert.equal(inboundHasAttachments("hello"), false);
  });

  it("formats file log lines without em dashes", () => {
    const line = formatDoeDtcFileLogLine(
      file({ id: "file-1", filename: "labs.jpg" }),
      Date.parse("2026-09-01T12:02:00.000Z"),
    );
    assert.match(line, /photo, labs\.jpg, 2m ago \(id: file-1\)/);
    assert.doesNotMatch(line, /\u2014/);
  });

  it("replaces attachment markers in inbound text", () => {
    const filesById = new Map([
      [
        "file-1",
        file({ id: "file-1", filename: "labs.jpg", created_at: "2026-09-01T12:00:00.000Z" }),
      ],
    ]);
    const replaced = replaceInboundAttachmentMarkers(
      "here\n[attachments: file-1]",
      filesById,
      Date.parse("2026-09-01T12:01:00.000Z"),
    );
    assert.match(replaced, /photo, labs\.jpg, 1m ago/);
  });

  it("enriches bare attachment rows in transcript", () => {
    const filesById = new Map([
      [
        "file-1",
        file({ id: "file-1", filename: "rx.png", mime: "image/png" }),
      ],
    ]);
    const enriched = enrichTranscriptBodiesForAgent(
      [{ direction: "inbound", body: "[attachment]" }],
      filesById,
      [file({ id: "file-1", filename: "rx.png", mime: "image/png" })],
      Date.parse("2026-09-01T12:01:00.000Z"),
    );
    assert.match(enriched[0]?.body ?? "", /photo, rx\.png/);
  });

  it("stripEmDash removes em dash characters", () => {
    assert.equal(stripEmDash("A1C is 7.8 % — high"), "A1C is 7.8 % - high");
  });
});

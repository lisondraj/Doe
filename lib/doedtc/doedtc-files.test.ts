import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { extractInboundMedia } from "@/lib/doedtc/doedtc-messaging";
import { bufferToVisionDataUrl, sanitizeInboundBlobFilename } from "@/lib/doedtc/doedtc-files";

describe("inbound media ingest helpers", () => {
  it("strips signed-url query strings from blob pathnames", () => {
    assert.equal(
      sanitizeInboundBlobFilename("photo.jpg?X-Amz-Signature=abc&other=1"),
      "photo.jpg",
    );
    assert.equal(sanitizeInboundBlobFilename("IMG_1234.HEIC"), "IMG_1234.HEIC");
    assert.equal(sanitizeInboundBlobFilename("../../../etc/passwd"), "passwd");
  });

  it("extracts media from webhook parts with signed urls and attachment ids", () => {
    const media = extractInboundMedia({
      data: {
        parts: [
          {
            type: "media",
            id: "f13dda7d-ecac-49eb-b3fe-16fe286abf19",
            filename: "labs.jpg",
            mime_type: "image/jpeg",
            url: "https://cdn.linqapp.com/attachments/f13dda7d/labs.jpg?signature=abc",
          },
        ],
      },
    });
    assert.equal(media.length, 1);
    assert.equal(media[0]?.attachmentId, "f13dda7d-ecac-49eb-b3fe-16fe286abf19");
    assert.match(media[0]?.url ?? "", /cdn\.linqapp\.com/);
  });

  it("extracts media when only attachment id is present", () => {
    const media = extractInboundMedia({
      data: {
        parts: [{ type: "media", attachment_id: "550e8400-e29b-41d4-a716-446655440000" }],
      },
    });
    assert.equal(media.length, 1);
    assert.equal(media[0]?.attachmentId, "550e8400-e29b-41d4-a716-446655440000");
    assert.equal(media[0]?.url, undefined);
  });

  it("builds a jpeg data url for vision fallback", () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const url = bufferToVisionDataUrl(jpeg, "image/heic");
    assert.equal(url?.startsWith("data:image/jpeg;base64,"), true);
  });
});

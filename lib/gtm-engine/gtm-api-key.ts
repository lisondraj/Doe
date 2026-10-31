import { createHash, timingSafeEqual } from "node:crypto";

/**
 * The key agents send to /GTMENGINE's API (`Authorization: Bearer <key>`), set as GTM_ENGINE_API_KEY. With no key
 * configured the API refuses everything.
 */
export function gtmApiKeyStatus(request: Request): "ok" | "missing" | "wrong" | "unconfigured" {
  const expected = process.env.GTM_ENGINE_API_KEY?.trim();
  if (!expected) return "unconfigured";
  const header = request.headers.get("authorization") ?? "";
  const given = header.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  if (!given) return "missing";
  // Hashing both sides first gives equal-length buffers, so the comparison takes the same time whatever was sent.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b) ? "ok" : "wrong";
}

/**
 * Spam and abuse limits for /api/demo. Agents are meant to be automated, so nothing here blocks bots as such: it
 * caps how fast and how much any one caller can do. Per-IP request rates are counted in memory per server instance;
 * new sessions are also counted in storage (by hashed IP, per hour) so the cap holds across instances.
 */
import { createHash } from "node:crypto";

import { DemoError } from "@/lib/demo/demo-error";

type Rule = { max: number; windowMs: number };

/** Requests per IP, per instance. Generous enough for an agent polling every few seconds. */
export const RATE: Record<"read" | "act" | "connect" | "mcp" | "clinic", Rule> = {
  read: { max: 120, windowMs: 60_000 },
  act: { max: 60, windowMs: 60_000 },
  connect: { max: 5, windowMs: 10 * 60_000 },
  mcp: { max: 120, windowMs: 60_000 },
  clinic: { max: 90, windowMs: 60_000 },
};

/** New sessions allowed per hour, per hashed IP and in total, counted in storage. */
export const CONNECT_PER_IP_HOUR = 10;
export const CONNECT_TOTAL_HOUR = 300;

const hits = new Map<string, number[]>();
let sweptAt = 0;

/** Throws 429 when `ip` has used up `rule` for `bucket`. */
export function rateLimit(bucket: keyof typeof RATE, ip: string) {
  const rule = RATE[bucket];
  const now = Date.now();
  const key = `${bucket}:${ip}`;
  const recent = (hits.get(key) ?? []).filter((t) => now - t < rule.windowMs);
  if (recent.length >= rule.max) {
    const wait = Math.ceil((rule.windowMs - (now - recent[0]!)) / 1000);
    throw new DemoError(429, `Too many requests. Try again in ${wait} s.`);
  }
  recent.push(now);
  hits.set(key, recent);
  if (now - sweptAt > 60_000) {
    sweptAt = now;
    hits.forEach((v, k) => {
      if (!v.some((t) => now - t < 10 * 60_000)) hits.delete(k);
    });
  }
}

export function clientIp(request: Request) {
  const h = request.headers;
  return (h.get("x-real-ip") ?? h.get("x-vercel-forwarded-for") ?? h.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim();
}

/** A stable, non-reversible key for an IP, so storage never holds the address itself. */
export const ipKey = (ip: string) => createHash("sha256").update(`doe-demo:${ip}`).digest("hex").slice(0, 16);

export const hourBucket = (now: Date) => now.toISOString().slice(0, 13);

const LINK = /https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|ru|xyz|top|info|biz)\b/gi;

/** Rejects messages that look like spam: link-stuffed or mostly repeated characters. */
export function checkMessage(text: string) {
  if ((text.match(LINK) ?? []).length > 2) throw new DemoError(400, "Messages can include at most 2 links.");
  if (/(.)\1{24,}/.test(text)) throw new DemoError(400, "That message looks like spam.");
}

/** The browser form's bot checks: a field people never see, and a minimum time to fill it in. */
export function checkHuman(fields: Record<string, unknown>) {
  if (typeof fields.website === "string" && fields.website.trim()) throw new DemoError(400, "Couldn't connect.");
  const elapsed = Number(fields.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed < 1500) throw new DemoError(429, "That was quick. Confirm each item with your user, then try again.");
}

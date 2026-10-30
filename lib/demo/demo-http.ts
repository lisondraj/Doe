/** Request and response helpers for the /api/demo routes. */
import { NextResponse } from "next/server";

import { DemoError } from "@/lib/demo/demo-engine";
import type { DemoChannel } from "@/lib/demo/demo-types";

const MAX_BODY = 100_000;

export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type, mcp-session-id, mcp-protocol-version, x-doe-client",
  "Cache-Control": "no-store",
};

export const preflight = () => new NextResponse(null, { status: 204, headers: CORS });

export async function respond(fn: () => Promise<unknown>) {
  try {
    return NextResponse.json(await fn(), { headers: CORS });
  } catch (error) {
    if (error instanceof DemoError) return NextResponse.json({ ok: false, error: error.message }, { status: error.status, headers: CORS });
    console.error("[demo api]", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "Something went wrong. Try again." }, { status: 500, headers: CORS });
  }
}

export async function jsonBody(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (text.length > MAX_BODY) throw new DemoError(413, "Request body is too large.");
  if (!text.trim()) return {};
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    return parsed as Record<string, unknown>;
  } catch {
    throw new DemoError(400, "Body must be a JSON object.");
  }
}

export const bearer = (request: Request) => request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() || null;

/** /demo's own page marks its calls; everything else over REST is an API agent. */
export const channelOf = (request: Request): DemoChannel => (request.headers.get("x-doe-client") === "browser" ? "browser" : "api");

export function originOf(request: Request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : new URL(request.url).origin;
}

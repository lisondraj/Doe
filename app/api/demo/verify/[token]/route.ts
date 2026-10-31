import { NextResponse } from "next/server";

import { DemoError } from "@/lib/demo/demo-engine";
import { clientIp, rateLimit } from "@/lib/demo/demo-guard";
import { originOf } from "@/lib/demo/demo-http";
import { submitVerify } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** Room for a licence photo the page has already shrunk. */
const MAX_BODY = 1_300_000;

/** The user's identity check from /demo/verify/<token>: { dob, license: { dataUrl, fileName }, webauthn? }. */
export async function POST(request: Request, { params }: { params: { token: string } }) {
  try {
    rateLimit("act", clientIp(request));
    const text = await request.text();
    if (text.length > MAX_BODY) throw new DemoError(413, "That photo is too large.");
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(text) as Record<string, unknown>;
    } catch {
      throw new DemoError(400, "Body must be JSON.");
    }
    return NextResponse.json(await submitVerify(params.token, body, originOf(request)), { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const status = error instanceof DemoError ? error.status : 500;
    if (!(error instanceof DemoError)) console.error("[demo verify]", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: error instanceof DemoError ? error.message : "Something went wrong. Try again." }, { status });
  }
}

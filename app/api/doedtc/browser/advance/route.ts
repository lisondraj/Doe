import { NextResponse } from "next/server";

import { advanceDoeDtcBrowserJob } from "@/lib/doedtc/doedtc-browser-advance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorizeCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { jobId?: string; turnId?: string };
  try {
    body = (await request.json()) as { jobId?: string; turnId?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.jobId?.trim()) {
    return NextResponse.json({ ok: false, error: "jobId is required." }, { status: 400 });
  }

  try {
    const result = await advanceDoeDtcBrowserJob({
      jobId: body.jobId.trim(),
      turnId: body.turnId?.trim(),
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Browser advance failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

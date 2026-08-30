import { NextResponse } from "next/server";

import { startDoeDtcFromLanding } from "@/lib/doedtc/doedtc-messaging";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: unknown };
    const phone = typeof body.phone === "string" ? body.phone : "";
    const result = await startDoeDtcFromLanding(phone);
    return NextResponse.json({ ok: true, phone: result.phone });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start Doe.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

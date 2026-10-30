import { NextResponse } from "next/server";

import { submitIndexConvertClaim } from "@/lib/indexconvert/submit-claim";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    await submitIndexConvertClaim(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed.";
    const status = message.includes("not configured") ? 503 : message.startsWith("Enter") ? 400 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

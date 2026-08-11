import { NextResponse } from "next/server";

import { submitCampusAmbassadorApplication } from "@/lib/join/submit-campus-ambassador-application";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await submitCampusAmbassadorApplication(payload);
    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

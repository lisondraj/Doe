import { NextResponse } from "next/server";

import { submitLaunchWaitlist } from "@/lib/landinglaunch/submit-launch-waitlist";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    await submitLaunchWaitlist(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed.";
    const status = message.includes("not configured") ? 503 : message.startsWith("Enter") ? 400 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

import { NextResponse } from "next/server";

import { submitJoinApplication } from "@/lib/join/submit-join-application";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await submitJoinApplication(formData);
    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

import { NextResponse } from "next/server";

import { JobInterestInputError, submitJobInterest } from "@/lib/jobs/submit-job-interest";

/** /jobs "Start Your Application": a multipart form with the fields and the résumé. */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    await submitJobInterest(formData);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof JobInterestInputError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    console.error("[jobs/apply] failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: null }, { status: 500 });
  }
}

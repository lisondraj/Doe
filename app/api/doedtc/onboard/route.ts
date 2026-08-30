import { NextResponse } from "next/server";

import { submitDoeDtcOnboarding } from "@/lib/doedtc/submit-doedtc-onboarding";
import type { DoeDtcOnboardPayload } from "@/lib/doedtc/doedtc-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<DoeDtcOnboardPayload>;
    const result = await submitDoeDtcOnboarding({
      token: String(body.token ?? ""),
      fullName: String(body.fullName ?? ""),
      email: String(body.email ?? ""),
      medications: Array.isArray(body.medications) ? body.medications : [],
      conditions: Array.isArray(body.conditions) ? body.conditions : [],
      whyDoe: String(body.whyDoe ?? ""),
      familyMembers: Array.isArray(body.familyMembers) ? body.familyMembers : [],
      medicalDeferred: Boolean(body.medicalDeferred),
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save onboarding.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

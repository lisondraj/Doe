import { NextResponse } from "next/server";

import { fetchInternshipApplications, summarizeInternshipApplications } from "@/lib/admin/internship-applications";

export async function GET() {
  try {
    const applications = await fetchInternshipApplications();
    return NextResponse.json({
      ok: true,
      applications,
      stats: summarizeInternshipApplications(applications),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load applications.";
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

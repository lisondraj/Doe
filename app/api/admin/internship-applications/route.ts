import { NextResponse } from "next/server";

import { fetchInternshipApplications, summarizeInternshipApplications } from "@/lib/admin/internship-applications";
import { AdminAuthError, requireAdminSession } from "@/lib/admin/require-admin-session";

export async function GET() {
  try {
    await requireAdminSession();
    const applications = await fetchInternshipApplications();
    return NextResponse.json({
      ok: true,
      applications,
      stats: summarizeInternshipApplications(applications),
    });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Could not load applications.";
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

import { NextResponse } from "next/server";

import {
  fetchCampusAmbassadorApplications,
  summarizeCampusAmbassadorApplications,
} from "@/lib/admin/campus-ambassador-applications";
import { AdminAuthError, requireAdminSession } from "@/lib/admin/require-admin-session";

export async function GET() {
  try {
    await requireAdminSession();
    const applications = await fetchCampusAmbassadorApplications();
    return NextResponse.json({
      ok: true,
      applications,
      stats: summarizeCampusAmbassadorApplications(applications),
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

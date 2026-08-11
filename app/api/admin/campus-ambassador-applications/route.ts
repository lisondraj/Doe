import { NextResponse } from "next/server";

import {
  fetchCampusAmbassadorApplications,
  summarizeCampusAmbassadorApplications,
} from "@/lib/admin/campus-ambassador-applications";

export async function GET() {
  try {
    const applications = await fetchCampusAmbassadorApplications();
    return NextResponse.json({
      ok: true,
      applications,
      stats: summarizeCampusAmbassadorApplications(applications),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load applications.";
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

import { NextResponse } from "next/server";

import { fetchInternshipApplicationEmails } from "@/lib/admin/internship-application-emails";
import { AdminAuthError, requireAdminSession } from "@/lib/admin/require-admin-session";

type RouteContext = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requireAdminSession();
    const emails = await fetchInternshipApplicationEmails(params.id);
    return NextResponse.json({ ok: true, emails });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Could not load confirmation email log.";
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

import { NextResponse } from "next/server";

import { fetchInternshipApplicationEmails } from "@/lib/admin/internship-application-emails";

type RouteContext = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const emails = await fetchInternshipApplicationEmails(params.id);
    return NextResponse.json({ ok: true, emails });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load confirmation email log.";
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

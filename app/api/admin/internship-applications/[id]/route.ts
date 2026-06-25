import { NextResponse } from "next/server";

import { enrichInternshipApplicationRow } from "@/lib/admin/internship-applications";
import { updateInternshipApplicationEmail } from "@/lib/admin/update-internship-application-email";

type RouteContext = {
  params: { id: string };
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const body = (await request.json()) as { email?: string };
    if (typeof body.email !== "string") {
      return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
    }

    const row = await updateInternshipApplicationEmail(params.id, body.email);
    const application = await enrichInternshipApplicationRow(row);
    return NextResponse.json({ ok: true, application });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update applicant email.";
    const status = message.includes("not configured")
      ? 503
      : message.includes("not found")
        ? 404
        : message.includes("valid email")
          ? 400
          : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

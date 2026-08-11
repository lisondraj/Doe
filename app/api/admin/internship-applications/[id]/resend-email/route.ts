import { NextResponse } from "next/server";

import { AdminAuthError, requireAdminSession } from "@/lib/admin/require-admin-session";
import { resendInternshipApplicationConfirmationEmail } from "@/lib/admin/resend-internship-confirmation";

type RouteContext = {
  params: { id: string };
};

export async function POST(_request: Request, { params }: RouteContext) {
  try {
    await requireAdminSession();
    const result = await resendInternshipApplicationConfirmationEmail(params.id);
    return NextResponse.json({ ok: true, emailSentAt: result.emailSentAt, log: result.log });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Could not resend confirmation email.";
    const status = message.includes("not configured") ? 503 : message.includes("not found") ? 404 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

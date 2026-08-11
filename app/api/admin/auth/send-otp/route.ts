import { NextResponse } from "next/server";

import {
  ADMIN_LOGIN_EMAIL_SENT_MESSAGE,
  isAdminAllowedEmail,
  normalizeAdminEmail,
} from "@/lib/admin/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let email = "";

  try {
    const body = (await request.json()) as { email?: string };
    email = normalizeAdminEmail(body.email ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  if (isAdminAllowedEmail(email)) {
    try {
      const origin = new URL(request.url).origin;
      const supabase = createSupabaseServerClient();
      await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${origin}/auth/callback?next=/admin`,
        },
      });
    } catch {
      // Do not reveal whether OTP delivery succeeded.
    }
  }

  return NextResponse.json({ ok: true, message: ADMIN_LOGIN_EMAIL_SENT_MESSAGE });
}

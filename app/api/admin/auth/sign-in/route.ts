import { NextResponse } from "next/server";

import {
  ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE,
  isAdminAllowedEmail,
  normalizeAdminEmail,
} from "@/lib/admin/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let email = "";
  let password = "";

  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = normalizeAdminEmail(body.email ?? "");
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!email || !email.includes("@") || !password) {
    return NextResponse.json({ ok: false, error: "Enter your email and password." }, { status: 400 });
  }

  if (!isAdminAllowedEmail(email)) {
    return NextResponse.json({ ok: false, error: ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ ok: false, error: ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
  }
}

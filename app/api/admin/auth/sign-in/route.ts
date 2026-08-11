import { NextResponse } from "next/server";

import {
  ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE,
  isAdminAllowedEmail,
  normalizeAdminEmail,
} from "@/lib/admin/admin-auth";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler";

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
  msg?: string;
};

async function signInWithPasswordDirect(email: string, password: string): Promise<TokenResponse | null> {
  const response = await fetch(`${getSupabaseUrl()}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: getSupabaseAnonKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const payload = (await response.json()) as TokenResponse;
  if (!response.ok) return payload;
  return payload;
}

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
    const response = NextResponse.json({ ok: true });
    const supabase = createSupabaseRouteHandlerClient(response);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      return response;
    }

    const tokens = await signInWithPasswordDirect(email, password);
    if (!tokens?.access_token || !tokens.refresh_token) {
      return NextResponse.json({ ok: false, error: ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    if (sessionError) {
      return NextResponse.json({ ok: false, error: ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
    }

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
  }
}

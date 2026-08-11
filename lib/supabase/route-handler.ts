import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export function createSupabaseRouteHandlerClient(response: NextResponse) {
  const cookieStore = cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

export function createRouteHandlerJsonResponse(body: Record<string, unknown>, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

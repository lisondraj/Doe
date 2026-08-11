import { NextResponse } from "next/server";

import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const supabase = createSupabaseRouteHandlerClient(response);
  await supabase.auth.signOut();
  return response;
}

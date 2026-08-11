import { isAdminAllowedEmail } from "@/lib/admin/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = "AdminAuthError";
    this.status = status;
  }
}

export async function requireAdminSession() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email || !isAdminAllowedEmail(user.email)) {
    throw new AdminAuthError("Unauthorized");
  }

  return { supabase, user };
}

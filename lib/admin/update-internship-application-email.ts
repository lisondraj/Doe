import { isJoinApplyEmailValid } from "@/lib/join/join-apply-form";
import { createSupabaseAdmin, type InternshipApplicationRow } from "@/lib/supabase/admin";

export async function updateInternshipApplicationEmail(
  applicationId: string,
  email: string,
): Promise<InternshipApplicationRow> {
  const trimmed = email.trim();
  if (!isJoinApplyEmailValid(trimmed)) {
    throw new Error("Enter a valid email address.");
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("internship_applications")
    .update({ email: trimmed })
    .eq("id", applicationId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Could not update applicant email.");
  }

  return data as InternshipApplicationRow;
}

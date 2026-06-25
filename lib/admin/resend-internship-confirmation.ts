import { sendAndLogInternshipConfirmationForRow } from "@/lib/admin/send-internship-confirmation-email";
import { createSupabaseAdmin, type InternshipApplicationEmailRow, type InternshipApplicationRow } from "@/lib/supabase/admin";

export async function resendInternshipApplicationConfirmationEmail(
  applicationId: string,
): Promise<{ emailSentAt: string; log: InternshipApplicationEmailRow }> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("internship_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Application not found.");
  }

  return sendAndLogInternshipConfirmationForRow(data as InternshipApplicationRow, "admin_resend");
}

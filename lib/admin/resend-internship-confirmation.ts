import { joinFormStateFromApplicationRow } from "@/lib/admin/internship-applications";
import { isApplicantCardEmailConfigured, sendApplicantCardEmail } from "@/lib/join/applicant-card-email";
import { createSupabaseAdmin, type InternshipApplicationRow } from "@/lib/supabase/admin";

export async function resendInternshipApplicationConfirmationEmail(
  applicationId: string,
): Promise<{ emailSentAt: string }> {
  if (!isApplicantCardEmailConfigured()) {
    throw new Error("Email service is not configured.");
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("internship_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Application not found.");
  }

  const row = data as InternshipApplicationRow;
  await sendApplicantCardEmail(joinFormStateFromApplicationRow(row));

  const emailSentAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("internship_applications")
    .update({ email_sent_at: emailSentAt })
    .eq("id", applicationId);

  if (updateError) {
    throw new Error(updateError.message || "Could not update email sent timestamp.");
  }

  return { emailSentAt };
}

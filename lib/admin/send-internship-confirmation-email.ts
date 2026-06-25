import type { InternshipConfirmationEmailTrigger } from "@/lib/admin/internship-application-emails";
import { joinFormStateFromApplicationRow } from "@/lib/admin/internship-applications";
import { isApplicantCardEmailConfigured, sendApplicantCardEmail } from "@/lib/join/applicant-card-email";
import type { JoinApplyFormState } from "@/lib/join/join-apply-form";
import { createSupabaseAdmin, type InternshipApplicationEmailRow, type InternshipApplicationRow } from "@/lib/supabase/admin";

async function insertEmailLog(entry: {
  applicationId: string;
  sentAt: string;
  recipientEmail: string;
  trigger: InternshipConfirmationEmailTrigger;
  status: "sent" | "failed";
  resendMessageId?: string | null;
  errorMessage?: string | null;
}): Promise<InternshipApplicationEmailRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("internship_application_emails")
    .insert({
      application_id: entry.applicationId,
      sent_at: entry.sentAt,
      recipient_email: entry.recipientEmail,
      trigger: entry.trigger,
      status: entry.status,
      resend_message_id: entry.resendMessageId ?? null,
      error_message: entry.errorMessage ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Could not record confirmation email log.");
  }

  return data as InternshipApplicationEmailRow;
}

export async function sendAndLogInternshipConfirmationEmail({
  applicationId,
  formState,
  trigger,
}: {
  applicationId: string;
  formState: JoinApplyFormState;
  trigger: InternshipConfirmationEmailTrigger;
}): Promise<{ emailSentAt: string; log: InternshipApplicationEmailRow }> {
  if (!isApplicantCardEmailConfigured()) {
    throw new Error("Email service is not configured.");
  }

  const supabase = createSupabaseAdmin();
  const recipientEmail = formState.email.trim();
  const sentAt = new Date().toISOString();

  try {
    const { messageId } = await sendApplicantCardEmail(formState);
    const log = await insertEmailLog({
      applicationId,
      sentAt,
      recipientEmail,
      trigger,
      status: "sent",
      resendMessageId: messageId,
    });

    const { error: updateError } = await supabase
      .from("internship_applications")
      .update({ email_sent_at: sentAt })
      .eq("id", applicationId);

    if (updateError) {
      throw new Error(updateError.message || "Could not update email sent timestamp.");
    }

    return { emailSentAt: sentAt, log };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send confirmation email.";
    try {
      await insertEmailLog({
        applicationId,
        sentAt,
        recipientEmail,
        trigger,
        status: "failed",
        errorMessage: message,
      });
    } catch (logError) {
      console.error("[admin/email] could not record failed send:", logError);
    }
    throw new Error(message);
  }
}

export async function sendAndLogInternshipConfirmationForRow(
  row: InternshipApplicationRow,
  trigger: InternshipConfirmationEmailTrigger,
): Promise<{ emailSentAt: string; log: InternshipApplicationEmailRow }> {
  return sendAndLogInternshipConfirmationEmail({
    applicationId: row.id,
    formState: joinFormStateFromApplicationRow(row),
    trigger,
  });
}

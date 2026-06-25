import { formatAdminDate } from "@/lib/admin/internship-applications";
import { createSupabaseAdmin, type InternshipApplicationEmailRow } from "@/lib/supabase/admin";

export type InternshipConfirmationEmailTrigger = InternshipApplicationEmailRow["trigger"];

export type InternshipConfirmationEmailLog = InternshipApplicationEmailRow;

export function formatConfirmationEmailTrigger(trigger: InternshipConfirmationEmailTrigger): string {
  switch (trigger) {
    case "initial":
      return "Initial signup";
    case "admin_resend":
      return "Admin resend";
    default:
      return trigger;
  }
}

export function formatConfirmationEmailStatus(status: InternshipConfirmationEmailLog["status"]): string {
  return status === "sent" ? "Sent" : "Failed";
}

export async function fetchInternshipApplicationEmails(
  applicationId: string,
): Promise<InternshipConfirmationEmailLog[]> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from("internship_application_emails")
    .select("*")
    .eq("application_id", applicationId)
    .order("sent_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Could not load confirmation email log.");
  }

  return (data ?? []) as InternshipConfirmationEmailLog[];
}

export function summarizeConfirmationEmailLog(log: InternshipConfirmationEmailLog[]): {
  total: number;
  sent: number;
  lastSentAt: string | null;
} {
  const sentEntries = log.filter((entry) => entry.status === "sent");
  return {
    total: log.length,
    sent: sentEntries.length,
    lastSentAt: sentEntries[0]?.sent_at ?? null,
  };
}

export function formatConfirmationEmailLogLine(entry: InternshipConfirmationEmailLog): string {
  const when = formatAdminDate(entry.sent_at);
  const trigger = formatConfirmationEmailTrigger(entry.trigger);
  const status = formatConfirmationEmailStatus(entry.status);
  return `${when} · ${entry.recipient_email} · ${trigger} · ${status}`;
}

import {
  JOIN_APPLY_COUNTRY_LABELS,
  JOIN_APPLY_EDUCATION_LABELS,
  type JoinApplyFormState,
} from "@/lib/join/join-apply-form";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function fieldRow(label: string, value: string | null | undefined): string {
  if (!value?.trim()) return "";
  return `
    <tr>
      <td style="padding:0 0 14px;color:#9A8F82;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;vertical-align:top;width:38%;">${escapeHtml(label)}</td>
      <td style="padding:0 0 14px;color:#1E343A;font-size:16px;font-weight:500;line-height:1.35;vertical-align:top;">${escapeHtml(value.trim())}</td>
    </tr>`;
}

export function buildApplicantCardEmailHtml(data: JoinApplyFormState): string {
  const country = JOIN_APPLY_COUNTRY_LABELS[data.country];
  const education =
    data.education && data.education in JOIN_APPLY_EDUCATION_LABELS
      ? JOIN_APPLY_EDUCATION_LABELS[data.education as keyof typeof JOIN_APPLY_EDUCATION_LABELS]
      : "";
  const linkedin = data.linkedinUsername.trim()
    ? `linkedin.com/in/${data.linkedinUsername.trim()}`
    : "";
  const areas = data.areas.join(", ");

  const rows = [
    fieldRow("Name", data.name),
    fieldRow("Email", data.email),
    fieldRow("Country", country),
    fieldRow("Education", education),
    fieldRow("School", data.schoolName),
    fieldRow("Program", data.programOfStudy),
    fieldRow("Areas", areas),
    fieldRow(
      "Resume",
      data.resumeFileName
        ? data.resumeFileType
          ? `${data.resumeFileName} (${data.resumeFileType})`
          : data.resumeFileName
        : null,
    ),
    fieldRow("LinkedIn", linkedin),
    fieldRow("Notes", data.additionalNotes),
  ]
    .filter(Boolean)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#F7F6F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1E343A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F7F6F3;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#F0EBE3;border:1px solid #E6E6E6;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 8px;font-size:34px;line-height:1.1;font-weight:400;color:#1E343A;">Doe</td>
            </tr>
            <tr>
              <td style="padding:8px 28px 24px;font-size:18px;line-height:1.45;color:#1E343A;">Your applicant card</td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
              </td>
            </tr>
          </table>
          <p style="max-width:560px;margin:18px 0 0;font-size:14px;line-height:1.5;color:#1E343A99;text-align:center;">
            Thank you for applying to Doe. We received your submission and will be in touch.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function isApplicantCardEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim());
}

export async function sendApplicantCardEmail(data: JoinApplyFormState): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    throw new Error("Email service is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [data.email.trim()],
      subject: "Your Doe applicant card",
      html: buildApplicantCardEmailHtml(data),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "Failed to send confirmation email.");
  }
}

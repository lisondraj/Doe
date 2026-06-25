import {
  JOIN_APPLY_COUNTRY_LABELS,
  JOIN_APPLY_EDUCATION_LABELS,
  type JoinApplyFormState,
} from "@/lib/join/join-apply-form";
import {
  APPLICANT_CARD_EMAIL_FONTS,
  APPLICANT_CARD_FROM_EMAIL,
  buildApplicantCardEmailLineArt,
} from "@/lib/join/applicant-card-email-art";
import { getResendClient } from "@/lib/resend/client";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

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
  const { inter } = APPLICANT_CARD_EMAIL_FONTS;
  return `
    <tr>
      <td style="padding:0 0 12px;color:#9A8F82;font-family:${inter};font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;vertical-align:top;width:38%;">${escapeHtml(label)}</td>
      <td style="padding:0 0 12px;color:#1E343A;font-family:${inter};font-size:15px;font-weight:500;line-height:1.4;vertical-align:top;">${escapeHtml(value.trim())}</td>
    </tr>`;
}

export function getApplicantCardFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || APPLICANT_CARD_FROM_EMAIL;
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
  const { lora, inter } = APPLICANT_CARD_EMAIL_FONTS;
  const lineArt = buildApplicantCardEmailLineArt();

  const rows = [
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
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:wght@400;500&display=swap');
    </style>
  </head>
  <body style="margin:0;padding:0;background:${JOIN_FORM_BEIGE.page};color:#1E343A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${JOIN_FORM_BEIGE.page};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${JOIN_FORM_BEIGE.field};border:1px solid ${JOIN_FORM_BEIGE.border};border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:0;margin:0;line-height:0;font-size:0;">
                ${lineArt}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 8px;">
                <p style="margin:0;font-family:${lora};font-size:34px;line-height:1.08;font-weight:400;letter-spacing:-0.03em;color:#1E343A;">
                  ${escapeHtml(data.name.trim() || "Your name")}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 28px 8px;">
                <p style="margin:0;font-family:${inter};font-size:13px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#9A8F82;">
                  Your applicant card
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
              </td>
            </tr>
          </table>
          <p style="max-width:560px;margin:18px 0 0;font-family:${inter};font-size:14px;line-height:1.5;color:rgba(30,52,58,0.62);text-align:center;">
            Thank you for applying to Doe. We received your submission and will be in touch.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function isApplicantCardEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendApplicantCardEmail(data: JoinApplyFormState): Promise<void> {
  if (!process.env.RESEND_API_KEY?.trim()) {
    throw new Error("Email service is not configured.");
  }

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getApplicantCardFromEmail(),
    to: data.email.trim(),
    subject: "Your Doe applicant card",
    html: buildApplicantCardEmailHtml(data),
  });

  if (error) {
    throw new Error(error.message || "Failed to send confirmation email.");
  }
}

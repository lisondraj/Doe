import {
  JOBS_COUNTRIES,
  type JobsCountry,
  JOBS_RESUME_MAX_BYTES,
  JOBS_ROLE_OPTIONS,
  JOBS_START_OPTIONS,
} from "@/lib/jobs/jobs-copy";
import { JOBS_TERMS } from "@/lib/jobs/jobs-roles";
import { getResendClient } from "@/lib/resend/client";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const RESUME_BUCKET = "job-interest-resumes";
const NOTIFY_TO_EMAIL = "james@doe.care";
const DEFAULT_FROM_EMAIL = "James <james@doe.care>";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RESUME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** A message the form can show as it is. Anything else is reported as a general failure. */
export class JobInterestInputError extends Error {}

type JobInterest = {
  fullName: string;
  email: string;
  phone: string | null;
  location: string;
  roleSlug: string;
  roleTitle: string;
  /** Availability, or for a co-op the 2027 terms chosen. */
  startTiming: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  note: string;
  sourcePath: string | null;
};

function text(formData: FormData, name: string, max: number): string {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, max);
}

/** An optional link: blank is null, a bare domain gets https://, anything that isn't a web address is refused. */
function link(formData: FormData, name: string, label: string): string | null {
  const raw = text(formData, name, 500);
  if (!raw) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (!url.hostname.includes(".")) throw new Error();
    return url.toString();
  } catch {
    throw new JobInterestInputError(`Enter a valid ${label} link.`);
  }
}

function parse(formData: FormData): JobInterest {
  const fullName = text(formData, "fullName", 200);
  const email = text(formData, "email", 320).toLowerCase();
  const country = text(formData, "country", 40);
  const region = text(formData, "region", 60);
  const city = text(formData, "city", 120);
  const postalCode = text(formData, "postalCode", 12);
  const roleSlug = text(formData, "role", 120);
  const availability = text(formData, "startTiming", 80);
  const terms = formData
    .getAll("terms")
    .map(String)
    .filter((term) => (JOBS_TERMS as readonly string[]).includes(term));
  const note = text(formData, "note", 4000);
  const role = JOBS_ROLE_OPTIONS.find((option) => option.slug === roleSlug);

  if (!fullName) throw new JobInterestInputError("Enter your name.");
  if (!EMAIL_PATTERN.test(email)) throw new JobInterestInputError("Enter a valid email.");
  if (!(country in JOBS_COUNTRIES)) throw new JobInterestInputError("Select your country.");
  const address = JOBS_COUNTRIES[country as JobsCountry];
  if (!(address.regions as readonly string[]).includes(region)) {
    throw new JobInterestInputError(`Select your ${address.regionLabel.toLowerCase()}.`);
  }
  if (!city) throw new JobInterestInputError("Enter your city.");
  if (!role) throw new JobInterestInputError("Select a position of interest.");
  if (role.student && terms.length === 0) throw new JobInterestInputError("Select at least one term.");
  if (!role.student && !(JOBS_START_OPTIONS as readonly string[]).includes(availability)) {
    throw new JobInterestInputError("Select your availability.");
  }
  const startTiming = role.student ? JOBS_TERMS.filter((term) => terms.includes(term)).join(" and ") : availability;
  if (!note) throw new JobInterestInputError("Add a cover note.");
  if (formData.get("consent") !== "yes") throw new JobInterestInputError("Confirm the statement above the button.");
  const location = [city, region, country].join(", ") + (postalCode ? ` ${postalCode.toUpperCase()}` : "");

  return {
    fullName,
    email,
    phone: text(formData, "phone", 60) || null,
    location,
    roleSlug: role.slug,
    roleTitle: role.title,
    startTiming,
    linkedinUrl: link(formData, "linkedinUrl", "LinkedIn"),
    githubUrl: link(formData, "githubUrl", "GitHub"),
    portfolioUrl: link(formData, "portfolioUrl", "portfolio or website"),
    note,
    sourcePath: text(formData, "sourcePath", 200) || null,
  };
}

function resumeFile(formData: FormData): { file: File; contentType: string } {
  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) throw new JobInterestInputError("Upload your resume.");
  if (file.size > JOBS_RESUME_MAX_BYTES) throw new JobInterestInputError("Your resume must be 4 MB or smaller.");
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const contentType = RESUME_TYPES[ext];
  if (!contentType) throw new JobInterestInputError("Your resume must be a PDF or Word document.");
  return { file, contentType };
}

function safeFileName(name: string) {
  return name.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 180) || "resume";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Emails James the application, every field and the résumé attached. Never throws: the application is already saved. */
async function notify(application: JobInterest, resume: { name: string; content: Buffer }): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY?.trim()) {
      console.warn("[jobs/apply] RESEND_API_KEY is not configured; skipping the notification.");
      return false;
    }
    const rows: [string, string | null][] = [
      ["Name", application.fullName],
      ["Email", application.email],
      ["Phone", application.phone],
      ["Location", application.location],
      ["Position", application.roleTitle],
      [JOBS_ROLE_OPTIONS.find((option) => option.slug === application.roleSlug)?.student ? "Terms" : "Availability", application.startTiming],
      ["LinkedIn", application.linkedinUrl],
      ["GitHub", application.githubUrl],
      ["Portfolio / website", application.portfolioUrl],
      ["Sent from", application.sourcePath],
    ];
    const filled = rows.filter((row): row is [string, string] => !!row[1]);
    const when = new Date().toLocaleString("en-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" });
    const cell = "font-family:Arial,sans-serif;font-size:14px;color:#1E343A;padding:6px 14px 6px 0;vertical-align:top;";
    const html = [
      `<p style="font-family:Arial,sans-serif;font-size:16px;color:#1E343A;"><strong>${escapeHtml(application.fullName)}</strong> sent an indication of interest for <strong>${escapeHtml(application.roleTitle)}</strong>.</p>`,
      `<table style="border-collapse:collapse;">${filled
        .map(([label, value]) => {
          const shown = /^https?:\/\//.test(value)
            ? `<a href="${escapeHtml(value)}">${escapeHtml(value)}</a>`
            : escapeHtml(value);
          return `<tr><td style="${cell}color:#9A8F82;">${escapeHtml(label)}</td><td style="${cell}">${shown}</td></tr>`;
        })
        .join("")}</table>`,
      `<p style="font-family:Arial,sans-serif;font-size:13px;color:#9A8F82;margin-top:18px;">Cover note</p>`,
      `<p style="font-family:Arial,sans-serif;font-size:14px;color:#1E343A;white-space:pre-wrap;">${escapeHtml(application.note)}</p>`,
      `<p style="font-family:Arial,sans-serif;font-size:13px;color:#9A8F82;">Resume attached. ${escapeHtml(when)} (Toronto)</p>`,
    ].join("");
    const plain = [
      `${application.fullName} sent an indication of interest for ${application.roleTitle}.`,
      "",
      ...filled.map(([label, value]) => `${label}: ${value}`),
      "",
      "Cover note:",
      application.note,
      "",
      `Resume attached. ${when} (Toronto)`,
    ].join("\n");
    const { error } = await getResendClient().emails.send({
      from: process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL,
      to: NOTIFY_TO_EMAIL,
      replyTo: application.email,
      subject: `Indication of interest: ${application.fullName} — ${application.roleTitle}`,
      html,
      text: plain,
      attachments: [{ filename: resume.name, content: resume.content }],
    });
    if (error) {
      console.error("[jobs/apply] notification failed:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[jobs/apply] notification failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Saves a /jobs indication of interest: the row first, then the résumé in the private bucket (the row is removed if
 * that fails, so nothing is left half saved), then emails James with every field and the résumé attached.
 */
export async function submitJobInterest(formData: FormData): Promise<{ id: string }> {
  // A field people can't see: anything in it is a bot. It is told it worked, and nothing is saved.
  if (text(formData, "website", 200)) return { id: "ok" };

  const application = parse(formData);
  const { file, contentType } = resumeFile(formData);
  const supabase = createSupabaseAdmin();

  const { data: inserted, error: insertError } = await supabase
    .from("job_interest_applications")
    .insert({
      full_name: application.fullName,
      email: application.email,
      phone: application.phone,
      location: application.location,
      role_slug: application.roleSlug,
      role_title: application.roleTitle,
      start_timing: application.startTiming,
      linkedin_url: application.linkedinUrl,
      github_url: application.githubUrl,
      portfolio_url: application.portfolioUrl,
      note: application.note,
      resume_file_name: file.name.slice(0, 200),
      source_path: application.sourcePath,
    })
    .select("id")
    .single();
  if (insertError || !inserted) throw new Error(insertError?.message || "Could not save the application.");

  const id = inserted.id as string;
  const fileName = safeFileName(file.name);
  const path = `${id}/${fileName}`;
  const content = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(path, content, { contentType, upsert: false });
  if (uploadError) {
    await supabase.from("job_interest_applications").delete().eq("id", id);
    throw new Error(uploadError.message || "Could not upload the resume.");
  }

  const emailed = await notify(application, { name: fileName, content });
  await supabase
    .from("job_interest_applications")
    .update({ resume_storage_path: path, ...(emailed ? { email_sent_at: new Date().toISOString() } : {}) })
    .eq("id", id);

  return { id };
}

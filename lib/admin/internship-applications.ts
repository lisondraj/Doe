import {
  JOIN_APPLY_COUNTRY_LABELS,
  JOIN_APPLY_EDUCATION_LABELS,
  type JoinApplyCountry,
  type JoinApplyEducation,
} from "@/lib/join/join-apply-form";
import { createSupabaseAdmin, RESUME_BUCKET, type InternshipApplicationRow } from "@/lib/supabase/admin";

export type AdminInternshipApplication = InternshipApplicationRow & {
  resume_download_url: string | null;
};

export type InternshipSignupStats = {
  total: number;
  withResume: number;
  withLinkedIn: number;
  withNotes: number;
};

const RESUME_URL_TTL_SECONDS = 60 * 60;

export function formatAdminDate(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatCountry(country: JoinApplyCountry): string {
  return JOIN_APPLY_COUNTRY_LABELS[country];
}

export function formatEducation(education: JoinApplyEducation): string {
  return JOIN_APPLY_EDUCATION_LABELS[education];
}

export function summarizeInternshipApplications(
  applications: AdminInternshipApplication[],
): InternshipSignupStats {
  return {
    total: applications.length,
    withResume: applications.filter((row) => row.resume_storage_path).length,
    withLinkedIn: applications.filter((row) => row.linkedin_username?.trim()).length,
    withNotes: applications.filter((row) => row.additional_notes?.trim()).length,
  };
}

export async function fetchInternshipApplications(): Promise<AdminInternshipApplication[]> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from("internship_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message || "Could not load internship applications.");

  const rows = (data ?? []) as InternshipApplicationRow[];

  return Promise.all(
    rows.map(async (row) => {
      if (!row.resume_storage_path) {
        return { ...row, resume_download_url: null };
      }

      const { data: signed, error: signedError } = await supabase.storage
        .from(RESUME_BUCKET)
        .createSignedUrl(row.resume_storage_path, RESUME_URL_TTL_SECONDS);

      if (signedError) {
        return { ...row, resume_download_url: null };
      }

      return { ...row, resume_download_url: signed?.signedUrl ?? null };
    }),
  );
}

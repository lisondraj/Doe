import { isApplicantCardEmailConfigured, sendApplicantCardEmail } from "@/lib/join/applicant-card-email";
import {
  JOIN_APPLY_AREAS,
  isJoinApplySubmissionValid,
  type JoinApplyArea,
  type JoinApplyFormState,
} from "@/lib/join/join-apply-form";
import { getResumeContentType, getResumeFileTypeLabel, isAllowedResumeFile } from "@/lib/join/resume-file";
import { createSupabaseAdmin, RESUME_BUCKET } from "@/lib/supabase/admin";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 180);
}

function parseAreas(raw: string): JoinApplyArea[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) throw new Error("Invalid areas.");
  const allowed = new Set<string>(JOIN_APPLY_AREAS);
  const areas = parsed.filter((item): item is JoinApplyArea => typeof item === "string" && allowed.has(item));
  if (areas.length === 0) throw new Error("Select at least one area.");
  return areas;
}

export function joinApplyFormStateFromFormData(formData: FormData): JoinApplyFormState {
  const country = formData.get("country");
  const education = formData.get("education");
  const areasRaw = formData.get("areas");

  if (typeof country !== "string" || (country !== "canada" && country !== "us")) {
    throw new Error("Invalid country.");
  }
  if (
    typeof education !== "string" ||
    (education !== "highschool" && education !== "university" && education !== "graduated")
  ) {
    throw new Error("Invalid education.");
  }
  if (typeof areasRaw !== "string") throw new Error("Invalid areas.");

  const resumeFile = formData.get("resume");
  const resumeFileName =
    resumeFile instanceof File && resumeFile.size > 0 ? resumeFile.name : null;
  const resumeFileType =
    resumeFile instanceof File && resumeFile.size > 0 ? getResumeFileTypeLabel(resumeFile) : null;

  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    country,
    education,
    schoolName: String(formData.get("schoolName") ?? "").trim(),
    programOfStudy: String(formData.get("programOfStudy") ?? "").trim(),
    areas: parseAreas(areasRaw),
    resumeFileName,
    resumeFileType,
    linkedinUsername: String(formData.get("linkedinUsername") ?? "").trim(),
    additionalNotes: String(formData.get("additionalNotes") ?? "").trim(),
  };
}

function getResumeFile(formData: FormData): File | null {
  const resume = formData.get("resume");
  if (!(resume instanceof File) || resume.size === 0) return null;
  if (resume.size > MAX_RESUME_BYTES) throw new Error("Resume must be 10 MB or smaller.");
  if (!isAllowedResumeFile(resume)) {
    throw new Error("Resume must be a PDF, Word document, or photo.");
  }
  return resume;
}

export async function submitJoinApplication(formData: FormData): Promise<{ id: string; emailSent: boolean }> {
  const data = joinApplyFormStateFromFormData(formData);
  if (!isJoinApplySubmissionValid(data)) {
    throw new Error("Please complete all required fields before submitting.");
  }

  const resumeFile = getResumeFile(formData);
  const supabase = createSupabaseAdmin();

  const { data: inserted, error: insertError } = await supabase
    .from("internship_applications")
    .insert({
      name: data.name,
      email: data.email,
      country: data.country,
      education: data.education,
      school_name: data.schoolName,
      program_of_study: data.programOfStudy,
      areas: data.areas,
      resume_file_name: data.resumeFileName,
      resume_file_type: data.resumeFileType,
      linkedin_username: data.linkedinUsername || null,
      additional_notes: data.additionalNotes || null,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message || "Could not save application.");
  }

  const applicationId = inserted.id as string;
  let resumeStoragePath: string | null = null;

  if (resumeFile) {
    const storagePath = `${applicationId}/${sanitizeFileName(resumeFile.name)}`;
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: getResumeContentType(resumeFile),
        upsert: false,
      });

    if (uploadError) {
      await supabase.from("internship_applications").delete().eq("id", applicationId);
      throw new Error(uploadError.message || "Could not upload resume.");
    }

    resumeStoragePath = storagePath;
    const { error: updateError } = await supabase
      .from("internship_applications")
      .update({ resume_storage_path: storagePath })
      .eq("id", applicationId);

    if (updateError) {
      await supabase.storage.from(RESUME_BUCKET).remove([storagePath]);
      await supabase.from("internship_applications").delete().eq("id", applicationId);
      throw new Error(updateError.message || "Could not finalize resume upload.");
    }
  }

  let emailSent = false;

  if (isApplicantCardEmailConfigured()) {
    try {
      await sendApplicantCardEmail(data);
      emailSent = true;
    } catch (error) {
      console.error("[join/apply] confirmation email failed:", error);
    }
  } else {
    console.warn("[join/apply] RESEND_API_KEY or RESEND_FROM_EMAIL is not configured; skipping confirmation email.");
  }

  if (emailSent) {
    const { error: emailSentError } = await supabase
      .from("internship_applications")
      .update({ email_sent_at: new Date().toISOString() })
      .eq("id", applicationId);

    if (emailSentError) {
      console.error("[join/apply] could not record email_sent_at:", emailSentError);
    }
  }

  return { id: applicationId, emailSent };
}

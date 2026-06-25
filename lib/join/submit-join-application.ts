import { sendApplicantCardEmail } from "@/lib/join/applicant-card-email";
import {
  JOIN_APPLY_AREAS,
  isJoinApplySubmissionValid,
  type JoinApplyArea,
  type JoinApplyFormState,
} from "@/lib/join/join-apply-form";
import { createSupabaseAdmin, RESUME_BUCKET } from "@/lib/supabase/admin";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

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

  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    country,
    education,
    schoolName: String(formData.get("schoolName") ?? "").trim(),
    programOfStudy: String(formData.get("programOfStudy") ?? "").trim(),
    areas: parseAreas(areasRaw),
    resumeFileName,
    linkedinUsername: String(formData.get("linkedinUsername") ?? "").trim(),
    additionalNotes: String(formData.get("additionalNotes") ?? "").trim(),
  };
}

function getResumeFile(formData: FormData): File | null {
  const resume = formData.get("resume");
  if (!(resume instanceof File) || resume.size === 0) return null;
  if (resume.size > MAX_RESUME_BYTES) throw new Error("Resume must be 10 MB or smaller.");
  if (!ALLOWED_RESUME_TYPES.has(resume.type)) {
    throw new Error("Resume must be a PDF or Word document.");
  }
  return resume;
}

export async function submitJoinApplication(formData: FormData): Promise<{ id: string }> {
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
        contentType: resumeFile.type,
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

  try {
    await sendApplicantCardEmail(data);
  } catch (error) {
    if (resumeStoragePath) {
      await supabase.storage.from(RESUME_BUCKET).remove([resumeStoragePath]);
    }
    await supabase.from("internship_applications").delete().eq("id", applicationId);
    throw error instanceof Error ? error : new Error("Could not send confirmation email.");
  }

  const { error: emailSentError } = await supabase
    .from("internship_applications")
    .update({ email_sent_at: new Date().toISOString() })
    .eq("id", applicationId);

  if (emailSentError) {
    throw new Error(emailSentError.message || "Could not finalize submission.");
  }

  return { id: applicationId };
}

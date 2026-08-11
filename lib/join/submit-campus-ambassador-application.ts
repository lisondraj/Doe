import {
  CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OPTIONS,
  CAMPUS_AMBASSADOR_SCHOOL_LEVEL_OPTIONS,
  CAMPUS_AMBASSADOR_STATEMENT_OPTIONS,
  CAMPUS_AMBASSADOR_YEAR_OF_STUDY_OPTIONS,
  formatCampusAmbassadorLinkedInUrl,
  isCampusAmbassadorFormValid,
  type CampusAmbassadorFormState,
  type CampusAmbassadorHealthProgramId,
  type CampusAmbassadorStatementId,
} from "@/lib/join/campus-ambassador-form";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const HEALTH_PROGRAM_IDS = new Set<string>(
  CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OPTIONS.map((option) => option.id),
);
const STATEMENT_IDS = new Set<string>(CAMPUS_AMBASSADOR_STATEMENT_OPTIONS.map((option) => option.id));
const SCHOOL_LEVELS = new Set<string>(CAMPUS_AMBASSADOR_SCHOOL_LEVEL_OPTIONS.map((option) => option.value));
const YEAR_OF_STUDY = new Set<string>(CAMPUS_AMBASSADOR_YEAR_OF_STUDY_OPTIONS.map((option) => option.value));

function parseStringArray(raw: unknown, allowed: Set<string>, fieldLabel: string): string[] {
  if (!Array.isArray(raw)) throw new Error(`Invalid ${fieldLabel}.`);
  const values = raw.filter((item): item is string => typeof item === "string" && allowed.has(item));
  if (values.length === 0) throw new Error(`Select at least one ${fieldLabel}.`);
  return values;
}

export function campusAmbassadorFormStateFromPayload(payload: unknown): CampusAmbassadorFormState {
  if (!payload || typeof payload !== "object") throw new Error("Invalid submission payload.");

  const body = payload as Record<string, unknown>;
  const country = body.country;
  const schoolLevel = body.schoolLevel;
  const yearOfStudy = body.yearOfStudy;

  if (country !== "us" && country !== "canada") throw new Error("Invalid country.");
  if (typeof schoolLevel !== "string" || !SCHOOL_LEVELS.has(schoolLevel)) {
    throw new Error("Invalid school level.");
  }

  let parsedYearOfStudy: CampusAmbassadorFormState["yearOfStudy"] = "";
  if (schoolLevel !== "graduated") {
    if (typeof yearOfStudy !== "string" || !YEAR_OF_STUDY.has(yearOfStudy)) {
      throw new Error("Invalid year of study.");
    }
    parsedYearOfStudy = yearOfStudy as CampusAmbassadorFormState["yearOfStudy"];
  }

  return {
    fullName: String(body.fullName ?? "").trim(),
    email: String(body.email ?? "").trim(),
    country,
    stateOrProvince: String(body.stateOrProvince ?? "").trim(),
    schoolLevel: schoolLevel as CampusAmbassadorFormState["schoolLevel"],
    schoolLevelOther: String(body.schoolLevelOther ?? "").trim(),
    yearOfStudy: parsedYearOfStudy,
    yearOfStudyOther: String(body.yearOfStudyOther ?? "").trim(),
    fieldOfStudy: String(body.fieldOfStudy ?? "").trim(),
    healthPrograms: parseStringArray(
      body.healthPrograms,
      HEALTH_PROGRAM_IDS,
      "health program",
    ) as CampusAmbassadorHealthProgramId[],
    healthProgramOther: String(body.healthProgramOther ?? "").trim(),
    statements: Array.isArray(body.statements)
      ? body.statements.filter(
          (item): item is CampusAmbassadorStatementId =>
            typeof item === "string" && STATEMENT_IDS.has(item),
        )
      : [],
    linkedin: String(body.linkedin ?? "").trim(),
  };
}

export async function submitCampusAmbassadorApplication(
  payload: unknown,
): Promise<{ id: string }> {
  const data = campusAmbassadorFormStateFromPayload(payload);
  if (!isCampusAmbassadorFormValid(data)) {
    throw new Error("Please complete all required fields before submitting.");
  }

  const supabase = createSupabaseAdmin();
  const linkedinUrl = formatCampusAmbassadorLinkedInUrl(data.linkedin);

  const { data: inserted, error: insertError } = await supabase
    .from("campus_ambassador_applications")
    .insert({
      full_name: data.fullName,
      email: data.email,
      country: data.country,
      state_or_province: data.stateOrProvince,
      school_level: data.schoolLevel,
      school_level_other: data.schoolLevel === "other" ? data.schoolLevelOther || null : null,
      year_of_study: data.schoolLevel === "graduated" ? null : data.yearOfStudy || null,
      year_of_study_other:
        data.schoolLevel !== "graduated" && data.yearOfStudy === "other"
          ? data.yearOfStudyOther || null
          : null,
      field_of_study: data.fieldOfStudy,
      health_programs: data.healthPrograms,
      health_program_other: data.healthPrograms.includes("other")
        ? data.healthProgramOther || null
        : null,
      statements: data.statements,
      linkedin_url: linkedinUrl,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message || "Could not save application.");
  }

  return { id: inserted.id as string };
}

import { randomUUID } from "crypto";

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

const MAX_FIELD_LENGTH = 500;
const MAX_EMAIL_LENGTH = 320;
const MAX_ARRAY_LENGTH = 32;

function trimToMax(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function parseStringArray(raw: unknown, allowed: Set<string>, fieldLabel: string, maxItems: number): string[] {
  if (!Array.isArray(raw)) throw new Error(`Invalid ${fieldLabel}.`);
  const values = raw
    .slice(0, maxItems)
    .filter((item): item is string => typeof item === "string" && allowed.has(item));
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
    fullName: trimToMax(String(body.fullName ?? ""), MAX_FIELD_LENGTH),
    email: trimToMax(String(body.email ?? ""), MAX_EMAIL_LENGTH),
    country,
    stateOrProvince: trimToMax(String(body.stateOrProvince ?? ""), MAX_FIELD_LENGTH),
    schoolLevel: schoolLevel as CampusAmbassadorFormState["schoolLevel"],
    schoolLevelOther: trimToMax(String(body.schoolLevelOther ?? ""), MAX_FIELD_LENGTH),
    yearOfStudy: parsedYearOfStudy,
    yearOfStudyOther: trimToMax(String(body.yearOfStudyOther ?? ""), MAX_FIELD_LENGTH),
    fieldOfStudy: trimToMax(String(body.fieldOfStudy ?? ""), MAX_FIELD_LENGTH),
    healthPrograms: parseStringArray(
      body.healthPrograms,
      HEALTH_PROGRAM_IDS,
      "health program",
      MAX_ARRAY_LENGTH,
    ) as CampusAmbassadorHealthProgramId[],
    healthProgramOther: trimToMax(String(body.healthProgramOther ?? ""), MAX_FIELD_LENGTH),
    statements: Array.isArray(body.statements)
      ? body.statements
          .slice(0, MAX_ARRAY_LENGTH)
          .filter(
            (item): item is CampusAmbassadorStatementId =>
              typeof item === "string" && STATEMENT_IDS.has(item),
          )
      : [],
    linkedin: trimToMax(String(body.linkedin ?? ""), MAX_FIELD_LENGTH),
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
  const applicationId = randomUUID();

  const { error: insertError } = await supabase.from("campus_ambassador_applications").insert({
    id: applicationId,
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
  });

  if (insertError) {
    throw new Error(insertError.message || "Could not save application.");
  }

  return { id: applicationId };
}

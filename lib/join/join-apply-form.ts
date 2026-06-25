export const JOIN_APPLY_AREAS = [
  "Engineering",
  "Product",
  "Operations",
  "Marketing",
  "Sales",
  "Market Research",
] as const;

export type JoinApplyArea = (typeof JOIN_APPLY_AREAS)[number];

export type JoinApplyCountry = "canada" | "us";

export type JoinApplyEducation = "highschool" | "university" | "graduated";

export type JoinApplyEducationValue = JoinApplyEducation | "";

export type JoinApplyFormState = {
  name: string;
  email: string;
  country: JoinApplyCountry;
  education: JoinApplyEducationValue;
  schoolName: string;
  programOfStudy: string;
  areas: JoinApplyArea[];
  resumeFileName: string | null;
  resumeFileType: string | null;
  linkedinUsername: string;
  additionalNotes: string;
};

export const JOIN_APPLY_INITIAL_STATE: JoinApplyFormState = {
  name: "",
  email: "",
  country: "canada",
  education: "",
  schoolName: "",
  programOfStudy: "",
  areas: [],
  resumeFileName: null,
  resumeFileType: null,
  linkedinUsername: "",
  additionalNotes: "",
};

export const JOIN_APPLY_COUNTRY_LABELS: Record<JoinApplyCountry, string> = {
  canada: "Canada",
  us: "United States",
};

export const JOIN_APPLY_EDUCATION_LABELS: Record<JoinApplyEducation, string> = {
  highschool: "Highschool",
  university: "University/College",
  graduated: "Graduated",
};

export const JOIN_APPLY_STEP_COUNT = 9;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isJoinApplyStepValid(step: number, data: JoinApplyFormState): boolean {
  switch (step) {
    case 0:
      return data.name.trim().length > 0;
    case 1:
      return EMAIL_RE.test(data.email.trim());
    case 2:
      return data.country === "canada" || data.country === "us";
    case 3:
      return data.education === "highschool" || data.education === "university" || data.education === "graduated";
    case 4:
      return data.schoolName.trim().length > 0;
    case 5:
      return data.areas.length > 0;
    case 6:
      return true;
    case 7:
      return true;
    case 8:
      return data.programOfStudy.trim().length > 0;
    default:
      return false;
  }
}

/** Mandatory steps — resume (6), LinkedIn (7) are optional. */
export const JOIN_APPLY_MANDATORY_STEPS = [0, 1, 2, 3, 4, 5, 8] as const;

export function isJoinApplyMandatoryComplete(data: JoinApplyFormState): boolean {
  return JOIN_APPLY_MANDATORY_STEPS.every((step) => isJoinApplyStepValid(step, data));
}

/** Server-side submission — all mandatory fields must be valid. */
export function isJoinApplySubmissionValid(data: JoinApplyFormState): boolean {
  return isJoinApplyMandatoryComplete(data);
}

/** True when the user has entered or saved anything on the card. */
export function hasJoinApplyCardInput(
  data: JoinApplyFormState,
  touchedSteps: ReadonlySet<number>,
): boolean {
  if (data.name.trim()) return true;
  if (data.email.trim()) return true;
  if (touchedSteps.has(2) || touchedSteps.has(3)) return true;
  if (data.schoolName.trim()) return true;
  if (data.programOfStudy.trim()) return true;
  if (data.areas.length > 0) return true;
  if (data.resumeFileName) return true;
  if (data.linkedinUsername.trim()) return true;
  if (data.additionalNotes.trim()) return true;
  return false;
}

/** Mobile card — country/education must be explicitly saved, not just defaulted. */
export function isJoinApplyCardMandatoryComplete(
  data: JoinApplyFormState,
  touchedSteps: ReadonlySet<number>,
): boolean {
  return (
    isJoinApplyStepValid(0, data) &&
    isJoinApplyStepValid(1, data) &&
    touchedSteps.has(2) &&
    touchedSteps.has(3) &&
    isJoinApplyStepValid(4, data) &&
    isJoinApplyStepValid(5, data) &&
    isJoinApplyStepValid(8, data)
  );
}

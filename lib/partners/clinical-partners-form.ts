export const CLINICAL_PARTNERS_COUNTRY_OPTIONS = [
  { value: "us", label: "United States" },
  { value: "canada", label: "Canada" },
] as const;

export type ClinicalPartnersCountry = (typeof CLINICAL_PARTNERS_COUNTRY_OPTIONS)[number]["value"];

export const CLINICAL_PARTNERS_TRAINING_STAGE_OPTIONS = [
  { value: "professional-school", label: "Professional school" },
  { value: "residency", label: "Residency" },
  { value: "fellowship", label: "Fellowship" },
  { value: "recently-graduated", label: "Recently graduated (entering practice within 5 years)" },
  { value: "other", label: "Other" },
] as const;

export type ClinicalPartnersTrainingStage =
  (typeof CLINICAL_PARTNERS_TRAINING_STAGE_OPTIONS)[number]["value"];

export const CLINICAL_PARTNERS_YEAR_OF_STUDY_OPTIONS = [
  { value: "year-1", label: "Year 1" },
  { value: "year-2", label: "Year 2" },
  { value: "year-3", label: "Year 3" },
  { value: "year-4", label: "Year 4" },
  { value: "year-5-plus", label: "Year 5+" },
  { value: "pgy-1", label: "PGY-1 / Intern year" },
  { value: "pgy-2-plus", label: "PGY-2+" },
  { value: "other", label: "Other" },
] as const;

export type ClinicalPartnersYearOfStudy =
  (typeof CLINICAL_PARTNERS_YEAR_OF_STUDY_OPTIONS)[number]["value"];

export const CLINICAL_PARTNERS_PRACTICE_TIMELINE_OPTIONS = [
  { value: "within-1-year", label: "Within 1 year" },
  { value: "1-2-years", label: "1–2 years" },
  { value: "2-3-years", label: "2–3 years" },
  { value: "3-5-years", label: "3–5 years" },
] as const;

export type ClinicalPartnersPracticeTimeline =
  (typeof CLINICAL_PARTNERS_PRACTICE_TIMELINE_OPTIONS)[number]["value"];

export const CLINICAL_PARTNERS_HEALTH_PROGRAM_OPTIONS = [
  { id: "medicine", label: "Medicine (MD/DO)" },
  { id: "pharmacy", label: "Pharmacy" },
  { id: "dentistry", label: "Dentistry" },
  { id: "nursing", label: "Nursing (NP/CNS)" },
  { id: "physician-assistant", label: "Physician Assistant (PA)" },
  { id: "physical-therapy", label: "Physical Therapy" },
  { id: "occupational-therapy", label: "Occupational Therapy" },
  { id: "optometry", label: "Optometry" },
  { id: "veterinary", label: "Veterinary Medicine" },
  { id: "public-health", label: "Public Health" },
  { id: "nutrition", label: "Nutrition / Dietetics" },
  { id: "podiatry", label: "Podiatry" },
  { id: "chiropractic", label: "Chiropractic" },
  { id: "speech-language", label: "Speech-Language Pathology" },
  { id: "audiology", label: "Audiology" },
  { id: "mental-health", label: "Mental Health Counseling / Clinical Psychology" },
  { id: "biomedical-research", label: "Biomedical / Health Sciences Research" },
  { id: "other", label: "Other" },
] as const;

export type ClinicalPartnersHealthProgramId =
  (typeof CLINICAL_PARTNERS_HEALTH_PROGRAM_OPTIONS)[number]["id"];

export const CLINICAL_PARTNERS_INTEREST_OPTIONS = [
  {
    id: "early-access-tools",
    label:
      "I am interested in early access to intelligent tools for my education, training, and practice.",
  },
  {
    id: "founding-partner-pricing",
    label:
      "I am interested in locking in founding partner discounts on future Doe intelligence plans.",
  },
  {
    id: "entering-practice-soon",
    label: "I expect to enter clinical practice within the next five years.",
  },
] as const;

export type ClinicalPartnersInterestId = (typeof CLINICAL_PARTNERS_INTEREST_OPTIONS)[number]["id"];

export type ClinicalPartnersFormState = {
  fullName: string;
  email: string;
  country: ClinicalPartnersCountry | "";
  stateOrProvince: string;
  institution: string;
  trainingStage: ClinicalPartnersTrainingStage | "";
  trainingStageOther: string;
  yearOfStudy: ClinicalPartnersYearOfStudy | "";
  yearOfStudyOther: string;
  practiceTimeline: ClinicalPartnersPracticeTimeline | "";
  healthPrograms: ClinicalPartnersHealthProgramId[];
  healthProgramOther: string;
  interests: ClinicalPartnersInterestId[];
  linkedin: string;
};

export const CLINICAL_PARTNERS_INITIAL_FORM_STATE: ClinicalPartnersFormState = {
  fullName: "",
  email: "",
  country: "",
  stateOrProvince: "",
  institution: "",
  trainingStage: "",
  trainingStageOther: "",
  yearOfStudy: "",
  yearOfStudyOther: "",
  practiceTimeline: "",
  healthPrograms: [],
  healthProgramOther: "",
  interests: [],
  linkedin: "",
};

export const CLINICAL_PARTNERS_LINKEDIN_PREFIX = "linkedin.com/in/";

/** Strip pasted URLs down to the profile slug after `/in/`. */
export function normalizeClinicalPartnersLinkedInUsername(value: string): string {
  return value
    .trim()
    .replace(/\s/g, "")
    .replace(/^@/, "")
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/^linkedin\.com\/in\//i, "")
    .replace(/\/+$/, "");
}

/** Canonical profile URL for form submission. */
export function formatClinicalPartnersLinkedInUrl(username: string): string {
  const slug = normalizeClinicalPartnersLinkedInUsername(username);
  if (!slug) return "";
  return `https://www.linkedin.com/in/${slug}`;
}

export function isClinicalPartnersEmailValid(email: string): boolean {
  return email.trim().length > 0;
}

export function isClinicalPartnersFormValid(data: ClinicalPartnersFormState): boolean {
  if (!data.fullName.trim()) return false;
  if (!isClinicalPartnersEmailValid(data.email)) return false;
  if (!data.country) return false;
  if (!data.stateOrProvince.trim()) return false;
  if (!data.institution.trim()) return false;
  if (!data.trainingStage) return false;
  if (data.trainingStage === "other" && !data.trainingStageOther.trim()) return false;
  if (data.trainingStage !== "recently-graduated") {
    if (!data.yearOfStudy) return false;
    if (data.yearOfStudy === "other" && !data.yearOfStudyOther.trim()) return false;
  }
  if (!data.practiceTimeline) return false;
  if (data.healthPrograms.length === 0) return false;
  if (data.healthPrograms.includes("other") && !data.healthProgramOther.trim()) return false;
  if (!normalizeClinicalPartnersLinkedInUsername(data.linkedin)) return false;
  return true;
}

export function toggleClinicalPartnersSelection<T extends string>(
  current: readonly T[],
  value: T,
): T[] {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

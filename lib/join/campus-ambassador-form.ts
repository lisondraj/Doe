export const CAMPUS_AMBASSADOR_COUNTRY_OPTIONS = [
  { value: "us", label: "United States" },
  { value: "canada", label: "Canada" },
] as const;

export type CampusAmbassadorCountry = (typeof CAMPUS_AMBASSADOR_COUNTRY_OPTIONS)[number]["value"];

export const CAMPUS_AMBASSADOR_SCHOOL_LEVEL_OPTIONS = [
  { value: "high-school", label: "High school" },
  { value: "college", label: "College" },
  { value: "university", label: "University" },
  { value: "other", label: "Other" },
] as const;

export type CampusAmbassadorSchoolLevel = (typeof CAMPUS_AMBASSADOR_SCHOOL_LEVEL_OPTIONS)[number]["value"];

export const CAMPUS_AMBASSADOR_YEAR_OF_STUDY_OPTIONS = [
  { value: "year-1", label: "Year 1" },
  { value: "year-2", label: "Year 2" },
  { value: "year-3", label: "Year 3" },
  { value: "year-4", label: "Year 4" },
  { value: "year-5-plus", label: "Year 5+" },
  { value: "other", label: "Other" },
] as const;

export type CampusAmbassadorYearOfStudy = (typeof CAMPUS_AMBASSADOR_YEAR_OF_STUDY_OPTIONS)[number]["value"];

export const CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OPTIONS = [
  { id: "medicine", label: "Medicine (MD/DO)" },
  { id: "pharmacy", label: "Pharmacy" },
  { id: "dentistry", label: "Dentistry" },
  { id: "nursing", label: "Nursing" },
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

export type CampusAmbassadorHealthProgramId = (typeof CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OPTIONS)[number]["id"];

export const CAMPUS_AMBASSADOR_STATEMENT_OPTIONS = [
  {
    id: "ai-tools",
    label:
      "I am familiar with AI tools, especially code generation tools such as Cursor or Claude Code.",
  },
  {
    id: "startup-experience",
    label: "I have experience working with startups or with other builders in tech.",
  },
  {
    id: "community-connected",
    label:
      "I am well connected within my community with my colleagues, especially providers, professors, and classmates.",
  },
] as const;

export type CampusAmbassadorStatementId = (typeof CAMPUS_AMBASSADOR_STATEMENT_OPTIONS)[number]["id"];

export type CampusAmbassadorFormState = {
  fullName: string;
  email: string;
  country: CampusAmbassadorCountry | "";
  stateOrProvince: string;
  schoolLevel: CampusAmbassadorSchoolLevel | "";
  schoolLevelOther: string;
  yearOfStudy: CampusAmbassadorYearOfStudy | "";
  yearOfStudyOther: string;
  fieldOfStudy: string;
  healthPrograms: CampusAmbassadorHealthProgramId[];
  healthProgramOther: string;
  statements: CampusAmbassadorStatementId[];
  linkedin: string;
};

export const CAMPUS_AMBASSADOR_INITIAL_FORM_STATE: CampusAmbassadorFormState = {
  fullName: "",
  email: "",
  country: "",
  stateOrProvince: "",
  schoolLevel: "",
  schoolLevelOther: "",
  yearOfStudy: "",
  yearOfStudyOther: "",
  fieldOfStudy: "",
  healthPrograms: [],
  healthProgramOther: "",
  statements: [],
  linkedin: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isCampusAmbassadorEmailValid(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function isCampusAmbassadorFormValid(data: CampusAmbassadorFormState): boolean {
  if (!data.fullName.trim()) return false;
  if (!isCampusAmbassadorEmailValid(data.email)) return false;
  if (!data.country) return false;
  if (!data.stateOrProvince.trim()) return false;
  if (!data.schoolLevel) return false;
  if (data.schoolLevel === "other" && !data.schoolLevelOther.trim()) return false;
  if (!data.yearOfStudy) return false;
  if (data.yearOfStudy === "other" && !data.yearOfStudyOther.trim()) return false;
  if (!data.fieldOfStudy.trim()) return false;
  if (data.healthPrograms.length === 0) return false;
  if (data.healthPrograms.includes("other") && !data.healthProgramOther.trim()) return false;
  if (!data.linkedin.trim()) return false;
  return true;
}

export function toggleCampusAmbassadorSelection<T extends string>(
  current: readonly T[],
  value: T,
): T[] {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

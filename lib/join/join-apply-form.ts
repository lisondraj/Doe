export const JOIN_APPLY_AREAS = [
  "Engineering",
  "Product",
  "Operations",
  "Marketing",
  "Sales",
  "GTM",
] as const;

export type JoinApplyArea = (typeof JOIN_APPLY_AREAS)[number];

export type JoinApplyCountry = "canada" | "us";

export type JoinApplyEducation = "highschool" | "university" | "graduated";

export type JoinApplyFormState = {
  name: string;
  email: string;
  country: JoinApplyCountry;
  education: JoinApplyEducation;
  schoolName: string;
  areas: JoinApplyArea[];
  resume: File | null;
  linkedinUsername: string;
  notes: string;
};

export const JOIN_APPLY_INITIAL_STATE: JoinApplyFormState = {
  name: "",
  email: "",
  country: "canada",
  education: "highschool",
  schoolName: "",
  areas: [],
  resume: null,
  linkedinUsername: "",
  notes: "",
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
      return !!data.education;
    case 4:
      return data.schoolName.trim().length > 0;
    case 5:
      return data.areas.length > 0;
    case 6:
      return data.resume !== null;
    case 7:
      return data.linkedinUsername.trim().length > 0;
    case 8:
      return true;
    default:
      return false;
  }
}

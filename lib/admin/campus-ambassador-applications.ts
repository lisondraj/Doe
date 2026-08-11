import {
  CAMPUS_AMBASSADOR_COUNTRY_OPTIONS,
  CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OPTIONS,
  CAMPUS_AMBASSADOR_SCHOOL_LEVEL_OPTIONS,
  CAMPUS_AMBASSADOR_STATEMENT_OPTIONS,
  CAMPUS_AMBASSADOR_YEAR_OF_STUDY_OPTIONS,
  type CampusAmbassadorCountry,
  type CampusAmbassadorHealthProgramId,
  type CampusAmbassadorSchoolLevel,
  type CampusAmbassadorStatementId,
  type CampusAmbassadorYearOfStudy,
} from "@/lib/join/campus-ambassador-form";
import { createSupabaseAdmin, type CampusAmbassadorApplicationRow } from "@/lib/supabase/admin";

export type AdminCampusAmbassadorApplication = CampusAmbassadorApplicationRow;

export type CampusAmbassadorSignupStats = {
  total: number;
  unitedStates: number;
  canada: number;
  withStatements: number;
  multiProgram: number;
};

const COUNTRY_LABELS = Object.fromEntries(
  CAMPUS_AMBASSADOR_COUNTRY_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CampusAmbassadorCountry, string>;

const SCHOOL_LEVEL_LABELS = Object.fromEntries(
  CAMPUS_AMBASSADOR_SCHOOL_LEVEL_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CampusAmbassadorSchoolLevel, string>;

const YEAR_OF_STUDY_LABELS = Object.fromEntries(
  CAMPUS_AMBASSADOR_YEAR_OF_STUDY_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CampusAmbassadorYearOfStudy, string>;

const HEALTH_PROGRAM_LABELS = Object.fromEntries(
  CAMPUS_AMBASSADOR_HEALTH_PROGRAM_OPTIONS.map((option) => [option.id, option.label]),
) as Record<CampusAmbassadorHealthProgramId, string>;

const STATEMENT_LABELS = Object.fromEntries(
  CAMPUS_AMBASSADOR_STATEMENT_OPTIONS.map((option) => [option.id, option.label]),
) as Record<CampusAmbassadorStatementId, string>;

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

export function formatCampusAmbassadorCountry(country: CampusAmbassadorCountry): string {
  return COUNTRY_LABELS[country];
}

export function formatCampusAmbassadorSchoolLevel(level: CampusAmbassadorSchoolLevel): string {
  return SCHOOL_LEVEL_LABELS[level];
}

export function formatCampusAmbassadorYearOfStudy(year: CampusAmbassadorYearOfStudy): string {
  return YEAR_OF_STUDY_LABELS[year];
}

export function formatCampusAmbassadorHealthProgram(id: string): string {
  return HEALTH_PROGRAM_LABELS[id as CampusAmbassadorHealthProgramId] ?? id;
}

export function formatCampusAmbassadorStatement(id: string): string {
  return STATEMENT_LABELS[id as CampusAmbassadorStatementId] ?? id;
}

export function summarizeCampusAmbassadorApplications(
  applications: AdminCampusAmbassadorApplication[],
): CampusAmbassadorSignupStats {
  return {
    total: applications.length,
    unitedStates: applications.filter((row) => row.country === "us").length,
    canada: applications.filter((row) => row.country === "canada").length,
    withStatements: applications.filter((row) => row.statements.length > 0).length,
    multiProgram: applications.filter((row) => row.health_programs.length > 1).length,
  };
}

export async function fetchCampusAmbassadorApplications(): Promise<AdminCampusAmbassadorApplication[]> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from("campus_ambassador_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message || "Could not load campus ambassador applications.");

  return (data ?? []) as AdminCampusAmbassadorApplication[];
}

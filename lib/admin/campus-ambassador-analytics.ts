import type { AdminCampusAmbassadorApplication } from "@/lib/admin/campus-ambassador-applications";
import {
  formatCampusAmbassadorCountry,
  formatCampusAmbassadorHealthProgram,
  formatCampusAmbassadorSchoolLevel,
} from "@/lib/admin/campus-ambassador-applications";

export type CampusAmbassadorAnalyticsSlice = {
  label: string;
  value: number;
};

export type CampusAmbassadorAnalytics = {
  total: number;
  byCountry: CampusAmbassadorAnalyticsSlice[];
  bySchoolLevel: CampusAmbassadorAnalyticsSlice[];
  byHealthProgram: CampusAmbassadorAnalyticsSlice[];
  byStatementCount: CampusAmbassadorAnalyticsSlice[];
};

function countBy<T extends string>(
  applications: AdminCampusAmbassadorApplication[],
  pick: (application: AdminCampusAmbassadorApplication) => T | T[],
  format: (value: T) => string,
): CampusAmbassadorAnalyticsSlice[] {
  const counts = new Map<string, number>();

  for (const application of applications) {
    const values = pick(application);
    const list = Array.isArray(values) ? values : [values];
    for (const value of list) {
      const label = format(value);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

export function buildCampusAmbassadorAnalytics(
  applications: AdminCampusAmbassadorApplication[],
): CampusAmbassadorAnalytics {
  return {
    total: applications.length,
    byCountry: countBy(applications, (row) => row.country, formatCampusAmbassadorCountry),
    bySchoolLevel: countBy(applications, (row) => row.school_level, formatCampusAmbassadorSchoolLevel),
    byHealthProgram: countBy(
      applications,
      (row) => row.health_programs,
      formatCampusAmbassadorHealthProgram,
    ),
    byStatementCount: countBy(applications, (row) => {
      if (row.statements.length === 0) return "No statements";
      if (row.statements.length === 1) return "1 statement";
      return `${row.statements.length} statements`;
    }, (value) => value),
  };
}

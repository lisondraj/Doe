import type { AdminCampusAmbassadorApplication } from "@/lib/admin/campus-ambassador-applications";
import {
  formatCampusAmbassadorCountry,
  formatCampusAmbassadorHealthProgram,
  formatCampusAmbassadorSchoolLevel,
} from "@/lib/admin/campus-ambassador-applications";
import { fuzzyGroupKey } from "@/lib/admin/internship-grouping";

export type CampusAmbassadorGroupMode =
  | "none"
  | "country"
  | "school_level"
  | "field_of_study"
  | "health_program"
  | "year_of_study";

export type CampusAmbassadorApplicationGroup = {
  key: string;
  label: string;
  count: number;
  applications: AdminCampusAmbassadorApplication[];
};

export function groupCampusAmbassadorApplications(
  applications: AdminCampusAmbassadorApplication[],
  mode: CampusAmbassadorGroupMode,
): CampusAmbassadorApplicationGroup[] {
  if (mode === "none") {
    return applications.length
      ? [{ key: "all", label: "All applications", count: applications.length, applications }]
      : [];
  }

  const buckets = new Map<string, { labels: string[]; applications: AdminCampusAmbassadorApplication[] }>();

  const addToBucket = (key: string, label: string, application: AdminCampusAmbassadorApplication) => {
    const bucket = buckets.get(key) ?? { labels: [], applications: [] };
    bucket.labels.push(label);
    bucket.applications.push(application);
    buckets.set(key, bucket);
  };

  for (const application of applications) {
    switch (mode) {
      case "country":
        addToBucket(application.country, formatCampusAmbassadorCountry(application.country), application);
        break;
      case "school_level":
        addToBucket(
          application.school_level,
          formatCampusAmbassadorSchoolLevel(application.school_level),
          application,
        );
        break;
      case "field_of_study":
        addToBucket(
          fuzzyGroupKey(application.field_of_study),
          application.field_of_study,
          application,
        );
        break;
      case "health_program":
        if (application.health_programs.length === 0) {
          addToBucket("none", "No programs selected", application);
        } else {
          for (const program of application.health_programs) {
            addToBucket(program, formatCampusAmbassadorHealthProgram(program), application);
          }
        }
        break;
      case "year_of_study": {
        const year = application.year_of_study ?? "graduated";
        addToBucket(year, year === "graduated" ? "Graduated" : year, application);
        break;
      }
    }
  }

  const groups = Array.from(buckets.entries()).map(([key, bucket]) => {
    const labelCounts = new Map<string, number>();
    for (const label of bucket.labels) {
      labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
    }
    const label = Array.from(labelCounts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? key;

    return {
      key,
      label,
      count: bucket.applications.length,
      applications: [...bucket.applications].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    };
  });

  return groups.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export const CAMPUS_AMBASSADOR_GROUP_MODE_OPTIONS: { value: CampusAmbassadorGroupMode; label: string }[] = [
  { value: "none", label: "No grouping" },
  { value: "country", label: "Country" },
  { value: "school_level", label: "School level" },
  { value: "field_of_study", label: "Field of study" },
  { value: "health_program", label: "Health program" },
  { value: "year_of_study", label: "Year of study" },
];

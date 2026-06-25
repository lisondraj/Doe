import type { AdminInternshipApplication } from "@/lib/admin/internship-applications";
import { formatCountry, formatEducation } from "@/lib/admin/internship-applications";

export type InternshipGroupMode =
  | "none"
  | "country"
  | "university"
  | "program"
  | "education"
  | "resume"
  | "resume_linkedin"
  | "roles";

export type InternshipApplicationGroup = {
  key: string;
  label: string;
  count: number;
  applications: AdminInternshipApplication[];
};

const GROUP_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "college",
  "for",
  "in",
  "institute",
  "of",
  "polytechnic",
  "school",
  "the",
  "univ",
  "university",
]);

const PROGRAM_ALIASES: Record<string, string> = {
  cs: "computer science",
  comp: "computer",
  computing: "computer science",
  "computer-science": "computer science",
  "comp-sci": "computer science",
  "comp sci": "computer science",
  "software-engineering": "software engineering",
  swe: "software engineering",
  ee: "electrical engineering",
  me: "mechanical engineering",
  bba: "business administration",
  mba: "business administration",
  econ: "economics",
  bio: "biology",
  chem: "chemistry",
  math: "mathematics",
  stats: "statistics",
  psych: "psychology",
  comm: "communications",
  eng: "engineering",
};

export function normalizeGroupText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s/-]/g, " ")
    .replace(/[\s/_-]+/g, " ")
    .trim();
}

function tokenizeForGrouping(value: string): string[] {
  const normalized = normalizeGroupText(value);
  if (!normalized) return [];

  const aliased = PROGRAM_ALIASES[normalized] ?? normalized;
  return aliased
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 0 && !GROUP_STOP_WORDS.has(token));
}

export function fuzzyGroupKey(value: string): string {
  const tokens = tokenizeForGrouping(value);
  if (tokens.length === 0) return normalizeGroupText(value) || "unknown";
  return Array.from(new Set(tokens)).sort().join(" ");
}

function pickDisplayLabel(values: string[]): string {
  if (values.length === 0) return "Unknown";

  const counts = new Map<string, number>();
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;
    counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1);
  }

  if (counts.size === 0) return "Unknown";

  return Array.from(counts.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  })[0][0];
}

function hasResume(application: AdminInternshipApplication): boolean {
  return Boolean(application.resume_storage_path || application.resume_file_name);
}

function hasLinkedIn(application: AdminInternshipApplication): boolean {
  return Boolean(application.linkedin_username?.trim());
}

function resumeLinkedInLabel(application: AdminInternshipApplication): string {
  const resume = hasResume(application);
  const linkedin = hasLinkedIn(application);
  if (resume && linkedin) return "Resume + LinkedIn";
  if (resume) return "Resume only";
  if (linkedin) return "LinkedIn only";
  return "Neither";
}

export function groupInternshipApplications(
  applications: AdminInternshipApplication[],
  mode: InternshipGroupMode,
): InternshipApplicationGroup[] {
  if (mode === "none") {
    return applications.length
      ? [{ key: "all", label: "All signups", count: applications.length, applications }]
      : [];
  }

  const buckets = new Map<string, { labels: string[]; applications: AdminInternshipApplication[] }>();

  const addToBucket = (key: string, label: string, application: AdminInternshipApplication) => {
    const bucket = buckets.get(key) ?? { labels: [], applications: [] };
    bucket.labels.push(label);
    bucket.applications.push(application);
    buckets.set(key, bucket);
  };

  for (const application of applications) {
    switch (mode) {
      case "country":
        addToBucket(application.country, formatCountry(application.country), application);
        break;
      case "university":
        addToBucket(fuzzyGroupKey(application.school_name), application.school_name, application);
        break;
      case "program":
        addToBucket(fuzzyGroupKey(application.program_of_study), application.program_of_study, application);
        break;
      case "education":
        addToBucket(application.education, formatEducation(application.education), application);
        break;
      case "resume": {
        const key = hasResume(application) ? "with_resume" : "no_resume";
        const label = hasResume(application) ? "With resume" : "No resume";
        addToBucket(key, label, application);
        break;
      }
      case "resume_linkedin": {
        const label = resumeLinkedInLabel(application);
        addToBucket(label, label, application);
        break;
      }
      case "roles":
        if (application.areas.length === 0) {
          addToBucket("no_roles", "No roles selected", application);
        } else {
          for (const area of application.areas) {
            addToBucket(area, area, application);
          }
        }
        break;
    }
  }

  const groups = Array.from(buckets.entries()).map(([key, bucket]) => ({
    key,
    label: pickDisplayLabel(bucket.labels),
    count: bucket.applications.length,
    applications: [...bucket.applications].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ),
  }));

  const sortOrder: Record<InternshipGroupMode, (a: InternshipApplicationGroup, b: InternshipApplicationGroup) => number> = {
    none: () => 0,
    country: (a, b) => b.count - a.count || a.label.localeCompare(b.label),
    university: (a, b) => b.count - a.count || a.label.localeCompare(b.label),
    program: (a, b) => b.count - a.count || a.label.localeCompare(b.label),
    education: (a, b) => b.count - a.count || a.label.localeCompare(b.label),
    resume: (a, b) => {
      if (a.key === "with_resume") return -1;
      if (b.key === "with_resume") return 1;
      return b.count - a.count;
    },
    resume_linkedin: (a, b) => {
      const order = ["Resume + LinkedIn", "Resume only", "LinkedIn only", "Neither"];
      return order.indexOf(a.label) - order.indexOf(b.label);
    },
    roles: (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  };

  return groups.sort(sortOrder[mode]);
}

export const INTERNSHIP_GROUP_MODE_OPTIONS: { value: InternshipGroupMode; label: string }[] = [
  { value: "none", label: "No grouping" },
  { value: "country", label: "Country" },
  { value: "university", label: "University" },
  { value: "program", label: "Field of study" },
  { value: "education", label: "Education level" },
  { value: "resume", label: "Resume submitted" },
  { value: "resume_linkedin", label: "Resume + LinkedIn" },
  { value: "roles", label: "Roles selected" },
];

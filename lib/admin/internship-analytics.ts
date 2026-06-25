import type { AdminInternshipApplication } from "@/lib/admin/internship-applications";
import { formatCountry, formatEducation } from "@/lib/admin/internship-applications";
import { fuzzyGroupKey, groupInternshipApplications } from "@/lib/admin/internship-grouping";

export type AnalyticsBarItem = {
  label: string;
  value: number;
  percentage: number;
};

export type InternshipAnalyticsSnapshot = {
  total: number;
  byCountry: AnalyticsBarItem[];
  byEducation: AnalyticsBarItem[];
  byUniversity: AnalyticsBarItem[];
  byProgram: AnalyticsBarItem[];
  byResumeStatus: AnalyticsBarItem[];
  byResumeLinkedIn: AnalyticsBarItem[];
  byRole: AnalyticsBarItem[];
  byMonth: AnalyticsBarItem[];
};

function toBarItems(entries: [string, number][], total: number, limit = 8): AnalyticsBarItem[] {
  return entries
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, value]) => ({
      label,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
}

function countBy<T extends string>(
  applications: AdminInternshipApplication[],
  pick: (application: AdminInternshipApplication) => T,
): Map<T, number> {
  const counts = new Map<T, number>();
  for (const application of applications) {
    const key = pick(application);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function countFuzzyField(
  applications: AdminInternshipApplication[],
  pickValue: (application: AdminInternshipApplication) => string,
  pickLabel: (application: AdminInternshipApplication) => string,
): Map<string, { count: number; label: string }> {
  const buckets = new Map<string, { count: number; label: string }>();
  for (const application of applications) {
    const key = fuzzyGroupKey(pickValue(application));
    const label = pickLabel(application).trim() || "Unknown";
    const existing = buckets.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      buckets.set(key, { count: 1, label });
    }
  }
  return buckets;
}

export function buildInternshipAnalytics(applications: AdminInternshipApplication[]): InternshipAnalyticsSnapshot {
  const total = applications.length;

  const countryCounts = countBy(applications, (row) => formatCountry(row.country));
  const educationCounts = countBy(applications, (row) => formatEducation(row.education));

  const universityBuckets = countFuzzyField(
    applications,
    (row) => row.school_name,
    (row) => row.school_name,
  );
  const programBuckets = countFuzzyField(
    applications,
    (row) => row.program_of_study,
    (row) => row.program_of_study,
  );

  const resumeGroups = groupInternshipApplications(applications, "resume");
  const resumeLinkedInGroups = groupInternshipApplications(applications, "resume_linkedin");
  const roleGroups = groupInternshipApplications(applications, "roles");

  const monthBuckets = new Map<string, { label: string; count: number }>();
  for (const application of applications) {
    const date = new Date(application.created_at);
    const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
    const bucket = monthBuckets.get(sortKey) ?? { label, count: 0 };
    bucket.count += 1;
    monthBuckets.set(sortKey, bucket);
  }

  const monthEntries = Array.from(monthBuckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, bucket]) => [bucket.label, bucket.count] as [string, number]);

  return {
    total,
    byCountry: toBarItems(Array.from(countryCounts.entries()), total),
    byEducation: toBarItems(Array.from(educationCounts.entries()), total),
    byUniversity: toBarItems(
      Array.from(universityBuckets.values()).map((bucket) => [bucket.label, bucket.count]),
      total,
      10,
    ),
    byProgram: toBarItems(
      Array.from(programBuckets.values()).map((bucket) => [bucket.label, bucket.count]),
      total,
      10,
    ),
    byResumeStatus: resumeGroups.map((group) => ({
      label: group.label,
      value: group.count,
      percentage: total > 0 ? Math.round((group.count / total) * 100) : 0,
    })),
    byResumeLinkedIn: resumeLinkedInGroups.map((group) => ({
      label: group.label,
      value: group.count,
      percentage: total > 0 ? Math.round((group.count / total) * 100) : 0,
    })),
    byRole: roleGroups.map((group) => ({
      label: group.label,
      value: group.count,
      percentage: total > 0 ? Math.round((group.count / total) * 100) : 0,
    })),
    byMonth: toBarItems(monthEntries, total, 12),
  };
}

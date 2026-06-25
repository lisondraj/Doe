"use client";

import { useMemo, useState, type ReactNode } from "react";

import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import {
  formatAdminDate,
  formatCountry,
  formatEducation,
  summarizeInternshipApplications,
  type AdminInternshipApplication,
  type InternshipSignupStats,
} from "@/lib/admin/internship-applications";
import { inter, lora } from "@/lib/home/fonts";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
      <p className="mt-1.5 text-[28px] font-medium leading-none tabular-nums tracking-tight text-neutral-900">
        {value}
      </p>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-b border-[#F0F0F0] py-3 last:border-b-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
      <div className="mt-1 text-[13px] font-medium leading-snug text-neutral-800">{value}</div>
    </div>
  );
}

function ApplicationListItem({
  application,
  selected,
  onSelect,
}: {
  application: AdminInternshipApplication;
  selected: boolean;
  onSelect: () => void;
}) {
  const initials = application.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 border-b border-[#F3F3F3] px-4 py-3 text-left transition-colors ${
        selected ? "bg-neutral-50" : "bg-white hover:bg-neutral-50/80"
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] text-[10px] font-semibold text-white">
        {initials || "?"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[13px] font-semibold tracking-tight text-neutral-900">{application.name}</p>
          <span className="shrink-0 text-[10px] font-medium tabular-nums text-neutral-400">
            {formatAdminDate(application.created_at)}
          </span>
        </div>
        <p className="mt-1 truncate text-[11px] font-medium text-neutral-600">{application.email}</p>
        <p className="mt-1 truncate text-[11px] text-neutral-500">{application.school_name}</p>
        <p className="mt-1 line-clamp-1 text-[11px] text-neutral-500">{application.areas.join(", ")}</p>
      </div>
    </button>
  );
}

function ApplicationDetail({ application }: { application: AdminInternshipApplication }) {
  const linkedin = application.linkedin_username?.trim()
    ? `linkedin.com/in/${application.linkedin_username.trim()}`
    : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-[#EFEFEF] px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Applicant card</p>
        <h2 className={`mt-1 text-[22px] font-normal tracking-tight text-neutral-900 ${lora.className}`}>
          {application.name}
        </h2>
        <p className="mt-1 text-[13px] text-neutral-500">Submitted {formatAdminDate(application.created_at)}</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2">
        <DetailField label="Email" value={application.email} />
        <DetailField label="Country" value={formatCountry(application.country)} />
        <DetailField label="Education" value={formatEducation(application.education)} />
        <DetailField label="School" value={application.school_name} />
        <DetailField label="Program of study" value={application.program_of_study} />
        <DetailField
          label="Areas"
          value={
            application.areas.length ? (
              <div className="flex flex-wrap gap-1.5">
                {application.areas.map((area) => (
                  <span
                    key={area}
                    className="rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700"
                  >
                    {area}
                  </span>
                ))}
              </div>
            ) : (
              "—"
            )
          }
        />
        <DetailField
          label="Resume"
          value={
            application.resume_file_name ? (
              <div className="flex flex-col gap-0.5">
                {application.resume_download_url ? (
                  <a
                    href={application.resume_download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#BF593D] underline-offset-2 hover:underline"
                  >
                    {application.resume_file_name}
                  </a>
                ) : (
                  application.resume_file_name
                )}
                {application.resume_file_type ? (
                  <span className="text-[11px] font-medium text-neutral-500">{application.resume_file_type}</span>
                ) : null}
              </div>
            ) : (
              "Not provided"
            )
          }
        />
        <DetailField
          label="LinkedIn"
          value={
            linkedin ? (
              <a
                href={`https://${linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#BF593D] underline-offset-2 hover:underline"
              >
                {linkedin}
              </a>
            ) : (
              "Not provided"
            )
          }
        />
        <DetailField
          label="Additional notes"
          value={application.additional_notes?.trim() ? application.additional_notes : "None"}
        />
        <DetailField label="Confirmation email sent" value={formatAdminDate(application.email_sent_at)} />
        <DetailField label="Application ID" value={<span className="font-mono text-[11px]">{application.id}</span>} />
      </div>
    </div>
  );
}

export function InternshipSignupsPanel({
  initialApplications,
  initialStats,
}: {
  initialApplications: AdminInternshipApplication[];
  initialStats: InternshipSignupStats;
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [stats, setStats] = useState(initialStats);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialApplications[0]?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return applications;
    return applications.filter((row) => {
      const haystack = [
        row.name,
        row.email,
        row.school_name,
        row.program_of_study,
        row.areas.join(" "),
        row.linkedin_username ?? "",
        row.additional_notes ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [applications, query]);

  const selected = useMemo(
    () => filtered.find((row) => row.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId],
  );

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/internship-applications");
      const payload = (await response.json()) as {
        ok?: boolean;
        applications?: AdminInternshipApplication[];
        stats?: InternshipSignupStats;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.applications || !payload.stats) {
        throw new Error(payload.error || "Could not refresh applications.");
      }
      setApplications(payload.applications);
      setStats(payload.stats);
      if (!payload.applications.some((row) => row.id === selectedId)) {
        setSelectedId(payload.applications[0]?.id ?? null);
      }
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Could not refresh applications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex h-full min-h-0 flex-col ${inter.className}`}>
      <header className="flex items-center gap-2 border-b border-[#EFEFEF] px-4 py-3">
        <DoeBuildIcon className="h-5 w-5 text-neutral-500">
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </>
        </DoeBuildIcon>
        <h1 className="text-[15px] font-semibold tracking-tight text-neutral-900">Internship signups</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex h-8 items-center rounded-lg border border-[#E2E2E2] bg-white px-3 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>

      <div className="border-b border-[#EFEFEF] px-4 py-3">
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total signups" value={stats.total} />
          <StatCard label="With resume" value={stats.withResume} />
          <StatCard label="With LinkedIn" value={stats.withLinkedIn} />
          <StatCard label="With notes" value={stats.withNotes} />
        </div>
      </div>

      <div className="border-b border-[#EFEFEF] px-4 py-3">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-[#ECECEC] bg-[#FAFAFA] px-2.5">
          <DoeBuildIcon className="h-4 w-4 text-neutral-400">
            <>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </>
          </DoeBuildIcon>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, school, areas…"
            className="flex-1 bg-transparent text-[13px] text-neutral-800 outline-none placeholder:text-neutral-400"
          />
          <span className="rounded border border-[#E5E5E5] bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
            {filtered.length}
          </span>
        </div>
        {error ? <p className="mt-2 text-[12px] font-medium text-[#BF593D]">{error}</p> : null}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
        <div className="min-h-0 overflow-y-auto border-r border-[#EFEFEF] bg-white">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13px] text-neutral-500">No internship signups yet.</div>
          ) : (
            filtered.map((application) => (
              <ApplicationListItem
                key={application.id}
                application={application}
                selected={selected?.id === application.id}
                onSelect={() => setSelectedId(application.id)}
              />
            ))
          )}
        </div>

        <div className="min-h-0 bg-white">
          {selected ? (
            <ApplicationDetail application={selected} />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-[13px] text-neutral-500">
              Select a signup to view the full applicant card.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

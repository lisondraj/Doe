"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";

import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import { AdminMobileSectionHeader } from "@/components/admin/AdminMobileSectionHeader";
import {
  formatAdminDate,
  formatCountry,
  formatEducation,
  type AdminInternshipApplication,
  type InternshipSignupStats,
} from "@/lib/admin/internship-applications";
import {
  groupInternshipApplications,
  INTERNSHIP_GROUP_MODE_OPTIONS,
  type InternshipGroupMode,
} from "@/lib/admin/internship-grouping";
import {
  ADMIN_MOBILE_BACK_BUTTON_TW,
  ADMIN_MOBILE_BACK_ICON_TW,
  ADMIN_MOBILE_BODY_TW,
  ADMIN_MOBILE_BUTTON_TW,
  ADMIN_MOBILE_CONTROL_ICON_TW,
  ADMIN_MOBILE_CONTROL_SURFACE,
  ADMIN_MOBILE_DETAIL_TITLE_TW,
  ADMIN_MOBILE_INPUT_H,
  ADMIN_MOBILE_INPUT_TEXT_TW,
  ADMIN_MOBILE_LABEL_TW,
  ADMIN_MOBILE_LIST_AVATAR_TW,
  ADMIN_MOBILE_LIST_NAME_TW,
  ADMIN_MOBILE_LIST_ROW_PAD,
  ADMIN_MOBILE_META_TW,
  ADMIN_MOBILE_PANEL_STACK,
  ADMIN_MOBILE_FIELD_TEXT_TW,
  ADMIN_MOBILE_SELECT_CHEVRON_TW,
  ADMIN_MOBILE_STAT_GRID,
  ADMIN_MOBILE_STAT_TILE,
  ADMIN_MOBILE_STAT_VALUE_TW,
  ADMIN_MOBILE_STACK_GAP,
  ADMIN_MOBILE_SURFACE,
} from "@/lib/admin/admin-layout";
import { inter, lora } from "@/lib/home/fonts";

type PanelVariant = "mobile" | "desktop";

function AdminMobileSearchBar({
  value,
  onChange,
  resultCount,
}: {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}) {
  return (
    <label className={`flex ${ADMIN_MOBILE_CONTROL_SURFACE} ${ADMIN_MOBILE_INPUT_H} items-center gap-3.5 px-5 iphone-page:gap-4 iphone-page:px-6`}>
      <DoeBuildIcon className={ADMIN_MOBILE_CONTROL_ICON_TW}>
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </>
      </DoeBuildIcon>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search name, email, school, areas…"
        className={ADMIN_MOBILE_INPUT_TEXT_TW}
      />
      <span className="shrink-0 rounded-full bg-neutral-100 px-3.5 py-1.5 text-[1rem] font-semibold tabular-nums text-neutral-600 iphone-page:px-4 iphone-page:py-2 iphone-page:text-[1.06rem]">
        {resultCount}
      </span>
    </label>
  );
}

function AdminMobileGroupSelect({
  value,
  onChange,
}: {
  value: InternshipGroupMode;
  onChange: (value: InternshipGroupMode) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5 iphone-page:gap-3">
      <p className={ADMIN_MOBILE_LABEL_TW}>Group by</p>
      <div className={`relative ${ADMIN_MOBILE_CONTROL_SURFACE}`}>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as InternshipGroupMode)}
          className={`w-full appearance-none bg-transparent ${ADMIN_MOBILE_INPUT_H} pl-5 pr-14 outline-none iphone-page:pl-6 iphone-page:pr-16 ${ADMIN_MOBILE_FIELD_TEXT_TW}`}
        >
          {INTERNSHIP_GROUP_MODE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <DoeBuildIcon className={ADMIN_MOBILE_SELECT_CHEVRON_TW}>
          <path d="m6 9 6 6 6-6" />
        </DoeBuildIcon>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: PanelVariant;
}) {
  if (variant === "mobile") {
    return (
      <div className={`${ADMIN_MOBILE_SURFACE} ${ADMIN_MOBILE_STAT_TILE}`}>
        <p className={ADMIN_MOBILE_LABEL_TW}>{label}</p>
        <p className={`mt-1.5 ${ADMIN_MOBILE_STAT_VALUE_TW}`}>{value}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
      <p className="mt-1.5 text-[28px] font-medium leading-none tabular-nums tracking-tight text-neutral-900">
        {value}
      </p>
    </div>
  );
}

function DetailField({
  label,
  value,
  variant,
}: {
  label: string;
  value: ReactNode;
  variant: PanelVariant;
}) {
  if (variant === "mobile") {
    return (
      <div className="border-b border-[#F0F0F0] py-5 last:border-b-0 iphone-page:py-6">
        <p className={ADMIN_MOBILE_LABEL_TW}>{label}</p>
        <div className={`mt-2.5 ${ADMIN_MOBILE_BODY_TW}`}>{value}</div>
      </div>
    );
  }

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
  variant,
}: {
  application: AdminInternshipApplication;
  selected: boolean;
  onSelect: () => void;
  variant: PanelVariant;
}) {
  const initials = application.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-start gap-4 border-b border-[#F0F0F0] text-left transition-colors last:border-b-0 iphone-page:gap-5 ${ADMIN_MOBILE_LIST_ROW_PAD} ${
          selected ? "bg-white" : "bg-transparent active:bg-white/80"
        }`}
      >
        <div className={ADMIN_MOBILE_LIST_AVATAR_TW}>
          {initials || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className={ADMIN_MOBILE_LIST_NAME_TW}>{application.name}</p>
            <span className={`shrink-0 tabular-nums ${ADMIN_MOBILE_META_TW}`}>
              {formatAdminDate(application.created_at)}
            </span>
          </div>
          <p className={`mt-1.5 truncate ${ADMIN_MOBILE_META_TW} text-neutral-600`}>{application.email}</p>
          <p className={`mt-1 truncate ${ADMIN_MOBILE_META_TW}`}>{application.school_name}</p>
          <p className={`mt-1 line-clamp-2 ${ADMIN_MOBILE_META_TW}`}>{application.areas.join(", ")}</p>
        </div>
      </button>
    );
  }

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

function ApplicationDetail({
  application,
  resendingConfirmation,
  resendError,
  onResendConfirmationEmail,
  variant,
}: {
  application: AdminInternshipApplication;
  resendingConfirmation: boolean;
  resendError: string | null;
  onResendConfirmationEmail: () => void;
  variant: PanelVariant;
}) {
  const linkedin = application.linkedin_username?.trim()
    ? `linkedin.com/in/${application.linkedin_username.trim()}`
    : null;

  const areaChips = application.areas.length ? (
    <div className="flex flex-wrap gap-2">
      {application.areas.map((area) => (
        <span
          key={area}
          className={`rounded-xl bg-neutral-100 px-3.5 py-2 font-medium text-neutral-700 ${
            variant === "mobile"
              ? "text-[clamp(1.1rem,0.96rem+0.55vmin,1.25rem)] iphone-page:text-[1.25rem]"
              : "text-[11px]"
          }`}
        >
          {area}
        </span>
      ))}
    </div>
  ) : (
    "—"
  );

  const resendButtonClass =
    variant === "mobile"
      ? `${ADMIN_MOBILE_BUTTON_TW} ${ADMIN_MOBILE_INPUT_H}`
      : "inline-flex h-8 items-center rounded-lg border border-[#E2E2E2] bg-white px-3 text-[12px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className={`flex h-full min-h-0 flex-col bg-white ${variant === "mobile" ? "" : ""}`}>
      <header className={`border-b border-[#EFEFEF] ${variant === "mobile" ? "px-6 py-6 iphone-page:px-7 iphone-page:py-7" : "px-5 py-4"}`}>
        <p className={variant === "mobile" ? ADMIN_MOBILE_LABEL_TW : "text-[10px] font-semibold uppercase tracking-wider text-neutral-400"}>
          Applicant card
        </p>
        <h2 className={`mt-2 ${variant === "mobile" ? ADMIN_MOBILE_DETAIL_TITLE_TW : `text-[22px] font-normal tracking-tight text-neutral-900 ${lora.className}`}`}>
          {application.name}
        </h2>
        <p className={`mt-2 ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[13px] text-neutral-500"}`}>
          Submitted {formatAdminDate(application.created_at)}
        </p>
      </header>

      <div className={`min-h-0 flex-1 overflow-y-auto ${variant === "mobile" ? "px-6 py-2 iphone-page:px-7" : "px-5 py-2"}`}>
        <DetailField variant={variant} label="Email" value={application.email} />
        <DetailField variant={variant} label="Country" value={formatCountry(application.country)} />
        <DetailField variant={variant} label="Education" value={formatEducation(application.education)} />
        <DetailField variant={variant} label="School" value={application.school_name} />
        <DetailField variant={variant} label="Program of study" value={application.program_of_study} />
        <DetailField variant={variant} label="Areas" value={areaChips} />
        <DetailField
          variant={variant}
          label="Resume"
          value={
            application.resume_file_name ? (
              <div className="flex flex-col gap-1">
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
                  <span className={variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[11px] font-medium text-neutral-500"}>
                    {application.resume_file_type}
                  </span>
                ) : null}
              </div>
            ) : (
              "Not provided"
            )
          }
        />
        <DetailField
          variant={variant}
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
          variant={variant}
          label="Additional notes"
          value={application.additional_notes?.trim() ? application.additional_notes : "None"}
        />
        <DetailField
          variant={variant}
          label="Confirmation email sent"
          value={
            <div className="flex flex-col items-start gap-3">
              <span>{formatAdminDate(application.email_sent_at)}</span>
              <button
                type="button"
                onClick={onResendConfirmationEmail}
                disabled={resendingConfirmation}
                className={resendButtonClass}
              >
                {resendingConfirmation ? "Sending…" : "Re-send confirmation email"}
              </button>
              {resendError ? (
                <span className={`font-medium text-[#BF593D] ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[12px]"}`}>
                  {resendError}
                </span>
              ) : null}
            </div>
          }
        />
        <DetailField
          variant={variant}
          label="Application ID"
          value={<span className={`font-mono ${variant === "mobile" ? "text-[1.12rem] iphone-page:text-[1.2rem]" : "text-[11px]"}`}>{application.id}</span>}
        />
      </div>
    </div>
  );
}

function GroupHeader({ label, count, variant }: { label: string; count: number; variant: PanelVariant }) {
  if (variant === "mobile") {
    return (
      <div className={`sticky top-0 z-[1] border-b border-[#ECECEC] bg-[#FAFAFA] px-5 py-3.5 iphone-page:px-6 iphone-page:py-4`}>
        <div className="flex items-center justify-between gap-3">
          <p className={`truncate ${ADMIN_MOBILE_LABEL_TW} text-neutral-600`}>{label}</p>
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[0.95rem] font-semibold tabular-nums text-neutral-500 iphone-page:text-[1rem]">
            {count}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-[1] border-b border-[#ECECEC] bg-[#FAFAFA] px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-neutral-600">{label}</p>
        <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold tabular-nums text-neutral-500">
          {count}
        </span>
      </div>
    </div>
  );
}

function ApplicationList({
  visibleApplications,
  filtered,
  groups,
  groupMode,
  selectedId,
  onSelect,
  variant,
}: {
  visibleApplications: AdminInternshipApplication[];
  filtered: AdminInternshipApplication[];
  groups: ReturnType<typeof groupInternshipApplications>;
  groupMode: InternshipGroupMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  variant: PanelVariant;
}) {
  const emptyClass =
    variant === "mobile"
      ? `px-5 py-14 text-center ${ADMIN_MOBILE_META_TW} iphone-page:px-6`
      : "px-4 py-10 text-center text-[13px] text-neutral-500";

  if (visibleApplications.length === 0) {
    return <div className={emptyClass}>No internship signups yet.</div>;
  }

  if (groupMode === "none") {
    return (
      <>
        {filtered.map((application) => (
          <ApplicationListItem
            key={application.id}
            application={application}
            selected={selectedId === application.id}
            onSelect={() => onSelect(application.id)}
            variant={variant}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <div key={group.key}>
          <GroupHeader label={group.label} count={group.count} variant={variant} />
          {group.applications.map((application) => (
            <ApplicationListItem
              key={`${group.key}-${application.id}`}
              application={application}
              selected={selectedId === application.id}
              onSelect={() => onSelect(application.id)}
              variant={variant}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export function InternshipSignupsPanel({
  variant = "desktop",
  applications,
  stats,
  loading,
  error,
  onRefresh,
  onApplicationUpdated,
}: {
  variant?: PanelVariant;
  applications: AdminInternshipApplication[];
  stats: InternshipSignupStats;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onApplicationUpdated: (application: AdminInternshipApplication) => void;
}) {
  const [query, setQuery] = useState("");
  const [groupMode, setGroupMode] = useState<InternshipGroupMode>("none");
  const [selectedId, setSelectedId] = useState<string | null>(applications[0]?.id ?? null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [resendingConfirmation, setResendingConfirmation] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (!applications.some((row) => row.id === selectedId)) {
      setSelectedId(applications[0]?.id ?? null);
      setMobileDetailOpen(false);
    }
  }, [applications, selectedId]);

  useEffect(() => {
    setResendError(null);
  }, [selectedId]);

  const handleResendConfirmationEmail = async (application: AdminInternshipApplication) => {
    setResendingConfirmation(true);
    setResendError(null);
    try {
      const response = await fetch(`/api/admin/internship-applications/${application.id}/resend-email`, {
        method: "POST",
      });
      const payload = (await response.json()) as { ok?: boolean; emailSentAt?: string; error?: string };
      if (!response.ok || !payload.ok || !payload.emailSentAt) {
        throw new Error(payload.error || "Could not resend confirmation email.");
      }
      onApplicationUpdated({ ...application, email_sent_at: payload.emailSentAt });
    } catch (resendFailure) {
      setResendError(
        resendFailure instanceof Error ? resendFailure.message : "Could not resend confirmation email.",
      );
    } finally {
      setResendingConfirmation(false);
    }
  };

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
        formatCountry(row.country),
        formatEducation(row.education),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [applications, query]);

  const groups = useMemo(
    () => groupInternshipApplications(filtered, groupMode),
    [filtered, groupMode],
  );

  const visibleApplications = useMemo(
    () => (groupMode === "none" ? filtered : groups.flatMap((group) => group.applications)),
    [filtered, groupMode, groups],
  );

  const selected = useMemo(
    () => visibleApplications.find((row) => row.id === selectedId) ?? visibleApplications[0] ?? null,
    [visibleApplications, selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (variant === "mobile") setMobileDetailOpen(true);
  };

  if (variant === "mobile" && mobileDetailOpen && selected) {
    return (
      <div className={`flex h-full min-h-0 flex-col ${ADMIN_MOBILE_PANEL_STACK} ${inter.className}`}>
        <button type="button" onClick={() => setMobileDetailOpen(false)} className={ADMIN_MOBILE_BACK_BUTTON_TW}>
          <DoeBuildIcon className={ADMIN_MOBILE_BACK_ICON_TW}>
            <path d="m15 18-6-6 6-6" />
          </DoeBuildIcon>
          Back to signups
        </button>
        <div className={`${ADMIN_MOBILE_SURFACE} min-h-0 flex-1 overflow-hidden`}>
          <ApplicationDetail
            application={selected}
            resendingConfirmation={resendingConfirmation}
            resendError={resendError}
            onResendConfirmationEmail={() => void handleResendConfirmationEmail(selected)}
            variant="mobile"
          />
        </div>
      </div>
    );
  }

  const statsGrid = variant === "mobile" ? ADMIN_MOBILE_STAT_GRID : "grid grid-cols-4 gap-3";
  const inputTextClass =
    "min-w-0 flex-1 bg-transparent text-[13px] text-neutral-800 outline-none placeholder:text-neutral-400";

  return (
    <div
      className={`flex h-full min-h-0 flex-col ${inter.className} ${
        variant === "mobile" ? ADMIN_MOBILE_PANEL_STACK : ""
      }`}
    >
      {variant === "desktop" ? (
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
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex h-8 items-center rounded-lg border border-[#E2E2E2] bg-white px-3 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>
      ) : (
        <AdminMobileSectionHeader title="Signups" loading={loading} onRefresh={onRefresh} />
      )}

      <div className={variant === "mobile" ? statsGrid : "border-b border-[#EFEFEF] px-4 py-3"}>
        {variant === "desktop" ? (
          <div className="grid grid-cols-4 gap-3">
            <StatCard variant={variant} label="Total signups" value={stats.total} />
            <StatCard variant={variant} label="With resume" value={stats.withResume} />
            <StatCard variant={variant} label="With LinkedIn" value={stats.withLinkedIn} />
            <StatCard variant={variant} label="With notes" value={stats.withNotes} />
          </div>
        ) : (
          <>
            <StatCard variant={variant} label="Total signups" value={stats.total} />
            <StatCard variant={variant} label="With resume" value={stats.withResume} />
            <StatCard variant={variant} label="With LinkedIn" value={stats.withLinkedIn} />
            <StatCard variant={variant} label="With notes" value={stats.withNotes} />
          </>
        )}
      </div>

      <div className={variant === "mobile" ? `flex flex-col ${ADMIN_MOBILE_STACK_GAP}` : "border-b border-[#EFEFEF] px-4 py-3"}>
        {variant === "mobile" ? (
          <>
            <AdminMobileSearchBar value={query} onChange={setQuery} resultCount={filtered.length} />
            <AdminMobileGroupSelect value={groupMode} onChange={setGroupMode} />
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-9 min-w-0 flex-1 items-center gap-3 rounded-lg border border-[#ECECEC] bg-[#FAFAFA] px-2.5">
              <DoeBuildIcon className="h-4 w-4 shrink-0 text-neutral-400">
                <>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35" />
                </>
              </DoeBuildIcon>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, email, school, areas…"
                className={inputTextClass}
              />
              <span className="rounded border border-[#E5E5E5] bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
                {filtered.length}
              </span>
            </div>

            <label className="flex h-9 w-full items-center gap-3 rounded-lg border border-[#ECECEC] bg-white px-2.5 sm:w-auto">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Group by</span>
              <select
                value={groupMode}
                onChange={(event) => setGroupMode(event.target.value as InternshipGroupMode)}
                className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-neutral-800 outline-none"
              >
                {INTERNSHIP_GROUP_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {error ? (
          <p className={`font-medium text-[#BF593D] ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[12px]"}`}>
            {error}
          </p>
        ) : null}
      </div>

      {variant === "mobile" ? (
        <div className={`${ADMIN_MOBILE_SURFACE} min-h-0 flex-1 overflow-y-auto`}>
          <ApplicationList
            visibleApplications={visibleApplications}
            filtered={filtered}
            groups={groups}
            groupMode={groupMode}
            selectedId={selected?.id ?? null}
            onSelect={handleSelect}
            variant={variant}
          />
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          <div className="min-h-0 overflow-y-auto border-r border-[#EFEFEF] bg-white">
            <ApplicationList
              visibleApplications={visibleApplications}
              filtered={filtered}
              groups={groups}
              groupMode={groupMode}
              selectedId={selected?.id ?? null}
              onSelect={handleSelect}
              variant={variant}
            />
          </div>

          <div className="min-h-0 bg-white">
            {selected ? (
              <ApplicationDetail
                application={selected}
                resendingConfirmation={resendingConfirmation}
                resendError={resendError}
                onResendConfirmationEmail={() => void handleResendConfirmationEmail(selected)}
                variant="desktop"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-[13px] text-neutral-500">
                Select a signup to view the full applicant card.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

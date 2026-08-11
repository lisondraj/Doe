"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import {
  formatAdminDate,
  formatCampusAmbassadorCountry,
  formatCampusAmbassadorHealthProgram,
  formatCampusAmbassadorSchoolLevel,
  formatCampusAmbassadorStatement,
  formatCampusAmbassadorYearOfStudy,
  type AdminCampusAmbassadorApplication,
  type CampusAmbassadorSignupStats,
} from "@/lib/admin/campus-ambassador-applications";
import {
  CAMPUS_AMBASSADOR_GROUP_MODE_OPTIONS,
  groupCampusAmbassadorApplications,
  type CampusAmbassadorGroupMode,
} from "@/lib/admin/campus-ambassador-grouping";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";

type PanelVariant = "mobile" | "desktop";

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
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
      <div className="admin-mobile-detail-field">
        <p className="admin-mobile-detail-field__label">{label}</p>
        <div className="admin-mobile-detail-field__value">{value}</div>
      </div>
    );
  }

  return (
    <div className="admin-detail-field">
      <p className="admin-detail-field__label">{label}</p>
      <div className="admin-detail-field__value">{value}</div>
    </div>
  );
}

function ApplicationDetail({
  application,
  variant,
}: {
  application: AdminCampusAmbassadorApplication;
  variant: PanelVariant;
}) {
  const programChips = application.health_programs.length ? (
    <div className="flex flex-wrap gap-2">
      {application.health_programs.map((program) => (
        <span key={program} className={variant === "mobile" ? "admin-mobile-chip" : "admin-chip"}>
          {formatCampusAmbassadorHealthProgram(program)}
        </span>
      ))}
    </div>
  ) : (
    "—"
  );

  const statementChips = application.statements.length ? (
    <div className="flex flex-col gap-2">
      {application.statements.map((statement) => (
        <span key={statement} className={variant === "mobile" ? "admin-mobile-chip" : "admin-chip"}>
          {formatCampusAmbassadorStatement(statement)}
        </span>
      ))}
    </div>
  ) : (
    "None selected"
  );

  const yearOfStudy =
    application.school_level === "graduated"
      ? "Graduated"
      : application.year_of_study
        ? application.year_of_study === "other"
          ? application.year_of_study_other || "Other"
          : formatCampusAmbassadorYearOfStudy(application.year_of_study)
        : "—";

  const headerClass = variant === "mobile" ? "admin-mobile-detail__header" : "admin-detail-header";
  const titleClass =
    variant === "mobile"
      ? `admin-mobile-detail__title ${lora.className}`
      : `admin-detail-header__title ${lora.className}`;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className={headerClass}>
        <p className={variant === "mobile" ? "admin-mobile-detail__eyebrow" : "admin-detail-header__eyebrow"}>
          Campus ambassador application
        </p>
        <h2 className={titleClass}>{application.full_name}</h2>
        <p className={variant === "mobile" ? "admin-mobile-list-item__meta" : "admin-list-item__meta"}>
          Submitted {formatAdminDate(application.created_at)}
        </p>
      </header>

      <div className={`min-h-0 flex-1 overflow-y-auto ${variant === "mobile" ? "admin-mobile-detail__body" : "px-5 py-2"}`}>
        <DetailField variant={variant} label="Email" value={application.email} />
        <DetailField
          variant={variant}
          label="Country"
          value={formatCampusAmbassadorCountry(application.country)}
        />
        <DetailField variant={variant} label="State or province" value={application.state_or_province} />
        <DetailField
          variant={variant}
          label="School level"
          value={
            application.school_level === "other"
              ? application.school_level_other || "Other"
              : formatCampusAmbassadorSchoolLevel(application.school_level)
          }
        />
        <DetailField variant={variant} label="Year of study" value={yearOfStudy} />
        <DetailField variant={variant} label="Field of study" value={application.field_of_study} />
        <DetailField variant={variant} label="Health programs" value={programChips} />
        {application.health_program_other ? (
          <DetailField variant={variant} label="Other health program" value={application.health_program_other} />
        ) : null}
        <DetailField variant={variant} label="Statements" value={statementChips} />
        <DetailField
          variant={variant}
          label="LinkedIn"
          value={
            <a
              href={application.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-link"
            >
              {application.linkedin_url.replace(/^https?:\/\//, "")}
            </a>
          }
        />
        <DetailField
          variant={variant}
          label="Application ID"
          value={<span className="font-mono text-[0.78rem]">{application.id}</span>}
        />
      </div>
    </div>
  );
}

function ApplicationListItem({
  application,
  selected,
  onSelect,
  variant,
}: {
  application: AdminCampusAmbassadorApplication;
  selected: boolean;
  onSelect: () => void;
  variant: PanelVariant;
}) {
  const initials = initialsFromName(application.full_name);

  if (variant === "mobile") {
    return (
      <button type="button" onClick={onSelect} className="admin-mobile-list-item">
        <div className="admin-mobile-list-item__avatar">{initials || "?"}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="admin-mobile-list-item__name">{application.full_name}</p>
            <span className="shrink-0 text-[0.82rem] tabular-nums text-[rgba(245,230,208,0.48)]">
              {formatAdminDate(application.created_at)}
            </span>
          </div>
          <p className="admin-mobile-list-item__meta">{application.email}</p>
          <p className="admin-mobile-list-item__meta">{application.field_of_study}</p>
          <p className="admin-mobile-list-item__meta">
            {application.health_programs.map(formatCampusAmbassadorHealthProgram).join(", ")}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`admin-list-item ${selected ? "admin-list-item--selected" : ""}`}
    >
      <div className="admin-list-item__avatar">{initials || "?"}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="admin-list-item__name">{application.full_name}</p>
          <span className="shrink-0 text-[0.62rem] font-medium tabular-nums text-[rgba(245,230,208,0.48)]">
            {formatAdminDate(application.created_at)}
          </span>
        </div>
        <p className="admin-list-item__meta">{application.email}</p>
        <p className="admin-list-item__meta">{application.field_of_study}</p>
        <p className="admin-list-item__meta">
          {application.health_programs.map(formatCampusAmbassadorHealthProgram).join(", ")}
        </p>
      </div>
    </button>
  );
}

export function CampusAmbassadorSignupsPanel({
  variant = "desktop",
  applications,
  stats,
  loading,
  error,
  onRefresh,
}: {
  variant?: PanelVariant;
  applications: AdminCampusAmbassadorApplication[];
  stats: CampusAmbassadorSignupStats;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  const [query, setQuery] = useState("");
  const [groupMode, setGroupMode] = useState<CampusAmbassadorGroupMode>("none");
  const [selectedId, setSelectedId] = useState<string | null>(applications[0]?.id ?? null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  useEffect(() => {
    if (!applications.some((row) => row.id === selectedId)) {
      setSelectedId(applications[0]?.id ?? null);
      setMobileDetailOpen(false);
    }
  }, [applications, selectedId]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return applications;
    return applications.filter((row) => {
      const haystack = [
        row.full_name,
        row.email,
        row.state_or_province,
        row.field_of_study,
        row.health_programs.join(" "),
        row.statements.join(" "),
        row.linkedin_url,
        formatCampusAmbassadorCountry(row.country),
        formatCampusAmbassadorSchoolLevel(row.school_level),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [applications, query]);

  const groups = useMemo(
    () => groupCampusAmbassadorApplications(filtered, groupMode),
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

  const listContent =
    visibleApplications.length === 0 ? (
      <div className={variant === "mobile" ? "admin-mobile-empty-state" : "admin-empty-state"}>
        No campus ambassador applications yet.
      </div>
    ) : groupMode === "none" ? (
      filtered.map((application) => (
        <ApplicationListItem
          key={application.id}
          application={application}
          selected={selected?.id === application.id}
          onSelect={() => handleSelect(application.id)}
          variant={variant}
        />
      ))
    ) : (
      groups.map((group) => (
        <div key={group.key}>
          <div className={variant === "mobile" ? "admin-mobile-group-header" : "admin-group-header"}>
            <span className="truncate">{group.label}</span>
            <span>{group.count}</span>
          </div>
          {group.applications.map((application) => (
            <ApplicationListItem
              key={`${group.key}-${application.id}`}
              application={application}
              selected={selected?.id === application.id}
              onSelect={() => handleSelect(application.id)}
              variant={variant}
            />
          ))}
        </div>
      ))
    );

  if (variant === "mobile" && mobileDetailOpen && selected) {
    return (
      <div className={`flex h-full min-h-0 flex-col gap-4 ${inter.className}`}>
        <button type="button" onClick={() => setMobileDetailOpen(false)} className="admin-mobile-back-btn">
          <DoeBuildIcon className="h-5 w-5">
            <path d="m15 18-6-6 6-6" />
          </DoeBuildIcon>
          Back to applications
        </button>
        <div className="admin-mobile-surface admin-mobile-detail min-h-0 flex-1 overflow-hidden">
          <ApplicationDetail application={selected} variant="mobile" />
        </div>
      </div>
    );
  }

  const statCards = (
    <>
      <div className={variant === "mobile" ? "admin-mobile-stat-card admin-mobile-surface" : "admin-stat-card"}>
        <p className={variant === "mobile" ? "admin-mobile-stat-card__label" : "admin-stat-card__label"}>
          Total applications
        </p>
        <p className={variant === "mobile" ? "admin-mobile-stat-card__value" : "admin-stat-card__value"}>
          {stats.total}
        </p>
      </div>
      <div className={variant === "mobile" ? "admin-mobile-stat-card admin-mobile-surface" : "admin-stat-card"}>
        <p className={variant === "mobile" ? "admin-mobile-stat-card__label" : "admin-stat-card__label"}>
          United States
        </p>
        <p className={variant === "mobile" ? "admin-mobile-stat-card__value" : "admin-stat-card__value"}>
          {stats.unitedStates}
        </p>
      </div>
      <div className={variant === "mobile" ? "admin-mobile-stat-card admin-mobile-surface" : "admin-stat-card"}>
        <p className={variant === "mobile" ? "admin-mobile-stat-card__label" : "admin-stat-card__label"}>Canada</p>
        <p className={variant === "mobile" ? "admin-mobile-stat-card__value" : "admin-stat-card__value"}>
          {stats.canada}
        </p>
      </div>
      <div className={variant === "mobile" ? "admin-mobile-stat-card admin-mobile-surface" : "admin-stat-card"}>
        <p className={variant === "mobile" ? "admin-mobile-stat-card__label" : "admin-stat-card__label"}>
          With statements
        </p>
        <p className={variant === "mobile" ? "admin-mobile-stat-card__value" : "admin-stat-card__value"}>
          {stats.withStatements}
        </p>
      </div>
    </>
  );

  return (
    <div className="product-landing-panel flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {variant === "desktop" ? (
        <div className="product-landing-console-shell shrink-0">
          <header className="product-landing-header flex shrink-0 items-center gap-2 py-3">
            <h1 className={`admin-panel-title m-0 ${lora.className}`}>Campus ambassador program</h1>
            <div className="ml-auto">
              <button type="button" onClick={onRefresh} disabled={loading} className="admin-panel-button">
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </header>
        </div>
      ) : (
        <header className={`product-landing-header product-mobile-page-header__bar flex items-center px-0 py-0 ${suisseIntl.className}`}>
          <h1 className="product-landing-header__title product-landing-header__trail product-mobile-page-header__trail m-0 min-w-0 font-normal tracking-tight">
            <span className="product-landing-header__crumb product-landing-header__crumb--current admin-mobile-section-title">
              Campus ambassador program
            </span>
          </h1>
        </header>
      )}

      <div className={variant === "mobile" ? "admin-mobile-stat-grid" : "grid grid-cols-4 gap-3 border-b border-[rgba(245,230,208,0.08)] px-[clamp(1.35rem,2vw,2rem)] py-4"}>
        {statCards}
      </div>

      <div className={variant === "mobile" ? "mt-4 flex flex-col gap-4" : "flex flex-col gap-3 border-b border-[rgba(245,230,208,0.08)] px-[clamp(1.35rem,2vw,2rem)] py-4"}>
        {variant === "mobile" ? (
          <>
            <label className="admin-mobile-search">
              <DoeBuildIcon className="h-5 w-5 shrink-0 text-[rgba(245,230,208,0.48)]">
                <>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35" />
                </>
              </DoeBuildIcon>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, email, school, programs…"
              />
              <span className="admin-search-bar__count">{filtered.length}</span>
            </label>
            <div className="admin-mobile-group-select">
              <label htmlFor="admin-mobile-group-by">Group by</label>
              <select
                id="admin-mobile-group-by"
                value={groupMode}
                onChange={(event) => setGroupMode(event.target.value as CampusAmbassadorGroupMode)}
              >
                {CAMPUS_AMBASSADOR_GROUP_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="admin-search-bar min-w-0 flex-1">
              <DoeBuildIcon className="h-4 w-4 shrink-0 text-[rgba(245,230,208,0.48)]">
                <>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35" />
                </>
              </DoeBuildIcon>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, email, school, programs…"
              />
              <span className="admin-search-bar__count">{filtered.length}</span>
            </div>
            <div className="admin-group-select min-w-[220px]">
              <label htmlFor="admin-desktop-group-by">Group by</label>
              <select
                id="admin-desktop-group-by"
                value={groupMode}
                onChange={(event) => setGroupMode(event.target.value as CampusAmbassadorGroupMode)}
              >
                {CAMPUS_AMBASSADOR_GROUP_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {error ? (
          <p className={variant === "mobile" ? "admin-mobile-error-text" : "admin-error-text"}>{error}</p>
        ) : null}
      </div>

      {variant === "mobile" ? (
        <div className="admin-mobile-surface mt-4 min-h-0 flex-1 overflow-y-auto">{listContent}</div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          <div className="min-h-0 overflow-y-auto border-r border-[rgba(245,230,208,0.08)]">{listContent}</div>
          <div className="min-h-0 bg-transparent">
            {selected ? (
              <ApplicationDetail application={selected} variant="desktop" />
            ) : (
              <div className="admin-empty-state">Select an application to view the full submission.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { AdminProductStatStrip } from "@/components/admin/admin-product-stats";
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
import { dmSans, suisseIntl } from "@/lib/home/fonts";

type PanelVariant = "mobile" | "desktop";

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="product-inbox-message product-inbox-message--latest">
      <div className="product-inbox-message__rail" aria-hidden>
        <span className="product-inbox-message__node" />
      </div>
      <div className="product-inbox-message__content">
        <p className="product-inbox-message__affiliation">{label}</p>
        <div className={`product-inbox-message__body ${dmSans.className}`}>{value}</div>
      </div>
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
        <span key={program} className="product-inbox-masthead__category product-inbox-masthead__category--active">
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
        <span key={statement} className="product-inbox-masthead__category">
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

  if (variant === "mobile") {
    return (
      <div className="admin-mobile-detail min-h-0 flex-1 overflow-hidden">
        <header className="admin-mobile-detail__header">
          <p className="admin-mobile-detail__eyebrow">Campus ambassador application</p>
          <h2 className={`admin-mobile-detail__title ${dmSans.className}`}>{application.full_name}</h2>
          <p className="admin-mobile-list-item__meta">Submitted {formatAdminDate(application.created_at)}</p>
        </header>
        <div className="admin-mobile-detail__body">
          <DetailRow label="Email" value={application.email} />
          <DetailRow label="Country" value={formatCampusAmbassadorCountry(application.country)} />
          <DetailRow label="State or province" value={application.state_or_province} />
          <DetailRow
            label="School level"
            value={
              application.school_level === "other"
                ? application.school_level_other || "Other"
                : formatCampusAmbassadorSchoolLevel(application.school_level)
            }
          />
          <DetailRow label="Year of study" value={yearOfStudy} />
          <DetailRow label="Field of study" value={application.field_of_study} />
          <DetailRow label="Health programs" value={programChips} />
          {application.health_program_other ? (
            <DetailRow label="Other health program" value={application.health_program_other} />
          ) : null}
          <DetailRow label="Statements" value={statementChips} />
          <DetailRow
            label="LinkedIn"
            value={
              <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer" className="admin-link">
                {application.linkedin_url.replace(/^https?:\/\//, "")}
              </a>
            }
          />
          <DetailRow label="Application ID" value={<span className="font-mono text-[0.78rem]">{application.id}</span>} />
        </div>
      </div>
    );
  }

  return (
    <div className="product-inbox-reading">
      <header className="product-inbox-reading__header">
        <p className="product-inbox-reading__kind">Campus ambassador application</p>
        <h2 className={`product-inbox-reading__subject admin-reading-title ${dmSans.className}`}>
          {application.full_name}
        </h2>
        <div className={`product-inbox-reading__stats ${suisseIntl.className}`}>
          <div className="product-inbox-reading__stat">
            <span>Submitted</span>
            <strong className={dmSans.className}>{formatAdminDate(application.created_at)}</strong>
          </div>
          <div className="product-inbox-reading__stat">
            <span>Country</span>
            <strong className={dmSans.className}>{formatCampusAmbassadorCountry(application.country)}</strong>
          </div>
          <div className="product-inbox-reading__stat">
            <span>Programs</span>
            <strong className={dmSans.className}>{application.health_programs.length}</strong>
          </div>
        </div>
      </header>
      <div className="product-inbox-reading__scroll">
        <div className="product-inbox-correspondence">
          <DetailRow label="Email" value={application.email} />
          <DetailRow label="State or province" value={application.state_or_province} />
          <DetailRow
            label="School level"
            value={
              application.school_level === "other"
                ? application.school_level_other || "Other"
                : formatCampusAmbassadorSchoolLevel(application.school_level)
            }
          />
          <DetailRow label="Year of study" value={yearOfStudy} />
          <DetailRow label="Field of study" value={application.field_of_study} />
          <DetailRow label="Health programs" value={programChips} />
          {application.health_program_other ? (
            <DetailRow label="Other health program" value={application.health_program_other} />
          ) : null}
          <DetailRow label="Statements" value={statementChips} />
          <DetailRow
            label="LinkedIn"
            value={
              <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer" className="admin-link">
                {application.linkedin_url.replace(/^https?:\/\//, "")}
              </a>
            }
          />
          <DetailRow label="Application ID" value={<span className="font-mono text-[0.78rem]">{application.id}</span>} />
        </div>
      </div>
    </div>
  );
}

function ApplicationThreadRow({
  application,
  selected,
  onSelect,
}: {
  application: AdminCampusAmbassadorApplication;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`product-inbox-thread${selected ? " product-inbox-thread--active" : ""}`}
    >
      <div className="product-inbox-thread__head">
        <p className="product-inbox-thread__from">{application.full_name}</p>
        <span className="product-inbox-thread__meta">{formatAdminDate(application.created_at)}</span>
      </div>
      <p className="product-inbox-thread__subject">{application.field_of_study}</p>
      <div className="product-inbox-thread__foot">
        <span className="product-inbox-thread__kind">
          {formatCampusAmbassadorCountry(application.country)}
        </span>
      </div>
      <p className="product-inbox-thread__preview">
        {application.email} · {application.health_programs.map(formatCampusAmbassadorHealthProgram).join(", ")}
      </p>
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

  const statItems = [
    { label: "Total", value: stats.total },
    { label: "United States", value: stats.unitedStates },
    { label: "Canada", value: stats.canada },
    { label: "With statements", value: stats.withStatements },
  ];

  const listContent =
    visibleApplications.length === 0 ? (
      <div className="product-inbox-index__empty">
        <p className="product-inbox-index__empty-title">No applications yet</p>
        <p className="product-inbox-index__empty-body">Campus ambassador submissions will appear here.</p>
      </div>
    ) : groupMode === "none" ? (
      filtered.map((application) => (
        <ApplicationThreadRow
          key={application.id}
          application={application}
          selected={selected?.id === application.id}
          onSelect={() => handleSelect(application.id)}
        />
      ))
    ) : (
      groups.map((group) => (
        <div key={group.key}>
          <p className="product-inbox-index__pinned-label">{group.label}</p>
          {group.applications.map((application) => (
            <ApplicationThreadRow
              key={`${group.key}-${application.id}`}
              application={application}
              selected={selected?.id === application.id}
              onSelect={() => handleSelect(application.id)}
            />
          ))}
        </div>
      ))
    );

  if (variant === "mobile" && mobileDetailOpen && selected) {
    return (
      <div className={`product-mobile-inbox product-mobile-inbox--detail flex h-full min-h-0 flex-col ${suisseIntl.className}`}>
        <button type="button" onClick={() => setMobileDetailOpen(false)} className="admin-mobile-back-btn">
          <DoeBuildIcon className="h-5 w-5">
            <path d="m15 18-6-6 6-6" />
          </DoeBuildIcon>
          Back to applications
        </button>
        <div className="admin-mobile-surface mt-4 min-h-0 flex-1 overflow-hidden">
          <ApplicationDetail application={selected} variant="mobile" />
        </div>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={`product-mobile-inbox product-mobile-panel flex h-full min-h-0 flex-col ${suisseIntl.className}`}>
        <div className="product-mobile-inbox__masthead">
          <p className="product-mobile-inbox__eyebrow">Admin</p>
          <h2 className={`product-mobile-inbox__heading ${dmSans.className}`}>Campus Ambassador Program</h2>
        </div>
        <AdminProductStatStrip variant="mobile" items={statItems} />
        <label className="admin-mobile-search mx-4 mt-4">
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
            placeholder="Search applications…"
          />
        </label>
        <div className="product-mobile-inbox__categories px-4 pt-3">
          {CAMPUS_AMBASSADOR_GROUP_MODE_OPTIONS.slice(0, 4).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGroupMode(option.value)}
              className={`product-mobile-inbox__category${groupMode === option.value ? " product-mobile-inbox__category--active" : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {error ? <p className="admin-mobile-error-text px-4 pt-3">{error}</p> : null}
        <div className="admin-mobile-surface mx-4 mt-4 min-h-0 flex-1 overflow-y-auto">{listContent}</div>
      </div>
    );
  }

  return (
    <div className="product-inbox-panel product-inbox-panel--editorial product-landing-panel flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="product-landing-console-shell shrink-0">
        <header className={`product-landing-header flex items-center gap-2 ${suisseIntl.className}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="product-landing-header__icon shrink-0"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <h1 className="product-landing-header__title m-0 font-normal tracking-tight">Admin</h1>
          <div className="ml-auto">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="product-call-history-rail__action-btn"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>
      </div>

      <div className={`product-inbox-masthead ${suisseIntl.className}`}>
        <div className="product-inbox-masthead__grid">
          <div className="product-inbox-masthead__hero">
            <h2 className={`product-inbox-masthead__desk ${dmSans.className}`}>Campus Ambassador Program</h2>
            <p className={`product-inbox-masthead__agent ${dmSans.className}`}>
              {stats.total} submission{stats.total === 1 ? "" : "s"} · program intake
            </p>
          </div>
        </div>
        <div className="px-[var(--pi-stage-pad-x,clamp(1.35rem,2vw,2rem))] pb-4">
          <AdminProductStatStrip variant="desktop" items={statItems} />
        </div>
        <div className="product-inbox-masthead__categories" aria-label="Group applications">
          {CAMPUS_AMBASSADOR_GROUP_MODE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGroupMode(option.value)}
              className={`product-inbox-masthead__category${groupMode === option.value ? " product-inbox-masthead__category--active" : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="product-landing-panel__divider" role="separator" aria-hidden />

      <div className="product-inbox-stage min-h-0 flex-1">
        <aside className="product-inbox-index">
          <div className="product-inbox-index__head">
            <p className="product-inbox-index__label">
              Submissions
              <span className="product-inbox-index__count">{filtered.length}</span>
            </p>
          </div>
          <label className="admin-inbox-search mx-[var(--pi-stage-pad-x,clamp(1.35rem,2vw,2rem))] mb-3 flex items-center gap-2">
            <DoeBuildIcon className="h-4 w-4 shrink-0 opacity-50">
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
          </label>
          {error ? <p className="admin-error-text px-[var(--pi-stage-pad-x,clamp(1.35rem,2vw,2rem))] pb-2">{error}</p> : null}
          <div className="product-inbox-index__list">{listContent}</div>
        </aside>

        {selected ? (
          <ApplicationDetail application={selected} variant="desktop" />
        ) : (
          <div className="product-inbox-reading">
            <div className="product-inbox-index__empty">
              <p className="product-inbox-index__empty-title">Select an application</p>
              <p className="product-inbox-index__empty-body">Choose a submission from the list to review details.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

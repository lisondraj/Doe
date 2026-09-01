"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

import { DoeDtcNav } from "@/components/doedtc/DoeDtcNav";
import { DoeDtcDobMenu } from "@/components/doedtc/DoeDtcDobMenu";
import { DoeDtcDropdown } from "@/components/doedtc/DoeDtcDropdown";
import { DoeDtcArtifactView } from "@/components/doedtc/DoeDtcArtifactView";
import { DoeDtcTrackerCarousel } from "@/components/doedtc/DoeDtcTrackerCarousel";
import { DoeDtcTrackerChart } from "@/components/doedtc/DoeDtcTrackerChart";
import { DoeDtcFeedbackView } from "@/components/doedtc/DoeDtcFeedbackView";
import { DoeDtcGuideView } from "@/components/doedtc/DoeDtcGuideView";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import {
  DOEDTC_GET_STARTED,
  DOEDTC_PROFILE,
  doeDtcAppUrl,
} from "@/lib/doedtc/doedtc-copy";
import { applyDoeDtcPreviewAction } from "@/lib/doedtc/doedtc-preview-snapshot";
import {
  buildArtifactSeriesPoints,
  formatPrimaryArtifactReading,
  pickPrimarySeriesField,
} from "@/lib/doedtc/doedtc-artifacts";
import { formatPhoneForDisplay } from "@/lib/doedtc/doedtc-phone";
import { memberCurrentlySharesWithHousehold } from "@/lib/doedtc/doedtc-household";
import type {
  DoeDtcAppointmentRow,
  DoeDtcFamilyRelationship,
  DoeDtcGender,
  DoeDtcGuideRow,
  DoeDtcHealthProvider,
  DoeDtcHouseholdMemberRow,
  DoeDtcListenSessionRow,
  DoeDtcProfileSnapshot,
  DoeDtcProfileTab,
  DoeDtcResultKind,
} from "@/lib/doedtc/doedtc-types";
import { DOEDTC_GENDERS } from "@/lib/doedtc/doedtc-types";
import { doeDtcVisibleProfileTab } from "@/lib/doedtc/doedtc-profile-tabs";
import { interlockSpans, symptomsLinkedToName } from "@/lib/doedtc/doedtc-conditions-view";
import {
  groupLabsByCategory,
  partitionResults,
  type DoeDtcLabCategory,
  type DoeDtcResultView,
} from "@/lib/doedtc/doedtc-results-view";
import { dmSans, plusJakartaSans } from "@/lib/home/fonts";

const RELATIONSHIP_OPTIONS: Array<{ value: DoeDtcFamilyRelationship; label: string }> = [
  { value: "grandmother", label: "Grandmother" },
  { value: "grandfather", label: "Grandfather" },
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "partner", label: "Partner" },
  { value: "other", label: "Other" },
];

function formatDateTime(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDate(value: string): string {
  try {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return value;
  }
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function relationshipLabel(value: string): string {
  return RELATIONSHIP_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function memberInitial(name: string): string {
  const trimmed = name.trim();
  return trimmed ? trimmed.slice(0, 1).toUpperCase() : "?";
}

function memberChartList(member: Pick<DoeDtcHouseholdMemberRow, "medications" | "conditions">): string[] {
  return [...(member.medications ?? []), ...(member.conditions ?? [])];
}

function memberFirstName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "—";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function sortHouseholdByDob(a: DoeDtcHouseholdMemberRow, b: DoeDtcHouseholdMemberRow): number {
  if (a.date_of_birth && b.date_of_birth) return a.date_of_birth.localeCompare(b.date_of_birth);
  if (a.date_of_birth) return -1;
  if (b.date_of_birth) return 1;
  return a.full_name.localeCompare(b.full_name);
}

type FamilyTreeNode = {
  member: DoeDtcHouseholdMemberRow;
  you: boolean;
};

function familyTreeRows(
  members: DoeDtcHouseholdMemberRow[],
  viewerMemberId: string | null,
): FamilyTreeNode[][] {
  const admin = members.find((row) => row.role === "admin") ?? members[0];
  if (!admin) return [];
  const rest = members.filter((row) => row.id !== admin.id);
  const pick = (relationship: DoeDtcFamilyRelationship) =>
    rest.filter((row) => row.relationship === relationship);
  const rows: FamilyTreeNode[][] = [];
  const mark = (member: DoeDtcHouseholdMemberRow): FamilyTreeNode => ({
    member,
    you: member.id === viewerMemberId,
  });

  const grandparents = [...pick("grandmother"), ...pick("grandfather")];
  const parents = [...pick("mother"), ...pick("father")];
  const siblings = pick("sibling").slice().sort(sortHouseholdByDob);
  const partners = pick("partner");
  const children = pick("child").slice().sort(sortHouseholdByDob);
  const others = pick("other");

  if (grandparents.length) rows.push(grandparents.map(mark));
  if (parents.length) rows.push(parents.map(mark));
  rows.push([...siblings.map(mark), mark(admin), ...partners.map(mark)]);
  if (children.length) rows.push(children.map(mark));
  if (others.length) rows.push(others.map(mark));
  return rows;
}

function FamilyTreeCard({
  members,
  viewerMemberId,
}: {
  members: DoeDtcHouseholdMemberRow[];
  viewerMemberId: string | null;
}) {
  const rows = familyTreeRows(members, viewerMemberId);
  if (rows.length === 0) return null;

  return (
    <section className="doedtc-family-tree" aria-label={DOEDTC_PROFILE.familyTreeLabel}>
      {rows.map((row, index) => (
        <div className="doedtc-family-tree__generation" key={row.map((node) => node.member.id).join("-")}>
          {index > 0 ? (
            <div className="doedtc-family-tree__connector" aria-hidden>
              <span className="doedtc-family-tree__stem" />
            </div>
          ) : null}
          <div
            className={`doedtc-family-tree__row${index > 0 && row.length > 1 ? " doedtc-family-tree__row--branch" : ""}`}
            style={
              index > 0 && row.length > 1
                ? ({ "--tree-bar": `${Math.min(82, 22 + row.length * 12)}%` } as CSSProperties)
                : undefined
            }
          >
            {row.map((node) => (
              <a
                className={`doedtc-family-tree__node${node.you ? " doedtc-family-tree__node--you" : ""}${
                  node.member.status !== "active" && !node.you ? " doedtc-family-tree__node--pending" : ""
                }`}
                href={`#family-member-${node.member.id}`}
                key={node.member.id}
              >
                <span className="doedtc-family-tree__dot">{memberInitial(node.member.full_name)}</span>
                <span className={`doedtc-family-tree__label ${plusJakartaSans.className}`}>
                  {node.you ? DOEDTC_PROFILE.familyYouBadge : memberFirstName(node.member.full_name)}
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function FamilyCardMenu({
  canView,
  viewHref,
  canInvite,
  canRemove,
  inviting,
  busy,
  onInvite,
  onRemove,
}: {
  canView: boolean;
  viewHref: string | null;
  canInvite: boolean;
  canRemove: boolean;
  inviting: boolean;
  busy: boolean;
  onInvite: () => void;
  onRemove: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setConfirmRemove(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setConfirmRemove(false);
      }
    }
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!canView && !canInvite && !canRemove) return null;

  return (
    <div className={`doedtc-family-card__menu${open ? " doedtc-family-card__menu--open" : ""}`} ref={rootRef}>
      <button
        className="doedtc-family-card__more"
        type="button"
        aria-label={DOEDTC_PROFILE.familyMoreLabel}
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => !value);
          setConfirmRemove(false);
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <circle cx="9" cy="4.25" r="1.35" fill="currentColor" />
          <circle cx="9" cy="9" r="1.35" fill="currentColor" />
          <circle cx="9" cy="13.75" r="1.35" fill="currentColor" />
        </svg>
      </button>
      {open ? (
        <div className="doedtc-family-card__panel" role="menu">
          {confirmRemove ? (
            <>
              <p className="doedtc-family-card__panel-copy">{DOEDTC_PROFILE.familyRemoveConfirm}</p>
              <button
                className="doedtc-family-card__panel-item doedtc-family-card__panel-item--danger"
                type="button"
                role="menuitem"
                disabled={busy}
                onClick={() => {
                  setOpen(false);
                  setConfirmRemove(false);
                  onRemove();
                }}
              >
                {DOEDTC_PROFILE.removeLabel}
              </button>
              <button
                className="doedtc-family-card__panel-item"
                type="button"
                role="menuitem"
                onClick={() => setConfirmRemove(false)}
              >
                {DOEDTC_PROFILE.familyAddCancel}
              </button>
            </>
          ) : (
            <>
              {canView && viewHref ? (
                <a className="doedtc-family-card__panel-item" href={viewHref} role="menuitem">
                  {DOEDTC_PROFILE.familyViewProfileLabel}
                </a>
              ) : null}
              {canInvite ? (
                <button
                  className="doedtc-family-card__panel-item"
                  type="button"
                  role="menuitem"
                  disabled={busy || inviting}
                  onClick={() => {
                    setOpen(false);
                    onInvite();
                  }}
                >
                  {inviting ? DOEDTC_PROFILE.familyInvitingLabel : DOEDTC_PROFILE.familyInviteLabel}
                </button>
              ) : null}
              {canRemove ? (
                <button
                  className="doedtc-family-card__panel-item doedtc-family-card__panel-item--danger"
                  type="button"
                  role="menuitem"
                  disabled={busy}
                  onClick={() => setConfirmRemove(true)}
                >
                  {DOEDTC_PROFILE.removeLabel}
                </button>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ChipField({
  id,
  label,
  placeholder,
  values,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function addValue() {
    const next = draft.trim();
    if (!next || values.some((value) => value.toLowerCase() === next.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...values, next]);
    setDraft("");
  }

  return (
    <div>
      <label className="doedtc-label" htmlFor={id}>
        {label}
      </label>
      <div className="doedtc-add-row">
        <input
          id={id}
          className="doedtc-input"
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addValue();
            }
          }}
        />
        <button className="doedtc-button doedtc-button--secondary doedtc-button--inline" type="button" onClick={addValue}>
          Add
        </button>
      </div>
      {values.length > 0 ? (
        <div className="doedtc-tag-list doedtc-tag-list--compact">
          {values.map((value) => (
            <span className="doedtc-tag" key={value}>
              {value}
              <button type="button" aria-label={`Remove ${value}`} onClick={() => onChange(values.filter((item) => item !== value))}>
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function appointmentStartMs(row: DoeDtcAppointmentRow): number | null {
  if (!row.starts_at) return null;
  const value = new Date(row.starts_at).getTime();
  return Number.isNaN(value) ? null : value;
}

function isUpcomingAppointment(row: DoeDtcAppointmentRow, now = Date.now()): boolean {
  const start = appointmentStartMs(row);
  return start == null || start >= now;
}

function sortAppointments(rows: DoeDtcAppointmentRow[], upcoming: boolean): DoeDtcAppointmentRow[] {
  return [...rows].sort((a, b) => {
    const aTime = appointmentStartMs(a);
    const bTime = appointmentStartMs(b);
    if (aTime == null && bTime == null) return 0;
    if (aTime == null) return 1;
    if (bTime == null) return -1;
    return upcoming ? aTime - bTime : bTime - aTime;
  });
}

function appointmentDateParts(row: DoeDtcAppointmentRow): {
  month: string;
  day: string;
  weekday: string;
  time: string;
  whenLabel: string;
} {
  const note = row.timing_note?.trim() ?? "";
  if (note) {
    return {
      month: "Soon",
      day: "·",
      weekday: note,
      time: "",
      whenLabel: note,
    };
  }

  const start = appointmentStartMs(row);
  if (start == null) {
    return {
      month: "TBD",
      day: "—",
      weekday: DOEDTC_PROFILE.appointmentWhenUnset,
      time: "",
      whenLabel: DOEDTC_PROFILE.appointmentWhenUnset,
    };
  }

  const date = new Date(start);
  const month = new Intl.DateTimeFormat(undefined, { month: "short" }).format(date);
  const day = String(date.getDate());
  const weekday = new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date);
  const time = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
  return {
    month,
    day,
    weekday,
    time,
    whenLabel: `${weekday} · ${time}`,
  };
}

function labCategoryLabel(category: DoeDtcLabCategory): string {
  switch (category) {
    case "general":
      return DOEDTC_PROFILE.resultsCategoryGeneral;
    case "metabolic":
      return DOEDTC_PROFILE.resultsCategoryMetabolic;
    case "kidney":
      return DOEDTC_PROFILE.resultsCategoryKidney;
    case "liver":
      return DOEDTC_PROFILE.resultsCategoryLiver;
    case "lipids":
      return DOEDTC_PROFILE.resultsCategoryLipids;
    case "thyroid":
      return DOEDTC_PROFILE.resultsCategoryThyroid;
    case "inflammation":
      return DOEDTC_PROFILE.resultsCategoryInflammation;
    default:
      return DOEDTC_PROFILE.resultsCategoryOther;
  }
}

function healthStatus(
  snapshot: DoeDtcProfileSnapshot,
  provider: DoeDtcHealthProvider,
): "disconnected" | "pending" | "connected" {
  return snapshot.healthConnections.find((row) => row.provider === provider)?.status ?? "disconnected";
}

type DoeDtcProfileAppProps = {
  token: string;
  valid: boolean;
  initialSnapshot: DoeDtcProfileSnapshot | null;
  initialTab: DoeDtcProfileTab;
  initialArtifactId?: string | null;
  initialTicketId?: string | null;
  initialGuideId?: string | null;
  viewingMemberUserId?: string | null;
  preview?: boolean;
  homeHref?: string;
};

export function DoeDtcProfileApp({
  token,
  valid,
  initialSnapshot,
  initialTab,
  initialArtifactId = null,
  initialTicketId = null,
  initialGuideId = null,
  viewingMemberUserId = null,
  preview = false,
  homeHref,
}: DoeDtcProfileAppProps) {
  const [tab, setTab] = useState<DoeDtcProfileTab>(() => doeDtcVisibleProfileTab(initialTab));
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [focusedArtifactId, setFocusedArtifactId] = useState<string | null>(initialArtifactId);
  const [focusedTicketId, setFocusedTicketId] = useState<string | null>(initialTicketId);
  const [focusedGuideId, setFocusedGuideId] = useState<string | null>(initialGuideId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const runAction = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      setBusy(true);
      setError("");
      try {
        if (preview) {
          setSnapshot((current) => (current ? applyDoeDtcPreviewAction(current, action, payload) : current));
          return;
        }
        const response = await fetch("/api/doedtc/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            action,
            payload: viewingMemberUserId
              ? { ...payload, subjectUserId: viewingMemberUserId }
              : payload,
          }),
        });
        const json = (await response.json()) as {
          ok?: boolean;
          error?: string;
          snapshot?: DoeDtcProfileSnapshot;
        };
        if (!response.ok || !json.ok || !json.snapshot) {
          throw new Error(json.error ?? "Unable to update profile.");
        }
        setSnapshot(json.snapshot);
      } catch (actionError) {
        setError(actionError instanceof Error ? actionError.message : "Unable to update profile.");
      } finally {
        setBusy(false);
      }
    },
    [preview, token, viewingMemberUserId],
  );

  const refetchSnapshot = useCallback(async () => {
    if (preview || !valid) return;
    try {
      const params = new URLSearchParams({ t: token });
      if (viewingMemberUserId) params.set("member", viewingMemberUserId);
      const response = await fetch(`/api/doedtc/profile?${params.toString()}`, {
        cache: "no-store",
      });
      const json = (await response.json()) as {
        ok?: boolean;
        snapshot?: DoeDtcProfileSnapshot;
      };
      if (response.ok && json.ok && json.snapshot) {
        setSnapshot(json.snapshot);
      }
    } catch {
      // Ignore background refresh failures.
    }
  }, [preview, token, valid, viewingMemberUserId]);

  useEffect(() => {
    void refetchSnapshot();

    function onVisibility() {
      if (document.visibilityState === "visible") void refetchSnapshot();
    }

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [refetchSnapshot]);

  useEffect(() => {
    if (initialArtifactId) {
      setFocusedArtifactId(initialArtifactId);
    }
  }, [initialArtifactId]);

  useEffect(() => {
    if (initialTicketId) {
      setFocusedTicketId(initialTicketId);
    }
  }, [initialTicketId]);

  useEffect(() => {
    if (initialGuideId) {
      setFocusedGuideId(initialGuideId);
    }
  }, [initialGuideId]);

  useEffect(() => {
    void refetchSnapshot();
  }, [tab, refetchSnapshot]);

  const greeting = useMemo(() => {
    const name = snapshot?.user.full_name?.trim();
    if (viewingMemberUserId && name) return `${name}'s profile`;
    return name || "Your profile";
  }, [snapshot, viewingMemberUserId]);

  const profilePhone = snapshot?.user.phone?.trim() || null;
  const profilePhoneDisplay = profilePhone ? formatPhoneForDisplay(profilePhone) : null;

  const canEditSubject = useMemo(() => {
    if (!viewingMemberUserId || !snapshot) return true;
    return snapshot.household.memberAccess.some(
      (row) => row.userId === viewingMemberUserId && row.canEdit,
    );
  }, [snapshot, viewingMemberUserId]);

  if (!valid || !snapshot) {
    return (
      <DoeDtcPageShell profile>
        <div className="doedtc-card">
          <strong>{DOEDTC_PROFILE.invalidTokenTitle}</strong>
          <p>{DOEDTC_PROFILE.invalidTokenBody}</p>
        </div>
      </DoeDtcPageShell>
    );
  }

  return (
    <DoeDtcPageShell profile>
      <DoeDtcNav
        token={token}
        activeTab={tab}
        onTabChange={setTab}
        displayName={snapshot.user.full_name}
        subtitle={snapshot.user.email}
        homeHref={homeHref}
        onBack={
          tab === "guides" && focusedGuideId
            ? () => setFocusedGuideId(null)
            : tab === "trackers" && focusedArtifactId
              ? () => setFocusedArtifactId(null)
              : undefined
        }
        backLabel={tab === "trackers" ? DOEDTC_PROFILE.trackersBackLabel : DOEDTC_PROFILE.guidesBackLabel}
        pageTitle={
          tab === "trackers" && focusedArtifactId
            ? snapshot.artifacts.find((artifact) => artifact.id === focusedArtifactId)?.title
            : undefined
        }
      >
        {tab === "dashboard" ? (
          <header className="doedtc-header">
            <div className="doedtc-profile-name-box">
              <div className="doedtc-profile-name-box__content">
                <h1 className={`doedtc-headline doedtc-profile-name-box__title ${plusJakartaSans.className}`}>{greeting}</h1>
                {profilePhoneDisplay ? (
                  <a className="doedtc-profile-phone-banner" href={`tel:${profilePhone}`}>
                    <span className="doedtc-profile-phone-banner__number">{profilePhoneDisplay}</span>
                  </a>
                ) : null}
              </div>
            </div>
            {viewingMemberUserId ? (
              <p className="doedtc-muted" style={{ marginTop: "0.35rem" }}>
                {canEditSubject ? null : `${DOEDTC_PROFILE.familyReadOnlyHint} `}
                <a href={homeHref ?? doeDtcAppUrl(token, { tab: "family" })}>{DOEDTC_PROFILE.familyBackLabel}</a>
              </p>
            ) : null}
          </header>
        ) : null}

        {error ? <p className="doedtc-error">{error}</p> : null}

      {tab === "dashboard" ? (
        <DashboardTab
          snapshot={snapshot}
          busy={busy}
          readOnly={!canEditSubject}
          onAction={runAction}
          onOpenTrackers={(artifactId) => {
            setFocusedArtifactId(artifactId ?? null);
            setTab("trackers");
          }}
        />
      ) : null}
      {tab === "appointments" ? (
        <AppointmentsTab snapshot={snapshot} busy={busy} readOnly={!canEditSubject} onAction={runAction} />
      ) : null}
      {tab === "results" ? (
        <ResultsTab snapshot={snapshot} busy={busy} readOnly={!canEditSubject} onAction={runAction} />
      ) : null}
      {tab === "conditions" ? (
        <ConditionsTab snapshot={snapshot} busy={busy} readOnly={!canEditSubject} onAction={runAction} />
      ) : null}
      {tab === "family" ? (
        <FamilyTab token={token} snapshot={snapshot} busy={busy} onAction={runAction} preview={preview} />
      ) : null}
      {tab === "locker" ? (
        <LockerTab snapshot={snapshot} busy={busy} readOnly={!canEditSubject} onAction={runAction} />
      ) : null}
      {tab === "trackers" ? (
        <TrackersTab
          snapshot={snapshot}
          busy={busy}
          readOnly={!canEditSubject}
          onAction={runAction}
          focusedArtifactId={focusedArtifactId}
          onFocusArtifact={setFocusedArtifactId}
        />
      ) : null}
      {tab === "guides" ? (
        <GuidesTab
          snapshot={snapshot}
          busy={busy}
          onAction={runAction}
          focusedGuideId={focusedGuideId}
          onFocusGuide={setFocusedGuideId}
        />
      ) : null}
      {tab === "feedback" ? (
        <FeedbackTab
          snapshot={snapshot}
          busy={busy}
          readOnly={!canEditSubject}
          onAction={runAction}
          focusedTicketId={focusedTicketId}
          onFocusTicket={setFocusedTicketId}
        />
      ) : null}
      </DoeDtcNav>
    </DoeDtcPageShell>
  );
}

type TabProps = {
  snapshot: DoeDtcProfileSnapshot;
  busy: boolean;
  readOnly?: boolean;
  onAction: (action: string, payload?: Record<string, unknown>) => Promise<void>;
};

function MedicalListEditor({
  label,
  placeholder,
  values,
  addAction,
  removeAction,
  busy,
  readOnly = false,
  onAction,
}: {
  label: string;
  placeholder: string;
  values: string[];
  addAction: string;
  removeAction: string;
  busy: boolean;
  readOnly?: boolean;
  onAction: (action: string, payload?: Record<string, unknown>) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");

  async function addValue() {
    const next = draft.trim();
    if (!next || values.some((value) => value.toLowerCase() === next.toLowerCase())) {
      setDraft("");
      return;
    }
    await onAction(addAction, { name: next });
    setDraft("");
  }

  return (
    <div className="doedtc-medical-box">
      <p className="doedtc-medical-box__title">{label}</p>
      {values.length === 0 ? (
        <p className="doedtc-medical-box__empty">{placeholder}</p>
      ) : (
        <div className="doedtc-tag-list">
          {values.map((value) => (
            <span className="doedtc-tag" key={value.toLowerCase()}>
              {value}
              {readOnly ? null : (
                <button
                  type="button"
                  aria-label={`Remove ${value}`}
                  disabled={busy}
                  onClick={() => onAction(removeAction, { name: value })}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      {readOnly ? null : (
        <div className="doedtc-add-row doedtc-medical-box__add">
          <input
            className="doedtc-input"
            value={draft}
            placeholder={placeholder}
            disabled={busy}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void addValue();
              }
            }}
          />
          <button
            className="doedtc-button doedtc-button--secondary doedtc-button--inline"
            type="button"
            disabled={busy}
            onClick={() => void addValue()}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function DashboardTab({
  snapshot,
  busy,
  readOnly = false,
  onAction,
  onOpenTrackers,
}: TabProps & {
  onOpenTrackers: (artifactId?: string | null) => void;
}) {
  const trackerCards = snapshot.artifacts.map((artifact) => {
    const lastEntry = snapshot.artifactEntries
      .filter((entry) => entry.artifact_id === artifact.id)
      .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at))[0];
    return { artifact, lastEntry };
  });

  return (
    <div>
      <div className="doedtc-medical-grid">
        <div className="doedtc-card doedtc-card--flat">
          <MedicalListEditor
            label={DOEDTC_GET_STARTED.medicationsLabel}
            placeholder={DOEDTC_GET_STARTED.medicationsPlaceholder}
            values={snapshot.medications}
            addAction="add_medication"
            removeAction="remove_medication"
            busy={busy}
            readOnly={readOnly}
            onAction={onAction}
          />
        </div>
        <div className="doedtc-card doedtc-card--flat">
          <MedicalListEditor
            label={DOEDTC_GET_STARTED.conditionsLabel}
            placeholder={DOEDTC_GET_STARTED.conditionsPlaceholder}
            values={snapshot.conditions}
            addAction="add_condition"
            removeAction="remove_condition"
            busy={busy}
            readOnly={readOnly}
            onAction={onAction}
          />
        </div>
      </div>

      {trackerCards.length > 0 ? (
        <DoeDtcTrackerCarousel
          cards={trackerCards.map(({ artifact, lastEntry }) => {
            const entries = snapshot.artifactEntries.filter((entry) => entry.artifact_id === artifact.id);
            const seriesField = pickPrimarySeriesField(artifact.config.fields, entries);
            const points = seriesField
              ? buildArtifactSeriesPoints({
                  entries,
                  fieldKey: seriesField.key,
                  limit: 12,
                })
              : [];
            return {
              artifact,
              lastReading: lastEntry ? formatPrimaryArtifactReading(artifact, lastEntry.values) : null,
              points,
            };
          })}
          onOpen={onOpenTrackers}
        />
      ) : null}

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.dashboardIntegrationsLabel}</h2>
        <div className="doedtc-integration-grid">
          <IntegrationCard
            title={DOEDTC_PROFILE.whoopTitle}
            body={DOEDTC_PROFILE.whoopBody}
            status={healthStatus(snapshot, "whoop")}
            busy={busy || readOnly}
            onConnect={() => onAction("connect_health", { provider: "whoop" })}
          />
          <IntegrationCard
            title={DOEDTC_PROFILE.appleHealthTitle}
            body={DOEDTC_PROFILE.appleHealthBody}
            status={healthStatus(snapshot, "apple_health")}
            busy={busy || readOnly}
            onConnect={() => onAction("connect_health", { provider: "apple_health" })}
          />
        </div>
      </div>
    </div>
  );
}

function severityLabel(value: string): string {
  if (value === "mild") return DOEDTC_PROFILE.symptomsSeverityMild;
  if (value === "moderate") return DOEDTC_PROFILE.symptomsSeverityModerate;
  if (value === "severe") return DOEDTC_PROFILE.symptomsSeveritySevere;
  return value;
}

function calendarChip(value: string): { month: string; day: string } {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return { month: "—", day: "—" };
  return {
    month: new Intl.DateTimeFormat(undefined, { month: "short" }).format(date),
    day: String(date.getDate()),
  };
}

function NameAddForm({
  label,
  saveLabel,
  cancelLabel,
  busy,
  onSave,
  onCancel,
}: {
  label: string;
  saveLabel: string;
  cancelLabel: string;
  busy: boolean;
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const fieldId = `name-add-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <form
      className="doedtc-card doedtc-form doedtc-conditions__form"
      onSubmit={async (event) => {
        event.preventDefault();
        const next = name.trim();
        if (!next) return;
        await onSave(next);
        setName("");
      }}
    >
      <label className="doedtc-label" htmlFor={fieldId}>
        {label}
      </label>
      <input
        id={fieldId}
        className="doedtc-input"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <div className="doedtc-appointments__form-actions">
        <button className="doedtc-button" type="submit" disabled={busy || !name.trim()}>
          {saveLabel}
        </button>
        <button className="doedtc-button doedtc-button--secondary" type="button" disabled={busy} onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </form>
  );
}

function ConditionsTab({ snapshot, busy, readOnly = false, onAction }: TabProps) {
  const [addingCondition, setAddingCondition] = useState(snapshot.conditions.length === 0 && !readOnly);
  const [addingMedication, setAddingMedication] = useState(false);
  const conditionSpans = interlockSpans(snapshot.conditions.length);
  const medicationSpans = interlockSpans(snapshot.medications.length);
  const symptoms = [...snapshot.symptoms].sort((a, b) => b.reported_at.localeCompare(a.reported_at));

  return (
    <div className="doedtc-conditions">
      <section className="doedtc-conditions__group">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.conditionsTitle}</h2>
        {snapshot.conditions.length === 0 ? (
          <p className="doedtc-empty">{DOEDTC_PROFILE.conditionsEmpty}</p>
        ) : (
          <div className="doedtc-condition-grid">
            {snapshot.conditions.map((name, index) => {
              const linked = symptomsLinkedToName(name, symptoms);
              return (
                <article
                  className={`doedtc-condition-tile doedtc-condition-tile--${conditionSpans[index] ?? "single"}`}
                  key={name.toLowerCase()}
                >
                  <div className="doedtc-condition-tile__top">
                    <h3 className={`doedtc-condition-tile__name ${plusJakartaSans.className}`}>{name}</h3>
                    {readOnly ? null : (
                      <button
                        className="doedtc-icon-button"
                        type="button"
                        disabled={busy}
                        onClick={() => onAction("remove_condition", { name })}
                      >
                        {DOEDTC_PROFILE.removeLabel}
                      </button>
                    )}
                  </div>
                  {linked.length > 0 ? (
                    <p className="doedtc-condition-tile__meta">
                      {linked.length}{" "}
                      {linked.length === 1
                        ? DOEDTC_PROFILE.conditionsLinkedSymptom
                        : DOEDTC_PROFILE.conditionsLinkedSymptoms}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
        {readOnly ? null : addingCondition ? (
          <NameAddForm
            label={DOEDTC_PROFILE.conditionsNameLabel}
            saveLabel={DOEDTC_PROFILE.conditionsAddSave}
            cancelLabel={DOEDTC_PROFILE.conditionsAddCancel}
            busy={busy}
            onSave={async (name) => {
              await onAction("add_condition", { name });
              setAddingCondition(false);
            }}
            onCancel={() => setAddingCondition(false)}
          />
        ) : (
          <button
            className="doedtc-button doedtc-button--secondary doedtc-conditions__add"
            type="button"
            disabled={busy}
            onClick={() => setAddingCondition(true)}
          >
            {DOEDTC_PROFILE.conditionsAddOpen}
          </button>
        )}
      </section>

      <section className="doedtc-conditions__group">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.medicationsTitle}</h2>
        {snapshot.medications.length === 0 ? (
          <p className="doedtc-empty">{DOEDTC_PROFILE.medicationsEmpty}</p>
        ) : (
          <div className="doedtc-condition-grid">
            {snapshot.medications.map((name, index) => (
              <article
                className={`doedtc-med-tile doedtc-condition-tile--${medicationSpans[index] ?? "single"}`}
                key={name.toLowerCase()}
              >
                <div className="doedtc-condition-tile__top">
                  <h3 className={`doedtc-condition-tile__name ${plusJakartaSans.className}`}>{name}</h3>
                  {readOnly ? null : (
                    <button
                      className="doedtc-icon-button"
                      type="button"
                      disabled={busy}
                      onClick={() => onAction("remove_medication", { name })}
                    >
                      {DOEDTC_PROFILE.removeLabel}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        {readOnly ? null : addingMedication ? (
          <NameAddForm
            label={DOEDTC_PROFILE.medicationsNameLabel}
            saveLabel={DOEDTC_PROFILE.medicationsAddSave}
            cancelLabel={DOEDTC_PROFILE.medicationsAddCancel}
            busy={busy}
            onSave={async (name) => {
              await onAction("add_medication", { name });
              setAddingMedication(false);
            }}
            onCancel={() => setAddingMedication(false)}
          />
        ) : (
          <button
            className="doedtc-button doedtc-button--secondary doedtc-conditions__add"
            type="button"
            disabled={busy}
            onClick={() => setAddingMedication(true)}
          >
            {DOEDTC_PROFILE.medicationsAddOpen}
          </button>
        )}
      </section>

      <section className="doedtc-conditions__group">
        <h2 className="doedtc-section-title">{DOEDTC_PROFILE.symptomsBoxTitle}</h2>
        {symptoms.length === 0 ? (
          <p className="doedtc-empty">{DOEDTC_PROFILE.dashboardSymptomsEmpty}</p>
        ) : (
          <ul className="doedtc-visit-list">
            {symptoms.map((symptom) => {
              const chip = calendarChip(symptom.reported_at);
              const title = symptom.summary?.trim() || symptom.raw_text;
              return (
                <li className="doedtc-visit-card" key={symptom.id}>
                  <div className="doedtc-visit-card__date" aria-hidden="true">
                    <span className="doedtc-visit-card__month">{chip.month}</span>
                    <span className="doedtc-visit-card__day">{chip.day}</span>
                  </div>
                  <div className="doedtc-visit-card__body">
                    <div className="doedtc-visit-card__top">
                      <strong>{title}</strong>
                      {symptom.severity && symptom.severity !== "unknown" ? (
                        <span className={`doedtc-tag doedtc-tag--${symptom.severity}`}>
                          {severityLabel(symptom.severity)}
                        </span>
                      ) : null}
                    </div>
                    <p className="doedtc-row-item__meta">{formatDateTime(symptom.reported_at)}</p>
                    {symptom.onset ? <p className="doedtc-row-item__meta">{symptom.onset}</p> : null}
                    {symptom.assessment_id ? (
                      <span className="doedtc-tag">{DOEDTC_PROFILE.symptomsAssessedLabel}</span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function IntegrationCard({
  title,
  body,
  status,
  busy,
  onConnect,
}: {
  title: string;
  body: string;
  status: "disconnected" | "pending" | "connected";
  busy: boolean;
  onConnect: () => void;
}) {
  const statusLabel =
    status === "connected"
      ? DOEDTC_PROFILE.connectedLabel
      : status === "pending"
        ? DOEDTC_PROFILE.pendingLabel
        : DOEDTC_PROFILE.connectLabel;

  return (
    <div className="doedtc-integration-card">
      <strong>{title}</strong>
      <p className="doedtc-muted" style={{ marginTop: "0.35rem" }}>
        {body}
      </p>
      {status === "disconnected" ? (
        <button className="doedtc-button doedtc-button--secondary" type="button" disabled={busy} onClick={onConnect}>
          {statusLabel}
        </button>
      ) : (
        <p className="doedtc-eyebrow" style={{ marginTop: "0.75rem" }}>
          {statusLabel}
        </p>
      )}
    </div>
  );
}

function AppointmentsTab({ snapshot, busy, readOnly = false, onAction }: TabProps) {
  const empty = snapshot.appointments.length === 0;
  const [title, setTitle] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState(empty);
  const [expandedListenId, setExpandedListenId] = useState<string | null>(null);

  const completedSessions = snapshot.listenSessions.filter((row) => row.status === "completed");
  const sessionsByAppointment = new Map<string, DoeDtcListenSessionRow[]>();
  const standaloneSessions: DoeDtcListenSessionRow[] = [];

  for (const session of completedSessions) {
    if (session.appointment_id) {
      const list = sessionsByAppointment.get(session.appointment_id) ?? [];
      list.push(session);
      sessionsByAppointment.set(session.appointment_id, list);
    } else {
      standaloneSessions.push(session);
    }
  }

  const upcoming = sortAppointments(
    snapshot.appointments.filter((row) => isUpcomingAppointment(row)),
    true,
  );
  const past = sortAppointments(
    snapshot.appointments.filter((row) => !isUpcomingAppointment(row)),
    false,
  );

  function resetAddForm() {
    setTitle("");
    setAppointmentDate("");
    setAppointmentTime("");
    setLocation("");
    setNotes("");
  }

  function renderListenSession(session: DoeDtcListenSessionRow) {
    const expanded = expandedListenId === session.id;
    return (
      <div className="doedtc-listen-nested doedtc-listen-nested--compact" key={session.id}>
        <div className="doedtc-listen-nested__head">
          <span className="doedtc-listen-nested__mark" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <rect x="6" y="1.5" width="4" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3.5 7.75a4.5 4.5 0 0 0 9 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M8 12.25v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <strong>{DOEDTC_PROFILE.appointmentListenLabel}</strong>
            <p className="doedtc-row-item__meta">
              {formatDateTime(session.completed_at ?? session.created_at)}
              {session.duration_seconds ? ` · ${formatDuration(session.duration_seconds)}` : null}
            </p>
          </div>
        </div>
        {session.summary ? <p className="doedtc-body">{session.summary}</p> : null}
        {session.transcript ? (
          <>
            <button
              className="doedtc-icon-button"
              type="button"
              onClick={() => setExpandedListenId(expanded ? null : session.id)}
            >
              {expanded ? DOEDTC_PROFILE.listenHideTranscript : DOEDTC_PROFILE.listenViewTranscript}
            </button>
            {expanded ? <p className="doedtc-body doedtc-listen-nested__transcript">{session.transcript}</p> : null}
          </>
        ) : null}
      </div>
    );
  }

  function renderVisit(appointment: DoeDtcAppointmentRow, pastVisit: boolean) {
    const parts = appointmentDateParts(appointment);
    const linkedSessions = sessionsByAppointment.get(appointment.id) ?? [];
    return (
      <li
        className={`doedtc-visit-card${pastVisit ? " doedtc-visit-card--past" : ""}`}
        key={appointment.id}
      >
        <div className="doedtc-visit-card__date" aria-hidden="true">
          <span className="doedtc-visit-card__month">{parts.month}</span>
          <span className="doedtc-visit-card__day">{parts.day}</span>
        </div>
        <div className="doedtc-visit-card__body">
          <div className="doedtc-visit-card__top">
            <div>
              <strong>{appointment.title}</strong>
              <p className="doedtc-row-item__meta">{parts.whenLabel}</p>
            </div>
            {readOnly ? null : (
              <button
                className="doedtc-icon-button"
                type="button"
                disabled={busy}
                onClick={() => onAction("remove_appointment", { appointmentId: appointment.id })}
              >
                {DOEDTC_PROFILE.removeLabel}
              </button>
            )}
          </div>
          {appointment.location ? (
            <p className="doedtc-row-item__meta">{appointment.location}</p>
          ) : null}
          {appointment.notes ? <p className="doedtc-body">{appointment.notes}</p> : null}
          {linkedSessions.map((session) => renderListenSession(session))}
        </div>
      </li>
    );
  }

  return (
    <div className="doedtc-appointments">
      {readOnly ? null : adding ? (
        <form
          className="doedtc-card doedtc-form doedtc-appointments__form"
          onSubmit={async (event) => {
            event.preventDefault();
            const startsAt =
              appointmentDate && appointmentTime ? `${appointmentDate}T${appointmentTime}` : "";
            await onAction("add_appointment", { title, startsAt, location, notes });
            resetAddForm();
            setAdding(false);
          }}
        >
          <label className="doedtc-label" htmlFor="appointment-title">
            {DOEDTC_PROFILE.appointmentTitleLabel}
          </label>
          <input
            id="appointment-title"
            className="doedtc-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <div>
            <label className="doedtc-label" htmlFor="appointment-date">
              {DOEDTC_PROFILE.appointmentWhenLabel}
            </label>
            <div className="doedtc-datetime-row">
              <input
                id="appointment-date"
                className="doedtc-input"
                type="date"
                value={appointmentDate}
                onChange={(event) => setAppointmentDate(event.target.value)}
                required
              />
              <input
                id="appointment-time"
                className="doedtc-input"
                type="time"
                value={appointmentTime}
                onChange={(event) => setAppointmentTime(event.target.value)}
                required
                aria-label="Time"
              />
            </div>
          </div>
          <div>
            <label className="doedtc-label" htmlFor="appointment-location">
              {DOEDTC_PROFILE.appointmentLocationLabel}
            </label>
            <input
              id="appointment-location"
              className="doedtc-input"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
          <div>
            <label className="doedtc-label" htmlFor="appointment-notes">
              {DOEDTC_PROFILE.appointmentNotesLabel}
            </label>
            <textarea
              id="appointment-notes"
              className="doedtc-textarea"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
          <div className="doedtc-appointments__form-actions">
            <button className="doedtc-button" type="submit" disabled={busy}>
              {DOEDTC_PROFILE.addAppointmentLabel}
            </button>
            {empty ? null : (
              <button
                className="doedtc-button doedtc-button--secondary"
                type="button"
                disabled={busy}
                onClick={() => {
                  resetAddForm();
                  setAdding(false);
                }}
              >
                {DOEDTC_PROFILE.appointmentsAddCancel}
              </button>
            )}
          </div>
        </form>
      ) : (
        <button
          className="doedtc-button doedtc-appointments__add"
          type="button"
          disabled={busy}
          onClick={() => setAdding(true)}
        >
          {DOEDTC_PROFILE.appointmentsAddOpen}
        </button>
      )}

      {empty && !adding ? <p className="doedtc-empty">{DOEDTC_PROFILE.appointmentsEmpty}</p> : null}

      {upcoming.length > 0 ? (
        <section className="doedtc-appointments__group">
          <h2 className="doedtc-section-title">
            {DOEDTC_PROFILE.appointmentsUpcoming}
            <span className="doedtc-appointments__count">{upcoming.length}</span>
          </h2>
          <ul className="doedtc-visit-list">{upcoming.map((row) => renderVisit(row, false))}</ul>
        </section>
      ) : null}

      {past.length > 0 ? (
        <section className="doedtc-appointments__group">
          <h2 className="doedtc-section-title">
            {DOEDTC_PROFILE.appointmentsPast}
            <span className="doedtc-appointments__count">{past.length}</span>
          </h2>
          <ul className="doedtc-visit-list">{past.map((row) => renderVisit(row, true))}</ul>
        </section>
      ) : null}

      {standaloneSessions.length > 0 ? (
        <section className="doedtc-appointments__group">
          <h2 className="doedtc-section-title">{DOEDTC_PROFILE.listenSectionTitle}</h2>
          <ul className="doedtc-visit-list">
            {standaloneSessions.map((session) => (
              <li className="doedtc-visit-card" key={session.id}>
                <div className="doedtc-visit-card__body">{renderListenSession(session)}</div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function ResultsTab({ snapshot, busy, readOnly = false, onAction }: TabProps) {
  const slices: Array<{ id: DoeDtcResultKind; label: string }> = [
    { id: "lab", label: DOEDTC_PROFILE.resultsSliceLabs },
    { id: "imaging", label: DOEDTC_PROFILE.resultsSliceImaging },
    { id: "micro", label: DOEDTC_PROFILE.resultsSliceMicro },
  ];
  const [slice, setSlice] = useState<DoeDtcResultKind>("lab");
  const [title, setTitle] = useState("");
  const [resultedAt, setResultedAt] = useState("");
  const [source, setSource] = useState("");
  const [summary, setSummary] = useState("");
  const [adding, setAdding] = useState(false);

  const partitioned = partitionResults(snapshot.results);
  const labGroups = groupLabsByCategory(partitioned.labs);
  const featuredImaging = partitioned.imaging[0] ?? null;
  const olderImaging = partitioned.imaging.slice(1);
  const sliceIndex = slices.findIndex((row) => row.id === slice);
  const sliceRows =
    slice === "lab" ? partitioned.labs : slice === "imaging" ? partitioned.imaging : partitioned.micro;
  const sliceEmpty =
    slice === "lab"
      ? DOEDTC_PROFILE.resultsLabsEmpty
      : slice === "imaging"
        ? DOEDTC_PROFILE.resultsImagingEmpty
        : DOEDTC_PROFILE.resultsMicroEmpty;

  function resetAddForm() {
    setTitle("");
    setResultedAt("");
    setSource("");
    setSummary("");
  }

  function renderRemove(resultId: string) {
    if (readOnly) return null;
    return (
      <button
        className="doedtc-icon-button"
        type="button"
        disabled={busy}
        onClick={() => onAction("remove_result", { resultId })}
      >
        {DOEDTC_PROFILE.removeLabel}
      </button>
    );
  }

  function renderLabTile(tile: DoeDtcResultView & { span: "single" | "wide" | "tall" }) {
    return (
      <article
        className={`doedtc-lab-tile doedtc-lab-tile--${tile.span}${tile.flag ? " doedtc-lab-tile--alert" : ""}`}
        key={tile.id}
      >
        <div className="doedtc-lab-tile__top">
          <h3 className={`doedtc-lab-tile__name ${plusJakartaSans.className}`}>{tile.title}</h3>
          {renderRemove(tile.id)}
        </div>
        {tile.reading ? (
          <>
            <p className="doedtc-lab-tile__value">{tile.reading.value}</p>
            {tile.reading.detail ? <p className="doedtc-lab-tile__detail">{tile.reading.detail}</p> : null}
            {tile.flag ? (
              <p className="doedtc-lab-tile__flag">{tile.flag === "high" ? "High" : "Low"}</p>
            ) : null}
          </>
        ) : tile.summary ? (
          <p className="doedtc-lab-tile__summary">{tile.summary}</p>
        ) : null}
        <p className="doedtc-lab-tile__meta">
          {formatDate(tile.resulted_at)}
          {tile.source ? ` · ${tile.source}` : ""}
        </p>
      </article>
    );
  }

  return (
    <div className="doedtc-results">
      <div className="doedtc-results-slider" role="tablist" aria-label={DOEDTC_PROFILE.resultsTitle}>
        <span
          className="doedtc-results-slider__thumb"
          style={{ left: `calc(0.22rem + ${Math.max(sliceIndex, 0)} * ((100% - 0.44rem) / 3))` }}
          aria-hidden="true"
        />
        {slices.map((row) => (
          <button
            key={row.id}
            className={`doedtc-results-slider__btn${slice === row.id ? " doedtc-results-slider__btn--active" : ""}`}
            type="button"
            role="tab"
            aria-selected={slice === row.id}
            onClick={() => setSlice(row.id)}
          >
            {row.label}
          </button>
        ))}
      </div>

      {slice === "lab" ? (
        sliceRows.length === 0 ? (
          <p className="doedtc-empty">{sliceEmpty}</p>
        ) : (
          <div className="doedtc-results__labs">
            {labGroups.map((group) => (
              <section className="doedtc-lab-group" key={group.category}>
                <h2 className="doedtc-section-title">{labCategoryLabel(group.category)}</h2>
                <div className="doedtc-lab-grid">{group.tiles.map((tile) => renderLabTile(tile))}</div>
              </section>
            ))}
          </div>
        )
      ) : null}

      {slice === "imaging" ? (
        sliceRows.length === 0 ? (
          <p className="doedtc-empty">{sliceEmpty}</p>
        ) : (
          <div className="doedtc-imaging">
            {featuredImaging ? (
              <article className="doedtc-imaging-hero">
                <div className="doedtc-imaging-hero__top">
                  <p className="doedtc-imaging-hero__kicker">{formatDate(featuredImaging.resulted_at)}</p>
                  {renderRemove(featuredImaging.id)}
                </div>
                <h3 className={`doedtc-imaging-hero__title ${plusJakartaSans.className}`}>
                  {featuredImaging.title}
                </h3>
                {featuredImaging.source ? (
                  <p className="doedtc-imaging-hero__source">{featuredImaging.source}</p>
                ) : null}
                {featuredImaging.summary ? (
                  <p className="doedtc-imaging-hero__summary">{featuredImaging.summary}</p>
                ) : null}
              </article>
            ) : null}
            {olderImaging.length > 0 ? (
              <ul className="doedtc-row-list">
                {olderImaging.map((row) => (
                  <li className="doedtc-row-item" key={row.id}>
                    <div className="doedtc-row-item__body">
                      <strong>{row.title}</strong>
                      <p className="doedtc-row-item__meta">
                        {formatDate(row.resulted_at)}
                        {row.source ? ` · ${row.source}` : ""}
                      </p>
                      {row.summary ? <p className="doedtc-body">{row.summary}</p> : null}
                    </div>
                    <div className="doedtc-row-item__actions">{renderRemove(row.id)}</div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      ) : null}

      {slice === "micro" ? (
        sliceRows.length === 0 ? (
          <p className="doedtc-empty">{sliceEmpty}</p>
        ) : (
          <ul className="doedtc-row-list">
            {partitioned.micro.map((row) => (
              <li className="doedtc-row-item" key={row.id}>
                <div className="doedtc-row-item__body">
                  <strong>{row.title}</strong>
                  <p className="doedtc-row-item__meta">
                    {formatDate(row.resulted_at)}
                    {row.source ? ` · ${row.source}` : ""}
                  </p>
                  {row.summary ? <p className="doedtc-body">{row.summary}</p> : null}
                </div>
                <div className="doedtc-row-item__actions">{renderRemove(row.id)}</div>
              </li>
            ))}
          </ul>
        )
      ) : null}

      {readOnly ? null : adding ? (
        <form
          className="doedtc-card doedtc-form doedtc-results__form"
          onSubmit={async (event) => {
            event.preventDefault();
            await onAction("add_result", { title, resultedAt, source, summary, kind: slice });
            resetAddForm();
            setAdding(false);
          }}
        >
          <label className="doedtc-label" htmlFor="result-title">
            {DOEDTC_PROFILE.resultTitleLabel}
          </label>
          <input
            id="result-title"
            className="doedtc-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <div>
            <label className="doedtc-label" htmlFor="result-date">
              {DOEDTC_PROFILE.resultDateLabel}
            </label>
            <input
              id="result-date"
              className="doedtc-input"
              type="date"
              value={resultedAt}
              onChange={(event) => setResultedAt(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="doedtc-label" htmlFor="result-source">
              {DOEDTC_PROFILE.resultSourceLabel}
            </label>
            <input
              id="result-source"
              className="doedtc-input"
              value={source}
              onChange={(event) => setSource(event.target.value)}
            />
          </div>
          <div>
            <label className="doedtc-label" htmlFor="result-summary">
              {DOEDTC_PROFILE.resultSummaryLabel}
            </label>
            <textarea
              id="result-summary"
              className="doedtc-textarea"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
          </div>
          <div className="doedtc-appointments__form-actions">
            <button className="doedtc-button" type="submit" disabled={busy}>
              {DOEDTC_PROFILE.addResultLabel}
            </button>
            <button
              className="doedtc-button doedtc-button--secondary"
              type="button"
              disabled={busy}
              onClick={() => {
                resetAddForm();
                setAdding(false);
              }}
            >
              {DOEDTC_PROFILE.resultsAddCancel}
            </button>
          </div>
        </form>
      ) : (
        <button
          className="doedtc-button doedtc-button--secondary doedtc-results__add"
          type="button"
          disabled={busy}
          onClick={() => setAdding(true)}
        >
          {DOEDTC_PROFILE.resultsAddOpen}
        </button>
      )}
    </div>
  );
}

function FamilyTab({
  token,
  snapshot,
  busy,
  onAction,
  preview = false,
}: TabProps & { token: string; preview?: boolean }) {
  const [adding, setAdding] = useState(false);
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState<DoeDtcFamilyRelationship>("other");
  const [gender, setGender] = useState<DoeDtcGender | "">("");
  const [phone, setPhone] = useState("");
  const [textPhone, setTextPhone] = useState<boolean | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [inviteBusyId, setInviteBusyId] = useState<string | null>(null);
  const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);

  const members = snapshot.household.members;
  const isAdmin = snapshot.household.isAdmin;
  const viewerMember = snapshot.household.viewerMember;
  const viewerShares = viewerMember
    ? memberCurrentlySharesWithHousehold({
        member: viewerMember,
        consent: snapshot.household.viewerConsent,
      })
    : false;
  const accessByMemberId = useMemo(
    () => new Map(snapshot.household.memberAccess.map((row) => [row.memberId, row])),
    [snapshot.household.memberAccess],
  );

  function resetAddForm() {
    setFullName("");
    setRelationship("other");
    setGender("");
    setPhone("");
    setTextPhone(null);
    setDateOfBirth("");
    setMedications([]);
    setConditions([]);
  }

  function closeAddForm() {
    resetAddForm();
    setAdding(false);
  }

  useEffect(() => {
    if (!adding) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeAddForm();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [adding]);

  async function sendInvite(memberId: string) {
    setInviteBusyId(memberId);
    try {
      await onAction("send_family_invite", { householdMemberId: memberId });
    } finally {
      setInviteBusyId(null);
    }
  }

  const canSave =
    Boolean(fullName.trim()) && (textPhone !== true || Boolean(phone.trim()));

  const modal =
    adding && typeof document !== "undefined"
      ? createPortal(
          <div className="doedtc-modal doedtc-profile-layout" role="dialog" aria-modal="true" aria-labelledby="family-add-title">
            <button
              className="doedtc-modal__backdrop"
              type="button"
              aria-label={DOEDTC_PROFILE.familyAddCancel}
              onClick={closeAddForm}
            />
            <div className="doedtc-modal__sheet">
              <div className="doedtc-modal__head">
                <div>
                  <h2 id="family-add-title" className="doedtc-modal__title">
                    {DOEDTC_PROFILE.familyAddTitle}
                  </h2>
                  <p className="doedtc-modal__hint">{DOEDTC_PROFILE.familyAddHint}</p>
                </div>
                <button
                  type="button"
                  className="doedtc-icon-button"
                  onClick={closeAddForm}
                  aria-label={DOEDTC_PROFILE.familyAddCancel}
                >
                  ×
                </button>
              </div>
              <form
                className="doedtc-form doedtc-modal__form"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!canSave) return;
                  await onAction("add_family", {
                    fullName,
                    relationship,
                    phone: textPhone ? phone : null,
                    dateOfBirth: dateOfBirth || null,
                    gender: gender || null,
                    medications,
                    conditions,
                    sendInvite: textPhone === true,
                  });
                  closeAddForm();
                }}
              >
                <div className="doedtc-modal__fields">
                <div>
                  <label className="doedtc-label" htmlFor="family-add-name">
                    {DOEDTC_PROFILE.familyNameQuestion}
                  </label>
                  <input
                    id="family-add-name"
                    className="doedtc-input"
                    value={fullName}
                    autoComplete="name"
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </div>
                <DoeDtcDropdown
                  variant="onboard"
                  label={DOEDTC_PROFILE.familyRelationshipQuestion}
                  value={relationship}
                  options={RELATIONSHIP_OPTIONS}
                  onChange={(value) => setRelationship(value as DoeDtcFamilyRelationship)}
                />
                <DoeDtcDropdown<DoeDtcGender | "">
                  variant="onboard"
                  label={DOEDTC_PROFILE.familyGenderQuestion}
                  value={gender}
                  options={DOEDTC_GENDERS}
                  placeholder="Select…"
                  onChange={setGender}
                />
                <DoeDtcDobMenu
                  label={DOEDTC_PROFILE.familyDobQuestion}
                  value={dateOfBirth}
                  placeholder={DOEDTC_GET_STARTED.familyDobPlaceholder}
                  onChange={setDateOfBirth}
                />
                <p className="doedtc-muted">{DOEDTC_PROFILE.familyDobHint}</p>
                <div>
                  <p className="doedtc-label">{DOEDTC_PROFILE.familyPhoneQuestion}</p>
                  <div className="doedtc-toggle-row">
                    <button
                      type="button"
                      className={`doedtc-toggle${textPhone === true ? " doedtc-toggle--active" : ""}`}
                      onClick={() => setTextPhone(true)}
                    >
                      {DOEDTC_GET_STARTED.familyPhoneYes}
                    </button>
                    <button
                      type="button"
                      className={`doedtc-toggle${textPhone === false ? " doedtc-toggle--active" : ""}`}
                      onClick={() => {
                        setTextPhone(false);
                        setPhone("");
                      }}
                    >
                      {DOEDTC_GET_STARTED.familyPhoneNo}
                    </button>
                  </div>
                </div>
                {textPhone ? (
                  <div>
                    <label className="doedtc-label" htmlFor="family-add-phone">
                      {DOEDTC_GET_STARTED.familyPhoneLabel}
                    </label>
                    <input
                      id="family-add-phone"
                      className="doedtc-input"
                      value={phone}
                      inputMode="tel"
                      autoComplete="tel"
                      onChange={(event) => setPhone(event.target.value)}
                      required
                    />
                  </div>
                ) : null}
                <ChipField
                  id="family-add-meds"
                  label={DOEDTC_PROFILE.familyMedsQuestion}
                  placeholder={DOEDTC_PROFILE.familyMedsPlaceholder}
                  values={medications}
                  onChange={setMedications}
                />
                <ChipField
                  id="family-add-conditions"
                  label={DOEDTC_PROFILE.familyConditionsQuestion}
                  placeholder={DOEDTC_PROFILE.familyConditionsPlaceholder}
                  values={conditions}
                  onChange={setConditions}
                />
                </div>
                <div className="doedtc-modal__actions doedtc-appointments__form-actions">
                  <button className="doedtc-button" type="submit" disabled={busy || !canSave}>
                    {busy ? DOEDTC_PROFILE.savingLabel : DOEDTC_PROFILE.familyAddSave}
                  </button>
                  <button
                    className="doedtc-button doedtc-button--secondary"
                    type="button"
                    disabled={busy}
                    onClick={closeAddForm}
                  >
                    {DOEDTC_PROFILE.familyAddCancel}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="doedtc-family">
      {members.length > 0 ? (
        <FamilyTreeCard members={members} viewerMemberId={viewerMember?.id ?? null} />
      ) : null}
      {members.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.familyEmpty}</p>
      ) : (
        <ul className="doedtc-family-list">
          {members.map((member) => {
            const access = accessByMemberId.get(member.id);
            const canView = Boolean(access?.canView && access.userId);
            const isYou = viewerMember?.id === member.id;
            const chart = memberChartList(member);
            const phoneDisplay = member.phone ? formatPhoneForDisplay(member.phone) : null;
            const viewHref =
              canView && access?.userId && !preview
                ? doeDtcAppUrl(token, { tab: "dashboard", member: access.userId })
                : null;
            return (
              <li className="doedtc-family-card" id={`family-member-${member.id}`} key={member.id}>
                <div className="doedtc-family-card__top">
                  <span className="doedtc-family-card__avatar" aria-hidden>
                    {memberInitial(member.full_name)}
                  </span>
                  <div className="doedtc-family-card__copy">
                    <div className="doedtc-family-card__name-row">
                      <h3 className={`doedtc-family-card__name ${plusJakartaSans.className}`}>{member.full_name}</h3>
                      {member.role === "admin" ? <span className="doedtc-tag">{DOEDTC_PROFILE.familyAdminBadge}</span> : null}
                      {isYou && member.role !== "admin" ? (
                        <span className="doedtc-tag">{DOEDTC_PROFILE.familyYouBadge}</span>
                      ) : null}
                    </div>
                    <p className="doedtc-family-card__meta">
                      {isYou ? "You" : relationshipLabel(member.relationship)}
                      {" · "}
                      {member.status === "active"
                        ? DOEDTC_PROFILE.familyActiveLabel
                        : DOEDTC_PROFILE.familyPendingLabel}
                    </p>
                    {phoneDisplay ? <p className="doedtc-family-card__meta">{phoneDisplay}</p> : null}
                  </div>
                  <FamilyCardMenu
                    canView={Boolean(viewHref)}
                    viewHref={viewHref}
                    canInvite={Boolean(
                      isAdmin && member.role !== "admin" && member.phone && member.status !== "active",
                    )}
                    canRemove={Boolean(isAdmin && member.role !== "admin")}
                    inviting={inviteBusyId === member.id}
                    busy={busy}
                    onInvite={() => void sendInvite(member.id)}
                    onRemove={() => void onAction("remove_family", { householdMemberId: member.id })}
                  />
                </div>
                {chart.length > 0 ? (
                  <div className="doedtc-tag-list doedtc-tag-list--compact">
                    {chart.map((item) => (
                      <span className="doedtc-tag" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {viewerShares && viewerMember && viewerMember.role !== "admin" ? (
        <div className="doedtc-card doedtc-card--spaced">
          <p className="doedtc-muted">{DOEDTC_PROFILE.familyRevokeAccessHint}</p>
          {!revokeConfirmOpen ? (
            <button
              type="button"
              className="doedtc-button doedtc-button--danger"
              disabled={busy}
              onClick={() => setRevokeConfirmOpen(true)}
            >
              {DOEDTC_PROFILE.familyRevokeAccessLabel}
            </button>
          ) : (
            <div className="doedtc-inline-actions">
              <button
                type="button"
                className="doedtc-button doedtc-button--danger"
                disabled={busy}
                onClick={async () => {
                  await onAction("revoke_household_access", { confirmed: true });
                  setRevokeConfirmOpen(false);
                }}
              >
                {DOEDTC_PROFILE.familyRevokeConfirmLabel}
              </button>
              <button
                type="button"
                className="doedtc-button doedtc-button--secondary"
                disabled={busy}
                onClick={() => setRevokeConfirmOpen(false)}
              >
                {DOEDTC_PROFILE.familyRevokeCancelLabel}
              </button>
            </div>
          )}
        </div>
      ) : null}

      {isAdmin ? (
        <button
          className="doedtc-button doedtc-family__add"
          type="button"
          disabled={busy}
          onClick={() => setAdding(true)}
        >
          {DOEDTC_PROFILE.familyAddOpen}
        </button>
      ) : null}
      {modal}
    </div>
  );
}

function LockerTab({ snapshot, busy, readOnly = false, onAction }: TabProps) {
  const [label, setLabel] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h2 className="doedtc-section-title">{DOEDTC_PROFILE.lockerTitle}</h2>
      <p className="doedtc-muted">{DOEDTC_PROFILE.lockerHint}</p>
      {snapshot.lockerItems.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.lockerEmpty}</p>
      ) : (
        <ul className="doedtc-row-list">
          {snapshot.lockerItems.map((item) => (
            <li className="doedtc-row-item" key={item.id}>
              <div>
                <strong>{item.label}</strong>
                <p className="doedtc-row-item__meta">{item.username || "—"}</p>
                <p className="doedtc-row-item__meta">{DOEDTC_PROFILE.lockerSavedPassword}</p>
              </div>
              <div className="doedtc-row-item__actions">
                {readOnly ? null : (
                  <button
                    className="doedtc-icon-button"
                    type="button"
                    disabled={busy}
                    onClick={() => onAction("remove_locker", { itemId: item.id })}
                  >
                    {DOEDTC_PROFILE.removeLabel}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {readOnly ? null : (
      <form
        className="doedtc-card doedtc-card--spaced"
        onSubmit={async (event) => {
          event.preventDefault();
          await onAction("add_locker", { label, username, password });
          setLabel("");
          setUsername("");
          setPassword("");
        }}
      >
        <label className="doedtc-label">{DOEDTC_PROFILE.lockerLabelField}</label>
        <input className="doedtc-input" value={label} onChange={(event) => setLabel(event.target.value)} required />
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_PROFILE.lockerUsernameField}</label>
          <input className="doedtc-input" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_PROFILE.lockerPasswordField}</label>
          <input
            className="doedtc-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button className="doedtc-button" type="submit" disabled={busy}>
          {DOEDTC_PROFILE.addLockerLabel}
        </button>
      </form>
      )}
    </div>
  );
}

function GuidesTab({
  snapshot,
  busy,
  onAction,
  focusedGuideId,
  onFocusGuide,
}: TabProps & {
  focusedGuideId: string | null;
  onFocusGuide: (guideId: string | null) => void;
}) {
  const activeGuide = snapshot.guides.find((guide) => guide.id === focusedGuideId) ?? null;
  const library = [...snapshot.guides].sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  if (activeGuide) {
    return (
      <div className="doedtc-guides">
        <DoeDtcGuideView guide={activeGuide} hideHeader />
        <div className="doedtc-guides__footer">
          <button
            type="button"
            className="doedtc-button doedtc-button--secondary"
            disabled={busy}
            onClick={async () => {
              await onAction("unsave_guide", { guideId: activeGuide.id });
              onFocusGuide(null);
            }}
          >
            {DOEDTC_PROFILE.guidesUnsaveLabel}
          </button>
          <button
            type="button"
            className="doedtc-button doedtc-button--danger"
            disabled={busy}
            onClick={async () => {
              await onAction("archive_guide", { guideId: activeGuide.id });
              onFocusGuide(null);
            }}
          >
            {DOEDTC_PROFILE.guidesArchiveLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doedtc-guides">
      {library.length === 0 ? (
        <p className="doedtc-empty">{DOEDTC_PROFILE.guidesEmpty}</p>
      ) : (
        <ul className="doedtc-guide-library">
          {library.map((guide) => {
            const excerpt = guideExcerpt(guide);
            const steps = guideStepCount(guide);
            return (
              <li key={guide.id}>
                <button
                  type="button"
                  className="doedtc-guide-preview"
                  onClick={() => onFocusGuide(guide.id)}
                >
                  <h3 className={`doedtc-guide-preview__title ${plusJakartaSans.className}`}>{guide.title}</h3>
                  {excerpt ? <p className="doedtc-guide-preview__excerpt">{excerpt}</p> : null}
                  {steps > 0 ? (
                    <p className="doedtc-guide-preview__meta">
                      {steps} {DOEDTC_PROFILE.guidesStepsLabel}
                    </p>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function guideExcerpt(guide: DoeDtcGuideRow): string {
  const hero = guide.blocks.find((block) => block.kind === "hero");
  if (hero?.body?.trim()) return hero.body.trim();
  const steps = guide.blocks.find((block) => block.kind === "steps");
  return steps?.steps?.[0]?.title ?? "";
}

function guideStepCount(guide: DoeDtcGuideRow): number {
  return guide.blocks.find((block) => block.kind === "steps")?.steps?.length ?? 0;
}

function trackerRecency(
  artifact: { id: string; updated_at: string },
  entries: Array<{ artifact_id: string; occurred_at: string }>,
): string {
  const last = entries
    .filter((entry) => entry.artifact_id === artifact.id)
    .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at))[0];
  return last?.occurred_at ?? artifact.updated_at;
}

function TrackersTab({
  snapshot,
  busy,
  readOnly = false,
  onAction,
  focusedArtifactId,
  onFocusArtifact,
}: TabProps & {
  focusedArtifactId: string | null;
  onFocusArtifact: (artifactId: string | null) => void;
}) {
  const library = [...snapshot.artifacts].sort((a, b) => {
    const aEntries = snapshot.artifactEntries.filter((entry) => entry.artifact_id === a.id);
    const bEntries = snapshot.artifactEntries.filter((entry) => entry.artifact_id === b.id);
    const aField = pickPrimarySeriesField(a.config.fields, aEntries);
    const bField = pickPrimarySeriesField(b.config.fields, bEntries);
    const aPoints = aField
      ? buildArtifactSeriesPoints({ entries: aEntries, fieldKey: aField.key, limit: 12 }).length
      : 0;
    const bPoints = bField
      ? buildArtifactSeriesPoints({ entries: bEntries, fieldKey: bField.key, limit: 12 }).length
      : 0;
    if (aPoints !== bPoints) return bPoints - aPoints;
    return trackerRecency(b, snapshot.artifactEntries).localeCompare(
      trackerRecency(a, snapshot.artifactEntries),
    );
  });
  const activeArtifact = snapshot.artifacts.find((artifact) => artifact.id === focusedArtifactId) ?? null;

  function trackerModel(artifact: (typeof library)[number]) {
    const entries = snapshot.artifactEntries
      .filter((entry) => entry.artifact_id === artifact.id)
      .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
    const lastEntry = entries[0] ?? null;
    const seriesField = pickPrimarySeriesField(artifact.config.fields, entries);
    return {
      artifact,
      entries,
      lastReading: lastEntry ? formatPrimaryArtifactReading(artifact, lastEntry.values) : null,
      lastAt: lastEntry?.occurred_at ?? artifact.updated_at,
      points: seriesField
        ? buildArtifactSeriesPoints({
            entries,
            fieldKey: seriesField.key,
            limit: 12,
          })
        : [],
    };
  }

  if (activeArtifact) {
    return (
      <div className="doedtc-trackers">
        <DoeDtcArtifactView
          artifact={activeArtifact}
          entries={snapshot.artifactEntries.filter((entry) => entry.artifact_id === activeArtifact.id)}
          busy={busy || readOnly}
          onAction={onAction}
        />
        {readOnly ? null : (
          <div className="doedtc-trackers__footer">
            <button
              type="button"
              className="doedtc-button doedtc-button--danger"
              disabled={busy}
              onClick={async () => {
                await onAction("archive_artifact", { artifactId: activeArtifact.id });
                onFocusArtifact(null);
              }}
            >
              {DOEDTC_PROFILE.trackersArchiveLabel}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (library.length === 0) {
    return <p className="doedtc-empty">{DOEDTC_PROFILE.trackersEmpty}</p>;
  }

  const [main, ...rest] = library.map(trackerModel);

  return (
    <div className="doedtc-trackers">
      <DoeDtcTrackerChart
        title="Trend"
        points={main.points}
        goal={main.artifact.goal}
        onOpen={() => onFocusArtifact(main.artifact.id)}
      />
      {rest.length > 0 ? (
        <ul className="doedtc-tracker-list">
          {rest.map((card) => (
            <li key={card.artifact.id}>
              <button
                type="button"
                className="doedtc-tracker-item"
                onClick={() => onFocusArtifact(card.artifact.id)}
              >
                <div className="doedtc-tracker-item__copy">
                  <h3 className={`doedtc-tracker-item__title ${plusJakartaSans.className}`}>
                    {card.artifact.title}
                  </h3>
                  <p className="doedtc-tracker-item__meta">{formatDate(card.lastAt)}</p>
                </div>
                <p className="doedtc-tracker-item__value">
                  {card.lastReading ?? DOEDTC_PROFILE.trackersNoEntries}
                </p>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FeedbackTab({
  snapshot,
  busy,
  readOnly = false,
  onAction,
  focusedTicketId,
  onFocusTicket,
}: TabProps & {
  focusedTicketId: string | null;
  onFocusTicket: (ticketId: string | null) => void;
}) {
  return (
    <DoeDtcFeedbackView
      tickets={snapshot.tickets}
      focusedTicketId={focusedTicketId}
      busy={busy || readOnly}
      showForm={!readOnly}
      onSubmit={async (payload) => {
        await onAction("submit_ticket", payload);
        onFocusTicket(null);
      }}
    />
  );
}

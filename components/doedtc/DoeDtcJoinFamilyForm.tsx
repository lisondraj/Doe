"use client";

import { useEffect, useMemo, useState } from "react";

import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DOEDTC_GET_STARTED, DOEDTC_JOIN_FAMILY } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcFamilyRelationship, DoeDtcHouseholdConsentLevel } from "@/lib/doedtc/doedtc-types";
import { dmSans } from "@/lib/home/fonts";

type InviteContext = {
  memberName: string;
  relationship: DoeDtcFamilyRelationship;
  needsConsent: boolean;
  householdMembers: Array<{ id: string; fullName: string }>;
};

type ConsentChoice = {
  level: DoeDtcHouseholdConsentLevel;
  memberIds: string[];
};

type DoeDtcJoinFamilyFormProps = {
  inviteToken: string;
};

export function DoeDtcJoinFamilyForm({ inviteToken }: DoeDtcJoinFamilyFormProps) {
  const [invite, setInvite] = useState<InviteContext | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [medicalMode, setMedicalMode] = useState<"now" | "later">("later");
  const [medDraft, setMedDraft] = useState("");
  const [shareHealth, setShareHealth] = useState<ConsentChoice>({ level: "none", memberIds: [] });
  const [allowEdits, setAllowEdits] = useState<ConsentChoice>({ level: "none", memberIds: [] });
  const [step, setStep] = useState<"profile" | "consent" | "success">("profile");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [messagesHref, setMessagesHref] = useState("");

  useEffect(() => {
    async function loadInvite() {
      setLoadingInvite(true);
      try {
        const response = await fetch(`/api/doedtc/join-family?i=${encodeURIComponent(inviteToken)}`);
        const json = (await response.json()) as {
          ok?: boolean;
          error?: string;
          invite?: InviteContext;
        };
        if (!response.ok || !json.ok || !json.invite) {
          throw new Error(json.error ?? "Invite unavailable.");
        }
        setInvite(json.invite);
        setFullName(json.invite.memberName);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Invite unavailable.");
      } finally {
        setLoadingInvite(false);
      }
    }
    void loadInvite();
  }, [inviteToken]);

  const disabled = useMemo(
    () => loadingInvite || status === "loading" || step === "success",
    [loadingInvite, status, step],
  );

  function addMedication() {
    const next = medDraft.trim();
    if (!next || medications.includes(next)) return;
    setMedications([...medications, next]);
    setMedDraft("");
  }

  async function submitJoin(consent?: { shareHealth: ConsentChoice; allowEdits: ConsentChoice }) {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/doedtc/join-family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteToken,
          fullName,
          email,
          medications: medicalMode === "now" ? medications : [],
          conditions: medicalMode === "now" ? conditions : [],
          medicalDeferred: medicalMode === "later",
          shareHealth: consent?.shareHealth.level ?? "none",
          allowEdits: consent?.allowEdits.level ?? "none",
          shareMemberIds: consent?.shareHealth.memberIds ?? [],
          editMemberIds: consent?.allowEdits.memberIds ?? [],
        }),
      });
      const json = (await response.json()) as {
        ok?: boolean;
        error?: string;
        messagesHref?: string;
      };
      if (!response.ok || !json.ok) {
        throw new Error(json.error ?? "Unable to join.");
      }
      setMessagesHref(json.messagesHref ?? "");
      setStep("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Unable to join.");
    } finally {
      setStatus("idle");
    }
  }

  if (loadingInvite) {
    return <p className="doedtc-muted">Loading invite…</p>;
  }

  if (!invite) {
    return (
      <div className="doedtc-card">
        <strong>{DOEDTC_JOIN_FAMILY.invalidInviteTitle}</strong>
        <p>{error || DOEDTC_JOIN_FAMILY.invalidInviteBody}</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="doedtc-card">
        <strong>{DOEDTC_JOIN_FAMILY.allSetTitle}</strong>
        <p>{DOEDTC_JOIN_FAMILY.allSetBody}</p>
        {messagesHref ? (
          <a className="doedtc-button" href={messagesHref}>
            {DOEDTC_JOIN_FAMILY.openMessagesLabel}
          </a>
        ) : null}
      </div>
    );
  }

  if (step === "consent") {
    return (
      <form
        className="doedtc-card"
        onSubmit={async (event) => {
          event.preventDefault();
          await submitJoin({ shareHealth, allowEdits });
        }}
      >
        <h2 className={`doedtc-section-title ${dmSans.className}`}>{DOEDTC_JOIN_FAMILY.consentTitle}</h2>
        <p className="doedtc-muted">{DOEDTC_JOIN_FAMILY.consentSubtitle}</p>
        <ConsentField
          label={DOEDTC_JOIN_FAMILY.shareHealthLabel}
          value={shareHealth}
          members={invite.householdMembers}
          onChange={setShareHealth}
        />
        <ConsentField
          label={DOEDTC_JOIN_FAMILY.allowEditsLabel}
          value={allowEdits}
          members={invite.householdMembers}
          onChange={setAllowEdits}
        />
        {error ? <p className="doedtc-error">{error}</p> : null}
        <button className="doedtc-button" type="submit" disabled={status === "loading"}>
          {status === "loading" ? DOEDTC_JOIN_FAMILY.submittingLabel : DOEDTC_JOIN_FAMILY.submitLabel}
        </button>
      </form>
    );
  }

  return (
    <form
      className="doedtc-card"
      onSubmit={async (event) => {
        event.preventDefault();
        if (invite.needsConsent) {
          setStep("consent");
          return;
        }
        await submitJoin();
      }}
    >
      <label className="doedtc-label">{DOEDTC_GET_STARTED.fullNameLabel}</label>
      <input className="doedtc-input" value={fullName} onChange={(event) => setFullName(event.target.value)} />
      <div style={{ marginTop: "0.75rem" }}>
        <label className="doedtc-label">{DOEDTC_GET_STARTED.emailLabel}</label>
        <input
          className="doedtc-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div style={{ marginTop: "1.25rem" }}>
        <strong className="doedtc-section-title">{DOEDTC_GET_STARTED.medicalSectionTitle}</strong>
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
          <input
            type="radio"
            checked={medicalMode === "now"}
            onChange={() => setMedicalMode("now")}
          />
          <span>{DOEDTC_GET_STARTED.medicalNowLabel}</span>
        </label>
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.35rem" }}>
          <input
            type="radio"
            checked={medicalMode === "later"}
            onChange={() => setMedicalMode("later")}
          />
          <span>{DOEDTC_GET_STARTED.medicalLaterLabel}</span>
        </label>
      </div>
      {medicalMode === "now" ? (
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_GET_STARTED.medicationsLabel}</label>
          <div className="doedtc-add-row">
            <input
              className="doedtc-input"
              value={medDraft}
              onChange={(event) => setMedDraft(event.target.value)}
              placeholder={DOEDTC_GET_STARTED.medicationsPlaceholder}
            />
            <button className="doedtc-button doedtc-button--secondary" type="button" onClick={addMedication}>
              Add
            </button>
          </div>
          <div className="doedtc-tag-list">
            {medications.map((value) => (
              <span className="doedtc-tag" key={value}>
                {value}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {error ? <p className="doedtc-error">{error}</p> : null}
      <button
        className="doedtc-button"
        type="submit"
        disabled={disabled || !fullName.trim() || !email.trim()}
        style={{ marginTop: "1rem" }}
      >
        {invite.needsConsent ? "Continue" : DOEDTC_JOIN_FAMILY.submitLabel}
      </button>
    </form>
  );
}

function ConsentField({
  label,
  value,
  members,
  onChange,
}: {
  label: string;
  value: ConsentChoice;
  members: Array<{ id: string; fullName: string }>;
  onChange: (next: ConsentChoice) => void;
}) {
  return (
    <div style={{ marginTop: "1rem" }}>
      <label className="doedtc-label">{label}</label>
      {(["all", "none", "certain"] as const).map((level) => (
        <label key={level} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.35rem" }}>
          <input
            type="radio"
            checked={value.level === level}
            onChange={() => onChange({ level, memberIds: level === "certain" ? value.memberIds : [] })}
          />
          <span>
            {level === "all"
              ? DOEDTC_JOIN_FAMILY.consentAllLabel
              : level === "none"
                ? DOEDTC_JOIN_FAMILY.consentNoneLabel
                : DOEDTC_JOIN_FAMILY.consentCertainLabel}
          </span>
        </label>
      ))}
      {value.level === "certain" ? (
        <div style={{ marginTop: "0.5rem" }}>
          <p className="doedtc-muted">{DOEDTC_JOIN_FAMILY.consentMembersLabel}</p>
          {members.map((member) => (
            <label key={member.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={value.memberIds.includes(member.id)}
                onChange={(event) => {
                  const memberIds = event.target.checked
                    ? [...value.memberIds, member.id]
                    : value.memberIds.filter((id) => id !== member.id);
                  onChange({ ...value, memberIds });
                }}
              />
              <span>{member.fullName}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

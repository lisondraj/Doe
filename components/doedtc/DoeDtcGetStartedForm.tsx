"use client";

import { useMemo, useState } from "react";

import { DOEDTC_GET_STARTED } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcFamilyRelationship } from "@/lib/doedtc/doedtc-types";

type TagFieldProps = {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
};

function TagField({ label, placeholder, values, onChange }: TagFieldProps) {
  const [draft, setDraft] = useState("");

  function addValue() {
    const next = draft.trim();
    if (!next || values.includes(next)) return;
    onChange([...values, next]);
    setDraft("");
  }

  return (
    <div style={{ marginTop: "1.25rem" }}>
      <label className="doedtc-label">{label}</label>
      <div className="doedtc-add-row">
        <input
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
        <button className="doedtc-button doedtc-button--secondary" type="button" onClick={addValue}>
          Add
        </button>
      </div>
      <div className="doedtc-tag-list">
        {values.map((value) => (
          <span className="doedtc-tag" key={value}>
            {value}
            <button
              type="button"
              aria-label={`Remove ${value}`}
              onClick={() => onChange(values.filter((item) => item !== value))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

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

type FamilyDraft = {
  id: string;
  fullName: string;
  relationship: DoeDtcFamilyRelationship;
  phone: string;
  noPhone: boolean;
  dateOfBirth: string;
  sendInvite: boolean;
};

type DoeDtcGetStartedFormProps = {
  token: string;
  valid: boolean;
};

export function DoeDtcGetStartedForm({ token, valid }: DoeDtcGetStartedFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whyDoe, setWhyDoe] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [medicalMode, setMedicalMode] = useState<"now" | "later">("now");
  const [familyMembers, setFamilyMembers] = useState<FamilyDraft[]>([]);
  const [familyDraft, setFamilyDraft] = useState<FamilyDraft>({
    id: "draft",
    fullName: "",
    relationship: "other",
    phone: "",
    noPhone: false,
    dateOfBirth: "",
    sendInvite: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [messagesHref, setMessagesHref] = useState("");
  const [profileHref, setProfileHref] = useState("");

  const disabled = useMemo(() => !valid || status === "loading" || status === "success", [status, valid]);

  if (!valid) {
    return (
      <div className="doedtc-card">
        <strong>{DOEDTC_GET_STARTED.invalidTokenTitle}</strong>
        <p>{DOEDTC_GET_STARTED.invalidTokenBody}</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="doedtc-card">
        <strong>{DOEDTC_GET_STARTED.allSetTitle}</strong>
        <p>{DOEDTC_GET_STARTED.allSetBody}</p>
        {profileHref ? (
          <a className="doedtc-button" href={profileHref}>
            {DOEDTC_GET_STARTED.openProfileLabel}
          </a>
        ) : null}
        {messagesHref ? (
          <a className="doedtc-button doedtc-button--secondary" href={messagesHref}>
            {DOEDTC_GET_STARTED.openMessagesLabel}
          </a>
        ) : null}
      </div>
    );
  }

  function addFamilyMember() {
    const name = familyDraft.fullName.trim();
    if (!name) return;
    setFamilyMembers([
      ...familyMembers,
      {
        ...familyDraft,
        id: `${Date.now()}-${familyMembers.length}`,
        fullName: name,
        phone: familyDraft.noPhone ? "" : familyDraft.phone.trim(),
      },
    ]);
    setFamilyDraft({
      id: "draft",
      fullName: "",
      relationship: "other",
      phone: "",
      noPhone: false,
      dateOfBirth: "",
      sendInvite: false,
    });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/doedtc/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName,
          email,
          medications: medicalMode === "now" ? medications : [],
          conditions: medicalMode === "now" ? conditions : [],
          whyDoe,
          medicalDeferred: medicalMode === "later",
          familyMembers: familyMembers.map((member) => ({
            fullName: member.fullName,
            relationship: member.relationship,
            phone: member.noPhone ? null : member.phone || null,
            dateOfBirth:
              member.relationship === "child" && member.dateOfBirth ? member.dateOfBirth : null,
            sendInvite: Boolean(member.sendInvite && member.phone),
          })),
        }),
      });
      const json = (await response.json()) as {
        ok?: boolean;
        error?: string;
        messagesHref?: string;
        profileHref?: string;
      };
      if (!response.ok || !json.ok) {
        throw new Error(json.error ?? "Unable to save your profile.");
      }
      setMessagesHref(json.messagesHref ?? "");
      setProfileHref(json.profileHref ?? "");
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Unable to save your profile.");
    }
  }

  return (
    <form className="doedtc-card" onSubmit={onSubmit}>
      <label className="doedtc-label" htmlFor="doedtc-full-name">
        {DOEDTC_GET_STARTED.fullNameLabel}
      </label>
      <input
        id="doedtc-full-name"
        className="doedtc-input"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        required
        disabled={disabled}
      />

      <div style={{ marginTop: "1rem" }}>
        <label className="doedtc-label" htmlFor="doedtc-email">
          {DOEDTC_GET_STARTED.emailLabel}
        </label>
        <input
          id="doedtc-email"
          className="doedtc-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={disabled}
        />
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <label className="doedtc-label" htmlFor="doedtc-why">
          {DOEDTC_GET_STARTED.whyLabel}
        </label>
        <textarea
          id="doedtc-why"
          className="doedtc-textarea"
          value={whyDoe}
          onChange={(event) => setWhyDoe(event.target.value)}
          placeholder={DOEDTC_GET_STARTED.whyPlaceholder}
          required
          disabled={disabled}
        />
      </div>

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_GET_STARTED.familySectionTitle}</h2>
        <p className="doedtc-muted">{DOEDTC_GET_STARTED.familySectionHint}</p>
        {familyMembers.length > 0 ? (
          <ul className="doedtc-row-list">
            {familyMembers.map((member) => (
              <li className="doedtc-row-item" key={member.id}>
                <div>
                  <strong>{member.fullName}</strong>
                  <p className="doedtc-row-item__meta">
                    {RELATIONSHIP_OPTIONS.find((option) => option.value === member.relationship)?.label}
                  </p>
                  {member.phone ? <p className="doedtc-row-item__meta">{member.phone}</p> : null}
                </div>
                <div className="doedtc-row-item__actions">
                  {member.phone ? (
                    <button
                      className="doedtc-button doedtc-button--secondary"
                      type="button"
                      onClick={() =>
                        setFamilyMembers(
                          familyMembers.map((item) =>
                            item.id === member.id ? { ...item, sendInvite: !item.sendInvite } : item,
                          ),
                        )
                      }
                    >
                      {member.sendInvite
                        ? DOEDTC_GET_STARTED.familyInviteQueuedLabel
                        : DOEDTC_GET_STARTED.familyInviteLabel}
                    </button>
                  ) : null}
                  <button
                    className="doedtc-icon-button"
                    type="button"
                    onClick={() => setFamilyMembers(familyMembers.filter((item) => item.id !== member.id))}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_GET_STARTED.familyNameLabel}</label>
          <input
            className="doedtc-input"
            value={familyDraft.fullName}
            onChange={(event) => setFamilyDraft({ ...familyDraft, fullName: event.target.value })}
          />
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label className="doedtc-label">{DOEDTC_GET_STARTED.familyRelationshipLabel}</label>
          <select
            className="doedtc-select"
            value={familyDraft.relationship}
            onChange={(event) =>
              setFamilyDraft({
                ...familyDraft,
                relationship: event.target.value as DoeDtcFamilyRelationship,
              })
            }
          >
            {RELATIONSHIP_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {familyDraft.relationship === "child" ? (
          <div style={{ marginTop: "0.75rem" }}>
            <label className="doedtc-label">{DOEDTC_GET_STARTED.familyDobLabel}</label>
            <input
              className="doedtc-input"
              type="date"
              value={familyDraft.dateOfBirth}
              onChange={(event) => setFamilyDraft({ ...familyDraft, dateOfBirth: event.target.value })}
            />
          </div>
        ) : null}
        {!familyDraft.noPhone ? (
          <div style={{ marginTop: "0.75rem" }}>
            <label className="doedtc-label">{DOEDTC_GET_STARTED.familyPhoneLabel}</label>
            <input
              className="doedtc-input"
              value={familyDraft.phone}
              onChange={(event) => setFamilyDraft({ ...familyDraft, phone: event.target.value })}
            />
          </div>
        ) : null}
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.75rem" }}>
          <input
            type="checkbox"
            checked={familyDraft.noPhone}
            onChange={(event) => setFamilyDraft({ ...familyDraft, noPhone: event.target.checked })}
          />
          <span>{DOEDTC_GET_STARTED.familyNoPhoneLabel}</span>
        </label>
        <button
          className="doedtc-button doedtc-button--secondary"
          type="button"
          onClick={addFamilyMember}
          disabled={!familyDraft.fullName.trim()}
        >
          {DOEDTC_GET_STARTED.familyAddLabel}
        </button>
      </div>

      <div className="doedtc-section">
        <h2 className="doedtc-section-title">{DOEDTC_GET_STARTED.medicalSectionTitle}</h2>
        <div className="doedtc-toggle-row">
          <button
            type="button"
            className={`doedtc-toggle${medicalMode === "now" ? " doedtc-toggle--active" : ""}`}
            onClick={() => setMedicalMode("now")}
          >
            {DOEDTC_GET_STARTED.medicalNowLabel}
          </button>
          <button
            type="button"
            className={`doedtc-toggle${medicalMode === "later" ? " doedtc-toggle--active" : ""}`}
            onClick={() => setMedicalMode("later")}
          >
            {DOEDTC_GET_STARTED.medicalLaterLabel}
          </button>
        </div>
        {medicalMode === "later" ? (
          <p className="doedtc-muted" style={{ marginTop: "0.75rem" }}>
            {DOEDTC_GET_STARTED.medicalLaterHint}
          </p>
        ) : (
          <>
            <TagField
              label={DOEDTC_GET_STARTED.medicationsLabel}
              placeholder={DOEDTC_GET_STARTED.medicationsPlaceholder}
              values={medications}
              onChange={setMedications}
            />
            <TagField
              label={DOEDTC_GET_STARTED.conditionsLabel}
              placeholder={DOEDTC_GET_STARTED.conditionsPlaceholder}
              values={conditions}
              onChange={setConditions}
            />
          </>
        )}
      </div>

      {error ? <p className="doedtc-error">{error}</p> : null}

      <button className="doedtc-button" type="submit" disabled={disabled}>
        {status === "loading" ? DOEDTC_GET_STARTED.submittingLabel : DOEDTC_GET_STARTED.submitLabel}
      </button>
    </form>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DoeDtcDobMenu } from "@/components/doedtc/DoeDtcDobMenu";
import { DoeDtcDropdown } from "@/components/doedtc/DoeDtcDropdown";
import { DOEDTC_GET_STARTED } from "@/lib/doedtc/doedtc-copy";
import { dmSans } from "@/lib/home/fonts";
import { doeDtcFindPhoneCountry, DOEDTC_PHONE_COUNTRIES } from "@/lib/doedtc/doedtc-phone-countries";
import { doeDtcGenderLabel, DOEDTC_GENDERS, type DoeDtcFamilyRelationship, type DoeDtcGender } from "@/lib/doedtc/doedtc-types";

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

function CheckCircleIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 12.2 10.2 16 17.5 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NextArrowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6.4 9.6a3.2 3.2 0 0 0 4.53 0l1.67-1.67a3.2 3.2 0 0 0-4.53-4.53L7.2 4.27"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.6 6.4a3.2 3.2 0 0 0-4.53 0L3.4 8.07a3.2 3.2 0 0 0 4.53 4.53L8.8 11.73"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditPencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11.2 2.6a1.15 1.15 0 0 1 1.63 1.62L6.1 10.95 3.5 11.5l.55-2.6 7.15-6.3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10.35 3.45l2.2 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDobLabel(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value || "—";
  const month = MONTH_LABELS[Number(match[2]) - 1];
  if (!month) return value;
  return `${month} ${Number(match[3])}, ${match[1]}`;
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
  gender: DoeDtcGender | "";
  phone: string;
  textPhone: boolean | null;
  dateOfBirth: string;
  sendInvite: boolean;
};

type OnboardConnectionId = "outlook" | "gmail" | "twitter" | "linkedin";

const ONBOARD_CONNECTIONS: Array<{ id: OnboardConnectionId; label: string }> = [
  { id: "outlook", label: DOEDTC_GET_STARTED.connectionsOutlook },
  { id: "gmail", label: DOEDTC_GET_STARTED.connectionsGmail },
  { id: "twitter", label: DOEDTC_GET_STARTED.connectionsTwitter },
  { id: "linkedin", label: DOEDTC_GET_STARTED.connectionsLinkedin },
];

type DoeDtcOnboardStep = "profile" | "medical" | "review" | "success";

type DoeDtcGetStartedFormProps = {
  token: string;
  valid: boolean;
  preview?: boolean;
  initialStep?: DoeDtcOnboardStep;
  onComplete?: () => void;
};

export function DoeDtcGetStartedForm({
  token,
  valid,
  preview = false,
  initialStep = "profile",
  onComplete,
}: DoeDtcGetStartedFormProps) {
  const previewFilled = preview && initialStep !== "profile";
  const [fullName, setFullName] = useState(previewFilled ? "James Lisondra" : "");
  const [email, setEmail] = useState(previewFilled ? "james@doe.care" : "");
  const [dateOfBirth, setDateOfBirth] = useState(previewFilled ? "1994-03-12" : "");
  const [gender, setGender] = useState<DoeDtcGender | "">(previewFilled ? "male" : "");
  const [country, setCountry] = useState(previewFilled ? "CA" : "");
  const [medications, setMedications] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [medicalMode, setMedicalMode] = useState<"now" | "later">("now");
  const [connectionsMode, setConnectionsMode] = useState<"now" | "later">("later");
  const [linkedConnections, setLinkedConnections] = useState<OnboardConnectionId[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyDraft[]>(
    previewFilled
      ? [
          {
            id: "preview-simon",
            fullName: "Simon",
            relationship: "child",
            gender: "male",
            phone: "",
            textPhone: false,
            dateOfBirth: "2016-08-30",
            sendInvite: false,
          },
        ]
      : [],
  );
  const [familyOpen, setFamilyOpen] = useState(false);
  const [familyDraft, setFamilyDraft] = useState<FamilyDraft>({
    id: "draft",
    fullName: "",
    relationship: "other",
    gender: "",
    phone: "",
    textPhone: null,
    dateOfBirth: "",
    sendInvite: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    initialStep === "success" ? "success" : "idle",
  );
  const [error, setError] = useState("");
  const [messagesHref, setMessagesHref] = useState("");
  const [profileHref, setProfileHref] = useState("");
  const [step, setStep] = useState<DoeDtcOnboardStep>(initialStep);
  const formRef = useRef<HTMLFormElement>(null);

  const disabled = useMemo(() => !valid || status === "loading" || status === "success", [status, valid]);

  useEffect(() => {
    if (status === "success") onComplete?.();
  }, [onComplete, status]);

  if (!valid) {
    return (
      <div className="doedtc-card">
        <strong>{DOEDTC_GET_STARTED.invalidTokenTitle}</strong>
        <p>{DOEDTC_GET_STARTED.invalidTokenBody}</p>
      </div>
    );
  }

  if (status === "success") {
    const fallbackHref = messagesHref || profileHref || "#";
    return (
      <div className="doedtc-onboard-success">
        <div className="doedtc-onboard-success__stage">
          <div className="doedtc-onboard-success__center">
            <div className="doedtc-onboard-success__mark" aria-hidden>
              <CheckCircleIcon />
            </div>
            <h1 className={`doedtc-onboard-success__title ${dmSans.className}`}>
              {DOEDTC_GET_STARTED.allSetTitle}
            </h1>
            <p className="doedtc-onboard-success__body">{DOEDTC_GET_STARTED.allSetBody}</p>
          </div>
          <p className="doedtc-onboard-success__fallback">
            {DOEDTC_GET_STARTED.allSetNoTextPrefix}{" "}
            <a className="doedtc-onboard-success__fallback-link" href={fallbackHref}>
              {DOEDTC_GET_STARTED.allSetNoTextAction}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </p>
        </div>
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
        phone: familyDraft.textPhone ? familyDraft.phone.trim() : "",
        sendInvite: Boolean(familyDraft.textPhone && familyDraft.phone.trim()),
      },
    ]);
    setFamilyDraft({
      id: "draft",
      fullName: "",
      relationship: "other",
      gender: "",
      phone: "",
      textPhone: null,
      dateOfBirth: "",
      sendInvite: false,
    });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (step === "profile") {
      goToMedical();
      return;
    }
    if (step === "medical") {
      goToReview();
      return;
    }
    setStatus("loading");
    setError("");

    try {
      if (preview) {
        setProfileHref("/profile");
        setMessagesHref("sms:");
        setStatus("success");
        return;
      }
      const response = await fetch("/api/doedtc/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName,
          email,
          dateOfBirth,
          gender,
          country,
          medications: medicalMode === "now" ? medications : [],
          conditions: medicalMode === "now" ? conditions : [],
          medicalDeferred: medicalMode === "later",
          familyMembers: familyMembers.map((member) => ({
            fullName: member.fullName,
            relationship: member.relationship,
            gender: member.gender || null,
            phone: member.textPhone ? member.phone || null : null,
            dateOfBirth: member.dateOfBirth || null,
            sendInvite: Boolean(member.textPhone && member.phone),
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

  function validateProfileStep(): boolean {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return false;
    }
    if (!dateOfBirth) {
      setError("Select your date of birth.");
      return false;
    }
    if (!gender) {
      setError("Select a gender.");
      return false;
    }
    if (!country) {
      setError("Select a country.");
      return false;
    }
    setError("");
    return true;
  }

  function goToMedical() {
    if (!validateProfileStep()) return;
    setStep("medical");
    window.scrollTo(0, 0);
  }

  function goToReview() {
    setError("");
    setStep("review");
    window.scrollTo(0, 0);
  }

  function goBackToProfile() {
    setError("");
    setStep("profile");
    window.scrollTo(0, 0);
  }

  function goBackToMedical() {
    setError("");
    setStep("medical");
    window.scrollTo(0, 0);
  }

  function renderProfileSummary(onEdit: () => void) {
    return (
      <div className="doedtc-card doedtc-onboard-summary">
        <div className="doedtc-onboard-summary__body">
          <div className="doedtc-onboard-summary__row">
            <span className="doedtc-onboard-summary__label">{DOEDTC_GET_STARTED.fullNameLabel}</span>
            <strong>{fullName.trim() || "—"}</strong>
          </div>
          <div className="doedtc-onboard-summary__row">
            <span className="doedtc-onboard-summary__label">{DOEDTC_GET_STARTED.emailLabel}</span>
            <p>{email.trim() || "—"}</p>
          </div>
          <div className="doedtc-onboard-summary__row">
            <span className="doedtc-onboard-summary__label">{DOEDTC_GET_STARTED.dobLabel}</span>
            <p>{formatDobLabel(dateOfBirth)}</p>
          </div>
          <div className="doedtc-onboard-summary__split">
            <div className="doedtc-onboard-summary__row">
              <span className="doedtc-onboard-summary__label">{DOEDTC_GET_STARTED.genderLabel}</span>
              <p>{gender ? doeDtcGenderLabel(gender) : "—"}</p>
            </div>
            <div className="doedtc-onboard-summary__row">
              <span className="doedtc-onboard-summary__label">{DOEDTC_GET_STARTED.countryLabel}</span>
              <p>{country ? doeDtcFindPhoneCountry(country).name : "—"}</p>
            </div>
          </div>
          <div className="doedtc-onboard-summary__row">
            <span className="doedtc-onboard-summary__label">{DOEDTC_GET_STARTED.familySectionTitle}</span>
            {familyMembers.length > 0 ? (
              <ul className="doedtc-onboard-summary__family">
                {familyMembers.map((member) => (
                  <li key={member.id}>
                    {member.fullName}
                    <span>
                      {RELATIONSHIP_OPTIONS.find((option) => option.value === member.relationship)?.label}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="doedtc-muted">{DOEDTC_GET_STARTED.summaryFamilyEmpty}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          className="doedtc-onboard-summary__edit"
          aria-label={DOEDTC_GET_STARTED.summaryEditLabel}
          onClick={onEdit}
        >
          <EditPencilIcon />
        </button>
      </div>
    );
  }

  function renderOnboardNext(onClick: () => void) {
    return (
      <div className="doedtc-onboard-actions">
        <button
          className="doedtc-onboard-next"
          type="button"
          aria-label={DOEDTC_GET_STARTED.nextLabel}
          onClick={onClick}
          disabled={disabled}
        >
          <NextArrowIcon />
        </button>
      </div>
    );
  }

  function renderMedicalSummary(onEdit: () => void) {
    return (
      <div className="doedtc-card doedtc-onboard-summary">
        <div className="doedtc-onboard-summary__body">
          <div className="doedtc-onboard-summary__row">
            <span className="doedtc-onboard-summary__label">{DOEDTC_GET_STARTED.medicalSectionTitle}</span>
            {medicalMode === "later" ? (
              <p className="doedtc-muted">{DOEDTC_GET_STARTED.summaryMedicalDeferred}</p>
            ) : null}
          </div>
          {medicalMode === "now" ? (
            <>
              <div className="doedtc-onboard-summary__row">
                <span className="doedtc-onboard-summary__label">{DOEDTC_GET_STARTED.medicationsLabel}</span>
                {medications.length > 0 ? (
                  <p>{medications.join(", ")}</p>
                ) : (
                  <p className="doedtc-muted">{DOEDTC_GET_STARTED.summaryMedicationsEmpty}</p>
                )}
              </div>
              <div className="doedtc-onboard-summary__row">
                <span className="doedtc-onboard-summary__label">{DOEDTC_GET_STARTED.conditionsLabel}</span>
                {conditions.length > 0 ? (
                  <p>{conditions.join(", ")}</p>
                ) : (
                  <p className="doedtc-muted">{DOEDTC_GET_STARTED.summaryConditionsEmpty}</p>
                )}
              </div>
            </>
          ) : null}
        </div>
        <button
          type="button"
          className="doedtc-onboard-summary__edit"
          aria-label={DOEDTC_GET_STARTED.summaryEditLabel}
          onClick={onEdit}
        >
          <EditPencilIcon />
        </button>
      </div>
    );
  }

  function toggleConnection(id: OnboardConnectionId) {
    if (connectionsMode !== "now") return;
    setLinkedConnections((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function renderConnectionsBox() {
    const active = connectionsMode === "now";
    return (
      <div className="doedtc-card">
        <h2 className="doedtc-section-title">{DOEDTC_GET_STARTED.connectionsSectionTitle}</h2>
        <div className="doedtc-toggle-row">
          <button
            type="button"
            className={`doedtc-toggle${connectionsMode === "now" ? " doedtc-toggle--active" : ""}`}
            onClick={() => setConnectionsMode("now")}
          >
            {DOEDTC_GET_STARTED.connectionsNowLabel}
          </button>
          <button
            type="button"
            className={`doedtc-toggle${connectionsMode === "later" ? " doedtc-toggle--active" : ""}`}
            onClick={() => setConnectionsMode("later")}
          >
            {DOEDTC_GET_STARTED.connectionsLaterLabel}
          </button>
        </div>
        {connectionsMode === "later" ? (
          <p className="doedtc-muted" style={{ marginTop: "0.75rem" }}>
            {DOEDTC_GET_STARTED.connectionsLaterHint}
          </p>
        ) : null}
        <ul className={`doedtc-onboard-connections${active ? "" : " doedtc-onboard-connections--inactive"}`}>
          {ONBOARD_CONNECTIONS.map((connection) => {
            const linked = linkedConnections.includes(connection.id);
            return (
              <li
                className={`doedtc-onboard-connection${linked ? " doedtc-onboard-connection--linked" : ""}`}
                key={connection.id}
              >
                <span>{connection.label}</span>
                <button
                  type="button"
                  className="doedtc-onboard-connection__link"
                  aria-label={
                    linked
                      ? `${DOEDTC_GET_STARTED.connectionsLinkedLabel} ${connection.label}`
                      : `${DOEDTC_GET_STARTED.connectionsLinkLabel} ${connection.label}`
                  }
                  disabled={!active}
                  onClick={() => toggleConnection(connection.id)}
                >
                  <LinkIcon />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      {step === "profile" ? (
        <>
      <div className="doedtc-card">
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

        <div style={{ marginTop: "1rem" }}>
          <DoeDtcDobMenu
            id="doedtc-dob"
            label={DOEDTC_GET_STARTED.dobLabel}
            value={dateOfBirth}
            placeholder={DOEDTC_GET_STARTED.dobPlaceholder}
            disabled={disabled}
            onChange={setDateOfBirth}
          />
        </div>

        <div className="doedtc-field-row">
          <DoeDtcDropdown<DoeDtcGender | "">
            id="doedtc-gender"
            variant="onboard"
            label={DOEDTC_GET_STARTED.genderLabel}
            value={gender}
            options={DOEDTC_GENDERS}
            disabled={disabled}
            onChange={setGender}
          />
          <DoeDtcDropdown
            id="doedtc-country"
            variant="onboard"
            label={DOEDTC_GET_STARTED.countryLabel}
            value={country}
            options={DOEDTC_PHONE_COUNTRIES.map((item) => ({ value: item.iso, label: item.name }))}
            disabled={disabled}
            onChange={setCountry}
          />
        </div>
      </div>

      <div className="doedtc-card">
        <h2 className="doedtc-section-title">{DOEDTC_GET_STARTED.familySectionTitle}</h2>
        <p className="doedtc-muted">{DOEDTC_GET_STARTED.familySectionHint}</p>
        {familyOpen ? (
          <>
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
          <DoeDtcDropdown
            variant="onboard"
            label={DOEDTC_GET_STARTED.familyRelationshipLabel}
            value={familyDraft.relationship}
            options={RELATIONSHIP_OPTIONS}
            onChange={(value) =>
              setFamilyDraft({
                ...familyDraft,
                relationship: value,
              })
            }
          />
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <DoeDtcDropdown<DoeDtcGender | "">
            variant="onboard"
            label={DOEDTC_GET_STARTED.genderLabel}
            value={familyDraft.gender}
            options={DOEDTC_GENDERS}
            onChange={(value) => setFamilyDraft({ ...familyDraft, gender: value })}
          />
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <DoeDtcDobMenu
            label={DOEDTC_GET_STARTED.familyDobLabel}
            value={familyDraft.dateOfBirth}
            placeholder={DOEDTC_GET_STARTED.familyDobPlaceholder}
            onChange={(value) => setFamilyDraft({ ...familyDraft, dateOfBirth: value })}
          />
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <p className="doedtc-label">{DOEDTC_GET_STARTED.familyPhonePrompt}</p>
          <div className="doedtc-toggle-row">
            <button
              type="button"
              className={`doedtc-toggle${familyDraft.textPhone === true ? " doedtc-toggle--active" : ""}`}
              onClick={() => setFamilyDraft({ ...familyDraft, textPhone: true })}
            >
              {DOEDTC_GET_STARTED.familyPhoneYes}
            </button>
            <button
              type="button"
              className={`doedtc-toggle${familyDraft.textPhone === false ? " doedtc-toggle--active" : ""}`}
              onClick={() => setFamilyDraft({ ...familyDraft, textPhone: false, phone: "" })}
            >
              {DOEDTC_GET_STARTED.familyPhoneNo}
            </button>
          </div>
        </div>
        {familyDraft.textPhone ? (
          <div style={{ marginTop: "0.75rem" }}>
            <label className="doedtc-label">{DOEDTC_GET_STARTED.familyPhoneLabel}</label>
            <input
              className="doedtc-input"
              value={familyDraft.phone}
              onChange={(event) => setFamilyDraft({ ...familyDraft, phone: event.target.value })}
            />
          </div>
        ) : null}
        <button
          className="doedtc-button doedtc-button--secondary"
          type="button"
          onClick={addFamilyMember}
          disabled={!familyDraft.fullName.trim() || (familyDraft.textPhone === true && !familyDraft.phone.trim())}
        >
          {DOEDTC_GET_STARTED.familyAddLabel}
        </button>
          </>
        ) : (
          <button
            className="doedtc-button"
            type="button"
            onClick={() => setFamilyOpen(true)}
          >
            {DOEDTC_GET_STARTED.familyBuildLabel}
          </button>
        )}
      </div>
          {error ? <p className="doedtc-error">{error}</p> : null}
          {renderOnboardNext(goToMedical)}
        </>
      ) : step === "medical" ? (
        <>
          {renderProfileSummary(goBackToProfile)}
          <div className="doedtc-card">
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
          {renderOnboardNext(goToReview)}
        </>
      ) : (
        <>
          <h2 className="doedtc-section-title">{DOEDTC_GET_STARTED.reviewSectionTitle}</h2>
          {renderProfileSummary(goBackToProfile)}
          {renderMedicalSummary(goBackToMedical)}
          {renderConnectionsBox()}
          {error ? <p className="doedtc-error">{error}</p> : null}
          <div className="doedtc-onboard-actions">
            <button className="doedtc-button" type="submit" disabled={disabled}>
              {status === "loading" ? DOEDTC_GET_STARTED.submittingLabel : DOEDTC_GET_STARTED.submitLabel}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

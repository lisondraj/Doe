"use client";

import { type ChangeEvent, type FormEvent, type ReactNode, useState } from "react";

import {
  JOBS_ANY_ROLE,
  JOBS_AUTHORIZATION_OPTIONS,
  JOBS_CONTACT_EMAIL,
  JOBS_COUNTRIES,
  JOBS_FORM_COPY,
  JOBS_FORM_ID,
  JOBS_RESUME_ACCEPT,
  JOBS_RESUME_MAX_BYTES,
  JOBS_ROLE_OPTIONS,
  JOBS_START_OPTIONS,
  type JobsCountry,
} from "@/lib/jobs/jobs-copy";
import { p22Mackinac } from "@/lib/home/fonts";

type Status = { state: "idle" } | { state: "sending" } | { state: "sent"; name: string } | { state: "error"; message: string };

function Field({ label, optional, wide, children }: { label: string; optional?: boolean; wide?: boolean; children: ReactNode }) {
  return (
    <label className={`jobs-form__field${wide ? " jobs-form__field--wide" : ""}`}>
      <span className="jobs-form__label">
        {label}
        {optional ? <span className="jobs-form__optional"> (optional)</span> : null}
      </span>
      {children}
    </label>
  );
}

function Select({
  name,
  options,
  defaultValue,
  onChange,
}: {
  name: string;
  options: readonly string[] | readonly { value: string; label: string }[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <span className="jobs-form__select">
      <select name={name} required defaultValue={defaultValue ?? ""} onChange={(event) => onChange?.(event.currentTarget.value)}>
        {defaultValue ? null : (
          <option value="" disabled>
            Select
          </option>
        )}
        {options.map((option) => {
          const { value, label } = typeof option === "string" ? { value: option, label: option } : option;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 6l6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * "Indicate Your Interest" on every /jobs role: the essentials, an address that opens once the country is chosen, the
 * links a technical team looks at (LinkedIn, GitHub, a portfolio), a resume and a cover note. It posts to /api/jobs/apply,
 * which saves it to Supabase and emails James with the resume attached.
 */
export function JobsApplicationForm({ roleSlug, sourcePath }: { roleSlug?: string; sourcePath: string }) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [country, setCountry] = useState<JobsCountry | null>(null);
  const address = country ? JOBS_COUNTRIES[country] : null;

  const onResume = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file && file.size > JOBS_RESUME_MAX_BYTES) {
      event.currentTarget.value = "";
      setResumeName(null);
      setStatus({ state: "error", message: "Your resume must be 4 MB or smaller." });
      return;
    }
    setResumeName(file?.name ?? null);
    if (status.state === "error") setStatus({ state: "idle" });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("fullName") ?? "").trim().split(/\s+/)[0] || "there";
    setStatus({ state: "sending" });
    try {
      const response = await fetch("/api/jobs/apply", { method: "POST", body: data });
      const body = (await response.json().catch(() => null)) as { ok?: boolean; error?: string | null } | null;
      if (!response.ok || !body?.ok) {
        setStatus({ state: "error", message: body?.error || JOBS_FORM_COPY.error });
        return;
      }
      form.reset();
      setResumeName(null);
      setCountry(null);
      setStatus({ state: "sent", name });
    } catch {
      setStatus({ state: "error", message: JOBS_FORM_COPY.error });
    }
  };

  return (
    <section id={JOBS_FORM_ID} className="jobs-form" aria-labelledby="jobs-form-title">
      <header className="jobs-form__head">
        <h2 id="jobs-form-title" className={`jobs-form__title ${p22Mackinac.className}`}>
          {JOBS_FORM_COPY.title}
        </h2>
        <a className="jobs-form__mail" href={`mailto:${JOBS_CONTACT_EMAIL}`}>
          <MailIcon />
          {JOBS_CONTACT_EMAIL}
        </a>
      </header>

      {status.state === "sent" ? (
        <p className={`jobs-form__thanks ${p22Mackinac.className}`} role="status">
          {JOBS_FORM_COPY.thanks.replace("{name}", status.name)}
        </p>
      ) : (
        <form className="jobs-form__form" onSubmit={onSubmit}>
          <input type="hidden" name="sourcePath" value={sourcePath} />
          {/* Left empty by people; bots fill it. */}
          <input className="jobs-form__trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden />

          <div className="jobs-form__grid">
            <p className="jobs-form__group">{JOBS_FORM_COPY.groups.about}</p>
            <Field label="Full Name">
              <input type="text" name="fullName" autoComplete="name" required maxLength={200} />
            </Field>
            <Field label="Email Address">
              <input type="email" name="email" autoComplete="email" required maxLength={320} />
            </Field>
            <Field label="Phone Number" optional>
              <input type="tel" name="phone" autoComplete="tel" maxLength={60} />
            </Field>
            <Field label="Country">
              <Select name="country" options={Object.keys(JOBS_COUNTRIES)} onChange={(value) => setCountry(value as JobsCountry)} />
            </Field>
            {address ? (
              <>
                <Field label={address.regionLabel}>
                  <Select key={country} name="region" options={address.regions} />
                </Field>
                <Field label="City">
                  <input type="text" name="city" autoComplete="address-level2" required maxLength={120} />
                </Field>
                <Field label={address.postalLabel} optional>
                  <input type="text" name="postalCode" autoComplete="postal-code" maxLength={12} />
                </Field>
              </>
            ) : null}

            <p className="jobs-form__group">{JOBS_FORM_COPY.groups.role}</p>
            <Field label="Position of Interest" wide>
              <Select
                name="role"
                defaultValue={roleSlug ?? JOBS_ANY_ROLE.slug}
                options={JOBS_ROLE_OPTIONS.map((option) => ({ value: option.slug, label: option.title }))}
              />
            </Field>
            <Field label="Availability">
              <Select name="startTiming" options={JOBS_START_OPTIONS} />
            </Field>
            <Field label="Work Authorization">
              <Select name="workAuthorization" options={JOBS_AUTHORIZATION_OPTIONS} />
            </Field>

            <p className="jobs-form__group">{JOBS_FORM_COPY.groups.work}</p>
            <Field label="LinkedIn Profile" optional>
              <input type="text" name="linkedinUrl" placeholder="linkedin.com/in/you" inputMode="url" maxLength={500} />
            </Field>
            <Field label="GitHub Profile" optional>
              <input type="text" name="githubUrl" placeholder="github.com/you" inputMode="url" maxLength={500} />
            </Field>
            <Field label="Portfolio or Website" optional wide>
              <input type="text" name="portfolioUrl" placeholder="yoursite.com" inputMode="url" maxLength={500} />
            </Field>
            <Field label="Cover Note" wide>
              <textarea
                name="note"
                rows={5}
                required
                maxLength={4000}
                placeholder="Your relevant experience, and what you would want to own at Doe."
              />
            </Field>
            <div className="jobs-form__field jobs-form__field--wide">
              <span className="jobs-form__label">Resume</span>
              <label className={`jobs-form__file${resumeName ? " has-file" : ""}`}>
                <input type="file" name="resume" accept={JOBS_RESUME_ACCEPT} required onChange={onResume} />
                <UploadIcon />
                <span className="jobs-form__file-button">{resumeName ? "Replace Resume" : "Upload Resume"}</span>
                <span className="jobs-form__file-name">{resumeName ?? "PDF or Word document, up to 4 MB"}</span>
              </label>
            </div>
          </div>

          <label className="jobs-form__consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>{JOBS_FORM_COPY.consent}</span>
          </label>

          {status.state === "error" ? (
            <p className="jobs-form__error" role="alert">
              {status.message}
            </p>
          ) : null}

          <button type="submit" className="jobs-form__submit" disabled={status.state === "sending"}>
            {status.state === "sending" ? JOBS_FORM_COPY.sending : JOBS_FORM_COPY.submit}
          </button>
        </form>
      )}
    </section>
  );
}

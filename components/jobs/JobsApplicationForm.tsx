"use client";

import { type ChangeEvent, type FormEvent, type ReactNode, useState } from "react";

import {
  JOBS_ANY_ROLE,
  JOBS_AUTHORIZATION_OPTIONS,
  JOBS_FORM_COPY,
  JOBS_FORM_ID,
  JOBS_RESUME_ACCEPT,
  JOBS_RESUME_MAX_BYTES,
  JOBS_ROLE_OPTIONS,
  JOBS_START_OPTIONS,
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

function Select({ name, options, defaultValue }: { name: string; options: readonly { value: string; label: string }[]; defaultValue?: string }) {
  return (
    <span className="jobs-form__select">
      <select name={name} required defaultValue={defaultValue ?? ""}>
        {defaultValue ? null : (
          <option value="" disabled>
            Choose one
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/**
 * "Start Your Application" at the foot of /jobs and every /jobs role: an indication of interest for the founding team.
 * The essentials, the links a technical team looks at (LinkedIn, GitHub, a portfolio), a résumé, and a short note. It
 * posts to /api/jobs/apply, which saves it to Supabase and emails James with the résumé attached.
 */
export function JobsApplicationForm({ roleSlug, sourcePath }: { roleSlug?: string; sourcePath: string }) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [resumeName, setResumeName] = useState<string | null>(null);

  const onResume = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file && file.size > JOBS_RESUME_MAX_BYTES) {
      event.currentTarget.value = "";
      setResumeName(null);
      setStatus({ state: "error", message: "Your résumé must be 4 MB or smaller." });
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
        <p className="jobs-form__subtitle">{JOBS_FORM_COPY.subtitle}</p>
      </header>

      {status.state === "sent" ? (
        <p className={`jobs-form__thanks ${p22Mackinac.className}`} role="status">
          {JOBS_FORM_COPY.thanks.replace("{name}", status.name)}
        </p>
      ) : (
        <form className="jobs-form__form" onSubmit={onSubmit} noValidate={false}>
          <input type="hidden" name="sourcePath" value={sourcePath} />
          {/* Left empty by people; bots fill it. */}
          <input className="jobs-form__trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden />

          <div className="jobs-form__grid">
            <Field label="Full name">
              <input type="text" name="fullName" autoComplete="name" required maxLength={200} />
            </Field>
            <Field label="Email">
              <input type="email" name="email" autoComplete="email" required maxLength={320} />
            </Field>
            <Field label="Phone" optional>
              <input type="tel" name="phone" autoComplete="tel" maxLength={60} />
            </Field>
            <Field label="Where you're based">
              <input type="text" name="location" placeholder="City, Country" autoComplete="address-level2" required maxLength={200} />
            </Field>
            <Field label="Role you're interested in" wide>
              <Select
                name="role"
                defaultValue={roleSlug ?? JOBS_ANY_ROLE.slug}
                options={JOBS_ROLE_OPTIONS.map((option) => ({ value: option.slug, label: option.title }))}
              />
            </Field>
            <Field label="When you could start">
              <Select name="startTiming" options={JOBS_START_OPTIONS.map((value) => ({ value, label: value }))} />
            </Field>
            <Field label="Work authorization">
              <Select name="workAuthorization" options={JOBS_AUTHORIZATION_OPTIONS.map((value) => ({ value, label: value }))} />
            </Field>
            <Field label="LinkedIn" optional>
              <input type="text" name="linkedinUrl" placeholder="linkedin.com/in/you" inputMode="url" maxLength={500} />
            </Field>
            <Field label="GitHub" optional>
              <input type="text" name="githubUrl" placeholder="github.com/you" inputMode="url" maxLength={500} />
            </Field>
            <Field label="Portfolio or website" optional wide>
              <input type="text" name="portfolioUrl" placeholder="yoursite.com" inputMode="url" maxLength={500} />
            </Field>
            <Field label="What would you build at Doe?" wide>
              <textarea
                name="note"
                rows={5}
                required
                maxLength={4000}
                placeholder="A few lines on the work you do best, and what you'd want to own here."
              />
            </Field>
            <div className="jobs-form__field jobs-form__field--wide">
              <span className="jobs-form__label">Résumé</span>
              <label className="jobs-form__file">
                <input type="file" name="resume" accept={JOBS_RESUME_ACCEPT} required onChange={onResume} />
                <span className="jobs-form__file-button">{resumeName ? "Change file" : "Upload résumé"}</span>
                <span className="jobs-form__file-name">{resumeName ?? "PDF or Word, up to 4 MB"}</span>
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

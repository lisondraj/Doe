"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ADMIN_LOGIN_EMAIL_SENT_MESSAGE,
  ADMIN_LOGIN_INVALID_CODE_MESSAGE,
  normalizeAdminEmail,
} from "@/lib/admin/admin-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { inter, lora } from "@/lib/home/fonts";

type LoginStep = "email" | "code";

export function AdminLoginForm({ initialError }: { initialError?: string | null }) {
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError ?? null);

  const normalizedEmail = useMemo(() => normalizeAdminEmail(email), [email]);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-admin-page", "true");
    html.setAttribute("data-product-page", "true");
    return () => {
      html.removeAttribute("data-admin-page");
      html.removeAttribute("data-product-page");
    };
  }, []);

  const sendCode = async () => {
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      if (!normalizedEmail) {
        setError("Enter your email address.");
        return;
      }

      const response = await fetch("/api/admin/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string };

      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Could not send sign-in code.");
        return;
      }

      setStep("code");
      setMessage(payload.message ?? ADMIN_LOGIN_EMAIL_SENT_MESSAGE);
    } catch (sendFailure) {
      setError(sendFailure instanceof Error ? sendFailure.message : "Could not send sign-in code.");
    } finally {
      setSubmitting(false);
    }
  };

  const verifyCode = async () => {
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const token = code.trim();
      if (!token) {
        setError("Enter the code from your email.");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token,
        type: "email",
      });

      if (verifyError) {
        setError(ADMIN_LOGIN_INVALID_CODE_MESSAGE);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError(ADMIN_LOGIN_INVALID_CODE_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === "email") {
      void sendCode();
      return;
    }
    void verifyCode();
  };

  return (
    <div className={`admin-login-card ${inter.className}`}>
      <p className={`admin-login-card__eyebrow ${inter.className}`}>Doe Admin</p>
      <h1 className={`admin-login-card__title ${lora.className}`}>Sign in</h1>
      <p className="admin-login-card__description">
        Enter your authorized email. We&apos;ll send a one-time code — no password.
      </p>

      <form className="admin-login-form" onSubmit={onSubmit} noValidate>
        <label className="admin-login-field">
          <span className="admin-login-field__label">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={step === "code" || submitting}
            className="admin-login-field__input"
            placeholder="you@example.com"
          />
        </label>

        {step === "code" ? (
          <label className="admin-login-field">
            <span className="admin-login-field__label">Sign-in code</span>
            <input
              type="text"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              disabled={submitting}
              className="admin-login-field__input"
              placeholder="6-digit code"
            />
          </label>
        ) : null}

        <button type="submit" disabled={submitting} className="admin-login-submit">
          {submitting ? "Working…" : step === "email" ? "Send code" : "Verify code"}
        </button>

        {step === "code" ? (
          <button
            type="button"
            disabled={submitting}
            className="admin-login-secondary"
            onClick={() => {
              setStep("email");
              setCode("");
              setMessage(null);
              setError(null);
            }}
          >
            Use a different email
          </button>
        ) : null}
      </form>

      {message ? (
        <p role="status" className="admin-login-feedback admin-login-feedback--success">
          {message}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="admin-login-feedback admin-login-feedback--error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

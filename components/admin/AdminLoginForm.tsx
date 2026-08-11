"use client";

import { useEffect, useMemo, useState } from "react";

import { ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE, normalizeAdminEmail } from "@/lib/admin/admin-auth";
import { inter, lora } from "@/lib/home/fonts";

export function AdminLoginForm({ initialError }: { initialError?: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!normalizedEmail || !password) {
        setError("Enter your email and password.");
        return;
      }

      const response = await fetch("/api/admin/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        setError(payload.error ?? ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError(ADMIN_LOGIN_INVALID_CREDENTIALS_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`admin-login-card ${inter.className}`}>
      <p className={`admin-login-card__eyebrow ${inter.className}`}>Doe Admin</p>
      <h1 className={`admin-login-card__title ${lora.className}`}>Sign in</h1>
      <p className="admin-login-card__description">Enter your authorized email and password.</p>

      <form className="admin-login-form" onSubmit={signIn} noValidate>
        <label className="admin-login-field">
          <span className="admin-login-field__label">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
            className="admin-login-field__input"
            placeholder="you@example.com"
          />
        </label>

        <label className="admin-login-field">
          <span className="admin-login-field__label">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
            className="admin-login-field__input"
            placeholder="Password"
          />
        </label>

        <button type="submit" disabled={submitting} className="admin-login-submit">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {error ? (
        <p role="alert" className="admin-login-feedback admin-login-feedback--error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";

import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import {
  formatAdminDate,
  type AdminInternshipApplication,
} from "@/lib/admin/internship-applications";
import {
  formatConfirmationEmailStatus,
  formatConfirmationEmailTrigger,
  type InternshipConfirmationEmailLog,
} from "@/lib/admin/internship-application-emails";
import {
  ADMIN_MOBILE_BODY_TW,
  ADMIN_MOBILE_BUTTON_TW,
  ADMIN_MOBILE_INPUT_H,
  ADMIN_MOBILE_LABEL_TW,
  ADMIN_MOBILE_META_TW,
  ADMIN_MOBILE_SURFACE,
} from "@/lib/admin/admin-layout";
import { inter } from "@/lib/home/fonts";

type PanelVariant = "mobile" | "desktop";

function LogEntry({
  entry,
  variant,
}: {
  entry: InternshipConfirmationEmailLog;
  variant: PanelVariant;
}) {
  const failed = entry.status === "failed";
  const metaClass = variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[12px] text-neutral-500";
  const bodyClass = variant === "mobile" ? ADMIN_MOBILE_BODY_TW : "text-[13px] font-medium text-neutral-800";

  return (
    <li
      className={`border-b border-[#F0F0F0] py-3 last:border-b-0 ${
        variant === "mobile" ? "py-4 iphone-page:py-5" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={bodyClass}>{formatAdminDate(entry.sent_at)}</p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 font-semibold ${
            failed
              ? "bg-[#FCEEE8] text-[#BF593D]"
              : "bg-neutral-100 text-neutral-600"
          } ${variant === "mobile" ? "text-[0.95rem] iphone-page:text-[1rem]" : "text-[11px]"}`}
        >
          {formatConfirmationEmailStatus(entry.status)}
        </span>
      </div>
      <p className={`mt-1.5 ${metaClass}`}>{entry.recipient_email}</p>
      <p className={`mt-1 ${metaClass}`}>{formatConfirmationEmailTrigger(entry.trigger)}</p>
      {failed && entry.error_message ? (
        <p className={`mt-2 font-medium text-[#BF593D] ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[12px]"}`}>
          {entry.error_message}
        </p>
      ) : null}
    </li>
  );
}

export function ConfirmationEmailLogModal({
  open,
  application,
  variant,
  onClose,
  onApplicationUpdated,
}: {
  open: boolean;
  application: AdminInternshipApplication;
  variant: PanelVariant;
  onClose: () => void;
  onApplicationUpdated: (application: AdminInternshipApplication) => void;
}) {
  const [emails, setEmails] = useState<InternshipConfirmationEmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const loadEmails = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch(`/api/admin/internship-applications/${application.id}/emails`);
      const payload = (await response.json()) as {
        ok?: boolean;
        emails?: InternshipConfirmationEmailLog[];
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.emails) {
        throw new Error(payload.error || "Could not load confirmation email log.");
      }
      setEmails(payload.emails);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load confirmation email log.");
      setEmails([]);
    } finally {
      setLoading(false);
    }
  }, [application.id]);

  useEffect(() => {
    if (!open) return;
    setResendError(null);
    void loadEmails();
  }, [open, loadEmails]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleResend = async () => {
    setResending(true);
    setResendError(null);
    try {
      const response = await fetch(`/api/admin/internship-applications/${application.id}/resend-email`, {
        method: "POST",
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        emailSentAt?: string;
        log?: InternshipConfirmationEmailLog;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.emailSentAt) {
        throw new Error(payload.error || "Could not resend confirmation email.");
      }
      onApplicationUpdated({ ...application, email_sent_at: payload.emailSentAt });
      if (payload.log) {
        setEmails((current) => [payload.log!, ...current]);
      } else {
        await loadEmails();
      }
    } catch (error) {
      setResendError(error instanceof Error ? error.message : "Could not resend confirmation email.");
    } finally {
      setResending(false);
    }
  };

  if (!open) return null;

  const titleClass =
    variant === "mobile"
      ? "text-[clamp(1.5rem,1.25rem+0.9vmin,1.75rem)] iphone-page:text-[1.85rem] font-semibold tracking-tight text-neutral-900"
      : "text-[18px] font-semibold tracking-tight text-neutral-900";
  const panelClass =
    variant === "mobile"
      ? `mx-4 mb-4 mt-auto flex max-h-[min(88dvh,52rem)] w-[calc(100%-2rem)] flex-col overflow-hidden ${ADMIN_MOBILE_SURFACE} iphone-page:mx-5 iphone-page:mb-5`
      : "mx-4 flex max-h-[min(80vh,36rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]";
  const closeButtonClass =
    variant === "mobile"
      ? "flex h-11 w-11 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 iphone-page:h-12 iphone-page:w-12"
      : "flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100";
  const resendButtonClass =
    variant === "mobile"
      ? `${ADMIN_MOBILE_BUTTON_TW} ${ADMIN_MOBILE_INPUT_H} w-full`
      : "inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#E2E2E2] bg-white text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className={`fixed inset-0 z-[120] flex ${variant === "mobile" ? "items-end" : "items-center justify-center"} ${inter.className}`}>
      <button
        type="button"
        aria-label="Close confirmation email log"
        className="absolute inset-0 z-0 bg-black/30"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-email-log-title"
        className={`relative z-10 ${panelClass}`}
      >
        <header
          className={`flex items-start justify-between gap-3 border-b border-[#EFEFEF] ${
            variant === "mobile" ? "px-5 py-5 iphone-page:px-6 iphone-page:py-6" : "px-5 py-4"
          }`}
        >
          <div className="min-w-0">
            <p className={variant === "mobile" ? ADMIN_MOBILE_LABEL_TW : "text-[10px] font-semibold uppercase tracking-wider text-neutral-400"}>
              Confirmation emails
            </p>
            <h2 id="confirmation-email-log-title" className={`mt-1.5 ${titleClass}`}>
              Email log
            </h2>
            <p className={`mt-2 ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[12px] text-neutral-500"}`}>
              Last sent {formatAdminDate(application.email_sent_at)}
            </p>
          </div>
          <button type="button" onClick={onClose} className={closeButtonClass}>
            <DoeBuildIcon className={variant === "mobile" ? "h-6 w-6" : "h-5 w-5"}>
              <path d="M18 6 6 18M6 6l12 12" />
            </DoeBuildIcon>
          </button>
        </header>

        <div className={`min-h-0 flex-1 overflow-y-auto ${variant === "mobile" ? "px-5 py-2 iphone-page:px-6" : "px-5 py-2"}`}>
          {loading ? (
            <p className={`py-8 text-center ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[13px] text-neutral-500"}`}>
              Loading…
            </p>
          ) : loadError ? (
            <p className={`py-8 text-center font-medium text-[#BF593D] ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[13px]"}`}>
              {loadError}
            </p>
          ) : emails.length === 0 ? (
            <p className={`py-8 text-center ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[13px] text-neutral-500"}`}>
              No confirmation emails recorded yet.
            </p>
          ) : (
            <ul>
              {emails.map((entry) => (
                <LogEntry key={entry.id} entry={entry} variant={variant} />
              ))}
            </ul>
          )}
        </div>

        <footer
          className={`border-t border-[#EFEFEF] ${
            variant === "mobile" ? "px-5 py-5 iphone-page:px-6 iphone-page:py-6" : "px-5 py-4"
          }`}
        >
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={resending}
            className={resendButtonClass}
          >
            {resending ? "Sending…" : "Re-send confirmation email"}
          </button>
          {resendError ? (
            <p className={`mt-3 font-medium text-[#BF593D] ${variant === "mobile" ? ADMIN_MOBILE_META_TW : "text-[12px]"}`}>
              {resendError}
            </p>
          ) : null}
        </footer>
      </div>
    </div>
  );
}

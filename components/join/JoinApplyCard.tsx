"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";
import type { JoinApplyFormState } from "@/lib/join/join-apply-form";
import {
  JOIN_APPLY_COUNTRY_LABELS,
  JOIN_APPLY_EDUCATION_LABELS,
} from "@/lib/join/join-apply-form";
import { JOIN_DESKTOP_APPLY_CARD_HEIGHT } from "@/lib/join/join-layout";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

export const JOIN_APPLY_CARD_HEIGHT = "h-[56rem] iphone-page:h-[62rem]";

const CARD_STYLES = {
  mobile: {
    height: JOIN_APPLY_CARD_HEIGHT,
    placeholderLabel:
      "text-[clamp(1.05rem,3.2vw,1.35rem)] font-medium uppercase tracking-[0.22em] text-[#C8C0B4] iphone-page:text-[clamp(1.15rem,0.95rem+0.9vmin,1.45rem)] iphone-page:tracking-[0.24em]",
    namePlaceholder: "",
    nameText: "",
    topPad: "p-8 iphone-page:p-9",
    topLeftMaxW: "max-w-[44%] iphone-page:max-w-[42%]",
    topRightMaxW: "max-w-[56%] iphone-page:max-w-[58%]",
    topGap: "gap-9 iphone-page:gap-10",
    nameLeading: 1.04,
    nameCornerPad:
      "px-8 pb-14 pt-0 iphone-page:px-[clamp(2rem,1.65rem+1.45vmin,2.6rem)] iphone-page:pb-[clamp(3rem,2.5rem+1.8vmin,3.75rem)]",
    lineBand:
      "absolute inset-x-0 z-[1] bottom-[11.75rem] h-[10rem] iphone-page:bottom-[12.5rem] iphone-page:h-[11rem]",
    roleChip:
      "w-fit max-w-full shrink-0 rounded-xl px-2.5 py-1.5 text-left font-medium leading-tight tracking-[-0.01em] text-[#1E343A]/72 text-[clamp(1.2rem,4vw,1.55rem)] iphone-page:px-3 iphone-page:py-2 iphone-page:text-[clamp(1.3rem,1.1rem+1.2vmin,1.7rem)]",
    roleGap: "gap-y-2 iphone-page:gap-y-2.5",
    filledFieldText:
      "text-right font-medium leading-tight tracking-[-0.01em] text-[#9A8F82] text-[clamp(1.35rem,4.2vw,1.75rem)] iphone-page:text-[clamp(1.45rem,1.2rem+1.4vmin,1.85rem)]",
    editorPad: "px-8 py-12 iphone-page:px-10 iphone-page:py-14",
    editorMaxW: "max-w-[min(100%,34rem)]",
    resetSlot: "pt-12 iphone-page:pt-14",
    resetBtn: "gap-3.5 text-[1.5rem] iphone-page:text-[1.625rem]",
    resetIcon: "h-7 w-7 iphone-page:h-8 iphone-page:w-8",
    confirmTitle: "text-[1.75rem] leading-snug iphone-page:text-[1.9375rem]",
    confirmBtnSize: "w-full rounded-xl text-center font-medium leading-snug tracking-[-0.01em] px-5 py-[1.65rem] text-[1.375rem] iphone-page:rounded-[0.85rem] iphone-page:px-5 iphone-page:py-[1.85rem] iphone-page:text-[1.5rem]",
    confirmBtnGap: "mt-5 flex flex-col gap-3 iphone-page:gap-3.5",
    modalCloseBtn: "left-0 top-0",
    modalCloseIcon: "h-7 w-7 iphone-page:h-8 iphone-page:w-8",
  },
  desktop: {
    height: JOIN_DESKTOP_APPLY_CARD_HEIGHT,
    placeholderLabel: "text-[1.0625rem] font-medium uppercase tracking-[0.22em] text-[#C8C0B4]",
    namePlaceholder: "",
    nameText: "",
    topPad: "p-7",
    topLeftMaxW: "max-w-[42%]",
    topRightMaxW: "max-w-[56%]",
    topGap: "gap-8",
    nameLeading: 1.04,
    nameCornerPad: "px-7 pb-10 pt-0",
    lineBand: "absolute inset-x-0 z-[1] bottom-[8.25rem] h-[8.5rem]",
    roleChip:
      "w-fit max-w-full shrink-0 rounded-lg px-2.5 py-1.5 text-left font-medium leading-tight tracking-[-0.01em] text-[#1E343A]/72 text-[1.125rem]",
    roleGap: "gap-y-1.5",
    filledFieldText:
      "text-right font-medium leading-tight tracking-[-0.01em] text-[#9A8F82] text-[1.3125rem]",
    editorPad: "px-11 py-10",
    editorMaxW: "max-w-[min(100%,32rem)]",
    resetSlot: "pt-12",
    resetBtn: "gap-3.5 text-[1.4375rem]",
    resetIcon: "h-7 w-7",
    confirmTitle: "text-[1.3125rem] leading-snug",
    confirmBtnSize: "w-full rounded-xl text-center font-medium leading-snug tracking-[-0.01em] px-4 py-3.5 text-[1.0625rem]",
    confirmBtnGap: "mt-5 flex flex-col gap-2.5",
    modalCloseBtn: "left-0 top-0",
    modalCloseIcon: "h-6 w-6",
  },
} as const;

const MODAL_SCRIM = "bg-[#EFECE7]/72";

const NAME_LORA_MOBILE =
  "text-[clamp(2.35rem,8vw,3.55rem)] iphone-page:text-[clamp(2.5rem,1.9rem+3.4vmin,4.15rem)]";

const NAME_LORA_DESKTOP = "text-[clamp(2.2rem,4.8vw,3.35rem)]";

const NAME_SIZE = {
  mobile: { max: 4.15, min: 1.75, shrinkAfter: 20 },
  desktop: { max: 2.35, min: 1.25, shrinkAfter: 20 },
} as const;

/** Shrink font only after 20 total characters; padding and slot stay fixed. */
function nameFontSizeRem(fullName: string, variant: "mobile" | "desktop"): number {
  const { max, min, shrinkAfter } = NAME_SIZE[variant];
  const totalLen = fullName.trim().length;
  if (totalLen <= shrinkAfter) return max;
  return Math.max(min, max * (shrinkAfter / totalLen) ** 0.82);
}

const BOTTOM_LEFT_NAME_LINE =
  "block w-full min-w-0 appearance-none border-0 bg-transparent p-0 font-normal tracking-[-0.03em] outline-none whitespace-nowrap overflow-hidden text-ellipsis";

function splitNameLines(name: string): { first: string; last: string } {
  const trimmed = name.trimStart();
  const space = trimmed.indexOf(" ");
  if (space === -1) return { first: trimmed, last: "" };
  return { first: trimmed.slice(0, space), last: trimmed.slice(space + 1) };
}

function joinNameLines(first: string, last: string): string {
  const f = first.trimEnd();
  const l = last.trimStart();
  if (!f) return l;
  if (!l) return f;
  return `${f} ${l}`;
}

function JoinApplyCardNameField({
  variant,
  name,
  readOnly,
  onNameChange,
  cornerPad,
  leading,
}: {
  variant: "mobile" | "desktop";
  name: string;
  readOnly: boolean;
  onNameChange: (name: string) => void;
  cornerPad: string;
  leading: number;
}) {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const lastInputRef = useRef<HTMLInputElement>(null);
  const { first, last } = splitNameLines(name);
  const hasName = name.trim().length > 0;
  const fontSizeRem = nameFontSizeRem(name, variant);
  const loraSizeClass = variant === "mobile" ? NAME_LORA_MOBILE : NAME_LORA_DESKTOP;

  const rowStyle = {
    height: `${leading}em`,
    lineHeight: leading,
    fontSize: `${fontSizeRem}rem`,
  };
  const blockStyle = {
    fontSize: `${fontSizeRem}rem`,
    lineHeight: leading,
    height: `${leading * 2}em`,
  };

  const handleFirstChange = (value: string) => {
    const space = value.indexOf(" ");
    if (space >= 0) {
      const newFirst = value.slice(0, space);
      const rest = value.slice(space + 1);
      onNameChange(joinNameLines(newFirst, rest ? `${rest}${last ? ` ${last}` : ""}` : last));
      lastInputRef.current?.focus();
      return;
    }
    onNameChange(joinNameLines(value, last));
  };

  const focusName = () => {
    if (readOnly) return;
    if (!first.trim()) firstInputRef.current?.focus();
    else lastInputRef.current?.focus();
  };

  return (
    <div
      className={`w-[min(100%,19em)] ${cornerPad} pt-0 ${lora.className} ${loraSizeClass}`}
      onClick={focusName}
      onKeyDown={(e) => {
        if (readOnly) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          focusName();
        }
      }}
      role={readOnly ? undefined : "group"}
      aria-label={readOnly ? undefined : "Your name"}
    >
      <div className="relative w-full" style={blockStyle}>
        {!hasName && !readOnly ? (
          <div className="pointer-events-none absolute inset-0 text-[#C8C0B4]" aria-hidden>
            <div style={rowStyle}>Enter your</div>
            <div style={rowStyle}>name here</div>
          </div>
        ) : null}
        {readOnly ? (
          <>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[#1E343A]" style={rowStyle}>
              {first}
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[#1E343A]" style={rowStyle}>
              {last}
            </div>
          </>
        ) : (
          <>
            <input
              ref={firstInputRef}
              type="text"
              value={first}
              onChange={(e) => handleFirstChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === " " && !first.trim()) e.preventDefault();
                if (e.key === "Backspace" && !first && last) {
                  e.preventDefault();
                  lastInputRef.current?.focus();
                }
              }}
              autoComplete="given-name"
              aria-label="First name"
              className={`${BOTTOM_LEFT_NAME_LINE} text-[#1E343A]`}
              style={rowStyle}
            />
            <input
              ref={lastInputRef}
              type="text"
              value={last}
              onChange={(e) => onNameChange(joinNameLines(first, e.target.value))}
              autoComplete="family-name"
              aria-label="Last name"
              className={`${BOTTOM_LEFT_NAME_LINE} text-[#1E343A]`}
              style={rowStyle}
            />
          </>
        )}
      </div>
    </div>
  );
}

const TOP_RIGHT_FIELDS = [
  { step: 1, placeholder: "Email", singleLine: false },
  { step: 2, placeholder: "Country", singleLine: false },
  { step: 3, placeholder: "Education", singleLine: false },
  { step: 4, placeholder: "School", singleLine: false },
  { step: 7, placeholder: "LinkedIn", singleLine: false },
  { step: 6, placeholder: "Resume", singleLine: false },
] as const;

function spacedCapsLabel(label: string): string {
  return label.toUpperCase().split("").join(" ");
}

function CloseIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M5.25 5.25l9.5 9.5M14.75 5.25l-9.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ResetIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M4.25 4.25A7.25 7.25 0 1 1 3.2 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3.5 3.5v3.25h3.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function splitEmailLines(email: string): { local: string; domain: string } | null {
  const at = email.indexOf("@");
  if (at <= 0) return null;
  return { local: email.slice(0, at), domain: email.slice(at) };
}

function capitalizeFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatCardValue(step: number, raw: string): string {
  if (step === 1 || step === 7) return raw;
  return capitalizeFirst(raw);
}

function getTopRightDisplayValue(
  step: number,
  data: JoinApplyFormState,
  touchedSteps: ReadonlySet<number>,
): string | null {
  switch (step) {
    case 1:
      return data.email.trim() || null;
    case 2:
      return touchedSteps.has(2) ? JOIN_APPLY_COUNTRY_LABELS[data.country] : null;
    case 3:
      return touchedSteps.has(3) && data.education
        ? JOIN_APPLY_EDUCATION_LABELS[data.education]
        : null;
    case 4:
      return data.schoolName.trim() || null;
    case 6:
      return data.resume?.name ?? null;
    case 7:
      return data.linkedinUsername.trim() || null;
    default:
      return null;
  }
}

function ModalCloseButton({
  onClick,
  className,
  iconClass,
  padClass,
}: {
  onClick: () => void;
  className: string;
  iconClass: string;
  padClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={`absolute z-[6] flex items-center justify-center text-[#9A8F82] transition-colors hover:text-[#1E343A]/70 active:scale-95 ${padClass} ${className}`}
    >
      <CloseIcon className={iconClass} />
    </button>
  );
}

export function JoinApplyCard({
  variant = "mobile",
  data,
  activeStep,
  touchedSteps,
  onEdit,
  onCloseEditor,
  onNameChange,
  readOnly = false,
  editor,
  showResetConfirm = false,
  onResetRequest,
  onResetConfirm,
  onResetCancel,
}: {
  variant?: "mobile" | "desktop";
  data: JoinApplyFormState;
  activeStep: number | null;
  touchedSteps: ReadonlySet<number>;
  onEdit: (step: number) => void;
  onCloseEditor: () => void;
  onNameChange: (name: string) => void;
  readOnly?: boolean;
  editor?: ReactNode;
  showResetConfirm?: boolean;
  onResetRequest?: () => void;
  onResetConfirm?: () => void;
  onResetCancel?: () => void;
}) {
  const styles = CARD_STYLES[variant];
  const isEditing = activeStep !== null && activeStep !== 0;
  const name = data.name;

  return (
    <div className={`relative w-full ${!readOnly && onResetRequest ? styles.resetSlot : ""}`}>
      {!readOnly && onResetRequest ? (
        <button
          type="button"
          onClick={onResetRequest}
          className={`absolute right-0 top-0 z-[6] flex items-center font-medium leading-none tracking-[-0.01em] text-[#9A8F82] transition-colors hover:text-[#1E343A]/70 ${styles.resetBtn} ${inter.className}`}
        >
          <ResetIcon className={styles.resetIcon} />
          Reset
        </button>
      ) : null}

      <div
        className={`relative w-full overflow-hidden border ${styles.height} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
        style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
      >
        <div
          className={`absolute inset-0 ${isEditing || showResetConfirm ? "pointer-events-none" : ""}`}
        >
          <div className={`pointer-events-none ${styles.lineBand}`}>
            <JoinInternLineGraphic variant={2} fullBleed />
          </div>

          {/* Top-left: preferred roles */}
          <div className={`absolute left-0 top-0 z-[2] ${styles.topLeftMaxW} ${styles.topPad}`}>
            <div className={`flex flex-col items-start ${styles.roleGap} ${inter.className}`}>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onEdit(5)}
                className={`transition-opacity hover:opacity-90 active:scale-[0.98] ${styles.roleChip}`}
                style={{ backgroundColor: JOIN_FORM_BEIGE.fieldMuted }}
              >
                Preferred Roles
              </button>
              {data.areas.map((area) => (
                <button
                  key={area}
                  type="button"
                  disabled={readOnly}
                  onClick={() => onEdit(5)}
                  className={`transition-opacity hover:opacity-90 active:scale-[0.98] ${styles.roleChip} ${data.areas.length > 0 ? "[animation:join-card-field-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both]" : ""}`}
                  style={{ backgroundColor: JOIN_FORM_BEIGE.fieldMuted }}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Top-right: other fields */}
          <div className={`absolute right-0 top-0 z-[2] ${styles.topRightMaxW} ${styles.topPad}`}>
            <div className={`flex flex-col items-end ${styles.topGap}`}>
              {TOP_RIGHT_FIELDS.map(({ step, placeholder, singleLine }) => {
                const value = getTopRightDisplayValue(step, data, touchedSteps);
                const isLinkedIn = step === 7;
                const isEmail = step === 1;
                const emailLines = isEmail && value ? splitEmailLines(value) : null;
                const displayText = value
                  ? isLinkedIn
                    ? `/${formatCardValue(step, value)}`
                    : formatCardValue(step, value)
                  : spacedCapsLabel(placeholder);

                return (
                  <button
                    key={step}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onEdit(step)}
                    className={`max-w-full text-right transition-opacity hover:opacity-90 active:scale-[0.98] ${
                      singleLine ? "block overflow-hidden text-ellipsis whitespace-nowrap" : "whitespace-normal break-words"
                    } ${
                      value
                        ? `${styles.filledFieldText} [animation:join-card-field-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both]`
                        : styles.placeholderLabel
                    } ${isLinkedIn && value ? "flex items-center gap-1.5 justify-end" : ""} ${inter.className}`}
                  >
                    {isEmail && emailLines ? (
                      <span className="flex flex-col items-end leading-tight">
                        <span>{emailLines.local}</span>
                        <span>{emailLines.domain}</span>
                      </span>
                    ) : isLinkedIn && value ? (
                      <>
                        <LinkedInIcon className={variant === "mobile"
                          ? "h-[1.15em] w-[1.15em] shrink-0 iphone-page:h-[1.12em] iphone-page:w-[1.12em]"
                          : "h-[1.1em] w-[1.1em] shrink-0"
                        } />
                        <span className="min-w-0 break-words">{displayText}</span>
                      </>
                    ) : (
                      displayText
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom-left: inline name — outside blur layer so it stays fixed when editing */}
        <div
          className={`absolute bottom-0 left-0 z-[3] ${isEditing || showResetConfirm ? "pointer-events-none" : ""}`}
        >
          <JoinApplyCardNameField
            variant={variant}
            name={name}
            readOnly={readOnly}
            onNameChange={onNameChange}
            cornerPad={styles.nameCornerPad}
            leading={styles.nameLeading}
          />
        </div>

        {isEditing && editor ? (
          <>
            <button
              type="button"
              aria-label="Close editor"
              className={`absolute inset-0 z-[4] ${MODAL_SCRIM}`}
              onClick={onCloseEditor}
            />
            <ModalCloseButton
              onClick={onCloseEditor}
              className={styles.modalCloseBtn}
              iconClass={styles.modalCloseIcon}
              padClass={styles.topPad}
            />
            <div
              className={`absolute inset-0 z-[5] flex items-center justify-center ${styles.editorPad}`}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("[data-join-apply-interactive]")) return;
                onCloseEditor();
              }}
            >
              <div
                className={`w-full ${styles.editorMaxW} [animation:join-step-enter-down_0.38s_cubic-bezier(0.22,1,0.36,1)_both]`}
              >
                {editor}
              </div>
            </div>
          </>
        ) : null}

        {showResetConfirm ? (
          <>
            <button
              type="button"
              aria-label="Cancel reset"
              className={`absolute inset-0 z-[4] ${MODAL_SCRIM}`}
              onClick={onResetCancel}
            />
            <div
              className={`absolute inset-0 z-[5] flex items-center justify-center ${styles.editorPad}`}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("[data-join-apply-interactive]")) return;
                onResetCancel?.();
              }}
            >
              <div
                className={`w-full ${styles.editorMaxW} [animation:join-step-enter-down_0.38s_cubic-bezier(0.22,1,0.36,1)_both]`}
              >
                <p className={`font-medium tracking-[-0.02em] text-[#1E343A] ${styles.confirmTitle} ${inter.className}`}>
                  Are you sure?
                </p>
                <div className={styles.confirmBtnGap}>
                  <button
                    type="button"
                    data-join-apply-interactive
                    onClick={onResetConfirm}
                    className={`transition-colors hover:opacity-90 active:scale-[0.98] ${styles.confirmBtnSize} ${inter.className}`}
                    style={{
                      backgroundColor: JOIN_FORM_BEIGE.meter,
                      color: JOIN_FORM_BEIGE.page,
                    }}
                  >
                    Reset card
                  </button>
                  <button
                    type="button"
                    data-join-apply-interactive
                    onClick={onResetCancel}
                    className={`transition-colors hover:opacity-90 active:scale-[0.98] ${styles.confirmBtnSize} ${inter.className}`}
                    style={{
                      backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
                      color: "rgba(30, 52, 58, 0.58)",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

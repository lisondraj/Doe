"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";

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
      "text-[clamp(0.95rem,3vw,1.2rem)] font-medium uppercase tracking-[0.26em] text-[#C8C0B4] iphone-page:text-[clamp(1rem,0.85rem+0.8vmin,1.3rem)] iphone-page:tracking-[0.28em]",
    namePlaceholder:
      "text-[clamp(2.55rem,7.5vw,3.85rem)] leading-[1.04] text-[#C8C0B4] iphone-page:text-[clamp(2.85rem,2.35rem+2.9vmin,4.25rem)]",
    nameText:
      "text-[clamp(2.55rem,7.5vw,3.85rem)] leading-[1.04] iphone-page:text-[clamp(2.85rem,2.35rem+2.9vmin,4.25rem)]",
    topPad: "p-8 iphone-page:p-9",
    topLeftMaxW: "max-w-[44%] iphone-page:max-w-[42%]",
    topRightMaxW: "max-w-[52%] iphone-page:max-w-[54%]",
    topGap: "gap-5 iphone-page:gap-6",
    nameWidth: "w-[11.25rem] iphone-page:w-[12.5rem]",
    nameLeading: 1.04,
    lineBand:
      "absolute inset-x-0 top-[54%] bottom-[10.25rem] origin-bottom scale-[1.52] iphone-page:top-[52%] iphone-page:bottom-[11rem] iphone-page:scale-[1.58]",
    roleChip:
      "w-fit max-w-full shrink-0 rounded-xl px-2.5 py-1.5 text-left font-medium leading-tight tracking-[-0.01em] text-[#1E343A]/72 text-[clamp(1.2rem,4vw,1.55rem)] iphone-page:px-3 iphone-page:py-2 iphone-page:text-[clamp(1.3rem,1.1rem+1.2vmin,1.7rem)]",
    roleGap: "gap-y-2 iphone-page:gap-y-2.5",
    filledFieldText:
      "text-right font-medium leading-tight tracking-[-0.01em] text-[#9A8F82] text-[clamp(1.2rem,4vw,1.55rem)] iphone-page:text-[clamp(1.3rem,1.1rem+1.2vmin,1.7rem)]",
    editorPad: "px-8 py-12 iphone-page:px-10 iphone-page:py-14",
    editorMaxW: "max-w-[min(100%,34rem)]",
    cornerPad: "pl-10 pb-11 pr-8 pt-0 iphone-page:pl-11 iphone-page:pb-12 iphone-page:pr-9",
    resetSlot: "pt-12 iphone-page:pt-14",
    resetBtn: "gap-3.5 text-[1.5rem] iphone-page:text-[1.625rem]",
    resetIcon: "h-7 w-7 iphone-page:h-8 iphone-page:w-8",
    confirmTitle: "text-[1.625rem] iphone-page:text-[1.75rem]",
    confirmBody: "text-[1.125rem] iphone-page:text-[1.1875rem]",
    confirmBtn: "rounded-xl px-5 py-3 text-[1.125rem] iphone-page:rounded-[0.95rem] iphone-page:px-6 iphone-page:py-3.5 iphone-page:text-[1.1875rem]",
    modalCloseBtn: "left-0 top-0",
    modalCloseIcon: "h-7 w-7 iphone-page:h-8 iphone-page:w-8",
  },
  desktop: {
    height: JOIN_DESKTOP_APPLY_CARD_HEIGHT,
    placeholderLabel: "text-[0.9375rem] font-medium uppercase tracking-[0.24em] text-[#C8C0B4]",
    namePlaceholder: "text-[2.35rem] leading-[1.04] text-[#C8C0B4]",
    nameText: "text-[2.35rem] leading-[1.04]",
    topPad: "p-7",
    topLeftMaxW: "max-w-[42%]",
    topRightMaxW: "max-w-[54%]",
    topGap: "gap-4",
    nameWidth: "w-[9.75rem]",
    nameLeading: 1.04,
    lineBand: "absolute inset-x-0 top-[52%] bottom-[8.75rem] origin-bottom scale-[1.54]",
    roleChip:
      "w-fit max-w-full shrink-0 rounded-lg px-2.5 py-1.5 text-left font-medium leading-tight tracking-[-0.01em] text-[#1E343A]/72 text-[1.125rem]",
    roleGap: "gap-y-1.5",
    filledFieldText:
      "text-right font-medium leading-tight tracking-[-0.01em] text-[#9A8F82] text-[1.125rem]",
    editorPad: "px-11 py-10",
    editorMaxW: "max-w-[min(100%,32rem)]",
    cornerPad: "pl-9 pb-10 pr-7 pt-0",
    resetSlot: "pt-12",
    resetBtn: "gap-3.5 text-[1.4375rem]",
    resetIcon: "h-7 w-7",
    confirmTitle: "text-[1.5rem]",
    confirmBody: "text-[1.125rem]",
    confirmBtn: "rounded-lg px-4 py-2.5 text-[1.0625rem]",
    modalCloseBtn: "left-0 top-0",
    modalCloseIcon: "h-6 w-6",
  },
} as const;

const MODAL_SCRIM = "bg-[#EFECE7]/62 backdrop-blur-[10px]";
const CARD_BLUR = "blur-[12px]";

const NAME_SIZE = {
  mobile: { max: 3.85, min: 1.45, refChars: 9 },
  desktop: { max: 2.35, min: 1.15, refChars: 9 },
} as const;

function nameFontSizeRem(first: string, last: string, variant: "mobile" | "desktop"): number {
  const { max, min, refChars } = NAME_SIZE[variant];
  const longest = Math.max(first.length, last.length, 1);
  if (longest <= refChars) return max;
  return Math.max(min, max * (refChars / longest) ** 0.88);
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
  placeholderClass,
  cornerPad,
  nameWidth,
  leading,
}: {
  variant: "mobile" | "desktop";
  name: string;
  readOnly: boolean;
  onNameChange: (name: string) => void;
  placeholderClass: string;
  cornerPad: string;
  nameWidth: string;
  leading: number;
}) {
  const lastInputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const { first, last } = splitNameLines(name);
  const hasName = name.trim().length > 0;
  const fontSizeRem = nameFontSizeRem(first, last, variant);
  const [fitSizeRem, setFitSizeRem] = useState(fontSizeRem);
  const displayFontRem = hasName || readOnly ? fitSizeRem : NAME_SIZE[variant].max;

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) {
      setFitSizeRem(fontSizeRem);
      return;
    }

    const maxPx = fontSizeRem * 16;
    const minPx = NAME_SIZE[variant].min * 16;
    const longest = Math.max(first.length, last.length, 1);
    measure.style.fontSize = `${maxPx}px`;
    measure.textContent = "M".repeat(longest);
    const available = measure.parentElement?.clientWidth ?? maxPx * longest * 0.62;
    let next = fontSizeRem;
    if (measure.scrollWidth > available && available > 0) {
      next = Math.max(NAME_SIZE[variant].min, (maxPx * available) / measure.scrollWidth / 16);
    }
    setFitSizeRem(next);
  }, [first, last, fontSizeRem, variant]);

  const rowStyle = { height: `${leading}em`, lineHeight: leading, fontSize: `${displayFontRem}rem` };
  const blockStyle = { fontSize: `${displayFontRem}rem`, lineHeight: leading };

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

  return (
    <div className={`${nameWidth} ${cornerPad}`} style={blockStyle}>
      <div className="relative w-full" style={{ height: `${leading * 2}em` }}>
        <span
          ref={measureRef}
          aria-hidden
          className={`invisible absolute left-0 top-0 whitespace-nowrap ${lora.className}`}
        />
        {!hasName && !readOnly ? (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className={`${placeholderClass} text-[#C8C0B4] ${lora.className}`} style={rowStyle}>
              Enter your
            </div>
            <div className={`${placeholderClass} text-[#C8C0B4] ${lora.className}`} style={rowStyle}>
              name here
            </div>
          </div>
        ) : null}
        {readOnly ? (
          <>
            <div className={`text-[#1E343A] ${lora.className}`} style={rowStyle}>
              {first}
            </div>
            <div className={`text-[#1E343A] ${lora.className}`} style={rowStyle}>
              {last}
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              value={first}
              onChange={(e) => handleFirstChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === " " && !first.trim()) e.preventDefault();
              }}
              autoComplete="given-name"
              aria-label="First name"
              className={`text-[#1E343A] ${lora.className} ${BOTTOM_LEFT_NAME_LINE}`}
              style={rowStyle}
            />
            <input
              ref={lastInputRef}
              type="text"
              value={last}
              onChange={(e) => onNameChange(joinNameLines(first, e.target.value))}
              autoComplete="family-name"
              aria-label="Last name"
              className={`text-[#1E343A] ${lora.className} ${BOTTOM_LEFT_NAME_LINE}`}
              style={rowStyle}
            />
          </>
        )}
      </div>
    </div>
  );
}

const TOP_RIGHT_FIELDS = [
  { step: 1, placeholder: "Email", singleLine: true },
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
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <rect width="16" height="16" rx="2.5" fill="currentColor" />
      <path
        d="M4.5 6.5v5M4.5 4.5v.25M8 11.5V9a1.5 1.5 0 0 1 3 0v2.5M8 6.5v5"
        stroke="white"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
          className={`absolute inset-0 transition-[filter] duration-300 ${isEditing || showResetConfirm ? `pointer-events-none ${CARD_BLUR}` : ""}`}
        >
          <div className={`pointer-events-none absolute origin-center ${styles.lineBand}`}>
            <div className="relative h-full w-full">
              <JoinInternLineGraphic variant={2} fullBleed />
            </div>
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
                    {isLinkedIn && value ? (
                      <>
                        <LinkedInIcon className={variant === "mobile"
                          ? "h-[1.15em] w-[1.15em] shrink-0 iphone-page:h-[1.12em] iphone-page:w-[1.12em]"
                          : "h-[1.1em] w-[1.1em] shrink-0"
                        } />
                        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{displayText}</span>
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
            placeholderClass={styles.namePlaceholder}
            cornerPad={styles.cornerPad}
            nameWidth={styles.nameWidth}
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
            <div className={`absolute inset-0 z-[5] flex items-center justify-center ${styles.editorPad}`}>
              <div
                className={`w-full ${styles.editorMaxW} [animation:join-step-enter-down_0.38s_cubic-bezier(0.22,1,0.36,1)_both]`}
                onClick={(e) => e.stopPropagation()}
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
            <div className={`absolute inset-0 z-[5] flex items-center justify-center ${styles.editorPad}`}>
              <div
                className={`w-full ${styles.editorMaxW} [animation:join-step-enter-down_0.38s_cubic-bezier(0.22,1,0.36,1)_both]`}
                onClick={(e) => e.stopPropagation()}
              >
                <p className={`font-normal leading-snug tracking-[-0.02em] text-[#1E343A] ${styles.confirmTitle} ${lora.className}`}>
                  Are you sure?
                </p>
                <p className={`mt-2 text-[#1E343A]/60 ${styles.confirmBody} ${inter.className}`}>
                  This will clear everything on your applicant card.
                </p>
                <div className="mt-5 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onResetCancel}
                    className={`font-medium text-[#1E343A]/55 transition-colors hover:text-[#1E343A]/75 ${styles.confirmBtn} ${inter.className}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onResetConfirm}
                    className={`font-medium text-[#1E343A] transition-colors hover:opacity-90 ${styles.confirmBtn} ${inter.className}`}
                    style={{
                      backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
                    }}
                  >
                    Reset card
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

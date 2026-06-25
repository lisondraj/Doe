"use client";

import type { ReactNode } from "react";

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
    fieldText:
      "text-[clamp(1.95rem,5.8vw,2.85rem)] leading-[1.08] iphone-page:text-[clamp(2.15rem,1.75rem+2.4vmin,3.05rem)]",
    placeholderLabel:
      "text-[clamp(0.95rem,3vw,1.2rem)] font-medium uppercase tracking-[0.26em] text-[#C8C0B4] iphone-page:text-[clamp(1rem,0.85rem+0.8vmin,1.3rem)] iphone-page:tracking-[0.28em]",
    namePlaceholder:
      "text-[clamp(2.55rem,7.5vw,3.85rem)] leading-[1.04] text-[#C8C0B4] iphone-page:text-[clamp(2.85rem,2.35rem+2.9vmin,4.25rem)]",
    nameText:
      "text-[clamp(2.55rem,7.5vw,3.85rem)] leading-[1.04] iphone-page:text-[clamp(2.85rem,2.35rem+2.9vmin,4.25rem)]",
    topPad: "p-8 iphone-page:p-9",
    topMaxW: "max-w-[94%]",
    topGap: "gap-4 iphone-page:gap-5",
    nameWidth: "w-full max-w-[min(100%,18rem)] iphone-page:max-w-[min(100%,20rem)]",
    nameLineGap: "gap-0",
    lineBand: "absolute inset-0 origin-center scale-[1.34] iphone-page:scale-[1.4]",
    editBtn: "h-14 w-14 iphone-page:h-[3.75rem] iphone-page:w-[3.75rem] iphone-page:rounded-[1rem]",
    pencil: "h-6 w-6 iphone-page:h-[1.4rem] iphone-page:w-[1.4rem]",
    roleChip:
      "w-fit max-w-full shrink-0 rounded-xl px-2.5 py-1.5 text-[clamp(1.2rem,4vw,1.55rem)] iphone-page:px-3 iphone-page:py-2 iphone-page:text-[clamp(1.3rem,1.1rem+1.2vmin,1.7rem)]",
    roleGrid: "inline-grid grid-cols-1",
    roleGap: "gap-y-2 iphone-page:gap-y-2.5",
    editorPad: "px-8 py-12 iphone-page:px-10 iphone-page:py-14",
    editorMaxW: "max-w-[min(100%,34rem)]",
    cornerPad: "pl-9 pb-10 pr-8 iphone-page:pl-10 iphone-page:pb-12 iphone-page:pr-9",
    resetSlot: "pt-11 iphone-page:pt-12",
    resetBtn: "gap-3 text-[1.25rem] iphone-page:text-[1.375rem]",
    resetIcon: "h-6 w-6 iphone-page:h-7 iphone-page:w-7",
    confirmTitle: "text-[1.625rem] iphone-page:text-[1.75rem]",
    confirmBody: "text-[1.125rem] iphone-page:text-[1.1875rem]",
    confirmBtn: "rounded-xl px-5 py-3 text-[1.125rem] iphone-page:rounded-[0.95rem] iphone-page:px-6 iphone-page:py-3.5 iphone-page:text-[1.1875rem]",
    modalCloseBtn: "left-0 top-0",
    modalCloseIcon: "h-7 w-7 iphone-page:h-8 iphone-page:w-8",
  },
  desktop: {
    height: JOIN_DESKTOP_APPLY_CARD_HEIGHT,
    fieldText: "text-[1.5rem] leading-[1.14]",
    placeholderLabel: "text-[0.9375rem] font-medium uppercase tracking-[0.24em] text-[#C8C0B4]",
    namePlaceholder: "text-[2.35rem] leading-[1.04] text-[#C8C0B4]",
    nameText: "text-[2.35rem] leading-[1.04]",
    topPad: "p-7",
    topMaxW: "max-w-[94%]",
    topGap: "gap-3.5",
    nameWidth: "w-full max-w-[16rem]",
    nameLineGap: "gap-0",
    lineBand: "absolute inset-0 origin-center scale-[1.36]",
    editBtn: "h-12 w-12 rounded-lg",
    pencil: "h-[1.35rem] w-[1.35rem]",
    roleChip: "w-fit max-w-full shrink-0 rounded-lg px-2.5 py-1.5 text-[1.125rem]",
    roleGrid: "inline-grid grid-cols-1",
    roleGap: "gap-y-1.5",
    editorPad: "px-11 py-10",
    editorMaxW: "max-w-[min(100%,32rem)]",
    cornerPad: "pl-8 pb-9 pr-7",
    resetSlot: "pt-10",
    resetBtn: "gap-3 text-[1.1875rem]",
    resetIcon: "h-6 w-6",
    confirmTitle: "text-[1.5rem]",
    confirmBody: "text-[1.125rem]",
    confirmBtn: "rounded-lg px-4 py-2.5 text-[1.0625rem]",
    modalCloseBtn: "left-0 top-0",
    modalCloseIcon: "h-6 w-6",
  },
} as const;

const MODAL_SCRIM = "bg-[#EFECE7]/62 backdrop-blur-[10px]";
const CARD_BLUR = "blur-[12px]";

const BOTTOM_LEFT_NAME_LINE =
  "block w-full bg-transparent font-normal tracking-[-0.03em] leading-[1.04] outline-none";

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

const TOP_RIGHT_FIELDS = [
  { step: 1, placeholder: "Email" },
  { step: 2, placeholder: "Country" },
  { step: 3, placeholder: "Education" },
  { step: 4, placeholder: "School" },
  { step: 7, placeholder: "LinkedIn" },
  { step: 6, placeholder: "Resume" },
  { step: 8, placeholder: "Notes" },
] as const;

function spacedCapsLabel(label: string): string {
  return label.toUpperCase().split("").join(" ");
}

function PencilIcon({ className }: { className: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M11.5 2.5l2 2M2 14l.75-3.25L11.5 2.5l2 2L4.25 13.25 2 14z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

function capitalizeFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatCardValue(step: number, raw: string): string {
  if (step === 1) return raw;
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
    case 8:
      return data.notes.trim() || null;
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

function EditButton({
  onClick,
  label,
  className,
  pencilClass,
}: {
  onClick: () => void;
  label: string;
  className: string;
  pencilClass: string;
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
      aria-label={label}
      className={`flex shrink-0 items-center justify-center rounded-xl transition-all active:scale-95 ${className}`}
      style={{
        backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
        color: JOIN_FORM_BEIGE.meter,
      }}
    >
      <PencilIcon className={pencilClass} />
    </span>
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
  const hasName = name.trim().length > 0;

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

          {/* Top-left: roles */}
          <div className={`absolute left-0 top-0 z-[2] ${styles.topMaxW} ${styles.topPad}`}>
            <div className={`flex max-w-full items-start gap-1 ${inter.className}`}>
              {data.areas.length > 0 ? (
                <div className={`${styles.roleGrid} ${styles.roleGap}`}>
                  {data.areas.map((area) => (
                    <span
                      key={area}
                      className={`font-medium leading-tight tracking-[-0.01em] text-[#1E343A]/72 ${styles.roleChip}`}
                      style={{ backgroundColor: JOIN_FORM_BEIGE.fieldMuted }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => onEdit(5)}
                  className={`text-left ${styles.placeholderLabel}`}
                >
                  {spacedCapsLabel("Roles")}
                </button>
              )}
              {!readOnly ? (
                <EditButton
                  onClick={() => onEdit(5)}
                  label="Edit roles"
                  className={styles.editBtn}
                  pencilClass={styles.pencil}
                />
              ) : null}
            </div>
          </div>

          {/* Top-right: other fields */}
          <div className={`absolute right-0 top-0 z-[2] ${styles.topMaxW} ${styles.topPad}`}>
            <div className={`flex flex-col items-end ${styles.topGap}`}>
              {TOP_RIGHT_FIELDS.map(({ step, placeholder }) => {
                const value = getTopRightDisplayValue(step, data, touchedSteps);
                const textClass = value
                  ? `text-[#1E343A]/72 ${styles.fieldText}`
                  : styles.placeholderLabel;

                return (
                  <div
                    key={step}
                    className={`flex max-w-full items-start justify-end gap-2 ${value ? "[animation:join-card-field-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both]" : ""} ${inter.className}`}
                  >
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => onEdit(step)}
                      className={`min-w-0 flex-1 text-right whitespace-normal break-words ${textClass}`}
                    >
                      {value ? formatCardValue(step, value) : spacedCapsLabel(placeholder)}
                    </button>
                    {!readOnly ? (
                      <EditButton
                        onClick={() => onEdit(step)}
                        label={`Edit ${placeholder.toLowerCase()}`}
                        className={styles.editBtn}
                        pencilClass={styles.pencil}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom-left: inline name input */}
          <div className={`absolute bottom-0 left-0 z-[2] ${styles.nameWidth} ${styles.cornerPad}`}>
            <div className={`relative flex flex-col ${styles.nameLineGap}`}>
              {!hasName && !readOnly ? (
                <div
                  className={`pointer-events-none absolute inset-0 text-left ${styles.namePlaceholder} ${lora.className}`}
                  aria-hidden
                >
                  <span className="block">Enter your</span>
                  <span className="block">name here</span>
                </div>
              ) : null}
              {readOnly ? (
                <>
                  <span className={`text-[#1E343A] ${styles.nameText} ${lora.className} ${BOTTOM_LEFT_NAME_LINE}`}>
                    {splitNameLines(name).first}
                  </span>
                  <span className={`text-[#1E343A] ${styles.nameText} ${lora.className} ${BOTTOM_LEFT_NAME_LINE}`}>
                    {splitNameLines(name).last}
                  </span>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={splitNameLines(name).first}
                    onChange={(e) =>
                      onNameChange(joinNameLines(e.target.value, splitNameLines(name).last))
                    }
                    autoComplete="given-name"
                    aria-label="First name"
                    className={`text-[#1E343A] ${styles.nameText} ${lora.className} ${BOTTOM_LEFT_NAME_LINE}`}
                  />
                  <input
                    type="text"
                    value={splitNameLines(name).last}
                    onChange={(e) =>
                      onNameChange(joinNameLines(splitNameLines(name).first, e.target.value))
                    }
                    autoComplete="family-name"
                    aria-label="Last name"
                    className={`text-[#1E343A] ${styles.nameText} ${lora.className} ${BOTTOM_LEFT_NAME_LINE}`}
                  />
                </>
              )}
            </div>
          </div>
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

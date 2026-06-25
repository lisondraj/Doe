"use client";

import type { ReactNode } from "react";

import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { BLOG_LANDING_HERO_CORNER_PAD } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";
import type { JoinApplyFormState } from "@/lib/join/join-apply-form";
import {
  JOIN_APPLY_COUNTRY_LABELS,
  JOIN_APPLY_EDUCATION_LABELS,
} from "@/lib/join/join-apply-form";
import { JOIN_DESKTOP_APPLY_CARD_HEIGHT } from "@/lib/join/join-layout";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

export const JOIN_APPLY_CARD_HEIGHT = "h-[46.67rem] iphone-page:h-[52.89rem]";

const CARD_STYLES = {
  mobile: {
    height: JOIN_APPLY_CARD_HEIGHT,
    fieldText:
      "text-[clamp(1.35rem,4.2vw,2rem)] leading-[1.12] iphone-page:text-[clamp(1.5rem,1.2rem+1.8vmin,2.2rem)]",
    placeholderLabel:
      "text-[0.625rem] font-medium uppercase tracking-[0.34em] text-[#C8C0B4] iphone-page:text-[0.6875rem] iphone-page:tracking-[0.36em]",
    namePlaceholder:
      "text-[clamp(1.35rem,4.2vw,2rem)] leading-[1.12] text-[#C8C0B4] iphone-page:text-[clamp(1.5rem,1.2rem+1.8vmin,2.2rem)]",
    topPad: "p-6 iphone-page:p-7",
    topMaxW: "max-w-[88%] iphone-page:max-w-[90%]",
    topGap: "gap-3 iphone-page:gap-3.5",
    nameMinH: "min-h-[4.5rem] iphone-page:min-h-[5rem]",
    nameWidth: "w-[min(100%,88%)]",
    lineBand: "bottom-[8.75rem] h-[19%] iphone-page:bottom-[9.75rem] iphone-page:h-[17%]",
    editBtn: "h-10 w-10 iphone-page:h-11 iphone-page:w-11 iphone-page:rounded-[0.85rem]",
    pencil: "iphone-page:h-[22px] iphone-page:w-[22px]",
    roleChip:
      "rounded-xl px-3 py-1.5 text-[clamp(0.95rem,3.2vw,1.2rem)] iphone-page:px-3.5 iphone-page:py-2 iphone-page:text-[clamp(1.05rem,0.9rem+1vmin,1.35rem)]",
    roleGap: "gap-2 iphone-page:gap-2.5",
    editorPad: "px-6 py-10 iphone-page:px-8",
    editorMaxW: "max-w-[min(100%,26rem)]",
    cornerPad: BLOG_LANDING_HERO_CORNER_PAD,
    resetBtn: "gap-1.5 text-[0.8125rem] iphone-page:text-[0.875rem]",
    resetIcon: "h-4 w-4 iphone-page:h-[1.125rem] iphone-page:w-[1.125rem]",
    confirmTitle: "text-[1.25rem] iphone-page:text-[1.375rem]",
    confirmBody: "text-[0.9375rem] iphone-page:text-[1rem]",
    confirmBtn: "rounded-xl px-4 py-2.5 text-[0.9375rem] iphone-page:rounded-[0.85rem] iphone-page:px-5 iphone-page:py-3 iphone-page:text-[1rem]",
    modalCloseBtn: "left-0 top-0 h-10 w-10 iphone-page:h-11 iphone-page:w-11 iphone-page:rounded-[0.85rem]",
    modalCloseIcon: "h-[1.125rem] w-[1.125rem] iphone-page:h-5 iphone-page:w-5",
    modalEditorLead: "pt-12 iphone-page:pt-14",
  },
  desktop: {
    height: JOIN_DESKTOP_APPLY_CARD_HEIGHT,
    fieldText: "text-[0.9375rem] leading-[1.2]",
    placeholderLabel: "text-[0.5625rem] font-medium uppercase tracking-[0.32em] text-[#C8C0B4]",
    namePlaceholder: "text-[0.9375rem] leading-[1.2] text-[#C8C0B4]",
    topPad: "p-4",
    topMaxW: "max-w-[86%]",
    topGap: "gap-2",
    nameMinH: "min-h-[3.25rem]",
    nameWidth: "w-[min(100%,86%)]",
    lineBand: "bottom-[5.5rem] h-[18%]",
    editBtn: "h-8 w-8 rounded-lg",
    pencil: "h-4 w-4",
    roleChip: "rounded-lg px-2 py-1 text-[0.75rem]",
    roleGap: "gap-1.5",
    editorPad: "px-8 py-6",
    editorMaxW: "max-w-[min(100%,22rem)]",
    cornerPad: "px-5 pb-5",
    resetBtn: "gap-1.5 text-[0.8125rem]",
    resetIcon: "h-3.5 w-3.5",
    confirmTitle: "text-[1.0625rem]",
    confirmBody: "text-[0.875rem]",
    confirmBtn: "rounded-lg px-3.5 py-2 text-[0.875rem]",
    modalCloseBtn: "left-0 top-0 h-8 w-8 rounded-lg",
    modalCloseIcon: "h-3.5 w-3.5",
    modalEditorLead: "pt-10",
  },
} as const;

const BOTTOM_LEFT_NAME_TEXT =
  "w-full whitespace-normal break-words bg-transparent font-normal tracking-[-0.03em] leading-[1.12] outline-none";

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
      return touchedSteps.has(3) ? JOIN_APPLY_EDUCATION_LABELS[data.education] : null;
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
}: {
  onClick: () => void;
  className: string;
  iconClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={`absolute z-[2] flex items-center justify-center rounded-xl text-[#9A8F82] transition-all hover:text-[#1E343A]/70 active:scale-95 ${className}`}
      style={{
        backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
      }}
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
    <div className="relative w-full">
      {!readOnly && onResetRequest ? (
        <button
          type="button"
          onClick={onResetRequest}
          className={`absolute -top-1 right-0 z-[6] flex translate-y-[-100%] items-center font-medium leading-none tracking-[-0.01em] text-[#9A8F82] transition-colors hover:text-[#1E343A]/70 ${styles.resetBtn} ${inter.className}`}
          style={{ marginTop: variant === "mobile" ? "-0.35rem" : "-0.25rem" }}
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
          className={`absolute inset-0 transition-[filter] duration-300 ${isEditing || showResetConfirm ? "pointer-events-none blur-[7px]" : ""}`}
        >
          <div className={`pointer-events-none absolute inset-x-0 ${styles.lineBand}`}>
            <div className="relative h-full w-full">
              <JoinInternLineGraphic variant={2} fullBleed />
            </div>
          </div>

          {/* Top-left: roles */}
          <div className={`absolute left-0 top-0 z-[2] ${styles.topMaxW} ${styles.topPad}`}>
            <div className={`flex max-w-full items-start gap-2 ${inter.className}`}>
              {data.areas.length > 0 ? (
                <div className={`flex max-w-full flex-wrap ${styles.roleGap}`}>
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
            <div className={`relative ${styles.nameMinH}`}>
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
                <p
                  className={`text-[#1E343A] ${styles.fieldText} ${lora.className} ${BOTTOM_LEFT_NAME_TEXT}`}
                >
                  {name.trim()}
                </p>
              ) : (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  autoComplete="name"
                  aria-label="Enter your name"
                  className={`text-[#1E343A] ${styles.fieldText} ${lora.className} ${BOTTOM_LEFT_NAME_TEXT}`}
                />
              )}
            </div>
          </div>
        </div>

        {isEditing && editor ? (
          <>
            <button
              type="button"
              aria-label="Close editor"
              className="absolute inset-0 z-[4] bg-[#EFECE7]/55 backdrop-blur-[2px]"
              onClick={onCloseEditor}
            />
            <div className={`absolute inset-0 z-[5] flex items-center justify-center ${styles.editorPad}`}>
              <div
                className={`relative w-full ${styles.editorMaxW} ${styles.modalEditorLead} [animation:join-step-enter-down_0.38s_cubic-bezier(0.22,1,0.36,1)_both]`}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalCloseButton
                  onClick={onCloseEditor}
                  className={styles.modalCloseBtn}
                  iconClass={styles.modalCloseIcon}
                />
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
              className="absolute inset-0 z-[4] bg-[#EFECE7]/55 backdrop-blur-[2px]"
              onClick={onResetCancel}
            />
            <div className={`absolute inset-0 z-[5] flex items-center justify-center ${styles.editorPad}`}>
              <div
                className={`w-full ${styles.editorMaxW} rounded-[1.25rem] border p-6 [animation:join-step-enter-down_0.38s_cubic-bezier(0.22,1,0.36,1)_both] iphone-page:rounded-[1.35rem] iphone-page:p-7`}
                style={{
                  backgroundColor: JOIN_FORM_BEIGE.field,
                  borderColor: JOIN_FORM_BEIGE.border,
                }}
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

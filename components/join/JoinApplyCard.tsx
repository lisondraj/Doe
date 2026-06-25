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
    topPad: "p-6 iphone-page:p-7",
    topMaxW: "max-w-[88%] iphone-page:max-w-[90%]",
    topGap: "gap-3 iphone-page:gap-3.5",
    nameMinH: "min-h-[4.5rem] iphone-page:min-h-[5rem]",
    nameWidth: "w-[min(100%,88%)]",
    lineTop: "top-[36%]",
    lineBottom: "bottom-[6.75rem] iphone-page:bottom-[7.75rem]",
    editBtn: "h-10 w-10 iphone-page:h-11 iphone-page:w-11 iphone-page:rounded-[0.85rem]",
    pencil: "iphone-page:h-[22px] iphone-page:w-[22px]",
    roleChip:
      "rounded-xl px-3 py-1.5 text-[clamp(0.95rem,3.2vw,1.2rem)] iphone-page:px-3.5 iphone-page:py-2 iphone-page:text-[clamp(1.05rem,0.9rem+1vmin,1.35rem)]",
    roleGap: "gap-2 iphone-page:gap-2.5",
    editorPad: "px-6 py-10 iphone-page:px-8",
    editorMaxW: "max-w-[min(100%,26rem)]",
    cornerPad: BLOG_LANDING_HERO_CORNER_PAD,
  },
  desktop: {
    height: JOIN_DESKTOP_APPLY_CARD_HEIGHT,
    fieldText: "text-[0.9375rem] leading-[1.2]",
    topPad: "p-4",
    topMaxW: "max-w-[86%]",
    topGap: "gap-2",
    nameMinH: "min-h-[3.25rem]",
    nameWidth: "w-[min(100%,86%)]",
    lineTop: "top-[34%]",
    lineBottom: "bottom-[4.25rem]",
    editBtn: "h-8 w-8 rounded-lg",
    pencil: "h-4 w-4",
    roleChip: "rounded-lg px-2 py-1 text-[0.75rem]",
    roleGap: "gap-1.5",
    editorPad: "px-8 py-6",
    editorMaxW: "max-w-[min(100%,22rem)]",
    cornerPad: "px-5 pb-5",
  },
} as const;

const BOTTOM_LEFT_NAME_TEXT =
  "whitespace-normal break-words font-normal tracking-[-0.03em] leading-[1.12]";

const TOP_RIGHT_FIELDS = [
  { step: 1, placeholder: "Email" },
  { step: 2, placeholder: "Country" },
  { step: 3, placeholder: "Education" },
  { step: 4, placeholder: "School" },
  { step: 5, placeholder: "Roles" },
  { step: 7, placeholder: "LinkedIn" },
  { step: 6, placeholder: "Resume" },
  { step: 8, placeholder: "Notes" },
] as const;

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
    case 5:
      return null;
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
  readOnly = false,
  editor,
}: {
  variant?: "mobile" | "desktop";
  data: JoinApplyFormState;
  activeStep: number | null;
  touchedSteps: ReadonlySet<number>;
  onEdit: (step: number) => void;
  onCloseEditor: () => void;
  readOnly?: boolean;
  editor?: ReactNode;
}) {
  const styles = CARD_STYLES[variant];
  const isEditing = activeStep !== null;
  const name = data.name.trim();
  const hasName = name.length > 0;

  return (
    <div
      className={`relative w-full overflow-hidden border ${styles.height} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      <div
        className={`absolute inset-0 transition-[filter] duration-300 ${isEditing ? "pointer-events-none blur-[7px]" : ""}`}
      >
        <div
          className={`pointer-events-none absolute inset-x-0 ${styles.lineTop} ${styles.lineBottom}`}
        >
          <div className="relative h-full w-full">
            <JoinInternLineGraphic variant={2} fullBleed />
          </div>
        </div>

        <div className={`absolute right-0 top-0 z-[2] ${styles.topMaxW} ${styles.topPad}`}>
          <div className={`flex flex-col items-end ${styles.topGap}`}>
            {TOP_RIGHT_FIELDS.map(({ step, placeholder }) => {
              if (step === 5) {
                const hasAreas = data.areas.length > 0;
                return (
                  <div
                    key={step}
                    className={`flex max-w-full items-center gap-2 ${inter.className}`}
                  >
                    {hasAreas ? (
                      <div className={`flex max-w-full flex-wrap justify-end ${styles.roleGap}`}>
                        {data.areas.map((area) => (
                          <span
                            key={area}
                            className={`text-right font-medium leading-tight tracking-[-0.01em] text-[#1E343A]/72 ${styles.roleChip}`}
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
                        onClick={() => onEdit(step)}
                        className={`text-right text-[#1E343A]/38 ${styles.fieldText}`}
                      >
                        {placeholder}
                      </button>
                    )}
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
              }

              const value = getTopRightDisplayValue(step, data, touchedSteps);
              const textClass = value
                ? `text-[#1E343A]/72 ${styles.fieldText}`
                : `text-[#1E343A]/38 ${styles.fieldText}`;

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
                    {value ? formatCardValue(step, value) : placeholder}
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

        <div className={`absolute bottom-0 left-0 z-[2] ${styles.nameWidth} ${styles.cornerPad}`}>
          <div className={`relative ${styles.nameMinH}`}>
            {hasName ? (
              <div className="flex items-start gap-2">
                <p
                  className={`min-w-0 flex-1 text-[#1E343A] ${styles.fieldText} ${lora.className} ${BOTTOM_LEFT_NAME_TEXT}`}
                >
                  {name}
                </p>
                {!readOnly ? (
                  <EditButton
                    onClick={() => onEdit(0)}
                    label="Edit name"
                    className={styles.editBtn}
                    pencilClass={styles.pencil}
                  />
                ) : null}
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => onEdit(0)}
                  className={`min-w-0 flex-1 text-left text-[#1E343A]/38 ${styles.fieldText} ${lora.className} ${BOTTOM_LEFT_NAME_TEXT}`}
                >
                  <span className="block">Enter your</span>
                  <span className="block">name here</span>
                </button>
                {!readOnly ? (
                  <EditButton
                    onClick={() => onEdit(0)}
                    label="Enter name"
                    className={styles.editBtn}
                    pencilClass={styles.pencil}
                  />
                ) : null}
              </div>
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
              className={`relative w-full ${styles.editorMaxW} [animation:join-step-enter-down_0.38s_cubic-bezier(0.22,1,0.36,1)_both]`}
              onClick={(e) => e.stopPropagation()}
            >
              {editor}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

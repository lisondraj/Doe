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
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

export const JOIN_APPLY_CARD_HEIGHT = "h-[46.67rem] iphone-page:h-[52.89rem]";

const LORA_SIZE =
  "text-[clamp(2rem,6.5vw,3rem)] iphone-page:text-[clamp(2.25rem,1.8rem+2.8vmin,3.5rem)]";

const LORA_SIZE_MEDIUM =
  "text-[clamp(1.65rem,5vw,2.35rem)] iphone-page:text-[clamp(1.85rem,1.5rem+2vmin,2.75rem)]";

const LORA_SIZE_SMALL =
  "text-[clamp(1.35rem,4vw,1.95rem)] iphone-page:text-[clamp(1.5rem,1.2rem+1.5vmin,2.25rem)]";

const CARD_FIELD_TEXT =
  "text-[clamp(1.35rem,4.2vw,2rem)] leading-[1.12] iphone-page:text-[clamp(1.5rem,1.2rem+1.8vmin,2.2rem)]";

const CARD_PLACEHOLDER_TEXT =
  "text-[clamp(1.35rem,4.2vw,2rem)] leading-[1.12] iphone-page:text-[clamp(1.5rem,1.2rem+1.8vmin,2.2rem)]";

const BOTTOM_LEFT_TWO_LINE =
  "line-clamp-2 max-h-[calc(2*1.04em)] overflow-hidden leading-[1.04]";

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

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden className="iphone-page:h-[22px] iphone-page:w-[22px]">
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

function cardFieldTextClass(step: number, value: string): string {
  if (step === 1) {
    const len = value.length;
    if (len > 32) {
      return "text-[clamp(0.95rem,3.2vw,1.35rem)] leading-[1.15] iphone-page:text-[clamp(1.05rem,0.9rem+1.1vmin,1.5rem)]";
    }
    if (len > 22) {
      return "text-[clamp(1.1rem,3.6vw,1.55rem)] leading-[1.12] iphone-page:text-[clamp(1.2rem,1rem+1.3vmin,1.7rem)]";
    }
  }
  return CARD_FIELD_TEXT;
}

function nameSizeClass(name: string): string {
  const len = name.trim().length;
  if (len <= 18) return LORA_SIZE;
  if (len <= 32) return LORA_SIZE_MEDIUM;
  return LORA_SIZE_SMALL;
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
      return data.notes.trim() ? data.notes.trim().slice(0, 48) + (data.notes.trim().length > 48 ? "…" : "") : null;
    default:
      return null;
  }
}

function EditButton({ onClick, label }: { onClick: () => void; label: string }) {
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
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all active:scale-95 iphone-page:h-11 iphone-page:w-11 iphone-page:rounded-[0.85rem]"
      style={{
        backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
        color: JOIN_FORM_BEIGE.meter,
      }}
    >
      <PencilIcon />
    </span>
  );
}

export function JoinApplyCard({
  data,
  activeStep,
  touchedSteps,
  onEdit,
  onCloseEditor,
  readOnly = false,
  editor,
}: {
  data: JoinApplyFormState;
  activeStep: number | null;
  touchedSteps: ReadonlySet<number>;
  onEdit: (step: number) => void;
  onCloseEditor: () => void;
  readOnly?: boolean;
  editor?: ReactNode;
}) {
  const isEditing = activeStep !== null;
  const name = data.name.trim();
  const hasName = name.length > 0;

  return (
    <div
      className={`relative w-full overflow-hidden border ${JOIN_APPLY_CARD_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      <div
        className={`absolute inset-0 transition-[filter] duration-300 ${isEditing ? "pointer-events-none blur-[7px]" : ""}`}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full">
            <JoinInternLineGraphic variant={2} fullBleed />
          </div>
        </div>

        {/* Top-right: field placeholders and values */}
        <div className="absolute right-0 top-0 z-[2] max-w-[78%] p-6 iphone-page:p-7">
          <div className="flex flex-col items-end gap-3 iphone-page:gap-3.5">
            {TOP_RIGHT_FIELDS.map(({ step, placeholder }) => {
              if (step === 5) {
                const hasAreas = data.areas.length > 0;
                return (
                  <div
                    key={step}
                    className={`flex max-w-full items-center gap-2.5 ${inter.className}`}
                  >
                    {hasAreas ? (
                      <div className="flex max-w-full flex-wrap justify-end gap-2 iphone-page:gap-2.5">
                        {data.areas.map((area) => (
                          <span
                            key={area}
                            className="rounded-xl px-3 py-1.5 text-right font-medium leading-tight tracking-[-0.01em] text-[#1E343A]/72 text-[clamp(0.95rem,3.2vw,1.2rem)] iphone-page:px-3.5 iphone-page:py-2 iphone-page:text-[clamp(1.05rem,0.9rem+1vmin,1.35rem)]"
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
                        className={`text-right text-[#1E343A]/38 ${CARD_PLACEHOLDER_TEXT}`}
                      >
                        {placeholder}
                      </button>
                    )}
                    {!readOnly ? (
                      <EditButton onClick={() => onEdit(step)} label={`Edit ${placeholder.toLowerCase()}`} />
                    ) : null}
                  </div>
                );
              }

              const value = getTopRightDisplayValue(step, data, touchedSteps);
              const textClass = value
                ? `text-[#1E343A]/72 ${cardFieldTextClass(step, value)}`
                : `text-[#1E343A]/38 ${CARD_PLACEHOLDER_TEXT}`;

              return (
                <div
                  key={step}
                  className={`flex max-w-full items-center gap-2.5 ${value ? "[animation:join-card-field-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both]" : ""} ${inter.className}`}
                >
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => onEdit(step)}
                    className={`min-w-0 max-w-[min(13rem,calc(100vw-8rem))] truncate text-right iphone-page:max-w-[min(15rem,calc(100vw-9rem))] ${textClass}`}
                  >
                    {value ? formatCardValue(step, value) : placeholder}
                  </button>
                  {!readOnly ? (
                    <EditButton onClick={() => onEdit(step)} label={`Edit ${placeholder.toLowerCase()}`} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom-left: name placeholder or value */}
        <div className={`absolute bottom-0 left-0 z-[2] w-[min(100%,19em)] ${BLOG_LANDING_HERO_CORNER_PAD}`}>
          <div className="relative min-h-[6.25rem] iphone-page:min-h-[7.3rem]">
            {hasName ? (
              <div className="flex items-end gap-2.5">
                <p
                  className={`min-w-0 flex-1 font-normal tracking-[-0.03em] text-[#1E343A] ${nameSizeClass(name)} ${lora.className} ${BOTTOM_LEFT_TWO_LINE}`}
                >
                  {name}
                </p>
                {!readOnly ? (
                  <EditButton onClick={() => onEdit(0)} label="Edit name" />
                ) : null}
              </div>
            ) : (
              <div className="flex items-end gap-2.5">
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => onEdit(0)}
                  className={`min-w-0 flex-1 text-left font-normal tracking-[-0.035em] text-[#1E343A]/38 ${LORA_SIZE} ${lora.className} ${BOTTOM_LEFT_TWO_LINE}`}
                >
                  <span className="block">Enter your</span>
                  <span className="block">name here</span>
                </button>
                {!readOnly ? (
                  <EditButton onClick={() => onEdit(0)} label="Enter name" />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* In-card editor overlay */}
      {isEditing && editor ? (
        <>
          <button
            type="button"
            aria-label="Close editor"
            className="absolute inset-0 z-[4] bg-[#EFECE7]/55 backdrop-blur-[2px]"
            onClick={onCloseEditor}
          />
          <div className="absolute inset-0 z-[5] flex items-center justify-center px-6 py-10 iphone-page:px-8">
            <div
              className="relative w-full max-w-[min(100%,26rem)] [animation:join-step-enter-down_0.38s_cubic-bezier(0.22,1,0.36,1)_both]"
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

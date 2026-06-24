"use client";

import type { ReactNode, RefObject } from "react";

import { JoinFormEnterButton } from "@/components/join/JoinFormEnterButton";
import {
  joinFormFieldClass,
  joinFormPanelClass,
  joinFormPromptClass,
  JoinCountrySlider,
  JoinEducationSlider,
  JoinLinkedInInput,
} from "@/components/join/JoinFormControls";
import { JOIN_APPLY_AREAS, type JoinApplyArea, type JoinApplyFormState } from "@/lib/join/join-apply-form";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";
import { inter } from "@/lib/home/fonts";

export const JOIN_APPLY_STEP_PROMPTS = [
  "What's your name?",
  "What's your email?",
  "Where are you based?",
  "What's your education level?",
  "What school do you attend?",
  "Which areas would you like to help with?",
  "Upload your resume (optional)",
  "Your LinkedIn profile",
  "Anything you'd like to add?",
] as const;

function toggleArea(areas: JoinApplyArea[], area: JoinApplyArea): JoinApplyArea[] {
  return areas.includes(area) ? areas.filter((a) => a !== area) : [...areas, area];
}

function fieldStyle() {
  return {
    backgroundColor: JOIN_FORM_BEIGE.field,
    borderColor: JOIN_FORM_BEIGE.border,
  };
}

type RenderJoinApplyStepOptions = {
  step: number;
  data: JoinApplyFormState;
  patch: (partial: Partial<JoinApplyFormState>) => void;
  variant: "mobile" | "desktop";
  interactive: boolean;
  resumeInputRef?: RefObject<HTMLInputElement>;
  onEnter?: () => void;
  enterDisabled?: boolean;
  enterLabel?: string;
};

function StepEnterWrap({
  onEnter,
  enterDisabled,
  enterLabel,
  children,
  className = "",
}: {
  onEnter?: () => void;
  enterDisabled?: boolean;
  enterLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  if (!onEnter) return <>{children}</>;
  return (
    <div className={`relative w-full ${className}`.trim()}>
      {children}
      <JoinFormEnterButton onClick={onEnter} disabled={enterDisabled} label={enterLabel} />
    </div>
  );
}

export function renderJoinApplyStep({
  step,
  data,
  patch,
  variant,
  interactive,
  resumeInputRef,
  onEnter,
  enterDisabled,
  enterLabel,
}: RenderJoinApplyStepOptions) {
  const prompt = JOIN_APPLY_STEP_PROMPTS[step];
  const fieldClass = joinFormFieldClass(variant);
  const readOnly = !interactive;
  const fieldWithEnterClass = onEnter
    ? `${fieldClass} pr-[4.75rem] iphone-page:pr-[5.25rem]`
    : fieldClass;
  const areaLabelSize =
    variant === "mobile"
      ? "px-4 py-[1.35rem] text-[1.1875rem] iphone-page:px-4 iphone-page:py-[1.5rem] iphone-page:text-[1.3125rem]"
      : "px-2.5 py-3 text-[0.875rem]";

  switch (step) {
    case 0:
      return (
        <div className="relative w-full">
          <input
            type="text"
            value={data.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder={prompt}
            autoComplete="name"
            aria-label={prompt}
            readOnly={readOnly}
            tabIndex={interactive ? 0 : -1}
            className={fieldWithEnterClass}
            style={fieldStyle()}
            onKeyDown={onEnter ? (e) => { if (e.key === "Enter") { e.preventDefault(); onEnter(); } } : undefined}
          />
          {onEnter ? (
            <JoinFormEnterButton onClick={onEnter} disabled={enterDisabled} label={enterLabel} />
          ) : null}
        </div>
      );
    case 1:
      return (
        <div className="relative w-full">
          <input
            type="email"
            value={data.email}
            onChange={(e) => patch({ email: e.target.value })}
            placeholder={prompt}
            autoComplete="email"
            aria-label={prompt}
            readOnly={readOnly}
            tabIndex={interactive ? 0 : -1}
            className={fieldWithEnterClass}
            style={fieldStyle()}
            onKeyDown={onEnter ? (e) => { if (e.key === "Enter") { e.preventDefault(); onEnter(); } } : undefined}
          />
          {onEnter ? (
            <JoinFormEnterButton onClick={onEnter} disabled={enterDisabled} label={enterLabel} />
          ) : null}
        </div>
      );
    case 2:
      return (
        <StepEnterWrap onEnter={onEnter} enterDisabled={enterDisabled} enterLabel={enterLabel}>
          <JoinCountrySlider
            variant={variant}
            value={data.country}
            onChange={(country) => patch({ country })}
            prompt={prompt}
            disabled={readOnly}
          />
        </StepEnterWrap>
      );
    case 3:
      return (
        <StepEnterWrap onEnter={onEnter} enterDisabled={enterDisabled} enterLabel={enterLabel}>
          <JoinEducationSlider
            variant={variant}
            value={data.education}
            onChange={(education) => patch({ education })}
            prompt={prompt}
            disabled={readOnly}
          />
        </StepEnterWrap>
      );
    case 4:
      return (
        <div className="relative w-full">
          <input
            type="text"
            value={data.schoolName}
            onChange={(e) => patch({ schoolName: e.target.value })}
            placeholder={prompt}
            autoComplete="organization"
            aria-label={prompt}
            readOnly={readOnly}
            tabIndex={interactive ? 0 : -1}
            className={fieldWithEnterClass}
            style={fieldStyle()}
            onKeyDown={onEnter ? (e) => { if (e.key === "Enter") { e.preventDefault(); onEnter(); } } : undefined}
          />
          {onEnter ? (
            <JoinFormEnterButton onClick={onEnter} disabled={enterDisabled} label={enterLabel} />
          ) : null}
        </div>
      );
    case 5:
      return (
        <StepEnterWrap onEnter={onEnter} enterDisabled={enterDisabled} enterLabel={enterLabel}>
          <div
            className={`${joinFormPanelClass(variant)} h-full${onEnter ? " pr-[4.75rem] iphone-page:pr-[5.25rem]" : ""}`}
            style={fieldStyle()}
          >
            <p className={joinFormPromptClass(variant)}>{prompt}</p>
            <div className={`grid grid-cols-2 ${variant === "mobile" ? "gap-2.5 iphone-page:gap-3" : "gap-2"}`}>
              {JOIN_APPLY_AREAS.map((area) => {
                const active = data.areas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    aria-pressed={active}
                    disabled={readOnly}
                    tabIndex={interactive ? 0 : -1}
                    onClick={() => patch({ areas: toggleArea(data.areas, area) })}
                    className={`rounded-xl text-center font-medium leading-tight tracking-[-0.01em] transition-colors ${areaLabelSize} ${inter.className}`}
                    style={
                      active
                        ? {
                            backgroundColor: JOIN_FORM_BEIGE.meter,
                            color: JOIN_FORM_BEIGE.page,
                          }
                        : {
                            backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
                            color: "rgba(30, 52, 58, 0.58)",
                          }
                    }
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>
        </StepEnterWrap>
      );
    case 6:
      return (
        <StepEnterWrap onEnter={onEnter} enterDisabled={enterDisabled} enterLabel={enterLabel}>
          {interactive && resumeInputRef ? (
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(e) => patch({ resume: e.target.files?.[0] ?? null })}
            />
          ) : null}
          <button
            type="button"
            disabled={readOnly}
            tabIndex={interactive ? 0 : -1}
            onClick={() => interactive && resumeInputRef?.current?.click()}
            aria-label={prompt}
            className={`${fieldWithEnterClass} flex h-full min-h-0 items-center text-left`}
            style={fieldStyle()}
          >
            <span className={`min-w-0 flex-1 truncate ${data.resume ? "text-[#1E343A]" : "text-[#1E343A]/38"}`}>
              {data.resume ? data.resume.name : prompt}
            </span>
          </button>
        </StepEnterWrap>
      );
    case 7:
      return (
        <StepEnterWrap onEnter={onEnter} enterDisabled={enterDisabled} enterLabel={enterLabel}>
          <div
            className={`${joinFormPanelClass(variant)} h-full${onEnter ? " pr-[4.75rem] iphone-page:pr-[5.25rem]" : ""}`}
            style={fieldStyle()}
          >
            <p className={joinFormPromptClass(variant)}>{prompt}</p>
            <JoinLinkedInInput
              variant={variant}
              value={data.linkedinUsername}
              onChange={(linkedinUsername) => patch({ linkedinUsername })}
              placeholder="username"
              nested
              readOnly={readOnly}
              onEnter={onEnter}
            />
          </div>
        </StepEnterWrap>
      );
    case 8:
      return (
        <StepEnterWrap onEnter={onEnter} enterDisabled={enterDisabled} enterLabel={enterLabel}>
          <textarea
            value={data.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder={prompt}
            aria-label={prompt}
            readOnly={readOnly}
            tabIndex={interactive ? 0 : -1}
            rows={4}
            className={`${fieldWithEnterClass} h-full min-h-0 resize-none`}
            style={fieldStyle()}
          />
        </StepEnterWrap>
      );
    default:
      return null;
  }
}

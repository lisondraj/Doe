"use client";

import type { RefObject } from "react";

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

function StepPrompt({
  variant,
  children,
}: {
  variant: "mobile" | "desktop";
  children: string;
}) {
  return <p className={joinFormPromptClass(variant)}>{children}</p>;
}

export function renderJoinApplyStep({
  step,
  data,
  patch,
  variant,
  interactive,
  resumeInputRef,
  onEnter,
}: RenderJoinApplyStepOptions) {
  const prompt = JOIN_APPLY_STEP_PROMPTS[step];
  const fieldClass = joinFormFieldClass(variant);
  const readOnly = !interactive;
  const areaLabelSize =
    variant === "mobile"
      ? "px-5 py-[1.65rem] text-[1.375rem] iphone-page:px-5 iphone-page:py-[1.85rem] iphone-page:text-[1.5rem]"
      : "px-4 py-3.5 text-[1.0625rem]";

  switch (step) {
    case 0:
      return (
        <div>
          <StepPrompt variant={variant}>{prompt}</StepPrompt>
          <input
            type="text"
            value={data.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Your name"
            autoComplete="name"
            aria-label={prompt}
            readOnly={readOnly}
            tabIndex={interactive ? 0 : -1}
            className={fieldClass}
            onKeyDown={onEnter ? (e) => { if (e.key === "Enter") { e.preventDefault(); onEnter(); } } : undefined}
          />
        </div>
      );
    case 1:
      return (
        <div>
          <StepPrompt variant={variant}>{prompt}</StepPrompt>
          <input
            type="email"
            value={data.email}
            onChange={(e) => patch({ email: e.target.value })}
            placeholder="you@email.com"
            autoComplete="email"
            aria-label={prompt}
            readOnly={readOnly}
            tabIndex={interactive ? 0 : -1}
            className={fieldClass}
            onKeyDown={onEnter ? (e) => { if (e.key === "Enter") { e.preventDefault(); onEnter(); } } : undefined}
          />
        </div>
      );
    case 2:
      return (
        <JoinCountrySlider
          variant={variant}
          value={data.country}
          onChange={(country) => patch({ country })}
          prompt={prompt}
          disabled={readOnly}
        />
      );
    case 3:
      return (
        <JoinEducationSlider
          variant={variant}
          value={data.education}
          onChange={(education) => patch({ education })}
          prompt={prompt}
          disabled={readOnly}
        />
      );
    case 4:
      return (
        <div>
          <StepPrompt variant={variant}>{prompt}</StepPrompt>
          <input
            type="text"
            value={data.schoolName}
            onChange={(e) => patch({ schoolName: e.target.value })}
            placeholder="School name"
            autoComplete="organization"
            aria-label={prompt}
            readOnly={readOnly}
            tabIndex={interactive ? 0 : -1}
            className={fieldClass}
            onKeyDown={onEnter ? (e) => { if (e.key === "Enter") { e.preventDefault(); onEnter(); } } : undefined}
          />
        </div>
      );
    case 5:
      return (
        <div className={`${joinFormPanelClass(variant)} h-full`}>
          <p className={joinFormPromptClass(variant)}>{prompt}</p>
          <div className={`grid grid-cols-2 ${variant === "mobile" ? "gap-3 iphone-page:gap-3.5" : "gap-2.5"}`}>
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
                  className={`rounded-xl text-center font-medium leading-snug tracking-[-0.01em] transition-colors ${areaLabelSize} ${inter.className}`}
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
      );
    case 6:
      return (
        <>
          {interactive && resumeInputRef ? (
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(e) => patch({ resume: e.target.files?.[0] ?? null })}
            />
          ) : null}
          <div>
            <StepPrompt variant={variant}>{prompt}</StepPrompt>
            <button
              type="button"
              disabled={readOnly}
              tabIndex={interactive ? 0 : -1}
              onClick={() => interactive && resumeInputRef?.current?.click()}
              aria-label={prompt}
              className={`${fieldClass} flex h-full min-h-0 items-center text-left`}
            >
              <span className={`min-w-0 flex-1 whitespace-normal break-words text-left ${data.resume ? "text-[#1E343A]" : "text-[#1E343A]/38"}`}>
                {data.resume ? data.resume.name : "Choose a file"}
              </span>
            </button>
          </div>
        </>
      );
    case 7:
      return (
        <div className={`${joinFormPanelClass(variant)} h-full`}>
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
      );
    case 8:
      return (
        <div>
          <StepPrompt variant={variant}>{prompt}</StepPrompt>
          <textarea
            value={data.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="Optional notes"
            aria-label={prompt}
            readOnly={readOnly}
            tabIndex={interactive ? 0 : -1}
            rows={4}
            className={`${fieldClass} h-full min-h-0 resize-none`}
          />
        </div>
      );
    default:
      return null;
  }
}

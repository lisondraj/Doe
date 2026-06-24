"use client";

import { useRef, useState } from "react";

import {
  joinFormFieldClass,
  joinFormPanelClass,
  joinFormPromptClass,
  joinFormShellClass,
  JoinCountrySlider,
  JoinEducationSlider,
  JoinFormAdvanceButton,
  JoinFormProgressBar,
  JoinLinkedInInput,
} from "@/components/join/JoinFormControls";
import {
  JOIN_APPLY_AREAS,
  JOIN_APPLY_INITIAL_STATE,
  JOIN_APPLY_STEP_COUNT,
  isJoinApplyStepValid,
  type JoinApplyArea,
  type JoinApplyFormState,
} from "@/lib/join/join-apply-form";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";
import { inter, suisseIntl } from "@/lib/home/fonts";

const STEP_PROMPTS = [
  "What's your name?",
  "What's your email?",
  "Where are you based?",
  "What's your education level?",
  "What school do you attend?",
  "Which areas would you like to help with?",
  "Upload your resume",
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

export function JoinApplyForm({ variant = "desktop" }: { variant?: "mobile" | "desktop" }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<JoinApplyFormState>(JOIN_APPLY_INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const canProceed = isJoinApplyStepValid(step, data);
  const isLastStep = step === JOIN_APPLY_STEP_COUNT - 1;
  const prompt = STEP_PROMPTS[step];
  const fieldClass = joinFormFieldClass(variant);
  const areaLabelSize =
    variant === "mobile"
      ? "px-3 py-[1.05rem] text-[1rem] iphone-page:px-3.5 iphone-page:py-[1.2rem] iphone-page:text-[1.0625rem]"
      : "px-2.5 py-3 text-[0.875rem]";

  const patch = (partial: Partial<JoinApplyFormState>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const goNext = () => {
    if (!canProceed) return;
    if (isLastStep) {
      setSubmitted(true);
      return;
    }
    setStep((s) => Math.min(s + 1, JOIN_APPLY_STEP_COUNT - 1));
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  if (submitted) {
    return (
      <div className={joinFormShellClass(variant)}>
        <p
          className={`font-normal leading-snug tracking-[-0.02em] text-[#1E343A] ${
            variant === "mobile"
              ? "text-[1.625rem] iphone-page:text-[1.875rem]"
              : "text-[1.375rem]"
          } ${suisseIntl.className}`}
        >
          Thank you — we&apos;ll be in touch.
        </p>
        <p
          className={`mt-3 text-[#1E343A]/60 ${inter.className} ${
            variant === "mobile" ? "text-[1.125rem] iphone-page:text-[1.25rem]" : "text-[1rem]"
          }`}
        >
          Your application has been received.
        </p>
      </div>
    );
  }

  const stepContent = (() => {
    switch (step) {
      case 0:
        return (
          <input
            type="text"
            value={data.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder={prompt}
            autoComplete="name"
            aria-label={prompt}
            className={fieldClass}
            style={fieldStyle()}
          />
        );
      case 1:
        return (
          <input
            type="email"
            value={data.email}
            onChange={(e) => patch({ email: e.target.value })}
            placeholder={prompt}
            autoComplete="email"
            aria-label={prompt}
            className={fieldClass}
            style={fieldStyle()}
          />
        );
      case 2:
        return (
          <JoinCountrySlider
            variant={variant}
            value={data.country}
            onChange={(country) => patch({ country })}
            prompt={prompt}
          />
        );
      case 3:
        return (
          <JoinEducationSlider
            variant={variant}
            value={data.education}
            onChange={(education) => patch({ education })}
            prompt={prompt}
          />
        );
      case 4:
        return (
          <input
            type="text"
            value={data.schoolName}
            onChange={(e) => patch({ schoolName: e.target.value })}
            placeholder={prompt}
            autoComplete="organization"
            aria-label={prompt}
            className={fieldClass}
            style={fieldStyle()}
          />
        );
      case 5:
        return (
          <div className={joinFormPanelClass(variant)} style={fieldStyle()}>
            <p className={joinFormPromptClass(variant)}>{prompt}</p>
            <div className={`grid grid-cols-2 ${variant === "mobile" ? "gap-2.5 iphone-page:gap-3" : "gap-2"}`}>
              {JOIN_APPLY_AREAS.map((area) => {
                const active = data.areas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    aria-pressed={active}
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
        );
      case 6:
        return (
          <>
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(e) => patch({ resume: e.target.files?.[0] ?? null })}
            />
            <button
              type="button"
              onClick={() => resumeInputRef.current?.click()}
              aria-label={prompt}
              className={`${fieldClass} flex items-center justify-between gap-3 text-left`}
              style={fieldStyle()}
            >
              <span className={data.resume ? "text-[#1E343A]" : "text-[#1E343A]/38"}>
                {data.resume ? data.resume.name : prompt}
              </span>
              <span
                className={`shrink-0 font-medium text-[#1E343A]/50 ${inter.className} ${
                  variant === "mobile" ? "text-[1rem] iphone-page:text-[1.0625rem]" : "text-[0.875rem]"
                }`}
              >
                Browse
              </span>
            </button>
          </>
        );
      case 7:
        return (
          <div className={joinFormPanelClass(variant)} style={fieldStyle()}>
            <p className={joinFormPromptClass(variant)}>{prompt}</p>
            <JoinLinkedInInput
              variant={variant}
              value={data.linkedinUsername}
              onChange={(linkedinUsername) => patch({ linkedinUsername })}
              placeholder="username"
              nested
            />
          </div>
        );
      case 8:
        return (
          <textarea
            value={data.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder={prompt}
            aria-label={prompt}
            rows={variant === "mobile" ? 5 : 4}
            className={`${fieldClass} resize-none ${variant === "mobile" ? "min-h-[9rem] iphone-page:min-h-[10rem]" : "min-h-[7.5rem]"}`}
            style={fieldStyle()}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div className={joinFormShellClass(variant)}>
      {variant === "mobile" ? (
        <p
          className={`mb-6 font-normal leading-[1.08] tracking-[-0.028em] text-[#1E343A] text-[clamp(1.75rem,1.45rem+1.2vmin,2.15rem)] iphone-page:mb-7 iphone-page:text-[clamp(2rem,1.65rem+1.55vmin,2.55rem)] ${suisseIntl.className}`}
        >
          Apply
        </p>
      ) : null}

      {step > 0 ? (
        <button
          type="button"
          onClick={goBack}
          className={`mb-4 font-medium text-[#1E343A]/45 transition-colors hover:text-[#1E343A]/70 ${inter.className} ${
            variant === "mobile" ? "text-[0.9375rem] iphone-page:text-[1rem]" : "text-[0.9375rem]"
          }`}
        >
          Back
        </button>
      ) : null}

      <div className={`flex items-stretch ${variant === "mobile" ? "gap-2.5 iphone-page:gap-3" : "gap-3"}`}>
        <div className="min-w-0 flex-1">{stepContent}</div>
        <JoinFormAdvanceButton
          variant={variant}
          disabled={!canProceed}
          onClick={goNext}
          label={isLastStep ? "Submit application" : "Next step"}
        />
      </div>

      <div
        className={`border-t ${
          variant === "mobile"
            ? "mt-7 pt-6 iphone-page:mt-8 iphone-page:pt-7"
            : "mt-5 pt-4"
        }`}
        style={{ borderColor: JOIN_FORM_BEIGE.line }}
      >
        <JoinFormProgressBar step={step} total={JOIN_APPLY_STEP_COUNT} />
      </div>
    </div>
  );
}

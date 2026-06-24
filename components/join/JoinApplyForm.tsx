"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { renderJoinApplyStep } from "@/components/join/join-apply-form-steps";
import {
  joinFormFieldClass,
  joinFormPanelClass,
  joinFormPromptClass,
  joinFormShellClass,
  JoinCountrySlider,
  JoinEducationSlider,
  JoinFormAdvanceButton,
  JoinLinkedInInput,
} from "@/components/join/JoinFormControls";
import { JoinFormNavArrow } from "@/components/join/JoinFormNavArrow";
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

const JOIN_APPLY_STEP_PROMPTS = [
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

const MOBILE_PREVIEW_SLOT = "h-36 iphone-page:h-40";
const MOBILE_ACTIVE_SLOT = "h-56 iphone-page:h-64";

function toggleArea(areas: JoinApplyArea[], area: JoinApplyArea): JoinApplyArea[] {
  return areas.includes(area) ? areas.filter((a) => a !== area) : [...areas, area];
}

function fieldStyle() {
  return {
    backgroundColor: JOIN_FORM_BEIGE.field,
    borderColor: JOIN_FORM_BEIGE.border,
  };
}

type JoinApplyMobileCarouselProps = {
  step: number;
  data: JoinApplyFormState;
  patch: (partial: Partial<JoinApplyFormState>) => void;
  goBack: () => void;
  goNext: () => void;
  submit: () => void;
  canProceed: boolean;
  isLastStep: boolean;
  resumeInputRef: RefObject<HTMLInputElement>;
};

function JoinApplyMobileCarousel({
  step,
  data,
  patch,
  goBack,
  goNext,
  submit,
  canProceed,
  isLastStep,
  resumeInputRef,
}: JoinApplyMobileCarouselProps) {
  const [direction, setDirection] = useState<"down" | "up">("down");

  const handleDown = useCallback(() => {
    if (isLastStep) {
      if (canProceed) submit();
      return;
    }
    if (canProceed) {
      setDirection("down");
      goNext();
    }
  }, [canProceed, goNext, isLastStep, submit]);

  const handleUp = useCallback(() => {
    setDirection("up");
    goBack();
  }, [goBack]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA") return;
      if (!canProceed) return;
      e.preventDefault();
      handleDown();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canProceed, handleDown]);

  const animClass =
    direction === "down"
      ? "[animation:join-step-enter-down_0.3s_cubic-bezier(0.22,1,0.36,1)_both]"
      : "[animation:join-step-enter-up_0.3s_cubic-bezier(0.22,1,0.36,1)_both]";

  const aboveStep = step > 0 ? step - 1 : null;
  const belowStep = step < JOIN_APPLY_STEP_COUNT - 1 ? step + 1 : null;
  const enterLabel = isLastStep ? "Submit" : "Next";

  return (
    <div className="flex w-full flex-col items-center gap-2 iphone-page:gap-2.5">
      {step > 0 ? (
        <JoinFormNavArrow direction="up" onClick={handleUp} label="Previous question" />
      ) : (
        <div className="h-9 shrink-0 iphone-page:h-10" aria-hidden />
      )}

      <div
        className="flex w-full flex-col gap-2.5 iphone-page:gap-3"
        aria-live="polite"
        aria-label={`Application step ${step + 1} of ${JOIN_APPLY_STEP_COUNT}`}
      >
        {/* Above preview */}
        <div
          key="slot-above"
          className={`${MOBILE_PREVIEW_SLOT} w-full shrink-0 overflow-hidden rounded-[1.35rem] iphone-page:rounded-[1.45rem] ${
            aboveStep !== null ? "pointer-events-none opacity-50" : ""
          }`}
          aria-hidden
        >
          {aboveStep !== null
            ? renderJoinApplyStep({ step: aboveStep, data, patch, variant: "mobile", interactive: false })
            : null}
        </div>

        {/* Active center */}
        <div
          key="slot-center"
          className={`${MOBILE_ACTIVE_SLOT} w-full shrink-0 overflow-hidden rounded-[1.35rem] iphone-page:rounded-[1.45rem]`}
        >
          <div key={step} className={`flex h-full min-h-0 flex-col justify-center ${animClass}`}>
            {renderJoinApplyStep({
              step,
              data,
              patch,
              variant: "mobile",
              interactive: true,
              resumeInputRef,
              onEnter: handleDown,
            })}
          </div>
        </div>

        {/* Below preview */}
        <div
          key="slot-below"
          className={`${MOBILE_PREVIEW_SLOT} w-full shrink-0 overflow-hidden rounded-[1.35rem] iphone-page:rounded-[1.45rem] ${
            belowStep !== null ? "pointer-events-none opacity-50" : ""
          }`}
          aria-hidden
        >
          {belowStep !== null
            ? renderJoinApplyStep({ step: belowStep, data, patch, variant: "mobile", interactive: false })
            : null}
        </div>
      </div>

      <JoinFormNavArrow
        direction="down"
        disabled={!canProceed}
        onClick={handleDown}
        label={enterLabel}
      />
    </div>
  );
}

export function JoinApplyForm({ variant = "desktop" }: { variant?: "mobile" | "desktop" }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<JoinApplyFormState>(JOIN_APPLY_INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const canProceed = isJoinApplyStepValid(step, data);
  const isLastStep = step === JOIN_APPLY_STEP_COUNT - 1;
  const prompt = JOIN_APPLY_STEP_PROMPTS[step];
  const fieldClass = joinFormFieldClass(variant);
  const areaLabelSize =
    variant === "mobile"
      ? "px-3.5 py-[1.2rem] text-[1.0625rem] iphone-page:px-4 iphone-page:py-[1.35rem] iphone-page:text-[1.125rem]"
      : "px-2.5 py-3 text-[0.875rem]";

  const patch = (partial: Partial<JoinApplyFormState>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const goNext = () => {
    if (!canProceed) return;
    setStep((s) => Math.min(s + 1, JOIN_APPLY_STEP_COUNT - 1));
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = () => {
    if (!canProceed) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={joinFormShellClass(variant)}>
        <p
          className={`font-normal leading-snug tracking-[-0.02em] text-[#1E343A] ${
            variant === "mobile"
              ? "text-[1.875rem] iphone-page:text-[2.125rem]"
              : "text-[1.375rem]"
          } ${suisseIntl.className}`}
        >
          Thank you — we&apos;ll be in touch.
        </p>
        <p
          className={`mt-3 text-[#1E343A]/60 ${inter.className} ${
            variant === "mobile" ? "text-[1.25rem] iphone-page:text-[1.375rem]" : "text-[1rem]"
          }`}
        >
          Your application has been received.
        </p>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={joinFormShellClass(variant)}>
        <JoinApplyMobileCarousel
          step={step}
          data={data}
          patch={patch}
          goBack={goBack}
          goNext={goNext}
          submit={submit}
          canProceed={canProceed}
          isLastStep={isLastStep}
          resumeInputRef={resumeInputRef}
        />
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
          <JoinCountrySlider variant={variant} value={data.country} onChange={(country) => patch({ country })} prompt={prompt} />
        );
      case 3:
        return (
          <JoinEducationSlider variant={variant} value={data.education} onChange={(education) => patch({ education })} prompt={prompt} />
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
            <div className="grid grid-cols-2 gap-2">
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
                        ? { backgroundColor: JOIN_FORM_BEIGE.meter, color: JOIN_FORM_BEIGE.page }
                        : { backgroundColor: JOIN_FORM_BEIGE.fieldMuted, color: "rgba(30, 52, 58, 0.58)" }
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
              <span className={`shrink-0 font-medium text-[#1E343A]/50 text-[0.875rem] ${inter.className}`}>Browse</span>
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
            rows={4}
            className={`${fieldClass} min-h-[7.5rem] resize-none`}
            style={fieldStyle()}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div className={joinFormShellClass(variant)}>
      {step > 0 ? (
        <button
          type="button"
          onClick={goBack}
          className={`mb-4 font-medium text-[#1E343A]/45 transition-colors hover:text-[#1E343A]/70 text-[0.9375rem] ${inter.className}`}
        >
          Back
        </button>
      ) : null}

      <div className="flex items-stretch gap-3">
        <div className="min-w-0 flex-1">{stepContent}</div>
        <JoinFormAdvanceButton
          variant={variant}
          disabled={!canProceed}
          onClick={isLastStep ? submit : goNext}
          label={isLastStep ? "Submit application" : "Next step"}
        />
      </div>
    </div>
  );
}

"use client";

import { useRef, useState, type RefObject } from "react";

import { JOIN_APPLY_STEP_PROMPTS, renderJoinApplyStep } from "@/components/join/join-apply-form-steps";
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

const MOBILE_PREVIEW_SLOT =
  "h-[clamp(5.75rem,calc(var(--app-vh,100lvh)*0.13),7.25rem)] iphone-page:h-[clamp(6.25rem,calc(var(--app-vh,100lvh)*0.135),7.75rem)]";

const MOBILE_ACTIVE_SLOT =
  "h-[clamp(11.5rem,calc(var(--app-vh,100lvh)*0.24),14.75rem)] iphone-page:h-[clamp(12.25rem,calc(var(--app-vh,100lvh)*0.255),15.5rem)]";

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
  const slots: { stepIndex: number | null; role: "preview" | "active" | "empty" }[] = [
    { stepIndex: step > 0 ? step - 1 : null, role: step > 0 ? "preview" : "empty" },
    { stepIndex: step, role: "active" },
    { stepIndex: step < JOIN_APPLY_STEP_COUNT - 1 ? step + 1 : null, role: step < JOIN_APPLY_STEP_COUNT - 1 ? "preview" : "empty" },
  ];

  const handleDown = () => {
    if (isLastStep) {
      if (canProceed) submit();
      return;
    }
    if (canProceed) goNext();
  };

  return (
    <div className="flex w-full flex-col items-center">
      <JoinFormNavArrow direction="up" disabled={step === 0} onClick={goBack} label="Previous question" />

      <div
        className="my-4 flex w-full flex-col gap-3 iphone-page:my-5 iphone-page:gap-3.5"
        aria-live="polite"
        aria-label={`Application step ${step + 1} of ${JOIN_APPLY_STEP_COUNT}`}
      >
        {slots.map(({ stepIndex, role }, index) => {
          const isActive = role === "active";
          const heightClass = isActive ? MOBILE_ACTIVE_SLOT : MOBILE_PREVIEW_SLOT;

          if (role === "empty" || stepIndex === null) {
            return (
              <div
                key={`slot-empty-${index}`}
                className={`${heightClass} w-full shrink-0 rounded-[1.2rem] iphone-page:rounded-[1.3rem]`}
                aria-hidden
              />
            );
          }

          return (
            <div
              key={`slot-${stepIndex}`}
              className={`${heightClass} w-full shrink-0 overflow-hidden transition-[opacity,filter,transform] duration-500 ease-out ${
                isActive
                  ? "opacity-100 blur-0"
                  : "pointer-events-none opacity-[0.34] blur-[10px] saturate-[0.85]"
              }`}
            >
              <div className={`flex h-full min-h-0 flex-col justify-center ${isActive && stepIndex === 5 ? "overflow-y-auto" : "overflow-hidden"}`}>
                {renderJoinApplyStep({
                  step: stepIndex,
                  data,
                  patch,
                  variant: "mobile",
                  interactive: isActive,
                  resumeInputRef: isActive ? resumeInputRef : undefined,
                })}
              </div>
            </div>
          );
        })}
      </div>

      <JoinFormNavArrow
        direction="down"
        disabled={!canProceed}
        onClick={handleDown}
        label={isLastStep ? "Submit application" : "Next question"}
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
        <p
          className={`mb-7 text-center font-normal leading-[1.08] tracking-[-0.028em] text-[#1E343A] text-[clamp(2rem,1.65rem+1.55vmin,2.55rem)] iphone-page:mb-8 iphone-page:text-[clamp(2.35rem,1.92rem+2.1vmin,3.05rem)] ${suisseIntl.className}`}
        >
          Apply
        </p>

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

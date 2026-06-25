"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { JoinApplyCard } from "@/components/join/JoinApplyCard";
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
import {
  JOIN_APPLY_AREAS,
  JOIN_APPLY_INITIAL_STATE,
  JOIN_APPLY_STEP_COUNT,
  isJoinApplyCardMandatoryComplete,
  isJoinApplyMandatoryComplete,
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

function toggleArea(areas: JoinApplyArea[], area: JoinApplyArea): JoinApplyArea[] {
  return areas.includes(area) ? areas.filter((a) => a !== area) : [...areas, area];
}

function fieldStyle() {
  return {
    backgroundColor: JOIN_FORM_BEIGE.field,
    borderColor: JOIN_FORM_BEIGE.border,
  };
}

// ─── Mobile: inline card fields + in-card editor overlay ───────────────────

type JoinApplyMobileFormProps = {
  data: JoinApplyFormState;
  patch: (partial: Partial<JoinApplyFormState>) => void;
  activeStep: number | null;
  setActiveStep: (step: number | null) => void;
  touchedSteps: ReadonlySet<number>;
  markStepTouched: (step: number) => void;
  submit: () => void;
  submitted: boolean;
  resumeInputRef: RefObject<HTMLInputElement>;
};

function JoinApplyMobileForm({
  data,
  patch,
  activeStep,
  setActiveStep,
  touchedSteps,
  markStepTouched,
  submit,
  submitted,
  resumeInputRef,
}: JoinApplyMobileFormProps) {
  const canProceed = activeStep !== null && isJoinApplyStepValid(activeStep, data);
  const mandatoryComplete = isJoinApplyCardMandatoryComplete(data, touchedSteps);

  const closeEditor = useCallback(() => {
    if (activeStep !== null && isJoinApplyStepValid(activeStep, data)) {
      markStepTouched(activeStep);
    }
    setActiveStep(null);
  }, [activeStep, data, markStepTouched, setActiveStep]);

  const handleAdvance = useCallback(() => {
    if (!canProceed || activeStep === null) return;
    markStepTouched(activeStep);
    setActiveStep(null);
  }, [activeStep, canProceed, markStepTouched, setActiveStep]);

  useEffect(() => {
    if (activeStep === null) return;
    const frame = requestAnimationFrame(() => {
      const root = document.querySelector<HTMLElement>("[data-join-apply-editor]");
      const focusable = root?.querySelector<HTMLElement>(
        "input:not([type=file]):not([readonly]), textarea:not([readonly]), button:not([disabled])",
      );
      focusable?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [activeStep]);

  useEffect(() => {
    if (activeStep === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).tagName === "TEXTAREA") return;
      if (!canProceed) return;
      e.preventDefault();
      handleAdvance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeStep, canProceed, handleAdvance]);

  const editor =
    activeStep !== null ? (
      <div data-join-apply-editor>
        {renderJoinApplyStep({
          step: activeStep,
          data,
          patch,
          variant: "mobile",
          interactive: true,
          resumeInputRef,
          onEnter: handleAdvance,
          enterDisabled: !canProceed,
          enterLabel: "Save answer",
        })}
      </div>
    ) : null;

  if (submitted) {
    return (
      <div className={`${joinFormShellClass("mobile")} flex w-full flex-col`}>
        <JoinApplyCard
          data={data}
          activeStep={null}
          touchedSteps={touchedSteps}
          onEdit={() => {}}
          onCloseEditor={() => {}}
          readOnly
        />
        <p className={`mt-6 font-normal leading-snug tracking-[-0.02em] text-[#1E343A] text-[1.875rem] iphone-page:mt-8 iphone-page:text-[2.125rem] ${suisseIntl.className}`}>
          Thank you — we&apos;ll be in touch.
        </p>
        <p className={`mt-2 text-[#1E343A]/55 text-[1.125rem] iphone-page:text-[1.25rem] ${inter.className}`}>
          Your application has been received.
        </p>
      </div>
    );
  }

  return (
    <div className={`${joinFormShellClass("mobile")} flex w-full flex-col`}>
      <JoinApplyCard
        data={data}
        activeStep={activeStep}
        touchedSteps={touchedSteps}
        onEdit={setActiveStep}
        onCloseEditor={closeEditor}
        editor={editor}
      />

      {mandatoryComplete ? (
        <button
          type="button"
          onClick={submit}
          className={`mt-5 w-full rounded-[1.35rem] border py-[1.35rem] text-center font-medium leading-snug tracking-[-0.02em] text-[#1E343A] transition-all active:scale-[0.99] iphone-page:mt-6 iphone-page:rounded-[1.45rem] iphone-page:py-[1.5rem] iphone-page:text-[1.3125rem] ${inter.className}`}
          style={{
            backgroundColor: JOIN_FORM_BEIGE.field,
            borderColor: JOIN_FORM_BEIGE.border,
          }}
        >
          Submit application
        </button>
      ) : null}
    </div>
  );
}

// ─── Shared form shell ───────────────────────────────────────────────────────

export function JoinApplyForm({ variant = "desktop" }: { variant?: "mobile" | "desktop" }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<JoinApplyFormState>(JOIN_APPLY_INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [touchedSteps, setTouchedSteps] = useState<Set<number>>(() => new Set());
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const markStepTouched = useCallback((s: number) => {
    setTouchedSteps((prev) => {
      if (prev.has(s)) return prev;
      const next = new Set(prev);
      next.add(s);
      return next;
    });
  }, []);

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

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    const complete =
      variant === "mobile"
        ? isJoinApplyCardMandatoryComplete(data, touchedSteps)
        : isJoinApplyMandatoryComplete(data);
    if (!complete) return;
    setSubmitted(true);
    setActiveStep(null);
  };

  if (submitted && variant !== "mobile") {
    return (
      <div className={joinFormShellClass(variant)}>
        <p className={`font-normal leading-snug tracking-[-0.02em] text-[#1E343A] text-[1.375rem] ${suisseIntl.className}`}>
          Thank you — we&apos;ll be in touch.
        </p>
        <p className={`mt-3 text-[#1E343A]/60 text-[1rem] ${inter.className}`}>
          Your application has been received.
        </p>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <JoinApplyMobileForm
        data={data}
        patch={patch}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        touchedSteps={touchedSteps}
        markStepTouched={markStepTouched}
        submit={submit}
        submitted={submitted}
        resumeInputRef={resumeInputRef}
      />
    );
  }

  // ── Desktop layout (unchanged) ──────────────────────────────────────────────

  const stepContent = (() => {
    switch (step) {
      case 0:
        return (
          <input type="text" value={data.name} onChange={(e) => patch({ name: e.target.value })}
            placeholder={prompt} autoComplete="name" aria-label={prompt}
            className={fieldClass} style={fieldStyle()} />
        );
      case 1:
        return (
          <input type="email" value={data.email} onChange={(e) => patch({ email: e.target.value })}
            placeholder={prompt} autoComplete="email" aria-label={prompt}
            className={fieldClass} style={fieldStyle()} />
        );
      case 2:
        return <JoinCountrySlider variant={variant} value={data.country} onChange={(country) => patch({ country })} prompt={prompt} />;
      case 3:
        return <JoinEducationSlider variant={variant} value={data.education} onChange={(education) => patch({ education })} prompt={prompt} />;
      case 4:
        return (
          <input type="text" value={data.schoolName} onChange={(e) => patch({ schoolName: e.target.value })}
            placeholder={prompt} autoComplete="organization" aria-label={prompt}
            className={fieldClass} style={fieldStyle()} />
        );
      case 5:
        return (
          <div className={joinFormPanelClass(variant)} style={fieldStyle()}>
            <p className={joinFormPromptClass(variant)}>{prompt}</p>
            <div className="grid grid-cols-2 gap-2">
              {JOIN_APPLY_AREAS.map((area) => {
                const active = data.areas.includes(area);
                return (
                  <button key={area} type="button" aria-pressed={active}
                    onClick={() => patch({ areas: toggleArea(data.areas, area) })}
                    className={`rounded-xl text-center font-medium leading-tight tracking-[-0.01em] transition-colors ${areaLabelSize} ${inter.className}`}
                    style={active ? { backgroundColor: JOIN_FORM_BEIGE.meter, color: JOIN_FORM_BEIGE.page } : { backgroundColor: JOIN_FORM_BEIGE.fieldMuted, color: "rgba(30,52,58,0.58)" }}>
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
            <input ref={resumeInputRef} type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only" onChange={(e) => patch({ resume: e.target.files?.[0] ?? null })} />
            <button type="button" onClick={() => resumeInputRef.current?.click()} aria-label={prompt}
              className={`${fieldClass} flex items-center justify-between gap-3 text-left`} style={fieldStyle()}>
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
            <JoinLinkedInInput variant={variant} value={data.linkedinUsername}
              onChange={(linkedinUsername) => patch({ linkedinUsername })} placeholder="username" nested />
          </div>
        );
      case 8:
        return (
          <textarea value={data.notes} onChange={(e) => patch({ notes: e.target.value })}
            placeholder={prompt} aria-label={prompt} rows={4}
            className={`${fieldClass} min-h-[7.5rem] resize-none`} style={fieldStyle()} />
        );
      default:
        return null;
    }
  })();

  return (
    <div className={joinFormShellClass(variant)}>
      {step > 0 ? (
        <button type="button" onClick={goBack}
          className={`mb-4 font-medium text-[#1E343A]/45 transition-colors hover:text-[#1E343A]/70 text-[0.9375rem] ${inter.className}`}>
          Back
        </button>
      ) : null}
      <div className="flex items-stretch gap-3">
        <div className="min-w-0 flex-1">{stepContent}</div>
        <JoinFormAdvanceButton variant={variant} disabled={!canProceed}
          onClick={isLastStep ? submit : goNext} label={isLastStep ? "Submit application" : "Next step"} />
      </div>
    </div>
  );
}

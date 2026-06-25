"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { JoinApplyCard } from "@/components/join/JoinApplyCard";
import { renderJoinApplyStep } from "@/components/join/join-apply-form-steps";
import { joinFormShellClass } from "@/components/join/JoinFormControls";
import {
  JOIN_APPLY_INITIAL_STATE,
  isJoinApplyCardMandatoryComplete,
  isJoinApplyStepValid,
  type JoinApplyFormState,
} from "@/lib/join/join-apply-form";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";
import { inter, suisseIntl } from "@/lib/home/fonts";

type JoinApplyCardFormProps = {
  variant: "mobile" | "desktop";
  data: JoinApplyFormState;
  patch: (partial: Partial<JoinApplyFormState>) => void;
  activeStep: number | null;
  setActiveStep: (step: number | null) => void;
  touchedSteps: ReadonlySet<number>;
  markStepTouched: (step: number) => void;
  resetForm: () => void;
  submit: () => void;
  submitted: boolean;
  resumeInputRef: RefObject<HTMLInputElement>;
};

function JoinApplyCardForm({
  variant,
  data,
  patch,
  activeStep,
  setActiveStep,
  touchedSteps,
  markStepTouched,
  resetForm,
  submit,
  submitted,
  resumeInputRef,
}: JoinApplyCardFormProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const canProceed = activeStep !== null && activeStep !== 0 && isJoinApplyStepValid(activeStep, data);
  const mandatoryComplete = isJoinApplyCardMandatoryComplete(data, touchedSteps);

  const closeEditor = useCallback(() => {
    if (activeStep !== null && activeStep !== 0 && isJoinApplyStepValid(activeStep, data)) {
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
    if (activeStep === null || activeStep === 0) return;
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
    if (activeStep === null || activeStep === 0) return;
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
    activeStep !== null && activeStep !== 0 ? (
      <div data-join-apply-editor>
        {renderJoinApplyStep({
          step: activeStep,
          data,
          patch,
          variant,
          interactive: true,
          resumeInputRef,
          onEnter: handleAdvance,
          enterDisabled: !canProceed,
          enterLabel: "Save answer",
        })}
      </div>
    ) : null;

  const thankYouTitle =
    variant === "mobile"
      ? "text-[1.875rem] iphone-page:text-[2.125rem]"
      : "text-[1.5rem]";
  const thankYouBody =
    variant === "mobile" ? "text-[1.125rem] iphone-page:text-[1.25rem]" : "text-[1rem]";
  const submitBtn =
    variant === "mobile"
      ? "mt-5 rounded-[1.35rem] py-[1.35rem] iphone-page:mt-6 iphone-page:rounded-[1.45rem] iphone-page:py-[1.5rem] iphone-page:text-[1.3125rem]"
      : "mt-4 rounded-2xl py-3.5 text-[0.9375rem]";

  if (submitted) {
    return (
      <div className={`${joinFormShellClass(variant)} flex w-full flex-col`}>
        <JoinApplyCard
          variant={variant}
          data={data}
          activeStep={null}
          touchedSteps={touchedSteps}
          onEdit={() => {}}
          onCloseEditor={() => {}}
          onNameChange={() => {}}
          readOnly
        />
        <p
          className={`mt-6 font-normal leading-snug tracking-[-0.02em] text-[#1E343A] ${thankYouTitle} ${variant === "mobile" ? "iphone-page:mt-8" : "mt-5"} ${suisseIntl.className}`}
        >
          Thank you — we&apos;ll be in touch.
        </p>
        <p className={`mt-2 text-[#1E343A]/55 ${thankYouBody} ${inter.className}`}>
          Your application has been received.
        </p>
      </div>
    );
  }

  return (
    <div className={`${joinFormShellClass(variant)} flex w-full flex-col`}>
      <JoinApplyCard
        variant={variant}
        data={data}
        activeStep={activeStep}
        touchedSteps={touchedSteps}
        onEdit={setActiveStep}
        onCloseEditor={closeEditor}
        onNameChange={(name) => patch({ name })}
        editor={editor}
        showResetConfirm={showResetConfirm}
        onResetRequest={() => setShowResetConfirm(true)}
        onResetConfirm={() => {
          resetForm();
          setShowResetConfirm(false);
        }}
        onResetCancel={() => setShowResetConfirm(false)}
      />

      {mandatoryComplete ? (
        <button
          type="button"
          onClick={submit}
          className={`w-full border text-center font-medium leading-snug tracking-[-0.02em] text-[#1E343A] transition-all active:scale-[0.99] hover:border-[#B5AA9C] ${submitBtn} ${inter.className}`}
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

export function JoinApplyForm({ variant = "desktop" }: { variant?: "mobile" | "desktop" }) {
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

  const patch = (partial: Partial<JoinApplyFormState>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const resetForm = useCallback(() => {
    setData(JOIN_APPLY_INITIAL_STATE);
    setTouchedSteps(new Set());
    setActiveStep(null);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  }, []);

  const submit = () => {
    if (!isJoinApplyCardMandatoryComplete(data, touchedSteps)) return;
    setSubmitted(true);
    setActiveStep(null);
  };

  return (
    <JoinApplyCardForm
      variant={variant}
      data={data}
      patch={patch}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      touchedSteps={touchedSteps}
      markStepTouched={markStepTouched}
      resetForm={resetForm}
      submit={submit}
      submitted={submitted}
      resumeInputRef={resumeInputRef}
    />
  );
}

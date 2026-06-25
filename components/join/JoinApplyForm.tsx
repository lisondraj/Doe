"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { JoinApplyCard } from "@/components/join/JoinApplyCard";
import { renderJoinApplyStep } from "@/components/join/join-apply-form-steps";
import { joinFormShellClass, JoinFormBorderedTextarea } from "@/components/join/JoinFormControls";
import {
  JOIN_APPLY_INITIAL_STATE,
  isJoinApplyCardMandatoryComplete,
  isJoinApplyStepValid,
  type JoinApplyFormState,
} from "@/lib/join/join-apply-form";
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
  const [showSubmitReview, setShowSubmitReview] = useState(false);
  const canProceed = activeStep !== null && activeStep !== 0 && isJoinApplyStepValid(activeStep, data);
  const mandatoryComplete = isJoinApplyCardMandatoryComplete(data, touchedSteps);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const isModalOpen = (activeStep !== null && activeStep !== 0) || showResetConfirm;
    if (!isModalOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveStep(null);
        setShowResetConfirm(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeStep, showResetConfirm, setActiveStep]);

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
  const submitBtnClass =
    variant === "mobile"
      ? `w-full inline-flex items-center justify-center rounded-2xl bg-black font-semibold text-white leading-none transition-opacity hover:opacity-90 active:scale-[0.99] active:opacity-80 text-[1.4375rem] py-[1.5rem] iphone-page:text-[clamp(1.5rem,1.28rem+1.1vmin,1.75rem)] iphone-page:py-[clamp(1.45rem,1.18rem+1.25vmin,1.68rem)] iphone-page:rounded-[clamp(1rem,0.85rem+0.72vmin,1.2rem)] ${inter.className}`
      : `w-full inline-flex items-center justify-center rounded-2xl bg-black font-semibold text-white leading-none transition-opacity hover:opacity-90 active:scale-[0.99] active:opacity-80 text-[1.0625rem] py-[1.1rem] ${inter.className}`;
  const submitBtnWrapClass =
    variant === "mobile" ? "mt-5 iphone-page:mt-6" : "mt-4";
  const submitReviewGap =
    variant === "mobile" ? "mt-5 space-y-5 iphone-page:mt-6 iphone-page:space-y-6" : "mt-4 space-y-4";

  const handleSubmitRequest = useCallback(() => {
    setActiveStep(null);
    setShowSubmitReview(true);
  }, [setActiveStep]);

  const handleConfirmSubmit = useCallback(() => {
    submit();
    setShowSubmitReview(false);
  }, [submit]);

  if (submitted) {
    return (
      <div ref={containerRef} className={`${joinFormShellClass(variant)} flex w-full flex-col`}>
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
    <div ref={containerRef} className={`${joinFormShellClass(variant)} flex w-full flex-col`}>
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
          setShowSubmitReview(false);
        }}
        onResetCancel={() => setShowResetConfirm(false)}
      />

      {mandatoryComplete && !showSubmitReview ? (
        <button
          type="button"
          onClick={handleSubmitRequest}
          className={`${submitBtnWrapClass} ${submitBtnClass}`}
        >
          Submit
        </button>
      ) : null}

      {showSubmitReview ? (
        <div className={submitReviewGap}>
          <JoinFormBorderedTextarea
            variant={variant}
            prompt="Anything else you'd like to add?"
            value={data.additionalNotes}
            onChange={(additionalNotes) => patch({ additionalNotes })}
            placeholder="Optional notes"
          />
          <button
            type="button"
            onClick={handleConfirmSubmit}
            className={submitBtnClass}
          >
            Confirm submission
          </button>
        </div>
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

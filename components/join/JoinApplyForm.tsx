"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type MutableRefObject } from "react";

import { JoinApplyCard } from "@/components/join/JoinApplyCard";
import { renderJoinApplyStep } from "@/components/join/join-apply-form-steps";
import { joinFormShellClass, JoinFormBorderedTextarea } from "@/components/join/JoinFormControls";
import {
  JOIN_APPLY_INITIAL_STATE,
  isJoinApplyCardMandatoryComplete,
  hasJoinApplyCardInput,
  isJoinApplyStepValid,
  type JoinApplyFormState,
} from "@/lib/join/join-apply-form";
import {
  ALLOWED_RESUME_ACCEPT,
  ALLOWED_RESUME_UPLOAD_MESSAGE,
  getResumeFileDisplayName,
  getResumeFileTypeLabel,
  isAllowedResumeFile,
} from "@/lib/join/resume-file";
import { inter, suisseIntl } from "@/lib/home/fonts";

const RESUME_PICKER_CLOSE_DELAY_MS = 500;

type JoinApplyCardFormProps = {
  variant: "mobile" | "desktop";
  data: JoinApplyFormState;
  patch: (partial: Partial<JoinApplyFormState>) => void;
  activeStep: number | null;
  setActiveStep: (step: number | null) => void;
  touchedSteps: ReadonlySet<number>;
  markStepTouched: (step: number) => void;
  resetForm: () => void;
  submit: () => Promise<boolean>;
  submitted: boolean;
  submitting: boolean;
  submitError: string | null;
  blockEditorCloseRef: MutableRefObject<boolean>;
  onOpenResumePicker: () => void;
  resumeUploadError: string | null;
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
  submitting,
  submitError,
  blockEditorCloseRef,
  onOpenResumePicker,
  resumeUploadError,
}: JoinApplyCardFormProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSubmitReview, setShowSubmitReview] = useState(false);
  const canProceed = activeStep !== null && activeStep !== 0 && isJoinApplyStepValid(activeStep, data);
  const mandatoryComplete = isJoinApplyCardMandatoryComplete(data, touchedSteps);
  const hasCardInput = hasJoinApplyCardInput(data, touchedSteps);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeEditor = useCallback(() => {
    if (blockEditorCloseRef.current) return;
    if (activeStep !== null && activeStep !== 0 && isJoinApplyStepValid(activeStep, data)) {
      markStepTouched(activeStep);
    }
    setActiveStep(null);
  }, [activeStep, blockEditorCloseRef, data, markStepTouched, setActiveStep]);

  const handleAdvance = useCallback(() => {
    if (!canProceed || activeStep === null) return;
    markStepTouched(activeStep);
    setActiveStep(null);
  }, [activeStep, canProceed, markStepTouched, setActiveStep]);

  useEffect(() => {
    const isModalOpen = (activeStep !== null && activeStep !== 0) || showResetConfirm;
    if (!isModalOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (blockEditorCloseRef.current) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveStep(null);
        setShowResetConfirm(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeStep, blockEditorCloseRef, showResetConfirm, setActiveStep]);

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

  useEffect(() => {
    if (!showSubmitReview) return;
    const frame = requestAnimationFrame(() => {
      const textarea = containerRef.current?.querySelector<HTMLTextAreaElement>("textarea[data-join-apply-interactive]");
      textarea?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [showSubmitReview]);

  const editor =
    activeStep !== null && activeStep !== 0 ? (
      <div data-join-apply-editor>
        {renderJoinApplyStep({
          step: activeStep,
          data,
          patch,
          variant,
          interactive: true,
          onOpenResumePicker,
          resumeUploadError,
          markStepTouched,
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
    variant === "mobile"
      ? "text-[0.9375rem] leading-snug iphone-page:text-[1rem]"
      : "text-[0.8125rem] leading-snug";
  const submitBtnClass =
    variant === "mobile"
      ? `w-full inline-flex items-center justify-center rounded-2xl bg-black font-semibold text-white leading-none transition-opacity hover:opacity-90 active:scale-[0.99] active:opacity-80 text-[1.4375rem] py-[1.5rem] iphone-page:text-[clamp(1.5rem,1.28rem+1.1vmin,1.75rem)] iphone-page:py-[clamp(1.45rem,1.18rem+1.25vmin,1.68rem)] iphone-page:rounded-[clamp(1rem,0.85rem+0.72vmin,1.2rem)] ${inter.className}`
      : `w-full inline-flex items-center justify-center rounded-2xl bg-black font-semibold text-white leading-none transition-opacity hover:opacity-90 active:scale-[0.99] active:opacity-80 text-[1.0625rem] py-[1.1rem] ${inter.className}`;
  const submitBtnWrapClass =
    variant === "mobile" ? "mt-5 iphone-page:mt-6" : "mt-4";

  const handleSubmitRequest = useCallback(() => {
    setActiveStep(null);
    setShowSubmitReview(true);
  }, [setActiveStep]);

  const handleConfirmSubmit = useCallback(async () => {
    const success = await submit();
    if (success) setShowSubmitReview(false);
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
          Thank you! We will be in touch.
        </p>
        <p className={`mt-2 text-[#1E343A]/55 ${thankYouBody} ${inter.className}`}>
          <span className="block">A copy of your applicant card</span>
          <span className="block">has been emailed to you.</span>
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
        showSubmitReview={showSubmitReview}
        submitReviewEditor={
          showSubmitReview ? (
            <JoinFormBorderedTextarea
              variant={variant}
              value={data.additionalNotes}
              onChange={(additionalNotes) => patch({ additionalNotes })}
              placeholder="Anything else you'd like to add?"
            />
          ) : null
        }
        onResetRequest={hasCardInput ? () => setShowResetConfirm(true) : undefined}
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
        <>
          {submitError ? (
            <p className={`${submitBtnWrapClass} text-[#BF593D] ${thankYouBody} ${inter.className}`}>{submitError}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void handleConfirmSubmit()}
            disabled={submitting}
            className={`${submitBtnWrapClass} ${submitBtnClass} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {submitting ? "Submitting…" : "Confirm submission"}
          </button>
        </>
      ) : null}
    </div>
  );
}

export function JoinApplyForm({ variant = "desktop" }: { variant?: "mobile" | "desktop" }) {
  const [data, setData] = useState<JoinApplyFormState>(JOIN_APPLY_INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [touchedSteps, setTouchedSteps] = useState<Set<number>>(() => new Set());
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const resumeFileRef = useRef<File | null>(null);
  const blockEditorCloseRef = useRef(false);
  const resumePickerCloseTimerRef = useRef<number | null>(null);

  const releaseResumePickerCloseBlock = useCallback(() => {
    if (resumePickerCloseTimerRef.current !== null) {
      window.clearTimeout(resumePickerCloseTimerRef.current);
    }
    resumePickerCloseTimerRef.current = window.setTimeout(() => {
      blockEditorCloseRef.current = false;
      resumePickerCloseTimerRef.current = null;
    }, RESUME_PICKER_CLOSE_DELAY_MS);
  }, []);

  const openResumePicker = useCallback(() => {
    const input = resumeInputRef.current;
    if (!input) return;

    blockEditorCloseRef.current = true;
    input.value = "";

    const onWindowFocus = () => {
      window.removeEventListener("focus", onWindowFocus);
      releaseResumePickerCloseBlock();
    };
    window.addEventListener("focus", onWindowFocus, { once: true });

    input.click();
  }, [releaseResumePickerCloseBlock]);

  const handleResumeInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      releaseResumePickerCloseBlock();

      const file = event.target.files?.[0] ?? null;
      if (!file) {
        setResumeUploadError(null);
        resumeFileRef.current = null;
        setData((prev) => ({ ...prev, resumeFileName: null, resumeFileType: null }));
        return;
      }

      if (!isAllowedResumeFile(file)) {
        setResumeUploadError(ALLOWED_RESUME_UPLOAD_MESSAGE);
        event.target.value = "";
        return;
      }

      setResumeUploadError(null);
      resumeFileRef.current = file;
      const resumeFileName = getResumeFileDisplayName(file);
      const resumeFileType = getResumeFileTypeLabel(file);
      setData((prev) => ({ ...prev, resumeFileName, resumeFileType }));
      setTouchedSteps((prev) => {
        if (prev.has(6)) return prev;
        const next = new Set(prev);
        next.add(6);
        return next;
      });
    },
    [releaseResumePickerCloseBlock],
  );

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
    setSubmitError(null);
    setResumeUploadError(null);
    resumeFileRef.current = null;
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  }, []);

  const submit = useCallback(async (): Promise<boolean> => {
    if (!isJoinApplyCardMandatoryComplete(data, touchedSteps)) return false;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("email", data.email.trim());
      formData.append("country", data.country);
      formData.append("education", data.education);
      formData.append("schoolName", data.schoolName.trim());
      formData.append("programOfStudy", data.programOfStudy.trim());
      formData.append("areas", JSON.stringify(data.areas));
      formData.append("linkedinUsername", data.linkedinUsername.trim());
      formData.append("additionalNotes", data.additionalNotes.trim());
      if (resumeFileRef.current) formData.append("resume", resumeFileRef.current);

      const response = await fetch("/api/join/apply", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error || "Could not submit your application.");
      }

      setSubmitted(true);
      setActiveStep(null);
      return true;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit your application.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [data, touchedSteps]);

  return (
    <>
      <input
        ref={resumeInputRef}
        type="file"
        accept={ALLOWED_RESUME_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={handleResumeInputChange}
      />
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
        submitting={submitting}
        submitError={submitError}
        blockEditorCloseRef={blockEditorCloseRef}
        onOpenResumePicker={openResumePicker}
        resumeUploadError={resumeUploadError}
      />
    </>
  );
}

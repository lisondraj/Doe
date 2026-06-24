"use client";

import { useRef, useState } from "react";

import {
  JOIN_FORM_FIELD_TW,
  JOIN_FORM_STEP_TITLE_TW,
  JOIN_FORM_LABEL_TW,
  JoinCountrySlider,
  JoinEducationSlider,
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
import { inter } from "@/lib/home/fonts";

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

export function JoinApplyForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<JoinApplyFormState>(JOIN_APPLY_INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const canProceed = isJoinApplyStepValid(step, data);
  const isLastStep = step === JOIN_APPLY_STEP_COUNT - 1;

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
      <div className="flex flex-1 flex-col justify-center py-8">
        <p className={JOIN_FORM_STEP_TITLE_TW}>Thank you — we&apos;ll be in touch.</p>
        <p className={`mt-3 text-[#1E343A]/65 ${inter.className}`}>
          Your application has been received.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className={`text-[0.8125rem] font-medium tracking-[0.06em] text-[#1E343A]/45 ${inter.className}`}>
          Apply
        </p>
        <p className={`text-[0.8125rem] tabular-nums text-[#1E343A]/45 ${inter.className}`}>
          {step + 1} / {JOIN_APPLY_STEP_COUNT}
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <h2 className={JOIN_FORM_STEP_TITLE_TW}>{STEP_PROMPTS[step]}</h2>

        <div className="mt-8">
          {step === 0 && (
            <input
              type="text"
              value={data.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="Full name"
              autoComplete="name"
              className={JOIN_FORM_FIELD_TW}
            />
          )}

          {step === 1 && (
            <input
              type="email"
              value={data.email}
              onChange={(e) => patch({ email: e.target.value })}
              placeholder="you@email.com"
              autoComplete="email"
              className={JOIN_FORM_FIELD_TW}
            />
          )}

          {step === 2 && <JoinCountrySlider value={data.country} onChange={(country) => patch({ country })} />}

          {step === 3 && (
            <JoinEducationSlider value={data.education} onChange={(education) => patch({ education })} />
          )}

          {step === 4 && (
            <input
              type="text"
              value={data.schoolName}
              onChange={(e) => patch({ schoolName: e.target.value })}
              placeholder="School name"
              autoComplete="organization"
              className={JOIN_FORM_FIELD_TW}
            />
          )}

          {step === 5 && (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {JOIN_APPLY_AREAS.map((area) => {
                const active = data.areas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    aria-pressed={active}
                    onClick={() => patch({ areas: toggleArea(data.areas, area) })}
                    className={`rounded-[clamp(0.85rem,0.75rem+0.4vmin,1rem)] border px-3 py-3.5 text-center text-[clamp(0.82rem,0.76rem+0.28vmin,0.92rem)] font-medium leading-tight tracking-[-0.01em] transition-colors ${inter.className} ${
                      active
                        ? "border-[#C47A5A]/45 bg-[#EBE7E0] text-[#1E343A] shadow-[inset_0_0_0_1px_rgba(196,122,90,0.2)]"
                        : "border-[#D9D4CC] bg-[#E3E1DB]/45 text-[#1E343A]/55 hover:border-[#C9C0B4] hover:text-[#1E343A]/75"
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          )}

          {step === 6 && (
            <div>
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
                className={`${JOIN_FORM_FIELD_TW} flex items-center justify-between gap-3 text-left`}
              >
                <span className={data.resume ? "text-[#1E343A]" : "text-[#1E343A]/40"}>
                  {data.resume ? data.resume.name : "Choose a PDF or Word file"}
                </span>
                <span className="shrink-0 text-[0.8125rem] font-medium text-[#C47A5A]">Browse</span>
              </button>
            </div>
          )}

          {step === 7 && (
            <JoinLinkedInInput
              value={data.linkedinUsername}
              onChange={(linkedinUsername) => patch({ linkedinUsername })}
            />
          )}

          {step === 8 && (
            <div>
              <label className={JOIN_FORM_LABEL_TW}>
                Optional
              </label>
              <textarea
                value={data.notes}
                onChange={(e) => patch({ notes: e.target.value })}
                placeholder="Tell us anything else you'd like us to know"
                rows={5}
                className={`${JOIN_FORM_FIELD_TW} min-h-[8.5rem] resize-none`}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-3 pt-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className={`rounded-[clamp(0.85rem,0.75rem+0.4vmin,1rem)] border border-[#D9D4CC] bg-[#EBE7E0] px-5 py-3 text-[0.875rem] font-medium text-[#1E343A]/75 transition-opacity hover:text-[#1E343A] ${inter.className}`}
          >
            Back
          </button>
        ) : (
          <span className="w-[4.75rem]" aria-hidden />
        )}

        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed}
          className={`ml-auto rounded-[clamp(0.85rem,0.75rem+0.4vmin,1rem)] px-6 py-3 text-[0.875rem] font-medium transition-all ${inter.className} ${
            canProceed
              ? "bg-[#1E343A] text-white hover:opacity-90"
              : "cursor-not-allowed bg-[#1E343A]/20 text-[#1E343A]/35"
          }`}
        >
          {isLastStep ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}

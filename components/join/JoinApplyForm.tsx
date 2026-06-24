"use client";

import { useRef, useState } from "react";

import {
  JOIN_FORM_FIELD_TW,
  JOIN_FORM_PANEL_TW,
  JOIN_FORM_PROMPT_INSET_TW,
  JOIN_FORM_SHELL_TW,
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

export function JoinApplyForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<JoinApplyFormState>(JOIN_APPLY_INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const canProceed = isJoinApplyStepValid(step, data);
  const isLastStep = step === JOIN_APPLY_STEP_COUNT - 1;
  const prompt = STEP_PROMPTS[step];

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
      <div className={JOIN_FORM_SHELL_TW}>
        <p className={`text-[1.375rem] font-normal leading-snug tracking-[-0.02em] text-[#1E343A] ${suisseIntl.className}`}>
          Thank you — we&apos;ll be in touch.
        </p>
        <p className={`mt-2.5 text-[1rem] text-[#1E343A]/55 ${inter.className}`}>
          Your application has been received.
        </p>
      </div>
    );
  }

  return (
    <div className={JOIN_FORM_SHELL_TW}>
      <p className={`mb-5 text-right text-[0.75rem] tabular-nums tracking-wide text-[#1E343A]/32 ${inter.className}`}>
        {step + 1} / {JOIN_APPLY_STEP_COUNT}
      </p>

      <div>
        {step === 0 && (
          <input
            type="text"
            value={data.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder={prompt}
            autoComplete="name"
            aria-label={prompt}
            className={JOIN_FORM_FIELD_TW}
          />
        )}

        {step === 1 && (
          <input
            type="email"
            value={data.email}
            onChange={(e) => patch({ email: e.target.value })}
            placeholder={prompt}
            autoComplete="email"
            aria-label={prompt}
            className={JOIN_FORM_FIELD_TW}
          />
        )}

        {step === 2 && (
          <JoinCountrySlider value={data.country} onChange={(country) => patch({ country })} prompt={prompt} />
        )}

        {step === 3 && (
          <JoinEducationSlider
            value={data.education}
            onChange={(education) => patch({ education })}
            prompt={prompt}
          />
        )}

        {step === 4 && (
          <input
            type="text"
            value={data.schoolName}
            onChange={(e) => patch({ schoolName: e.target.value })}
            placeholder={prompt}
            autoComplete="organization"
            aria-label={prompt}
            className={JOIN_FORM_FIELD_TW}
          />
        )}

        {step === 5 && (
          <div className={JOIN_FORM_PANEL_TW}>
            <p className={JOIN_FORM_PROMPT_INSET_TW}>{prompt}</p>
            <div className="grid grid-cols-2 gap-2">
              {JOIN_APPLY_AREAS.map((area) => {
                const active = data.areas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    aria-pressed={active}
                    onClick={() => patch({ areas: toggleArea(data.areas, area) })}
                    className={`rounded-xl px-2.5 py-3 text-center text-[0.875rem] font-medium leading-tight tracking-[-0.01em] transition-colors ${inter.className} ${
                      active
                        ? "bg-[#1E343A] text-white"
                        : "bg-[#F0EEEA] text-[#1E343A]/55 hover:bg-[#E8E6E1] hover:text-[#1E343A]/80"
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
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
              aria-label={prompt}
              className={`${JOIN_FORM_FIELD_TW} flex items-center justify-between gap-3 text-left`}
            >
              <span className={data.resume ? "text-[#1E343A]" : "text-[#1E343A]/36"}>
                {data.resume ? data.resume.name : prompt}
              </span>
              <span className="shrink-0 text-[0.875rem] font-medium text-[#1E343A]/50">Browse</span>
            </button>
          </div>
        )}

        {step === 7 && (
          <div className={JOIN_FORM_PANEL_TW}>
            <p className={JOIN_FORM_PROMPT_INSET_TW}>{prompt}</p>
            <JoinLinkedInInput
              value={data.linkedinUsername}
              onChange={(linkedinUsername) => patch({ linkedinUsername })}
              placeholder="username"
              nested
            />
          </div>
        )}

        {step === 8 && (
          <textarea
            value={data.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder={prompt}
            aria-label={prompt}
            rows={4}
            className={`${JOIN_FORM_FIELD_TW} min-h-[7.5rem] resize-none`}
          />
        )}
      </div>

      <div className="mt-7 flex items-center gap-2.5">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className={`rounded-2xl px-5 py-3.5 text-[0.9375rem] font-medium text-[#1E343A]/50 transition-colors hover:text-[#1E343A] ${inter.className}`}
          >
            Back
          </button>
        ) : null}

        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed}
          className={`${step > 0 ? "ml-auto" : "w-full"} rounded-2xl px-6 py-3.5 text-[0.9375rem] font-medium transition-all ${inter.className} ${
            canProceed
              ? "bg-[#1E343A] text-white hover:opacity-90"
              : "cursor-not-allowed bg-[#1E343A]/12 text-[#1E343A]/30"
          }`}
        >
          {isLastStep ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}

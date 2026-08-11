"use client";

import { useState, type FormEvent } from "react";

import { AboutContactRingsGraphic } from "@/components/about/AboutContactRingsGraphic";
import {
  CAMPUS_AMBASSADOR_FIELD_COUNT,
  CAMPUS_AMBASSADOR_FIELD_PROMPT,
  CAMPUS_AMBASSADOR_FORM_HEADLINE,
  CAMPUS_AMBASSADOR_SUBMIT_LABEL,
} from "@/lib/join/campus-ambassador-copy";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { dmSans } from "@/lib/home/fonts";

function emptyFields(count: number) {
  return Array.from({ length: count }, () => "");
}

type CampusAmbassadorApplyPanelProps = {
  id?: string;
};

/** Tall gold-framed application panel — ten name fields and submit. */
export function CampusAmbassadorApplyPanel({ id }: CampusAmbassadorApplyPanelProps) {
  const [values, setValues] = useState<string[]>(() => emptyFields(CAMPUS_AMBASSADOR_FIELD_COUNT));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (index: number, next: string) => {
    setValues((current) => {
      const copy = [...current];
      copy[index] = next;
      return copy;
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const complete = values.every((value) => value.trim().length > 0);
    if (!complete) return;
    setSubmitted(true);
  };

  return (
    <aside
      id={id}
      className={`campus-ambassador-apply relative flex min-h-[clamp(44rem,118vw,58rem)] w-full items-stretch overflow-hidden border border-[rgba(212,165,116,0.28)] bg-[#271F17] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-label="Campus ambassador application"
    >
      <div
        className="broader-doe-email-invite__rings pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[min(92%,15rem)]"
        aria-hidden
      >
        <AboutContactRingsGraphic />
      </div>

      <form
        className="relative z-10 flex w-full flex-col gap-6 px-6 py-8 iphone-page:gap-7 iphone-page:px-8 iphone-page:py-10"
        onSubmit={onSubmit}
        noValidate
      >
        <p
          className={`text-center font-medium leading-[1.12] tracking-[-0.02em] text-[#F2E8DA] text-[clamp(1.55rem,1.28rem+1.05vmin,1.95rem)] iphone-page:text-[clamp(1.72rem,1.42rem+1.2vmin,2.15rem)] ${dmSans.className}`}
        >
          {CAMPUS_AMBASSADOR_FORM_HEADLINE}
        </p>

        <div className="flex flex-1 flex-col gap-5 iphone-page:gap-6">
          {values.map((value, index) => (
            <label key={index} className="block">
              <span
                className={`campus-ambassador-field-label mb-2.5 block text-[clamp(1.02rem,0.9rem+0.48vmin,1.16rem)] font-medium tracking-[-0.01em] iphone-page:text-[clamp(1.08rem,0.94rem+0.52vmin,1.22rem)] ${dmSans.className}`}
              >
                {CAMPUS_AMBASSADOR_FIELD_PROMPT}
                <span aria-hidden> *</span>
              </span>
              <input
                type="text"
                name={`campus-ambassador-name-${index + 1}`}
                autoComplete={index === 0 ? "name" : "off"}
                required
                value={value}
                placeholder={focusedIndex === index || value ? "" : CAMPUS_AMBASSADOR_FIELD_PROMPT}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex((current) => (current === index ? null : current))}
                onChange={(event) => updateField(index, event.target.value)}
                className={`campus-ambassador-field-input w-full rounded-xl px-4 py-3.5 text-[clamp(1.05rem,0.92rem+0.55vmin,1.22rem)] font-normal leading-snug tracking-[-0.01em] iphone-page:px-5 iphone-page:py-4 iphone-page:text-[clamp(1.12rem,0.98rem+0.62vmin,1.28rem)] ${dmSans.className}`}
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitted}
          className={`campus-ambassador-submit mx-auto inline-flex items-center justify-center rounded-xl px-6 py-3.5 font-medium leading-tight tracking-[-0.01em] transition-colors disabled:opacity-60 text-[clamp(1.05rem,0.92rem+0.55vmin,1.22rem)] iphone-page:px-7 iphone-page:py-4 iphone-page:text-[clamp(1.12rem,0.98rem+0.62vmin,1.28rem)] ${dmSans.className}`}
        >
          {submitted ? "Application received" : CAMPUS_AMBASSADOR_SUBMIT_LABEL}
        </button>
      </form>
    </aside>
  );
}

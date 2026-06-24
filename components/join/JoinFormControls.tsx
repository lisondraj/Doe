"use client";

import type { JoinApplyCountry, JoinApplyEducation } from "@/lib/join/join-apply-form";
import { inter } from "@/lib/home/fonts";

export const JOIN_FORM_SHELL_TW = "mx-auto w-full max-w-[22.5rem]";

export const JOIN_FORM_FIELD_TW = [
  "w-full rounded-2xl border border-[#D9D4CC]/90 bg-white",
  "px-5 py-[1.15rem] text-[1.0625rem] leading-snug text-[#1E343A]",
  "outline-none transition-[border-color,box-shadow]",
  "placeholder:text-[#1E343A]/36 placeholder:font-normal",
  "focus:border-[#1E343A]/25 focus:ring-[3px] focus:ring-[#1E343A]/8",
  inter.className,
].join(" ");

export const JOIN_FORM_PANEL_TW = [
  "w-full rounded-2xl border border-[#D9D4CC]/90 bg-white",
  "px-5 py-[1.15rem]",
].join(" ");

export const JOIN_FORM_PROMPT_INSET_TW = `mb-4 text-[1.0625rem] leading-snug text-[#1E343A]/36 ${inter.className}`;

type JoinSegmentSliderProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
};

export function JoinSegmentSlider<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: JoinSegmentSliderProps<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);

  return (
    <div
      className="relative rounded-xl bg-[#F0EEEA] p-1"
      role="group"
      aria-label={ariaLabel}
    >
      <div
        className="pointer-events-none absolute top-1 bottom-1 rounded-[0.65rem] bg-white shadow-[0_1px_2px_rgba(30,52,58,0.06)] transition-[left,width] duration-200 ease-out"
        style={{
          left: `calc(${activeIndex} * (100% / ${options.length}) + 4px)`,
          width: `calc(100% / ${options.length} - 8px)`,
        }}
        aria-hidden
      />
      <div
        className="relative grid"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`relative z-[1] px-2 py-[0.9rem] text-center text-[0.9375rem] font-medium leading-tight tracking-[-0.01em] transition-colors ${inter.className} ${
                active ? "text-[#1E343A]" : "text-[#1E343A]/42 hover:text-[#1E343A]/65"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function JoinLinkedInInput({
  value,
  onChange,
  placeholder,
  nested = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  nested?: boolean;
}) {
  const prefix = "linkedin.com/in/";
  const shellClass = nested
    ? "flex items-center overflow-hidden rounded-xl bg-[#F0EEEA] px-4 py-[0.9rem]"
    : `flex items-center overflow-hidden ${JOIN_FORM_FIELD_TW} py-0`;

  return (
    <div className={shellClass}>
      <span
        className={`shrink-0 select-none text-[0.9375rem] text-[#1E343A]/42 ${nested ? "" : "py-[1.15rem] pl-5"} ${inter.className}`}
      >
        {prefix}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
        onKeyDown={(e) => {
          const input = e.currentTarget;
          const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
          if (atStart && (e.key === "Backspace" || e.key === "Delete")) {
            e.preventDefault();
          }
        }}
        placeholder={placeholder ?? "username"}
        autoComplete="off"
        spellCheck={false}
        className={`min-w-0 flex-1 bg-transparent text-[1.0625rem] text-[#1E343A] outline-none placeholder:text-[#1E343A]/36 ${nested ? "py-0" : "py-[1.15rem] pr-5"} ${inter.className}`}
      />
    </div>
  );
}

export function JoinCountrySlider({
  value,
  onChange,
  prompt,
}: {
  value: JoinApplyCountry;
  onChange: (value: JoinApplyCountry) => void;
  prompt: string;
}) {
  return (
    <div className={JOIN_FORM_PANEL_TW}>
      <p className={JOIN_FORM_PROMPT_INSET_TW}>{prompt}</p>
      <JoinSegmentSlider
        ariaLabel="Country"
        value={value}
        onChange={onChange}
        options={[
          { value: "canada", label: "Canada" },
          { value: "us", label: "United States" },
        ]}
      />
    </div>
  );
}

export function JoinEducationSlider({
  value,
  onChange,
  prompt,
}: {
  value: JoinApplyEducation;
  onChange: (value: JoinApplyEducation) => void;
  prompt: string;
}) {
  return (
    <div className={JOIN_FORM_PANEL_TW}>
      <p className={JOIN_FORM_PROMPT_INSET_TW}>{prompt}</p>
      <JoinSegmentSlider
        ariaLabel="Education level"
        value={value}
        onChange={onChange}
        options={[
          { value: "highschool", label: "Highschool" },
          { value: "university", label: "University/College" },
          { value: "graduated", label: "Graduated" },
        ]}
      />
    </div>
  );
}

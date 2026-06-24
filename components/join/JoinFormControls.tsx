"use client";

import type { JoinApplyCountry, JoinApplyEducation } from "@/lib/join/join-apply-form";
import { inter, suisseIntl } from "@/lib/home/fonts";

export const JOIN_FORM_FIELD_TW =
  "w-full rounded-[clamp(0.85rem,0.75rem+0.4vmin,1rem)] border border-[#D9D4CC] bg-[#EBE7E0] px-4 py-3.5 text-[#1E343A] outline-none transition-[border-color,box-shadow] placeholder:text-[#1E343A]/40 focus:border-[#C47A5A]/55 focus:ring-2 focus:ring-[#C47A5A]/15";

export const JOIN_FORM_LABEL_TW = `mb-2.5 block text-left text-[0.8125rem] font-medium tracking-[0.02em] text-[#1E343A]/65 ${inter.className}`;

export const JOIN_FORM_STEP_TITLE_TW = `text-left font-normal leading-[1.12] tracking-[-0.025em] text-[#1E343A] text-[clamp(1.55rem,1.25rem+1.1vmin,2rem)] ${suisseIntl.className}`;

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
      className="relative rounded-[clamp(0.85rem,0.75rem+0.4vmin,1rem)] border border-[#D9D4CC] bg-[#E3E1DB]/60 p-1"
      role="group"
      aria-label={ariaLabel}
    >
      <div
        className="pointer-events-none absolute top-1 bottom-1 rounded-[clamp(0.65rem,0.58rem+0.32vmin,0.82rem)] bg-[#EBE7E0] shadow-[0_1px_3px_rgba(30,52,58,0.08)] transition-[left,width] duration-200 ease-out"
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
              className={`relative z-[1] px-2 py-3 text-center text-[clamp(0.78rem,0.72rem+0.28vmin,0.9rem)] font-medium leading-tight tracking-[-0.01em] transition-colors ${inter.className} ${
                active ? "text-[#1E343A]" : "text-[#1E343A]/45 hover:text-[#1E343A]/70"
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
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const prefix = "linkedin.com/in/";

  return (
    <div className={`flex items-center overflow-hidden ${JOIN_FORM_FIELD_TW} py-0`}>
      <span className={`shrink-0 select-none py-3.5 pl-4 text-[#1E343A]/50 ${inter.className}`}>
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
        placeholder="username"
        autoComplete="off"
        spellCheck={false}
        className={`min-w-0 flex-1 bg-transparent py-3.5 pr-4 text-[#1E343A] outline-none placeholder:text-[#1E343A]/40 ${inter.className}`}
      />
    </div>
  );
}

export function JoinCountrySlider({
  value,
  onChange,
}: {
  value: JoinApplyCountry;
  onChange: (value: JoinApplyCountry) => void;
}) {
  return (
    <JoinSegmentSlider
      ariaLabel="Country"
      value={value}
      onChange={onChange}
      options={[
        { value: "canada", label: "Canada" },
        { value: "us", label: "United States" },
      ]}
    />
  );
}

export function JoinEducationSlider({
  value,
  onChange,
}: {
  value: JoinApplyEducation;
  onChange: (value: JoinApplyEducation) => void;
}) {
  return (
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
  );
}

"use client";

import type { JoinApplyCountry, JoinApplyEducation } from "@/lib/join/join-apply-form";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";
import { inter } from "@/lib/home/fonts";

export function joinFormShellClass(variant: "mobile" | "desktop") {
  return variant === "mobile"
    ? "mx-auto w-full max-w-[min(100%,26rem)] iphone-page:max-w-[min(100%,20.25rem)]"
    : "mx-auto w-full max-w-[20.5rem]";
}

export function joinFormFieldClass(variant: "mobile" | "desktop") {
  const size =
    variant === "mobile"
      ? "rounded-[1.05rem] px-4 py-[1.25rem] text-[1.125rem] iphone-page:rounded-[1.1rem] iphone-page:px-[1.15rem] iphone-page:py-[1.35rem] iphone-page:text-[1.25rem]"
      : "rounded-2xl px-5 py-[1.15rem] text-[1.0625rem]";

  return [
    "w-full border outline-none transition-[border-color,box-shadow]",
    size,
    "leading-snug text-[#1E343A]",
    "placeholder:text-[#1E343A]/38 placeholder:font-normal",
    "focus:border-[#B5AA9C] focus:ring-[3px] focus:ring-[#9A8F82]/20",
    inter.className,
  ].join(" ");
}

export function joinFormPanelClass(variant: "mobile" | "desktop") {
  const size =
    variant === "mobile"
      ? "rounded-[1.05rem] px-4 py-[1.25rem] iphone-page:rounded-[1.1rem] iphone-page:px-[1.15rem] iphone-page:py-[1.35rem]"
      : "rounded-2xl px-5 py-[1.15rem]";

  return `w-full border ${size}`;
}

export function joinFormPromptClass(variant: "mobile" | "desktop") {
  const size =
    variant === "mobile"
      ? "mb-4 text-[1.125rem] iphone-page:mb-[1.15rem] iphone-page:text-[1.25rem]"
      : "mb-4 text-[1.0625rem]";

  return `${size} leading-snug text-[#1E343A]/40 ${inter.className}`;
}

export function JoinFormProgressBar({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  const progress = ((step + 1) / total) * 100;

  return (
    <div
      className="h-[0.35rem] w-full overflow-hidden rounded-full iphone-page:h-[0.42rem]"
      style={{ backgroundColor: JOIN_FORM_BEIGE.fieldMuted }}
      role="progressbar"
      aria-valuenow={step + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${step + 1} of ${total}`}
    >
      <div
        className="h-full rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%`, backgroundColor: JOIN_FORM_BEIGE.meter }}
      />
    </div>
  );
}

export function JoinFormAdvanceButton({
  variant = "desktop",
  disabled,
  onClick,
  label,
}: {
  variant?: "mobile" | "desktop";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex shrink-0 items-center justify-center rounded-[1.1rem] border transition-all ${
        variant === "mobile"
          ? "px-4 iphone-page:rounded-[1.15rem] iphone-page:px-[1.15rem]"
          : "px-[1.15rem]"
      } ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-[#B5AA9C] active:scale-[0.98]"
      }`}
      style={{
        backgroundColor: JOIN_FORM_BEIGE.field,
        borderColor: JOIN_FORM_BEIGE.border,
        alignSelf: "stretch",
        minHeight: variant === "mobile" ? "3.1rem" : "3.25rem",
      }}
    >
      <svg
        className={
          variant === "mobile"
            ? "h-[1.25rem] w-[1.25rem] iphone-page:h-[1.35rem] iphone-page:w-[1.35rem]"
            : "h-[1.35rem] w-[1.35rem] iphone-page:h-6 iphone-page:w-6"
        }
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke={JOIN_FORM_BEIGE.ink}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

type JoinSegmentSliderProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  variant: "mobile" | "desktop";
};

export function JoinSegmentSlider<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  variant,
}: JoinSegmentSliderProps<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);
  const labelSize =
    variant === "mobile"
      ? "py-[1.05rem] text-[1rem] iphone-page:py-[1.15rem] iphone-page:text-[1.0625rem]"
      : "py-[0.9rem] text-[0.9375rem]";

  return (
    <div
      className="relative rounded-xl p-1 iphone-page:rounded-[0.85rem] iphone-page:p-1.5"
      style={{ backgroundColor: JOIN_FORM_BEIGE.fieldMuted }}
      role="group"
      aria-label={ariaLabel}
    >
      <div
        className="pointer-events-none absolute top-1 bottom-1 rounded-[0.65rem] transition-[left,width] duration-200 ease-out iphone-page:top-1.5 iphone-page:bottom-1.5"
        style={{
          left: `calc(${activeIndex} * (100% / ${options.length}) + ${variant === "mobile" ? 6 : 4}px)`,
          width: `calc(100% / ${options.length} - ${variant === "mobile" ? 12 : 8}px)`,
          backgroundColor: JOIN_FORM_BEIGE.field,
          boxShadow: "0 1px 2px rgba(30, 52, 58, 0.06)",
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
              className={`relative z-[1] px-2 text-center font-medium leading-tight tracking-[-0.01em] transition-colors ${labelSize} ${inter.className} ${
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
  variant = "desktop",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  nested?: boolean;
  variant?: "mobile" | "desktop";
}) {
  const prefix = "linkedin.com/in/";
  const textSize = variant === "mobile" ? "text-[1.1875rem] iphone-page:text-[1.3125rem]" : "text-[1.0625rem]";
  const shellClass = nested
    ? `flex items-center overflow-hidden rounded-xl px-4 py-[0.9rem] iphone-page:rounded-[0.85rem] iphone-page:px-5 iphone-page:py-[1.05rem]`
    : `flex items-center overflow-hidden ${joinFormFieldClass(variant)} py-0`;

  return (
    <div
      className={shellClass}
      style={nested ? { backgroundColor: JOIN_FORM_BEIGE.fieldMuted } : { backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      <span
        className={`shrink-0 select-none text-[#1E343A]/45 ${textSize} ${nested ? "" : variant === "mobile" ? "py-[1.35rem] pl-5 iphone-page:py-[1.5rem] iphone-page:pl-6" : "py-[1.15rem] pl-5"} ${inter.className}`}
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
        className={`min-w-0 flex-1 bg-transparent text-[#1E343A] outline-none placeholder:text-[#1E343A]/38 ${textSize} ${nested ? "py-0" : variant === "mobile" ? "py-[1.35rem] pr-5 iphone-page:py-[1.5rem] iphone-page:pr-6" : "py-[1.15rem] pr-5"} ${inter.className}`}
      />
    </div>
  );
}

export function JoinCountrySlider({
  value,
  onChange,
  prompt,
  variant,
}: {
  value: JoinApplyCountry;
  onChange: (value: JoinApplyCountry) => void;
  prompt: string;
  variant: "mobile" | "desktop";
}) {
  return (
    <div
      className={joinFormPanelClass(variant)}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      <p className={joinFormPromptClass(variant)}>{prompt}</p>
      <JoinSegmentSlider
        variant={variant}
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
  variant,
}: {
  value: JoinApplyEducation;
  onChange: (value: JoinApplyEducation) => void;
  prompt: string;
  variant: "mobile" | "desktop";
}) {
  return (
    <div
      className={joinFormPanelClass(variant)}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      <p className={joinFormPromptClass(variant)}>{prompt}</p>
      <JoinSegmentSlider
        variant={variant}
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

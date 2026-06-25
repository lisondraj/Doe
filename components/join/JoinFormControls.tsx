"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

import type { JoinApplyCountry, JoinApplyEducation, JoinApplyEducationValue } from "@/lib/join/join-apply-form";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";
import { inter } from "@/lib/home/fonts";

export function joinFormShellClass(_variant: "mobile" | "desktop") {
  return "mx-auto w-full max-w-none";
}

export function joinFormFieldClass(variant: "mobile" | "desktop") {
  const size =
    variant === "mobile"
      ? "rounded-[1.35rem] px-7 py-[2.35rem] text-[2.125rem] iphone-page:rounded-[1.45rem] iphone-page:px-8 iphone-page:py-[2.6rem] iphone-page:text-[2.375rem]"
      : "rounded-2xl px-7 py-[1.65rem] text-[1.375rem]";

  return [
    "w-full outline-none",
    size,
    "leading-snug text-[#1E343A]",
    "placeholder:text-[#1E343A]/38 placeholder:font-normal",
    inter.className,
  ].join(" ");
}


export function joinFormPanelClass(variant: "mobile" | "desktop") {
  const size =
    variant === "mobile"
      ? "rounded-[1.35rem] px-7 py-[2.15rem] iphone-page:rounded-[1.45rem] iphone-page:px-8 iphone-page:py-[2.35rem]"
      : "rounded-2xl px-7 py-[1.5rem]";

  return `w-full ${size}`;
}

export function joinFormPromptClass(variant: "mobile" | "desktop") {
  const size =
    variant === "mobile"
      ? "mb-5 text-[1.75rem] iphone-page:mb-6 iphone-page:text-[1.9375rem]"
      : "mb-5 text-[1.3125rem]";

  return `${size} leading-snug text-[#1E343A]/45 ${inter.className}`;
}

function joinFormBorderedBoxClass(variant: "mobile" | "desktop") {
  const size =
    variant === "mobile"
      ? "rounded-xl px-6 py-5 iphone-page:px-7 iphone-page:py-6"
      : "rounded-xl px-5 py-4";

  return `w-full border ${size} ${inter.className}`;
}

function joinFormBorderedPromptClass(variant: "mobile" | "desktop") {
  const size =
    variant === "mobile"
      ? "mb-4 text-[1.35rem] iphone-page:mb-5 iphone-page:text-[1.5rem]"
      : "mb-3 text-[1rem]";

  return `${size} font-medium leading-snug tracking-[0.01em] text-[#1E343A]/45`;
}

const BORDERED_INPUT_SIZE = {
  mobile: { max: 2.125, min: 1.05, shell: "min-h-[3.75rem] iphone-page:min-h-[4rem]" },
  desktop: { max: 1.375, min: 0.8125, shell: "min-h-[2.75rem]" },
} as const;

function useFitInputFontRem(
  inputRef: RefObject<HTMLInputElement | null>,
  value: string,
  maxRem: number,
  minRem: number,
) {
  const [fontRem, setFontRem] = useState(maxRem);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const fit = () => {
      let sizeRem = maxRem;
      input.style.fontSize = `${sizeRem}rem`;
      let guard = 0;
      while (input.scrollWidth > input.clientWidth && sizeRem > minRem && guard < 60) {
        sizeRem -= 0.0625;
        input.style.fontSize = `${sizeRem}rem`;
        guard += 1;
      }
      setFontRem(sizeRem);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(input);
    return () => observer.disconnect();
  }, [value, maxRem, minRem]);

  return fontRem;
}

export function JoinFormBorderedField({
  variant,
  prompt,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
  interactive = true,
  onEnter,
  autoComplete,
  spellCheck,
  prefix,
}: {
  variant: "mobile" | "desktop";
  prompt: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email";
  readOnly?: boolean;
  interactive?: boolean;
  onEnter?: () => void;
  autoComplete?: string;
  spellCheck?: boolean;
  prefix?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { max, min, shell } = BORDERED_INPUT_SIZE[variant];
  const fontRem = useFitInputFontRem(inputRef, value, max, min);
  const prefixRem = Math.max(min, fontRem * 0.72);

  return (
    <div
      className={joinFormBorderedBoxClass(variant)}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      <p className={joinFormBorderedPromptClass(variant)}>{prompt}</p>
      <div className={`flex min-w-0 items-center ${shell}`}>
        {prefix ? (
          <span
            className="mr-0.5 shrink-0 select-none font-medium leading-snug text-[#1E343A]/45"
            style={{ fontSize: `${prefixRem}rem` }}
          >
            {prefix}
          </span>
        ) : null}
        <input
          ref={inputRef}
          type={type}
          data-join-apply-interactive
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          spellCheck={spellCheck}
          aria-label={prompt}
          readOnly={readOnly}
          tabIndex={interactive ? 0 : -1}
          className="block w-full min-w-0 appearance-none border-0 bg-transparent p-0 font-medium leading-snug tracking-[-0.01em] text-[#1E343A] outline-none placeholder:font-normal placeholder:text-[#1E343A]/38 whitespace-nowrap"
          style={{ fontSize: `${fontRem}rem` }}
          onKeyDown={
            onEnter
              ? (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onEnter();
                  }
                }
              : undefined
          }
        />
      </div>
    </div>
  );
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
  value: T | "";
  onChange: (value: T) => void;
  ariaLabel: string;
  variant: "mobile" | "desktop";
  disabled?: boolean;
};

export function JoinSegmentSlider<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  variant,
  disabled = false,
}: JoinSegmentSliderProps<T>) {
  const activeIndex = value ? options.findIndex((o) => o.value === value) : -1;
  const labelSize =
    variant === "mobile"
      ? "px-3 py-[1.65rem] text-[1.375rem] leading-snug iphone-page:px-3.5 iphone-page:py-[1.85rem] iphone-page:text-[1.5rem]"
      : "px-3 py-[1.1rem] text-[1.0625rem] leading-snug";

  return (
    <div
      className="relative rounded-xl p-1 iphone-page:rounded-[0.85rem] iphone-page:p-1.5"
      style={{ backgroundColor: JOIN_FORM_BEIGE.fieldMuted }}
      role="group"
      aria-label={ariaLabel}
    >
      {activeIndex >= 0 ? (
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
      ) : null}
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
              data-join-apply-interactive
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`relative z-[1] whitespace-normal break-words text-center font-medium tracking-[-0.01em] transition-colors ${labelSize} ${inter.className} ${
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
  readOnly = false,
  onEnter,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  nested?: boolean;
  variant?: "mobile" | "desktop";
  readOnly?: boolean;
  onEnter?: () => void;
}) {
  const prefix = "linkedin.com/in/";
  const textSize = variant === "mobile" ? "text-[2.125rem] iphone-page:text-[2.375rem]" : "text-[1.375rem]";
  const shellClass = nested
    ? `flex items-center overflow-hidden rounded-xl px-6 py-[1.45rem] iphone-page:rounded-[0.95rem] iphone-page:px-7 iphone-page:py-[1.65rem]`
    : `flex items-center overflow-hidden ${joinFormFieldClass(variant)} py-0`;

  return (
    <div
      className={shellClass}
      style={nested ? { backgroundColor: JOIN_FORM_BEIGE.fieldMuted } : undefined}
    >
      <span
        className={`shrink-0 select-none text-[#1E343A]/45 ${textSize} ${nested ? "" : variant === "mobile" ? "py-[1.65rem] pl-7 iphone-page:py-[1.85rem] iphone-page:pl-8" : "py-[1.45rem] pl-7"} ${inter.className}`}
      >
        {prefix}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
        readOnly={readOnly}
        tabIndex={readOnly ? -1 : 0}
        onKeyDown={(e) => {
          const input = e.currentTarget;
          const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
          if (atStart && (e.key === "Backspace" || e.key === "Delete")) {
            e.preventDefault();
            return;
          }
          if (e.key === "Enter" && onEnter) {
            e.preventDefault();
            onEnter();
          }
        }}
        placeholder={placeholder ?? "username"}
        autoComplete="off"
        spellCheck={false}
        className={`min-w-0 flex-1 bg-transparent text-[#1E343A] outline-none placeholder:text-[#1E343A]/38 ${textSize} ${nested ? "py-0" : variant === "mobile" ? "py-[1.65rem] pr-7 iphone-page:py-[1.85rem] iphone-page:pr-8" : "py-[1.45rem] pr-7"} ${inter.className}`}
      />
    </div>
  );
}

export function JoinCountrySlider({
  value,
  onChange,
  prompt,
  variant,
  disabled = false,
  className,
}: {
  value: JoinApplyCountry;
  onChange: (value: JoinApplyCountry) => void;
  prompt: string;
  variant: "mobile" | "desktop";
  disabled?: boolean;
  className?: string;
}) {
  const optionSize =
    variant === "mobile"
      ? "px-5 py-[1.65rem] text-[1.375rem] iphone-page:px-5 iphone-page:py-[1.85rem] iphone-page:text-[1.5rem]"
      : "px-4 py-3.5 text-[1.0625rem]";

  const options: { value: JoinApplyCountry; label: string }[] = [
    { value: "canada", label: "Canada" },
    { value: "us", label: "United States" },
  ];

  return (
    <div className={`${joinFormPanelClass(variant)}${className ? ` ${className}` : ""}`}>
      <p className={joinFormPromptClass(variant)}>{prompt}</p>
      <div className={`flex flex-col ${variant === "mobile" ? "gap-3 iphone-page:gap-3.5" : "gap-2.5"}`}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              data-join-apply-interactive
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`w-full rounded-xl text-left font-medium leading-snug tracking-[-0.01em] transition-colors ${optionSize} ${inter.className}`}
              style={
                active
                  ? {
                      backgroundColor: JOIN_FORM_BEIGE.meter,
                      color: JOIN_FORM_BEIGE.page,
                    }
                  : {
                      backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
                      color: "rgba(30, 52, 58, 0.58)",
                    }
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function JoinEducationSlider({
  value,
  onChange,
  prompt,
  variant,
  disabled = false,
  className,
}: {
  value: JoinApplyEducationValue;
  onChange: (value: JoinApplyEducation) => void;
  prompt: string;
  variant: "mobile" | "desktop";
  disabled?: boolean;
  className?: string;
}) {
  const optionSize =
    variant === "mobile"
      ? "px-5 py-[1.65rem] text-[1.375rem] iphone-page:px-5 iphone-page:py-[1.85rem] iphone-page:text-[1.5rem]"
      : "px-4 py-3.5 text-[1.0625rem]";

  const options = [
    { value: "highschool" as const, label: "Highschool" },
    { value: "university" as const, label: "University/College" },
    { value: "graduated" as const, label: "Graduated" },
  ];

  return (
    <div className={`${joinFormPanelClass(variant)}${className ? ` ${className}` : ""}`}>
      <p className={joinFormPromptClass(variant)}>{prompt}</p>
      <div className={`flex flex-col ${variant === "mobile" ? "gap-3 iphone-page:gap-3.5" : "gap-2.5"}`}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              data-join-apply-interactive
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`w-full rounded-xl text-left font-medium leading-snug tracking-[-0.01em] transition-colors ${optionSize} ${inter.className}`}
              style={
                active
                  ? {
                      backgroundColor: JOIN_FORM_BEIGE.meter,
                      color: JOIN_FORM_BEIGE.page,
                    }
                  : {
                      backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
                      color: "rgba(30, 52, 58, 0.58)",
                    }
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";

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

export function JoinFormBorderedStep({
  variant,
  children,
}: {
  variant: "mobile" | "desktop";
  children: ReactNode;
}) {
  return (
    <div
      className={joinFormBorderedBoxClass(variant)}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      {children}
    </div>
  );
}

export function JoinFormBorderedTextarea({
  variant,
  value,
  onChange,
  placeholder,
  ariaLabel,
  readOnly = false,
  interactive = true,
}: {
  variant: "mobile" | "desktop";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel?: string;
  readOnly?: boolean;
  interactive?: boolean;
}) {
  const textSize =
    variant === "mobile"
      ? "text-[1.35rem] leading-snug iphone-page:text-[1.5rem]"
      : "text-[1rem] leading-snug";

  return (
    <div
      className={joinFormBorderedBoxClass(variant)}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      <textarea
        data-join-apply-interactive
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        readOnly={readOnly}
        tabIndex={interactive ? 0 : -1}
        rows={variant === "mobile" ? 4 : 3}
        className={`block w-full resize-none appearance-none border-0 bg-transparent p-0 font-medium tracking-[-0.01em] text-[#1E343A] outline-none placeholder:font-normal placeholder:text-[#1E343A]/38 ${textSize}`}
      />
    </div>
  );
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

function useFitRowFontRem(
  containerRef: RefObject<HTMLDivElement | null>,
  measureText: string,
  maxRem: number,
  minRem: number,
) {
  const [fontRem, setFontRem] = useState(maxRem);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = document.createElement("span");
    measure.setAttribute("aria-hidden", "true");
    measure.className = `pointer-events-none absolute left-0 top-0 whitespace-nowrap opacity-0 ${inter.className}`;
    container.appendChild(measure);

    const fit = () => {
      const available = container.clientWidth;
      if (available <= 0) return;

      let sizeRem = maxRem;
      while (sizeRem >= minRem) {
        measure.style.fontSize = `${sizeRem}rem`;
        measure.textContent = measureText;
        if (measure.scrollWidth <= available) {
          setFontRem(sizeRem);
          return;
        }
        sizeRem -= 0.0625;
      }
      setFontRem(minRem);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => {
      observer.disconnect();
      measure.remove();
    };
  }, [measureText, maxRem, minRem]);

  return fontRem;
}

const BORDERED_INPUT_CLASS =
  "block w-full min-w-0 appearance-none border-0 bg-transparent p-0 font-medium leading-snug tracking-[-0.01em] text-[#1E343A] outline-none placeholder:font-normal placeholder:text-[#1E343A]/38 whitespace-nowrap";

function JoinFormBorderedInput({
  variant,
  value,
  onChange,
  placeholder,
  ariaLabel,
  readOnly,
  interactive,
  onEnter,
  autoComplete,
  spellCheck,
  prefix,
  prefixMatchSize = false,
  type = "text",
}: {
  variant: "mobile" | "desktop";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  readOnly?: boolean;
  interactive?: boolean;
  onEnter?: () => void;
  autoComplete?: string;
  spellCheck?: boolean;
  prefix?: ReactNode;
  prefixMatchSize?: boolean;
  type?: "text" | "email";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { max, min, shell } = BORDERED_INPUT_SIZE[variant];
  const fontRem = useFitInputFontRem(inputRef, value, max, min);
  const prefixRem = prefixMatchSize ? fontRem : Math.max(min, fontRem * 0.72);

  return (
    <div className={`flex min-w-0 items-center ${shell}`}>
      {prefix ? (
        <span
          className="mr-0 shrink-0 select-none font-medium leading-snug tracking-[-0.015em]"
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
        aria-label={ariaLabel}
        readOnly={readOnly}
        tabIndex={interactive ? 0 : -1}
        className={BORDERED_INPUT_CLASS}
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
  );
}

export function JoinFormBorderedField({
  variant,
  value,
  onChange,
  placeholder,
  ariaLabel,
  type = "text",
  readOnly = false,
  interactive = true,
  onEnter,
  autoComplete,
  spellCheck,
  prefix,
}: {
  variant: "mobile" | "desktop";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel?: string;
  type?: "text" | "email";
  readOnly?: boolean;
  interactive?: boolean;
  onEnter?: () => void;
  autoComplete?: string;
  spellCheck?: boolean;
  prefix?: string;
}) {
  return (
    <div
      className={joinFormBorderedBoxClass(variant)}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      <JoinFormBorderedInput
        variant={variant}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        ariaLabel={ariaLabel ?? placeholder}
        readOnly={readOnly}
        interactive={interactive}
        onEnter={onEnter}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        prefix={prefix}
      />
    </div>
  );
}

export function JoinFormBorderedSchoolFields({
  variant,
  schoolName,
  programOfStudy,
  onSchoolChange,
  onProgramChange,
  readOnly = false,
  interactive = true,
  onEnter,
}: {
  variant: "mobile" | "desktop";
  schoolName: string;
  programOfStudy: string;
  onSchoolChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  readOnly?: boolean;
  interactive?: boolean;
  onEnter?: () => void;
}) {
  return (
    <div
      className={joinFormBorderedBoxClass(variant)}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      <JoinFormBorderedInput
        variant={variant}
        value={schoolName}
        onChange={onSchoolChange}
        placeholder="School name"
        autoComplete="organization"
        ariaLabel="School name"
        readOnly={readOnly}
        interactive={interactive}
        onEnter={onEnter}
      />
      <div className={variant === "mobile" ? "mt-6 iphone-page:mt-7" : "mt-5"}>
        <JoinFormBorderedInput
          variant={variant}
          value={programOfStudy}
          onChange={onProgramChange}
          placeholder="Program of study"
          autoComplete="organization-title"
          ariaLabel="Program of study"
          readOnly={readOnly}
          interactive={interactive}
          onEnter={onEnter}
        />
      </div>
    </div>
  );
}

export function JoinFormBorderedLinkedInField({
  variant,
  value,
  onChange,
  readOnly = false,
  interactive = true,
  onEnter,
}: {
  variant: "mobile" | "desktop";
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  interactive?: boolean;
  onEnter?: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { max, min, shell } = BORDERED_INPUT_SIZE[variant];
  const measureText = `linkedin.com/in/${value || "username"}`;
  const fontRem = useFitRowFontRem(rowRef, measureText, max, min);
  const rowStyle = { fontSize: `${fontRem}rem` };

  return (
    <div
      className={joinFormBorderedBoxClass(variant)}
      style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
    >
      <div ref={rowRef} className={`relative flex min-w-0 items-center ${shell}`}>
        <span
          className="mr-0 shrink-0 select-none font-medium leading-snug tracking-[-0.015em] text-[#1E343A]/45"
          style={rowStyle}
        >
          linkedin.com/in/
        </span>
        <input
          type="text"
          data-join-apply-interactive
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="username"
          autoComplete="off"
          spellCheck={false}
          aria-label="LinkedIn username"
          readOnly={readOnly}
          tabIndex={interactive ? 0 : -1}
          className={BORDERED_INPUT_CLASS}
          style={rowStyle}
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

function ResumeFileIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13h6M9 17h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function JoinFormBorderedResumeField({
  variant,
  resumeFileName,
  onChange,
  readOnly = false,
  interactive = true,
  inputRef,
}: {
  variant: "mobile" | "desktop";
  resumeFileName: string | null;
  onChange: (fileName: string | null, file?: File | null) => void;
  readOnly?: boolean;
  interactive?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
}) {
  const localInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = inputRef ?? localInputRef;
  const { shell } = BORDERED_INPUT_SIZE[variant];
  const textSize =
    variant === "mobile"
      ? "text-[1.75rem] iphone-page:text-[1.9375rem]"
      : "text-[1.3125rem]";
  const iconSize =
    variant === "mobile"
      ? "h-[1.75rem] w-[1.75rem] shrink-0 iphone-page:h-[1.9375rem] iphone-page:w-[1.9375rem]"
      : "h-[1.3125rem] w-[1.3125rem] shrink-0";
  const innerPad =
    variant === "mobile"
      ? "rounded-lg px-5 py-4 iphone-page:rounded-[0.85rem] iphone-page:px-6 iphone-page:py-[1.15rem]"
      : "rounded-lg px-4 py-3";

  const openPicker = () => {
    if (!interactive || readOnly) return;
    const input = fileInputRef.current;
    if (!input) return;
    input.value = "";
    input.click();
  };

  const label = resumeFileName ?? "Choose a file";
  const optionalClass =
    variant === "mobile"
      ? "mt-4 text-[1.3125rem] leading-snug iphone-page:mt-5 iphone-page:text-[1.4375rem]"
      : "mt-3 text-[1.125rem] leading-snug";

  return (
    <div className="w-full">
      {interactive ? (
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            onChange(file?.name ?? null, file);
          }}
        />
      ) : null}

      <div
        className={`border ${innerPad}`}
        style={{ backgroundColor: JOIN_FORM_BEIGE.fieldMuted, borderColor: JOIN_FORM_BEIGE.border }}
      >
        {resumeFileName ? (
          <div
            className={`flex min-w-0 items-center gap-3 ${shell} ${textSize} font-medium leading-snug tracking-[-0.01em] text-[#1E343A]`}
          >
            <ResumeFileIcon className={iconSize} />
            <span className="min-w-0 truncate">{label}</span>
          </div>
        ) : (
          <button
            type="button"
            data-join-apply-interactive
            disabled={readOnly}
            tabIndex={interactive ? 0 : -1}
            onClick={openPicker}
            aria-label="Choose a resume file"
            className={`flex w-full min-w-0 items-center gap-3 text-left font-medium leading-snug tracking-[-0.01em] transition-opacity hover:opacity-90 active:scale-[0.99] disabled:cursor-default disabled:opacity-100 ${shell} ${textSize} ${inter.className}`}
          >
            <ResumeFileIcon className={`${iconSize} text-[#1E343A]/45`} />
            <span className="text-[#1E343A]/38">Choose a file</span>
          </button>
        )}
      </div>

      {resumeFileName && interactive && !readOnly ? (
        <button
          type="button"
          data-join-apply-interactive
          onClick={openPicker}
          className={`mt-3 font-medium leading-snug tracking-[-0.01em] text-[#1E343A]/45 transition-colors hover:text-[#1E343A]/70 active:scale-[0.99] ${
            variant === "mobile" ? "text-[1.2rem] iphone-page:text-[1.3125rem]" : "text-[0.9375rem]"
          } ${inter.className}`}
        >
          Reupload
        </button>
      ) : null}
      <p className={`text-right font-medium tracking-[-0.01em] text-[#1E343A]/45 ${optionalClass} ${inter.className}`}>
        Optional
      </p>
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
  hidePrompt = false,
  className,
}: {
  value: JoinApplyCountry;
  onChange: (value: JoinApplyCountry) => void;
  prompt: string;
  variant: "mobile" | "desktop";
  disabled?: boolean;
  hidePrompt?: boolean;
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
    <div className={hidePrompt ? className ?? "" : `${joinFormPanelClass(variant)}${className ? ` ${className}` : ""}`}>
      {hidePrompt ? null : <p className={joinFormPromptClass(variant)}>{prompt}</p>}
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
  hidePrompt = false,
  className,
}: {
  value: JoinApplyEducationValue;
  onChange: (value: JoinApplyEducation) => void;
  prompt: string;
  variant: "mobile" | "desktop";
  disabled?: boolean;
  hidePrompt?: boolean;
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
    <div className={hidePrompt ? className ?? "" : `${joinFormPanelClass(variant)}${className ? ` ${className}` : ""}`}>
      {hidePrompt ? null : <p className={joinFormPromptClass(variant)}>{prompt}</p>}
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

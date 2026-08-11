"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { dmSans } from "@/lib/home/fonts";

const FIELD_INPUT_CLASS = `campus-ambassador-field-input w-full rounded-xl px-4 py-3.5 text-[clamp(1.05rem,0.92rem+0.55vmin,1.22rem)] font-normal leading-snug tracking-[-0.01em] iphone-page:px-5 iphone-page:py-4 iphone-page:text-[clamp(1.12rem,0.98rem+0.62vmin,1.28rem)] ${dmSans.className}`;

const FIELD_LABEL_CLASS = `campus-ambassador-field-label mb-2.5 block text-[clamp(1.02rem,0.9rem+0.48vmin,1.16rem)] font-medium tracking-[-0.01em] iphone-page:text-[clamp(1.08rem,0.94rem+0.52vmin,1.22rem)] ${dmSans.className}`;

const GROUP_HEADING_CLASS = `campus-ambassador-group-heading mb-3 block text-[clamp(1.02rem,0.9rem+0.48vmin,1.16rem)] font-medium leading-snug tracking-[-0.01em] iphone-page:text-[clamp(1.08rem,0.94rem+0.52vmin,1.22rem)] ${dmSans.className}`;

const GROUP_HINT_CLASS = `campus-ambassador-group-hint mb-4 block text-[clamp(0.92rem,0.82rem+0.38vmin,1.05rem)] font-normal leading-snug tracking-[0.01em] iphone-page:text-[clamp(0.96rem,0.86rem+0.42vmin,1.08rem)] ${dmSans.className}`;

type CampusAmbassadorTextFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "email";
  autoComplete?: string;
  placeholder?: string;
};

export function CampusAmbassadorTextField({
  label,
  name,
  value,
  onChange,
  required = true,
  type = "text",
  autoComplete,
  placeholder,
}: CampusAmbassadorTextFieldProps) {
  const [focused, setFocused] = useState(false);
  const resolvedPlaceholder = placeholder ?? label;

  return (
    <label className="block">
      <span className={FIELD_LABEL_CLASS}>
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={focused || value ? "" : resolvedPlaceholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD_INPUT_CLASS}
      />
    </label>
  );
}

type SelectOption = { value: string; label: string };

type CampusAmbassadorSelectFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  required?: boolean;
};

export function CampusAmbassadorSelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = true,
}: CampusAmbassadorSelectFieldProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="campus-ambassador-select block">
      <span className={FIELD_LABEL_CLASS} id={`${listboxId}-label`}>
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </span>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        type="button"
        className={`campus-ambassador-select-trigger ${FIELD_INPUT_CLASS}${open ? " campus-ambassador-select-trigger--open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${listboxId}-label`}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? "text-[#F2E8DA]" : "text-[rgba(242,232,218,0.38)]"}>
          {selected?.label ?? placeholder}
        </span>
        <span className="campus-ambassador-select-chevron" aria-hidden />
      </button>
      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={`${listboxId}-label`}
          className="campus-ambassador-select-menu"
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`campus-ambassador-select-option${active ? " campus-ambassador-select-option--active" : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

type CampusAmbassadorCheckboxGroupProps<T extends string> = {
  legend: string;
  hint?: string;
  name: string;
  options: readonly { id: T; label: string }[];
  values: readonly T[];
  onToggle: (id: T) => void;
  required?: boolean;
};

export function CampusAmbassadorCheckboxGroup<T extends string>({
  legend,
  hint,
  name,
  options,
  values,
  onToggle,
  required = false,
}: CampusAmbassadorCheckboxGroupProps<T>) {
  return (
    <fieldset className="campus-ambassador-checkbox-group m-0 border-0 p-0">
      <legend className={GROUP_HEADING_CLASS}>
        {legend}
        {required ? <span aria-hidden> *</span> : null}
      </legend>
      {hint ? <p className={GROUP_HINT_CLASS}>{hint}</p> : null}
      <ul className="m-0 flex list-none flex-col gap-3 p-0 iphone-page:gap-3.5">
        {options.map((option, index) => {
          const checked = values.includes(option.id);
          return (
            <li key={option.id}>
              <label className="campus-ambassador-checkbox-row flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name={`${name}-${index}`}
                  checked={checked}
                  onChange={() => onToggle(option.id)}
                  className="campus-ambassador-checkbox-input sr-only"
                />
                <span className="campus-ambassador-checkbox-box mt-0.5 shrink-0" aria-hidden />
                <span className={`campus-ambassador-checkbox-label text-[clamp(1.02rem,0.9rem+0.48vmin,1.16rem)] font-normal leading-snug tracking-[-0.01em] iphone-page:text-[clamp(1.08rem,0.94rem+0.52vmin,1.22rem)] ${dmSans.className}`}>
                  {option.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export function CampusAmbassadorFormSection({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5 iphone-page:gap-6">{children}</div>;
}

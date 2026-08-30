"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export type DoeDtcDropdownOption<T extends string = string> = {
  value: T;
  label: string;
};

type DoeDtcDropdownProps<T extends string = string> = {
  id?: string;
  label?: string;
  value: T;
  options: DoeDtcDropdownOption<T>[];
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: T) => void;
  className?: string;
};

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 8.2 6.4 11 12.5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DoeDtcDropdown<T extends string = string>({
  id,
  label,
  value,
  options,
  disabled = false,
  placeholder = "Select…",
  onChange,
  className,
}: DoeDtcDropdownProps<T>) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listId = `${triggerId}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  return (
    <div className={`doedtc-dropdown${className ? ` ${className}` : ""}`} ref={rootRef}>
      {label ? (
        <label className="doedtc-label" htmlFor={triggerId}>
          {label}
        </label>
      ) : null}
      <button
        id={triggerId}
        type="button"
        className="doedtc-dropdown__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="doedtc-dropdown__value">{selected?.label ?? placeholder}</span>
        <span className="doedtc-dropdown__chevron">
          <ChevronIcon />
        </span>
      </button>
      {open ? (
        <ul id={listId} className="doedtc-dropdown__menu" role="listbox" aria-labelledby={triggerId}>
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`doedtc-dropdown__option${active ? " doedtc-dropdown__option--active" : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    close();
                  }}
                >
                  <span>{option.label}</span>
                  {active ? (
                    <span className="doedtc-dropdown__check">
                      <CheckIcon />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  DOEDTC_DEFAULT_PHONE_COUNTRY,
  DOEDTC_PHONE_COUNTRIES,
  doeDtcComposePhoneNumber,
  doeDtcPhoneCountryFlag,
  type DoeDtcPhoneCountry,
} from "@/lib/doedtc/doedtc-phone-countries";

type DoeDtcPhoneInputProps = {
  id?: string;
  label?: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatNationalNumber(raw: string, country: DoeDtcPhoneCountry): string {
  const digits = raw.replace(/\D/g, "").slice(0, 15);
  if (country.dialCode !== "+1") return digits;

  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function DoeDtcPhoneInput({ id, label, value, disabled = false, onChange }: DoeDtcPhoneInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-countries`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [country, setCountry] = useState<DoeDtcPhoneCountry>(DOEDTC_DEFAULT_PHONE_COUNTRY);
  const [national, setNational] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const updateNational = (next: string) => {
    const formatted = formatNationalNumber(next, country);
    setNational(formatted);
    onChange(doeDtcComposePhoneNumber(country, formatted));
  };

  const selectCountry = (next: DoeDtcPhoneCountry) => {
    setCountry(next);
    onChange(doeDtcComposePhoneNumber(next, national));
    closeMenu();
  };

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu, menuOpen]);

  return (
    <div className="doedtc-phone-input" ref={rootRef}>
      {label ? (
        <label className="doedtc-label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className={`doedtc-phone-input__control${disabled ? " doedtc-phone-input__control--disabled" : ""}`}>
        <button
          type="button"
          className="doedtc-phone-input__country"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          aria-controls={listId}
          aria-label={`Country code ${country.name}`}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="doedtc-phone-input__flag" aria-hidden>
            {doeDtcPhoneCountryFlag(country.iso)}
          </span>
          <span className="doedtc-phone-input__dial">{country.dialCode}</span>
          <span className="doedtc-phone-input__chevron">
            <ChevronIcon />
          </span>
        </button>
        <input
          id={inputId}
          className="doedtc-phone-input__field"
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          placeholder={country.placeholder}
          value={national}
          disabled={disabled}
          required
          onChange={(event) => updateNational(event.target.value)}
        />
        {menuOpen ? (
          <ul id={listId} className="doedtc-phone-input__menu" role="listbox" aria-label="Country codes">
            {DOEDTC_PHONE_COUNTRIES.map((option) => {
              const active = option.iso === country.iso;
              return (
                <li key={option.iso} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`doedtc-phone-input__option${active ? " doedtc-phone-input__option--active" : ""}`}
                    onClick={() => selectCountry(option)}
                  >
                    <span className="doedtc-phone-input__option-flag" aria-hidden>
                      {doeDtcPhoneCountryFlag(option.iso)}
                    </span>
                    <span className="doedtc-phone-input__option-name">{option.name}</span>
                    <span className="doedtc-phone-input__option-code">{option.dialCode}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      <input type="hidden" name="phone" value={value} readOnly />
    </div>
  );
}

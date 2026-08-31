"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type DoeDtcDropdownOption<T extends string = string> = {
  value: T;
  label: string;
};

type DoeDtcDropdownProps<T extends string = string> = {
  id?: string;
  label?: string;
  value: T;
  options: readonly DoeDtcDropdownOption<T>[];
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: T) => void;
  className?: string;
  variant?: "default" | "onboard";
};

type MenuBox = {
  left: number;
  width: number;
  top: number;
  maxHeight: number;
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

function measureOnboardMenu(trigger: HTMLElement): MenuBox {
  const rect = trigger.getBoundingClientRect();
  const gutter = 12;
  const gap = 8;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const width = rect.width;
  const left = rect.left;
  return {
    left,
    width,
    top: rect.bottom + gap,
    maxHeight: Math.max(132, Math.min(280, viewportHeight - rect.bottom - gutter - gap)),
  };
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
  variant = "default",
}: DoeDtcDropdownProps<T>) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listId = `${triggerId}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<MenuBox | null>(null);
  const onboard = variant === "onboard";

  const selected = options.find((option) => option.value === value);

  const close = useCallback(() => setOpen(false), []);

  const syncMenu = useCallback(() => {
    if (!triggerRef.current) return;
    setMenuBox(measureOnboardMenu(triggerRef.current));
  }, []);

  useLayoutEffect(() => {
    if (!open || !onboard) return;
    syncMenu();
  }, [onboard, open, syncMenu]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    if (onboard) {
      window.addEventListener("resize", syncMenu);
      window.addEventListener("scroll", syncMenu, true);
    }
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", syncMenu);
      window.removeEventListener("scroll", syncMenu, true);
    };
  }, [close, onboard, open, syncMenu]);

  const menu = open ? (
    <ul
      id={listId}
      ref={menuRef}
      className={`doedtc-dropdown__menu${onboard ? " doedtc-dropdown__menu--onboard" : ""}`}
      role="listbox"
      aria-labelledby={triggerId}
      style={
        onboard && menuBox
          ? {
              position: "fixed",
              left: menuBox.left,
              width: menuBox.width,
              top: menuBox.top,
              bottom: "auto",
              right: "auto",
              maxHeight: menuBox.maxHeight,
            }
          : undefined
      }
    >
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
  ) : null;

  return (
    <div
      className={`doedtc-dropdown${onboard ? " doedtc-dropdown--onboard" : ""}${className ? ` ${className}` : ""}`}
      ref={rootRef}
    >
      {label ? (
        <label className="doedtc-label" htmlFor={triggerId}>
          {label}
        </label>
      ) : null}
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        className={`doedtc-dropdown__trigger${open ? " doedtc-dropdown__trigger--open" : ""}${
          selected ? "" : " doedtc-dropdown__trigger--placeholder"
        }`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setOpen((current) => {
            const next = !current;
            if (next && onboard && triggerRef.current) {
              setMenuBox(measureOnboardMenu(triggerRef.current));
            }
            return next;
          });
        }}
      >
        <span className="doedtc-dropdown__value">{selected?.label ?? placeholder}</span>
        <span className="doedtc-dropdown__chevron">
          <ChevronIcon />
        </span>
      </button>
      {onboard ? (menuBox && typeof document !== "undefined" ? createPortal(menu, document.body) : null) : menu}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type MenuBox = {
  left: number;
  width: number;
  top: number;
};

type DoeDtcDobMenuProps = {
  id?: string;
  label: string;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
};

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1920;
const YEARS = Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, index) => MIN_YEAR + index);
const MONTH_VALUES: readonly number[] = MONTHS.map((item) => item.value);
const ITEM_HEIGHT = 40;
const DEFAULT_MONTH = 1;
const DEFAULT_DAY = 1;
const DEFAULT_YEAR = 1990;

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function parseDob(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1) return null;
  return { year, month, day };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDob(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function displayDob(value: string): string | null {
  const parsed = parseDob(value);
  if (!parsed) return null;
  const month = MONTHS.find((item) => item.value === parsed.month)?.label;
  if (!month) return null;
  return `${month} ${parsed.day}, ${parsed.year}`;
}

function measureMenu(trigger: HTMLElement): MenuBox {
  const rect = trigger.getBoundingClientRect();
  const gap = 8;
  const menuHeight = 256;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const spaceBelow = viewportHeight - rect.bottom - gap - 12;
  const openUp = spaceBelow < menuHeight && rect.top > spaceBelow;
  return {
    left: rect.left,
    width: rect.width,
    top: openUp ? Math.max(12, rect.top - gap - menuHeight) : rect.bottom + gap,
  };
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Wheel<T extends string | number>({
  items,
  value,
  getLabel,
  onChange,
  align = "center",
  ariaLabel,
}: {
  items: readonly T[];
  value: T;
  getLabel: (item: T) => string;
  onChange: (item: T) => void;
  align?: "start" | "center";
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ignoreRef = useRef(false);
  const readyRef = useRef(false);
  const settleRef = useRef<number>();
  const [active, setActive] = useState(value);

  const indexOf = useCallback(
    (item: T) => {
      const index = items.indexOf(item);
      return index < 0 ? 0 : index;
    },
    [items],
  );

  const scrollTo = useCallback(
    (item: T) => {
      const node = ref.current;
      if (!node) return;
      ignoreRef.current = true;
      node.scrollTop = indexOf(item) * ITEM_HEIGHT;
      window.setTimeout(() => {
        ignoreRef.current = false;
      }, 80);
    },
    [indexOf],
  );

  useLayoutEffect(() => {
    readyRef.current = false;
    scrollTo(value);
    setActive(value);
    const timer = window.setTimeout(() => {
      readyRef.current = true;
    }, 120);
    return () => window.clearTimeout(timer);
  }, [scrollTo, value]);

  function readIndex() {
    const node = ref.current;
    if (!node) return 0;
    return Math.min(items.length - 1, Math.max(0, Math.round(node.scrollTop / ITEM_HEIGHT)));
  }

  function settle() {
    const next = items[readIndex()];
    if (next === undefined) return;
    setActive(next);
    if (next !== value) onChange(next);
  }

  return (
    <div
      ref={ref}
      className="doedtc-dob__wheel"
      role="listbox"
      aria-label={ariaLabel}
      onScroll={() => {
        if (!readyRef.current || ignoreRef.current) return;
        const next = items[readIndex()];
        if (next !== undefined) setActive(next);
        window.clearTimeout(settleRef.current);
        settleRef.current = window.setTimeout(settle, 80);
      }}
    >
      <div className="doedtc-dob__spacer" aria-hidden />
      {items.map((item) => (
        <button
          key={String(item)}
          type="button"
          role="option"
          aria-selected={item === active}
          className={`doedtc-dob__cell${item === active ? " doedtc-dob__cell--active" : ""}${
            align === "start" ? " doedtc-dob__cell--start" : ""
          }`}
          onClick={() => {
            ignoreRef.current = true;
            ref.current?.scrollTo({ top: indexOf(item) * ITEM_HEIGHT, behavior: "smooth" });
            setActive(item);
            onChange(item);
            window.setTimeout(() => {
              ignoreRef.current = false;
            }, 280);
          }}
        >
          {getLabel(item)}
        </button>
      ))}
      <div className="doedtc-dob__spacer" aria-hidden />
    </div>
  );
}

export function DoeDtcDobMenu({
  id,
  label,
  value,
  disabled = false,
  placeholder = "Select…",
  onChange,
}: DoeDtcDobMenuProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const parsed = parseDob(value);
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<MenuBox | null>(null);
  const [month, setMonth] = useState(parsed?.month ?? DEFAULT_MONTH);
  const [day, setDay] = useState(parsed?.day ?? DEFAULT_DAY);
  const [year, setYear] = useState(parsed?.year ?? DEFAULT_YEAR);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const display = displayDob(value);
  const days = useMemo(() => {
    const count = daysInMonth(year, month);
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [month, year]);

  useEffect(() => {
    const next = parseDob(value);
    if (!next) return;
    setMonth(next.month);
    setDay(next.day);
    setYear(next.year);
  }, [value]);

  useEffect(() => {
    const maxDay = daysInMonth(year, month);
    if (day > maxDay) setDay(maxDay);
  }, [day, month, year]);

  const close = useCallback(() => setOpen(false), []);

  const syncMenu = useCallback(() => {
    if (!triggerRef.current) return;
    setMenuBox(measureMenu(triggerRef.current));
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    syncMenu();
  }, [open, syncMenu]);

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
    window.addEventListener("resize", syncMenu);
    window.addEventListener("scroll", syncMenu, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", syncMenu);
      window.removeEventListener("scroll", syncMenu, true);
    };
  }, [close, open, syncMenu]);

  function commit(nextYear: number, nextMonth: number, nextDay: number) {
    const safeDay = Math.min(nextDay, daysInMonth(nextYear, nextMonth));
    setMonth(nextMonth);
    setDay(safeDay);
    setYear(nextYear);
    onChange(formatDob(nextYear, nextMonth, safeDay));
  }

  const menu = open ? (
    <div
      ref={menuRef}
      className="doedtc-dropdown__menu doedtc-dropdown__menu--onboard doedtc-dob__menu"
      style={
        menuBox
          ? {
              position: "fixed",
              left: menuBox.left,
              width: menuBox.width,
              top: menuBox.top,
            }
          : undefined
      }
    >
      <div className="doedtc-dob__head">
        <span>Month</span>
        <span>Day</span>
        <span>Year</span>
      </div>
      <div className="doedtc-dob__wheels">
        <div className="doedtc-dob__band" aria-hidden />
        <Wheel
          ariaLabel="Month"
          items={MONTH_VALUES}
          value={month}
          align="start"
          getLabel={(item) => MONTHS[item - 1]?.label ?? String(item)}
          onChange={(next) => commit(year, next, day)}
        />
        <Wheel
          ariaLabel="Day"
          items={days}
          value={Math.min(day, days[days.length - 1] ?? 1)}
          getLabel={(item) => String(item)}
          onChange={(next) => commit(year, month, next)}
        />
        <Wheel
          ariaLabel="Year"
          items={YEARS}
          value={year}
          getLabel={(item) => String(item)}
          onChange={(next) => commit(next, month, day)}
        />
      </div>
    </div>
  ) : null;

  return (
    <div className="doedtc-dropdown doedtc-dropdown--onboard doedtc-dob" ref={rootRef}>
      <label className="doedtc-label" htmlFor={triggerId}>
        {label}
      </label>
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        className={`doedtc-dropdown__trigger${open ? " doedtc-dropdown__trigger--open" : ""}${
          display ? "" : " doedtc-dropdown__trigger--placeholder"
        }`}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => {
            const next = !current;
            if (next && triggerRef.current) setMenuBox(measureMenu(triggerRef.current));
            return next;
          });
        }}
      >
        <span className="doedtc-dropdown__value">{display ?? placeholder}</span>
        <span className="doedtc-dropdown__chevron">
          <ChevronIcon />
        </span>
      </button>
      {menuBox && typeof document !== "undefined" ? createPortal(menu, document.body) : null}
    </div>
  );
}

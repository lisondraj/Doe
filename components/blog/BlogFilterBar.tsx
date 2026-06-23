"use client";

import { useEffect, useRef, useState } from "react";
import { dmSans } from "@/lib/home/fonts";

type DropdownOption = { label: string; value: string };

const YEAR_OPTIONS: DropdownOption[] = [
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
];

const CATEGORY_OPTIONS: DropdownOption[] = [
  { label: "Releases", value: "releases" },
  { label: "Press",    value: "press"    },
  { label: "Founders", value: "founders" },
];

/* ── Chevron ─────────────────────────────────────────────────── */
function Chevron({ open, heroVariant }: { open: boolean; heroVariant?: boolean }) {
  return (
    <svg
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${
        heroVariant
          ? "h-[0.62em] w-[0.62em]"
          : "h-[0.7em] w-[0.7em]"
      }`}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Checkmark ───────────────────────────────────────────────── */
function Check() {
  return (
    <svg
      className="h-[0.68em] w-[0.68em] shrink-0 text-[#C47A5A]"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Filter pill ─────────────────────────────────────────────── */
function FilterPill({
  label,
  options,
  selected,
  onSelect,
  heroVariant = false,
}: {
  label: string;
  options: DropdownOption[];
  selected: string;
  onSelect: (v: string) => void;
  heroVariant?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const displayLabel = selected
    ? options.find((o) => o.value === selected)?.label ?? label
    : label;

  const triggerSize = heroVariant
    ? `text-[1.38rem] iphone-page:text-[1.55rem]`
    : `text-[clamp(1.75rem,6.5vw,2.6rem)] iphone-page:text-[clamp(2rem,1.55rem+2.85vmin,3.15rem)]`;

  const itemSize =
    `text-[clamp(1.22rem,1.08rem+0.68vmin,1.45rem)] iphone-page:text-[clamp(1.38rem,1.15rem+1.05vmin,1.72rem)]`;

  /* Hero variant: panel opens upward and aligns to the right edge of the button */
  const panelPosition = heroVariant
    ? "right-0 bottom-[calc(100%+0.45rem)]"
    : "left-0 top-[calc(100%+0.55rem)]";

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-[0.3em] text-left font-medium leading-none text-[#1E343A] transition-opacity active:opacity-60 ${triggerSize} ${dmSans.className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {displayLabel}
        <Chevron open={open} heroVariant={heroVariant} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={`blog-dropdown-menu absolute z-50 min-w-[8.5rem] overflow-hidden rounded-[1rem] border border-[#D9D4CC] bg-[#F5F2EE] shadow-[0_10px_32px_rgba(0,0,0,0.09),0_2px_6px_rgba(0,0,0,0.04)] ${panelPosition}`}
          role="listbox"
        >
          {options.map((opt, i) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => {
                  onSelect(isSelected ? "" : opt.value);
                  setOpen(false);
                }}
                className={[
                  "flex w-full items-center justify-between gap-5",
                  "px-5 py-[0.85rem]",
                  "text-left transition-colors",
                  i > 0 ? "border-t border-[#E8E4DD]" : "",
                  isSelected
                    ? "bg-[#EBE7E0]"
                    : "hover:bg-[#EDEAE4] active:bg-[#E5E1DA]",
                  itemSize,
                  dmSans.className,
                  isSelected
                    ? "font-semibold text-[#1E343A]"
                    : "font-normal text-[#4B5563]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span>{opt.label}</span>
                {isSelected && <Check />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Bar ─────────────────────────────────────────────────────── */
export function BlogFilterBar({ variant = "standalone" }: { variant?: "standalone" | "hero" }) {
  const [year, setYear]         = useState("");
  const [category, setCategory] = useState("");

  if (variant === "hero") {
    return (
      <div className="blog-landing-hero-filters flex flex-col items-end gap-[0.45rem] iphone-page:gap-[0.5rem]">
        <FilterPill
          label="2026"
          options={YEAR_OPTIONS}
          selected={year}
          onSelect={setYear}
          heroVariant
        />
        <FilterPill
          label="All Articles"
          options={CATEGORY_OPTIONS}
          selected={category}
          onSelect={setCategory}
          heroVariant
        />
      </div>
    );
  }

  return (
    <div className="flex w-full items-baseline justify-center gap-8 iphone-page:gap-[clamp(1.8rem,1.4rem+2vmin,2.8rem)]">
      <FilterPill
        label="2026"
        options={YEAR_OPTIONS}
        selected={year}
        onSelect={setYear}
      />
      <FilterPill
        label="All Articles"
        options={CATEGORY_OPTIONS}
        selected={category}
        onSelect={setCategory}
      />
    </div>
  );
}

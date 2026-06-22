"use client";

import { useEffect, useRef, useState } from "react";
import { dmSans } from "@/lib/home/fonts";

/* ── shared types ────────────────────────────────────────────── */
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

/* ── ChevronDown SVG ─────────────────────────────────────────── */
function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-[0.85em] w-[0.85em] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── individual filter pill + dropdown ──────────────────────── */
function FilterPill({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: DropdownOption[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* close on outside click */
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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-[0.35em] text-left font-medium leading-none text-[#1E343A] transition-opacity active:opacity-70 text-[clamp(1.75rem,6.5vw,2.6rem)] iphone-page:text-[clamp(2rem,1.55rem+2.85vmin,3.15rem)] ${dmSans.className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {displayLabel}
        <ChevronDown open={open} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 min-w-[10rem] overflow-hidden rounded-[0.75rem] border border-[#D9D4CC] bg-[#F7F6F3] shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
          role="listbox"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={selected === opt.value}
              type="button"
              onClick={() => {
                onSelect(opt.value === selected ? "" : opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-[#EBE7E0] active:bg-[#E0DBD3] text-[1.05rem] iphone-page:text-[clamp(1.05rem,0.9rem+0.75vmin,1.2rem)] ${dmSans.className} ${
                selected === opt.value
                  ? "font-semibold text-[#1E343A]"
                  : "font-normal text-[#374151]"
              }`}
            >
              {opt.label}
              {selected === opt.value && (
                <svg className="ml-3 h-3.5 w-3.5 shrink-0 text-[#C47A5A]" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── exported bar ────────────────────────────────────────────── */
export function BlogFilterBar() {
  const [year, setYear]         = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="flex w-full items-baseline gap-8 iphone-page:gap-[clamp(1.8rem,1.4rem+2vmin,2.8rem)]">
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

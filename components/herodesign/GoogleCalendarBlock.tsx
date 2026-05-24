"use client";

import { useWorkflowBlockTheme } from "@/components/herodesign/WorkflowBlockVariantContext";
import { suisseIntl } from "@/lib/home/fonts";

function CalendarGlyphIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.35" />
      <path d="M4 9.5h16M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function InputtingIcon({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className={className}>
      <path
        d="M1.95 5h5.95M6.28 3.15 8.52 5 6.28 6.85"
        stroke="currentColor"
        strokeWidth="1.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DateConfirmedCheck({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" opacity={0.85} />
      <path
        d="M4.35 7.05l1.68 1.68 3.62-4.06"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GoogleCalendarBlock() {
  const t = useWorkflowBlockTheme();

  return (
    <div className={`flex h-fit w-full flex-col rounded-xl border ${t.shell} ${suisseIntl.className}`}>
      <div className={`relative shrink-0 border-b ${t.headerBorder} px-3.5 py-3 pr-10`}>
        <p className={`text-[14px] font-normal leading-none ${t.title}`}>Updating Calendar</p>
        <p className={`mt-1.5 flex items-center gap-1.5 text-[11px] leading-none ${t.subtitle}`}>
          <InputtingIcon className={`shrink-0 ${t.subtitle}`} />
          Accessing Google calendar...
        </p>
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.icon}`} aria-hidden>
          <CalendarGlyphIcon />
        </span>
      </div>

      <div className="space-y-1.5 px-3.5 pb-3 pt-3">
        <div className="flex items-center justify-between gap-2">
          <p className={`min-w-0 flex-1 text-[16px] font-normal leading-snug tracking-tight ${t.emerald}`}>
            Wednesday, February 26
          </p>
          <DateConfirmedCheck className={`shrink-0 ${t.emerald}`} />
        </div>
        <p className={`text-[12px] leading-snug ${t.bodyLg}`}>
          Mark Walters <span className={t.dotMuted}>·</span> Medication Refill
        </p>
        <p className={`text-[10px] leading-snug ${t.bodyMuted}`}>2:30 PM · Exam room 3</p>
      </div>
    </div>
  );
}

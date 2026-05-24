"use client";

import { useWorkflowBlockTheme } from "@/components/herodesign/WorkflowBlockVariantContext";
import { suisseIntl } from "@/lib/home/fonts";

function VerifiedDot() {
  return (
    <span className="relative h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/90" aria-hidden />
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 4.25l7.5 3.75V12c0 4.65-5.72 8.55-7.5 9.5-1.78-.95-7.5-4.85-7.5-9.5V8l7.5-3.75z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 12l1.75 1.75L14.75 10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InsuranceVerifyBlock() {
  const t = useWorkflowBlockTheme();

  return (
    <div className={`flex h-fit w-full flex-col rounded-xl border ${t.shell} ${suisseIntl.className}`}>
      <div className={`relative shrink-0 border-b ${t.headerBorder} px-3.5 py-3 pr-10`}>
        <p className={`text-[14px] font-normal leading-none ${t.title}`}>Insurance Verify</p>
        <p className={`mt-1.5 flex items-center gap-1.5 text-[11px] leading-none ${t.subtitle}`}>
          <VerifiedDot />
          Coverage active
        </p>
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.icon}`} aria-hidden>
          <ShieldCheckIcon />
        </span>
      </div>

      <div className="space-y-1.5 px-3.5 pb-3 pt-3">
        <p className={`text-[16px] font-normal leading-snug tracking-tight ${t.bodyLg}`}>BlueCross PPO</p>
        <p className={`text-[12px] leading-snug ${t.body}`}>
          Mark Walters <span className={t.dotMuted}>·</span> Medication Refill
        </p>
        <p className={`text-[11px] leading-snug ${t.bodyMuted}`}>Copay $35</p>
      </div>
    </div>
  );
}
